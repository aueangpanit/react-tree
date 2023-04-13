import traverse, { Node, NodePath, Scope } from '@babel/traverse'
import {
  JSXElement,
  JSXFragment,
  JSXIdentifier,
  VariableDeclarator
} from '@babel/types'
import { ElementMap, ElementMapItem, ElementNode } from './types'

export function isReactComponent(
  node: VariableDeclarator,
  scope: Scope,
  parentPath: NodePath<Node>
) {
  if (
    !(
      node.id.type === 'Identifier' &&
      node.init?.type === 'ArrowFunctionExpression'
    )
  ) {
    return false
  }

  let returnsJsx = false
  traverse(
    node,
    {
      ReturnStatement({ node }) {
        returnsJsx =
          returnsJsx ||
          (node.argument?.type === 'JSXElement' &&
            node.argument.openingElement.name.type === 'JSXIdentifier') ||
          node.argument?.type === 'JSXFragment'
      }
    },
    scope,
    null,
    parentPath
  )

  return returnsJsx
}

export function markChildrenNodes(elementMap: ElementMap) {
  for (const node of Object.values(elementMap)) {
    if (node.children.length) {
      for (const child of node.children) {
        if (elementMap[child]) {
          elementMap[child].isChildren = true
        }
      }
    }
  }

  return elementMap
}

export function getChildrenNodes(
  id: string,
  elementMap: ElementMap
): ElementNode[] {
  if (!elementMap[id]) {
    return []
  }

  const childrenNodes: ElementNode[] = []

  for (const childId of elementMap[id].children) {
    const children = getChildrenNodes(childId, elementMap)
    childrenNodes.push({
      id: childId,
      name: elementMap[childId].name,
      children
    })
  }

  return childrenNodes
}

export function getJSXElementNode(node: JSXElement): ElementMapItem {
  const name = (node.openingElement.name as JSXIdentifier).name
  const children = node.children
    .filter(child => child.type === 'JSXElement')
    .map(child => String((child as JSXElement).openingElement.start))
  const id = String(node.openingElement.start)

  return { id, name, children }
}

export function getJSXFragmentNode(node: JSXFragment): ElementMapItem {
  const id = String(node.openingFragment.start)
  const name = 'Fragment'
  const children = node.children
    .filter(child => child.type === 'JSXElement')
    .map(child => String((child as JSXElement).openingElement.start))
  return { id, name, children }
}

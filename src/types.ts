export interface ElementNode {
  id: string
  name: string
  children: ElementNode[]
}

export interface ElementMapItem {
  id: string
  name: string
  children: string[]
  isChildren?: boolean
}

export type ElementMap = Record<string, ElementMapItem>

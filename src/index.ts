import fs from 'fs'
import { SaplingParser } from './Parser'

const parser = new SaplingParser('./src/App.tsx')
parser.parse()
const tree = parser.getTree()

fs.writeFileSync('./flare.json', JSON.stringify(tree, null, 2))

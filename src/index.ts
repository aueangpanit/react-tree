import fs from 'fs'
import { SaplingParser } from './Parser'

const parser = new SaplingParser('../dashboard/frontend/src/pages/DatasetExplorerPage.tsx', '/Users/aue/Documents/dashboard/frontend/src')
parser.parse()
const tree = parser.getTree()

fs.writeFileSync('./data.json', JSON.stringify(tree, null, 2))

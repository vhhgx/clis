import { File } from './file.js'
import path, { dirname } from 'path'

import { fileURLToPath } from 'url'

// 在ESM模式下获取__dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const paths = path.join(__dirname, 'template.js')

console.log('paths', __filename, '1', __dirname, '2', paths)

let a = new File(paths)

console.log('aaa', await a.exists())

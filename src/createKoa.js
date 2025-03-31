import ejs from 'ejs'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

export default (config) => {
  const __dirname = fileURLToPath(import.meta.url)
  const templateCode = fs.readFileSync(
    path.resolve(__dirname, '../template/index.ejs')
  )
  return ejs.render(templateCode.toString(), {
    middleware: config.middleware,
    port: config.port
  })
};

import prompts from 'prompts'
import path, { dirname } from 'path'
import fs from 'fs'
import { execSync } from 'child_process'
import ora from 'ora'
import { fileURLToPath } from 'url'


// 在ESM模式下获取__dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const renderTemplate = async (templatePath, targetPath, data = {}) => {
  try {
    // 使用ESM动态导入代替require
    const templateModulePath = path.join(
      dirname(__dirname),
      'templates',
      templatePath
    )
    
    // 确保文件路径符合URL规范
    const templateModuleUrl = `file://${templateModulePath.replace(
      /\\/g,
      '/'
    )}`
    // 删除重复声明的templateModule变量
    const templateModule = await import(templateModuleUrl)
    
    const rendered = templateModule.default(config)
    fs.writeFileSync(targetPath, rendered)
  } catch (error) {
    console.error(`渲染模板失败: ${templatePath}`, error)
    console.error(error.stack) // 打印更详细的错误信息
    throw error
  }
}

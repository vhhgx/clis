import prompts from 'prompts'
import path, { dirname } from 'path'
import fs from 'fs'
import { execSync } from 'child_process'
import ora from 'ora'
import { fileURLToPath } from 'url'

// 在ESM模式下获取__dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 创建Vue项目的函数
 * 负责生成Vue项目的所有文件和目录结构，安装依赖，并初始化Git仓库
 *
 * @param {string} projectPath - 项目的绝对路径
 * @param {Object} config - 项目配置对象
 * @param {string} config.name - 项目名称
 * @param {string[]} config.features - 选择的特性列表，如'typescript'、'router'等
 * @param {string} [config.cssPreprocessor] - CSS预处理器类型，如'sass'、'less'、'stylus'
 * @returns {Promise<void>}
 */

export const createVueProject = async (projectPath, config) => {
  
  console.log('22', projectPath, config)
  
  // 使用ESM导入替代require
  // const fs = require('fs')
  // const path = require('path')
  // const { execSync } = require('child_process')
  
  // 创建基本目录结构
  fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true })
  fs.mkdirSync(path.join(projectPath, 'src', 'assets'), { recursive: true })
  fs.mkdirSync(path.join(projectPath, 'src', 'components'), { recursive: true })
  fs.mkdirSync(path.join(projectPath, 'public'), { recursive: true })
  
  // 如果选择了路由，创建路由目录
  if (config.features.includes('router')) {
    fs.mkdirSync(path.join(projectPath, 'src', 'views'), { recursive: true })
    fs.mkdirSync(path.join(projectPath, 'src', 'router'), { recursive: true })
  }
  
  // 如果选择了状态管理，创建store目录
  if (config.features.includes('stores')) {
    fs.mkdirSync(path.join(projectPath, 'src', 'stores'), { recursive: true })
  }
  
  // 使用TypeScript还是JavaScript
  const fileExt = config.features.includes('typescript') ? 'ts' : 'js'
  
  // 渲染模板
  // async function renderTemplate(templatePath, targetPath, data = {}) {
  //   try {
  //     // 使用ESM动态导入代替require
  //     const templateModulePath = path.join(
  //       dirname(__dirname),
  //       'templates',
  //       templatePath
  //     )
  //
  //     // 确保文件路径符合URL规范
  //     const templateModuleUrl = `file://${templateModulePath.replace(
  //       /\\/g,
  //       '/'
  //     )}`
  //     // 删除重复声明的templateModule变量
  //     const templateModule = await import(templateModuleUrl)
  //
  //     const rendered = templateModule.default(config)
  //     fs.writeFileSync(targetPath, rendered)
  //   } catch (error) {
  //     console.error(`渲染模板失败: ${templatePath}`, error)
  //     console.error(error.stack) // 打印更详细的错误信息
  //     throw error
  //   }
  // }

  try {
    // 创建package.json
    await renderTemplate(
      'vue/package.json.template.js',
      path.join(projectPath, 'package.json')
    )

    // 创建vite.config.js/ts
    await renderTemplate(
      `vue/vite.config.${fileExt}.template.js`,
      path.join(projectPath, `vite.config.${fileExt}`)
    )

    // 创建index.html
    await renderTemplate(
      'vue/index.html.template.js',
      path.join(projectPath, 'index.html')
    )

    // 创建main.js/ts
    await renderTemplate(
      `vue/main.${fileExt}.template.js`,
      path.join(projectPath, 'src', `main.${fileExt}`)
    )

    // 创建App.vue
    await renderTemplate(
      'vue/App.vue.template.js',
      path.join(projectPath, 'src', 'App.vue')
    )

    // 创建HelloWorld组件
    await renderTemplate(
      'vue/components/HelloWorld.vue.template.js',
      path.join(projectPath, 'src', 'components', 'HelloWorld.vue')
    )

    // 如果选择了路由，创建路由文件
    if (config.features.includes('router')) {
      await renderTemplate(
        `vue/router/index.${fileExt}.template.js`,
        path.join(projectPath, 'src', 'router', `index.${fileExt}`)
      )
      await renderTemplate(
        'vue/views/HomeView.vue.template.js',
        path.join(projectPath, 'src', 'views', 'HomeView.vue')
      )
      await renderTemplate(
        'vue/views/AboutView.vue.template.js',
        path.join(projectPath, 'src', 'views', 'AboutView.vue')
      )
    }

    // 如果选择了状态管理，创建store文件
    if (config.features.includes('stores')) {
      await renderTemplate(
        `vue/store/index.${fileExt}.template.js`,
        path.join(projectPath, 'src', 'stores', `index.${fileExt}`)
      )
    }

    // 创建.gitignore
    await renderTemplate(
      'vue/gitignore.template.js',
      path.join(projectPath, '.gitignore')
    )

    // 创建README.md
    await renderTemplate(
      'vue/README.md.template.js',
      path.join(projectPath, 'README.md')
    )

    // 复制Vue Logo
    const logoSourcePath = path.join(
      __dirname,
      '..',
      'templates',
      'vue',
      'logo.png'
    )
    const logoTargetPath = path.join(projectPath, 'src', 'assets', 'logo.png')

    if (fs.existsSync(logoSourcePath)) {
      fs.copyFileSync(logoSourcePath, logoTargetPath)
    } else {
      console.log(
        '警告: Vue logo图片未找到，请手动添加一个logo图片到src/assets目录。'
      )
    }

    // 如果选择了typescript，创建tsconfig.json
    if (config.features.includes('typescript')) {
      await renderTemplate(
        'vue/tsconfig.json.ejs',
        path.join(projectPath, 'tsconfig.json')
      )
      await renderTemplate(
        'vue/tsconfig.node.json.ejs',
        path.join(projectPath, 'tsconfig.node.json')
      )
    }

    // 如果选择了ESLint，创建.eslintrc.js
    if (config.features.includes('linter')) {
      await renderTemplate(
        'vue/eslintrc.js.ejs',
        path.join(projectPath, '.eslintrc.js')
      )
    }

    // 如果环境中有npm，初始化项目依赖
    try {
      process.chdir(projectPath)
      console.log('安装项目依赖...')
      execSync('npm install', { stdio: 'ignore' })
      console.log('✓ 依赖安装完成')

      // 初始化Git仓库
      try {
        console.log('初始化Git仓库...')
        execSync('git init', { stdio: 'ignore' })
        execSync('git add .', { stdio: 'ignore' })
        execSync('git commit -m "Initial commit"', { stdio: 'ignore' })
        console.log('✓ Git仓库初始化成功')
      } catch (gitError) {
        console.log('无法初始化Git仓库：', gitError.message)
        console.log('请在创建后手动运行 git init')
      }
    } catch (error) {
      console.log('无法自动安装依赖，请在创建后运行 npm install')
    }
  } catch (error) {
    console.error('文件生成失败:', error)
    throw error
  }
  
  // 处理可能的依赖安装
  // ...existing code...
}

import prompts from 'prompts'
import path, { dirname } from 'path'
import fs from 'fs'
import { execSync } from 'child_process'
import ora from 'ora'
import { fileURLToPath } from 'url'

import { createVueProject } from '../createVue.js'

// 处理 Ctrl+C 中断
export const onCancel = () => {
  process.exit(0)
}

// 选择框架模板
export const chooseFramework = (name) => {
  // 添加name参数
  let questions = [
    {
      type: 'select',
      name: 'projectType',
      message: '请选择项目类型：',
      choices: [
        { title: 'Vue', value: 'vue', description: '使用Vue.js 创建项目' },
        {
          title: 'Nuxt',
          value: 'nuxt',
          description: '使用Nuxt.js 创建SSR项目'
        },
        {
          title: 'Koa',
          value: 'koa',
          description: '使用Koa.js 服务端项目'
        }
      ]
    }
  ]
  
  // 如果没有提供名称，则询问
  if (!name) {
    questions.push({
      type: 'text',
      name: 'projectName',
      message: '请输入项目名称：',
      initial: (prev) => ``
    })
  }
  
  return questions
}

// 前端特性选择（Vue和Nuxt）
export const frontEndFeatures = async () => {
  const { features } = await prompts(
    {
      type: 'multiselect',
      name: 'features',
      message: '请选择项目需要的特性: ',
      choices: [
        { title: 'TypeScript', value: 'typescript', selected: false },
        { title: 'Router', value: 'router', selected: true },
        { title: 'Pinia', value: 'stores', selected: true },
        { title: 'CSS预处理器', value: 'css-preprocessor', selected: false },
        { title: 'Tailwind CSS', value: 'tailwind', selected: true },
        { title: 'Linter / Formatter', value: 'linter', selected: true },
        { title: 'Unit Testing', value: 'unit-testing', selected: false },
        { title: 'E2E Testing', value: 'e2e-testing', selected: false },
        { title: 'I18n', value: 'i18n', selected: false }
      ]
    },
    { onCancel }
  )
  
  return features || []
}

// CSS 预处理器选择
export const preCssFeatures = async () => {
  const { cssPreProcessor } = await prompts(
    {
      type: 'select',
      name: 'cssPreProcessor',
      message: '选择CSS预处理器:',
      choices: [
        { title: 'Sass/SCSS', value: 'sass' },
        { title: 'Less', value: 'less' },
        { title: 'Stylus', value: 'stylus' }
      ]
    },
    { onCancel }
  )
  
  return cssPreProcessor
}

// 后端内容特性选择（Koa）
export const backEndFeatures = async () => {
  const { features } = await prompts(
    {
      type: 'multiselect',
      name: 'features',
      message: '请选择项目需要的特性: ',
      choices: [
        { title: 'TypeScript', value: 'typescript', selected: false },
        { title: '身份验证', value: 'auth', selected: true },
        { title: '日志系统', value: 'logger', selected: true },
        { title: '数据验证', value: 'validation', selected: true },
        { title: 'CORS', value: 'cors', selected: true },
        { title: 'Swagger API文档', value: 'swagger', selected: false },
        { title: '单元测试', value: 'testing', selected: false }
      ]
    },
    { onCancel }
  )
  
  return features || []
}

// 创建项目
export const createProject = async (config) => {
  const name = config.projectName
  
  // 创建项目目录
  const projectPath = path.resolve(process.cwd(), name)
  
  console.log(`\n创建项目目录: ${projectPath}`)
  
  // 检查项目目录是否已存在
  if (fs.existsSync(projectPath)) {
    console.error(`\n错误: 目录 ${config.name} 已存在，请使用其他项目名称。`)
    process.exit(1)
  }
  
  fs.mkdirSync(projectPath, { recursive: true })
  
  let spinner
  
  try {
    // 根据不同项目类型使用不同的模板创建方法
    switch (config.projectType) {
      case 'vue':
        // 确保spinner在启动前正确初始化，并在控制台有足够空间显示
        console.log('') // 添加空行以确保有足够的空间
        spinner = ora('正在创建Vue项目...').start()
        
        // 这里暂停spinner的更新，避免后续操作中的输出干扰spinner
        spinner.stop()
        // 实际创建项目（这步可能有控制台输出）
        await createVueProject(projectPath, config)
        // 创建完毕后重新启动spinner并显示成功
        spinner.start().succeed('Vue项目创建成功！')
        break
      
      case 'nuxt':
        spinner = ora('正在创建Nuxt项目...').start()
        
        // 使用npx创建Nuxt项目
        process.chdir(path.dirname(projectPath))
        
        if (config.template === 'nuxt3') {
          execSync(`npx nuxi init ${config.name}`, { stdio: 'ignore' })
        } else {
          execSync(`npx create-nuxt-app ${config.name}`, { stdio: 'ignore' })
        }
        
        // 安装选定的模块
        process.chdir(projectPath)
        
        // 如果选择了Tailwind
        if (config.features.includes('tailwind')) {
          spinner.text = '安装Tailwind CSS...'
          execSync('npm install -D tailwindcss postcss autoprefixer', {
            stdio: 'ignore'
          })
          execSync('npx tailwindcss init', { stdio: 'ignore' })
        }
        
        // 其他模块安装
        const nuxtModules = []
        if (config.features.includes('content'))
          nuxtModules.push('@nuxt/content')
        if (config.features.includes('image')) nuxtModules.push('@nuxt/image')
        if (config.features.includes('auth'))
          nuxtModules.push('@nuxtjs/auth-next')
        if (config.features.includes('color-mode'))
          nuxtModules.push('@nuxtjs/color-mode')
        if (config.features.includes('google-fonts'))
          nuxtModules.push('@nuxtjs/google-fonts')
        if (config.features.includes('i18n')) nuxtModules.push('@nuxtjs/i18n')
        
        if (nuxtModules.length > 0) {
          spinner.text = '安装选定的Nuxt模块...'
          execSync(`npm install ${nuxtModules.join(' ')}`, { stdio: 'ignore' })
        }
        
        spinner.succeed('Nuxt项目创建成功！')
        break
      
      case 'koa':
        spinner = ora('正在创建Koa项目...').start()
        
        // 创建基本的项目结构
        fs.writeFileSync(
          path.join(projectPath, 'package.json'),
          JSON.stringify(
            {
              name: config.name,
              version: '0.1.0',
              private: true,
              scripts: {
                start: config.features.includes('typescript')
                  ? 'ts-node src/index.ts'
                  : 'node src/index.js',
                dev: config.features.includes('typescript')
                  ? 'nodemon --exec ts-node src/index.ts'
                  : 'nodemon src/index.js'
              }
            },
            null,
            2
          )
        )
        
        // 创建基本目录
        const srcDir = path.join(projectPath, 'src')
        fs.mkdirSync(srcDir)
        
        // 创建基本入口文件
        const ext = config.features.includes('typescript') ? 'ts' : 'js'
        fs.writeFileSync(
          path.join(srcDir, `index.${ext}`),
          `const Koa = require('koa');\nconst app = new Koa();\n\napp.use(async ctx => {\n  ctx.body = 'Hello World';\n});\n\napp.listen(3000, () => console.log('Server running on http://localhost:3000'));\n`
        )
        
        // 安装依赖
        process.chdir(projectPath)
        spinner.text = '安装Koa依赖...'
        execSync('npm install koa', { stdio: 'ignore' })
        
        // 安装开发依赖
        spinner.text = '安装开发依赖...'
        execSync('npm install nodemon --save-dev', { stdio: 'ignore' })
        
        // 安装特性依赖
        const koaDeps = []
        const koaDevDeps = []
        
        if (config.features.includes('typescript')) {
          koaDevDeps.push('typescript', '@types/koa', 'ts-node')
        }
        if (config.features.includes('auth'))
          koaDeps.push('koa-jwt', 'jsonwebtoken')
        if (config.features.includes('logger')) koaDeps.push('koa-logger')
        if (config.features.includes('validation'))
          koaDeps.push('joi', 'koa-bodyparser')
        if (config.features.includes('cors')) koaDeps.push('@koa/cors')
        if (config.features.includes('swagger'))
          koaDeps.push('swagger-jsdoc', 'koa2-swagger-ui')
        if (config.features.includes('testing'))
          koaDevDeps.push('jest', 'supertest')
        
        if (koaDeps.length > 0) {
          spinner.text = '安装选定的依赖...'
          execSync(`npm install ${koaDeps.join(' ')}`, { stdio: 'ignore' })
        }
        
        if (koaDevDeps.length > 0) {
          spinner.text = '安装选定的开发依赖...'
          execSync(`npm install ${koaDevDeps.join(' ')} --save-dev`, {
            stdio: 'ignore'
          })
        }
        
        spinner.succeed('Koa项目创建成功！')
        break
      
      default:
        console.log('\n暂不支持此类型项目的自动创建，请手动设置项目。')
        break
    }
    
    // 提示成功信息和后续步骤
    console.log('\n🎉 项目创建成功！')
    
    // 初始化Git仓库（对所有项目类型）
    if (config.type !== 'vue') {
      // Vue项目在createVueProject中已初始化
      try {
        process.chdir(projectPath)
        console.log('初始化Git仓库...')
        execSync('git init', { stdio: 'ignore' })
        execSync('git add .', { stdio: 'ignore' })
        execSync('git commit -m "Initial commit"', { stdio: 'ignore' })
        console.log('✓ Git仓库初始化成功')
      } catch (gitError) {
        console.log('无法初始化Git仓库，请在创建后手动运行 git init')
      }
    }
    
    console.log('\n开始使用:')
    console.log(`  cd ${config.name}`)
    console.log('  npm run dev (或相应的开发命令)')
    console.log('\n祝您开发愉快！')
  } catch (error) {
    if (spinner && typeof spinner.fail === 'function') {
      spinner.fail('项目创建失败')
    } else {
      console.error('\n项目创建失败')
    }
    console.error('\n创建项目时出错:', error.message)
    
    // 尝试清理已创建的目录
    console.log('\n正在清理...')
    try {
      fs.rmdirSync(projectPath, { recursive: true })
    } catch (cleanupError) {
      console.error(`无法清理项目目录: ${cleanupError.message}`)
    }
    
    process.exit(1)
  }
}

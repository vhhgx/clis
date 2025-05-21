#!/usr/bin/env node

const { program } = require('commander')
// const packages = require('../package.json')
const { input, select, Separator, checkbox } = require('@inquirer/prompts')

// program.option('-v, --version').action(() => {
//   console.log(`v${packages.version}`)
// })

// program.parse()

program
  .command('create [name]')
  .description('创建项目 create a project')
  .option('-t, --template <template>')
  .action(async (name, options) => {
    try {
      // 用于存储所有回答的对象
      const answers = {
        projectType: null,
        template: null,
        features: [],
        projectName: null,
      };
      
      // 第一步：选择项目类型
      answers.projectType = await select({
        message: '请选择项目类型：',
        choices: [
          {
            name: 'Vue',
            value: 'vue',
            description: '使用Vue.js框架创建项目',
          },
          {
            name: 'Nuxt',
            value: 'nuxt',
            description: '使用Nuxt.js框架创建SSR项目',
          },
          {
            name: 'Koa',
            value: 'koa',
            description: '使用Koa.js创建服务端项目',
          },
          new Separator(),
          {
            name: 'React',
            value: 'react',
            description: '使用React.js框架创建项目',
          },
          {
            name: '其他',
            value: 'other',
            description: '其他项目类型',
          },
        ],
      });
      
      // 根据项目类型提供不同的模板选择
      switch (answers.projectType) {
        case 'vue':
          // answers.template = await select({
          //   message: '请选择Vue模板：',
          //   choices: [
          //     {
          //       name: 'Vue 3 + Vite',
          //       value: 'vue3-vite',
          //       description: '使用Vue 3和Vite构建工具',
          //     },
          //   ],
          // });
          
          // Vue项目的多选特性
          answers.features = await checkbox({
            message: '请选择项目需要的特性:',
            choices: [
              { name: 'TypeScript', value: 'typescript', checked: false },
              { name: 'Router', value: 'router', checked: true },
              { name: 'Vuex/Pinia', value: 'store', checked: true },
              { name: 'CSS 预处理器', value: 'css-preprocessor', checked: false },
              { name: 'Linter / Formatter', value: 'linter', checked: true },
              { name: 'Unit Testing', value: 'unit-testing', checked: false },
              { name: 'E2E Testing', value: 'e2e-testing', checked: false },
            ],
          });
          
          // 如果选择了CSS预处理器，进一步询问使用哪种
          if (answers.features.includes('css-preprocessor')) {
            answers.cssPreprocessor = await select({
              message: '选择CSS预处理器:',
              choices: [
                { name: 'Sass/SCSS', value: 'sass' },
                { name: 'Less', value: 'less' },
                { name: 'Stylus', value: 'stylus' }
              ],
            });
          }
          break;
          
        case 'nuxt':
          answers.template = await select({
            message: '请选择Nuxt模板：',
            choices: [
              {
                name: 'Nuxt 3',
                value: 'nuxt3',
                description: '最新的Nuxt 3框架',
              },
              {
                name: 'Nuxt 2',
                value: 'nuxt2',
                description: '稳定的Nuxt 2框架',
              },
            ],
          });
          
          // Nuxt项目的多选特性
          answers.features = await checkbox({
            message: '请选择项目需要的模块:',
            choices: [
              { name: 'Content', value: 'content', checked: false },
              { name: 'Tailwind CSS', value: 'tailwind', checked: true },
              { name: 'Image', value: 'image', checked: false },
              { name: 'Auth', value: 'auth', checked: false },
              { name: 'Color Mode', value: 'color-mode', checked: true },
              { name: 'Google Fonts', value: 'google-fonts', checked: false },
              { name: 'I18n', value: 'i18n', checked: false },
            ],
          });
          break;
          
        case 'koa':
          answers.template = await select({
            message: '请选择Koa模板：',
            choices: [
              {
                name: 'Koa基础模板',
                value: 'koa-basic',
                description: '基础的Koa服务器模板',
              },
              {
                name: 'Koa + TypeScript',
                value: 'koa-typescript',
                description: '带TypeScript的Koa模板',
              },
              {
                name: 'Koa + MongoDB',
                value: 'koa-mongodb',
                description: '集成MongoDB的Koa模板',
              },
            ],
          });
          
          // Koa项目的多选特性
          answers.features = await checkbox({
            message: '请选择需要集成的功能:',
            choices: [
              { name: 'TypeScript', value: 'typescript', checked: false },
              { name: '身份验证', value: 'auth', checked: true },
              { name: '日志系统', value: 'logger', checked: true },
              { name: '数据验证', value: 'validation', checked: true },
              { name: 'CORS', value: 'cors', checked: true },
              { name: 'Swagger API文档', value: 'swagger', checked: false },
              { name: '单元测试', value: 'testing', checked: false },
            ],
          });
          break;

        case 'react':
          answers.template = await select({
            message: '请选择React模板：',
            choices: [
              {
                name: 'React + Vite',
                value: 'react-vite',
                description: '使用React和Vite构建工具',
              },
              {
                name: 'Create React App',
                value: 'cra',
                description: '使用官方CRA模板',
              },
              {
                name: 'Next.js',
                value: 'nextjs',
                description: 'React的SSR框架',
              },
            ],
          });
          
          // React项目的多选特性
          answers.features = await checkbox({
            message: '请选择项目需要的特性:',
            choices: [
              { name: 'TypeScript', value: 'typescript', checked: false },
              { name: 'React Router', value: 'router', checked: true },
              { name: 'Redux/Zustand', value: 'state-management', checked: true },
              { name: 'CSS-in-JS', value: 'css-in-js', checked: false },
              { name: 'ESLint', value: 'eslint', checked: true },
              { name: 'Jest', value: 'jest', checked: false },
              { name: 'React Testing Library', value: 'testing-library', checked: false },
            ],
          });
          break;
            
        default:
          // 对于"其他"选项，使用通用模板
          answers.template = options.template || await input({ 
            message: '请输入自定义模板名称：' 
          });
          break;
      }
      
      // 项目名称（如果命令行没提供）
      if (!name) {
        answers.projectName = await input({ 
          message: '请输入项目名称：',
          default: `my-${answers.projectType}-app`,
        });
      } else {
        answers.projectName = name;
      }
      
      // 整理最终的配置
      const finalConfig = {
        name: answers.projectName,
        type: answers.projectType,
        template: answers.template,
        features: answers.features,
        cssPreprocessor: answers.cssPreprocessor, // 可能是undefined
        ...options,
      };
      
      console.log('\n项目配置信息:')
      console.log('------------------------------')
      console.log(`项目名称: ${finalConfig.name}`)
      console.log(`项目类型: ${finalConfig.type}`)
      console.log(`使用模板: ${finalConfig.template}`)
      console.log(`选择的特性: ${finalConfig.features.join(', ') || '无'}`)
      if (finalConfig.cssPreprocessor) {
        console.log(`CSS预处理器: ${finalConfig.cssPreprocessor}`)
      }
      console.log('------------------------------')
      
      // 这里可以添加项目创建逻辑
      console.log('\n开始创建项目...')
      // 实际项目创建代码
      // 创建项目
      await createProject(finalConfig);
      
    } catch (error) {
      // 处理用户中断（Ctrl+C）
      if (error.message && error.message.includes('SIGINT')) {
        // console.log('\n操作已取消')
        process.exit(0)
      } else {
        // 处理其他错误
        console.error('发生错误:', error)
        process.exit(1)
      }
    }
  })

program
  .command('list')
  .description('查看模版列表 check template list')
  .action(() => {
    console.log('查看模版')
  })

// // 解析用户执行命令传入参数
program.parse(process.argv)
// // .action(() => {
// //   console.log(process.argv, 'process.argv');
// // })

/**
 * 通过 create 这种命令来进行创建项目
 *
 */

/**
 * 创建项目的函数
 * @param {Object} config - 项目配置
 */
async function createProject(config) {
  const path = require('path');
  const fs = require('fs');
  const { execSync, spawnSync } = require('child_process');
  const ora = require('ora'); // 需要安装这个包用于显示加载动画
  
  // 创建项目目录
  const projectPath = path.resolve(process.cwd(), config.name);
  
  // 检查项目目录是否已存在
  if (fs.existsSync(projectPath)) {
    console.error(`\n错误: 目录 ${config.name} 已存在，请使用其他项目名称。`);
    process.exit(1);
  }
  
  console.log(`\n创建项目目录: ${projectPath}`);
  fs.mkdirSync(projectPath, { recursive: true });
  
  let spinner;
  
  try {
    // 根据不同项目类型使用不同的模板创建方法
    switch (config.type) {
      case 'vue':
        spinner = ora('正在创建Vue项目...').start();
        
        // 不使用Vue CLI，而是手动创建Vue项目
        // 创建基本项目结构
        createVueProject(projectPath, config);
        
        spinner.succeed('Vue项目创建成功！');
        break;
        
      case 'nuxt':
        spinner = ora('正在创建Nuxt项目...').start();
        
        // 使用npx创建Nuxt项目
        process.chdir(path.dirname(projectPath));
        
        if (config.template === 'nuxt3') {
          execSync(`npx nuxi init ${config.name}`, { stdio: 'ignore' });
        } else {
          execSync(`npx create-nuxt-app ${config.name}`, { stdio: 'ignore' });
        }
        
        // 安装选定的模块
        process.chdir(projectPath);
        
        // 如果选择了Tailwind
        if (config.features.includes('tailwind')) {
          spinner.text = '安装Tailwind CSS...';
          execSync('npm install -D tailwindcss postcss autoprefixer', { stdio: 'ignore' });
          execSync('npx tailwindcss init', { stdio: 'ignore' });
        }
        
        // 其他模块安装
        const nuxtModules = [];
        if (config.features.includes('content')) nuxtModules.push('@nuxt/content');
        if (config.features.includes('image')) nuxtModules.push('@nuxt/image');
        if (config.features.includes('auth')) nuxtModules.push('@nuxtjs/auth-next');
        if (config.features.includes('color-mode')) nuxtModules.push('@nuxtjs/color-mode');
        if (config.features.includes('google-fonts')) nuxtModules.push('@nuxtjs/google-fonts');
        if (config.features.includes('i18n')) nuxtModules.push('@nuxtjs/i18n');
        
        if (nuxtModules.length > 0) {
          spinner.text = '安装选定的Nuxt模块...';
          execSync(`npm install ${nuxtModules.join(' ')}`, { stdio: 'ignore' });
        }
        
        spinner.succeed('Nuxt项目创建成功！');
        break;
        
      case 'koa':
        spinner = ora('正在创建Koa项目...').start();
        
        // 创建基本的项目结构
        fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify({
          name: config.name,
          version: '0.1.0',
          private: true,
          scripts: {
            start: config.features.includes('typescript') ? 'ts-node src/index.ts' : 'node src/index.js',
            dev: config.features.includes('typescript') ? 'nodemon --exec ts-node src/index.ts' : 'nodemon src/index.js'
          }
        }, null, 2));
        
        // 创建基本目录
        const srcDir = path.join(projectPath, 'src');
        fs.mkdirSync(srcDir);
        
        // 创建基本入口文件
        const ext = config.features.includes('typescript') ? 'ts' : 'js';
        fs.writeFileSync(path.join(srcDir, `index.${ext}`), 
          `const Koa = require('koa');\nconst app = new Koa();\n\napp.use(async ctx => {\n  ctx.body = 'Hello World';\n});\n\napp.listen(3000, () => console.log('Server running on http://localhost:3000'));\n`
        );
        
        // 安装依赖
        process.chdir(projectPath);
        spinner.text = '安装Koa依赖...';
        execSync('npm install koa', { stdio: 'ignore' });
        
        // 安装开发依赖
        spinner.text = '安装开发依赖...';
        execSync('npm install nodemon --save-dev', { stdio: 'ignore' });
        
        // 安装特性依赖
        const koaDeps = [];
        const koaDevDeps = [];
        
        if (config.features.includes('typescript')) {
          koaDevDeps.push('typescript', '@types/koa', 'ts-node');
        }
        if (config.features.includes('auth')) koaDeps.push('koa-jwt', 'jsonwebtoken');
        if (config.features.includes('logger')) koaDeps.push('koa-logger');
        if (config.features.includes('validation')) koaDeps.push('joi', 'koa-bodyparser');
        if (config.features.includes('cors')) koaDeps.push('@koa/cors');
        if (config.features.includes('swagger')) koaDeps.push('swagger-jsdoc', 'koa2-swagger-ui');
        if (config.features.includes('testing')) koaDevDeps.push('jest', 'supertest');
        
        if (koaDeps.length > 0) {
          spinner.text = '安装选定的依赖...';
          execSync(`npm install ${koaDeps.join(' ')}`, { stdio: 'ignore' });
        }
        
        if (koaDevDeps.length > 0) {
          spinner.text = '安装选定的开发依赖...';
          execSync(`npm install ${koaDevDeps.join(' ')} --save-dev`, { stdio: 'ignore' });
        }
        
        spinner.succeed('Koa项目创建成功！');
        break;
        
      case 'react':
        spinner = ora('正在创建React项目...').start();
        
        // 根据模板选择创建React项目
        process.chdir(path.dirname(projectPath));
        
        if (config.template === 'react-vite') {
          execSync(`npm create vite@latest ${config.name} -- --template react${config.features.includes('typescript') ? '-ts' : ''}`, { stdio: 'ignore' });
        } else if (config.template === 'cra') {
          const craCommand = `npx create-react-app ${config.name}${config.features.includes('typescript') ? ' --template typescript' : ''}`;
          execSync(craCommand, { stdio: 'ignore' });
        } else if (config.template === 'nextjs') {
          execSync(`npx create-next-app ${config.name}`, { stdio: 'ignore' });
        }
        
        // 安装额外的依赖
        process.chdir(projectPath);
        const reactDeps = [];
        
        if (config.features.includes('router')) reactDeps.push('react-router-dom');
        if (config.features.includes('state-management')) reactDeps.push(config.template === 'nextjs' ? 'zustand' : 'redux react-redux @reduxjs/toolkit');
        if (config.features.includes('css-in-js')) reactDeps.push('styled-components');
        
        if (reactDeps.length > 0) {
          spinner.text = '安装额外的依赖...';
          execSync(`npm install ${reactDeps.join(' ')}`, { stdio: 'ignore' });
        }
        
        spinner.succeed('React项目创建成功！');
        break;
        
      default:
        console.log('\n暂不支持此类型项目的自动创建，请手动设置项目。');
        break;
    }
    
    // 提示成功信息和后续步骤
    console.log('\n🎉 项目创建成功！');
    console.log('\n开始使用:');
    console.log(`  cd ${config.name}`);
    console.log('  npm run dev (或相应的开发命令)');
    console.log('\n祝您开发愉快！');
    
  } catch (error) {
    spinner.fail('项目创建失败');
    console.error('\n创建项目时出错:', error.message);
    
    // 尝试清理已创建的目录
    console.log('\n正在清理...');
    try {
      fs.rmdirSync(projectPath, { recursive: true });
    } catch (cleanupError) {
      console.error(`无法清理项目目录: ${cleanupError.message}`);
    }
    
    process.exit(1);
  }
}

/**
 * 创建Vue项目的函数
 * @param {string} projectPath - 项目路径
 * @param {Object} config - 项目配置
 */
function createVueProject(projectPath, config) {
  const fs = require('fs');
  const path = require('path');
  const ejs = require('ejs');
  const { execSync } = require('child_process');
  
  // 创建基本目录结构
  fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
  fs.mkdirSync(path.join(projectPath, 'src', 'assets'), { recursive: true });
  fs.mkdirSync(path.join(projectPath, 'src', 'components'), { recursive: true });
  fs.mkdirSync(path.join(projectPath, 'public'), { recursive: true });
  
  // 如果选择了路由，创建路由目录
  if (config.features.includes('router')) {
    fs.mkdirSync(path.join(projectPath, 'src', 'views'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'src', 'router'), { recursive: true });
  }
  
  // 如果选择了状态管理，创建store目录
  if (config.features.includes('store')) {
    fs.mkdirSync(path.join(projectPath, 'src', 'store'), { recursive: true });
  }
  
  // 使用TypeScript还是JavaScript
  const fileExt = config.features.includes('typescript') ? 'ts' : 'js';
  
  // 渲染模板函数
  function renderTemplate(templatePath, targetPath, data = {}) {
    const templateDir = path.join(__dirname, '..', 'templates');
    const templateContent = fs.readFileSync(path.join(templateDir, templatePath), 'utf-8');
    const rendered = ejs.render(templateContent, { ...data, config });
    fs.writeFileSync(targetPath, rendered);
  }
  
  // 创建package.json
  renderTemplate('vue/package.json.ejs', path.join(projectPath, 'package.json'));
  
  // 创建vite.config.js/ts
  renderTemplate(`vue/vite.config.${fileExt}.ejs`, path.join(projectPath, `vite.config.${fileExt}`));
  
  // 创建index.html
  renderTemplate('vue/index.html.ejs', path.join(projectPath, 'index.html'));
  
  // 创建main.js/ts
  renderTemplate(`vue/main.${fileExt}.ejs`, path.join(projectPath, 'src', `main.${fileExt}`));
  
  // 创建App.vue
  renderTemplate('vue/App.vue.ejs', path.join(projectPath, 'src', 'App.vue'));
  
  // 创建HelloWorld组件
  renderTemplate('vue/components/HelloWorld.vue.ejs', path.join(projectPath, 'src', 'components', 'HelloWorld.vue'));
  
  // 如果选择了路由，创建路由文件
  if (config.features.includes('router')) {
    renderTemplate(`vue/router/index.${fileExt}.ejs`, path.join(projectPath, 'src', 'router', `index.${fileExt}`));
    renderTemplate('vue/views/HomeView.vue.ejs', path.join(projectPath, 'src', 'views', 'HomeView.vue'));
    renderTemplate('vue/views/AboutView.vue.ejs', path.join(projectPath, 'src', 'views', 'AboutView.vue'));
  }
  
  // 如果选择了状态管理，创建store文件
  if (config.features.includes('store')) {
    renderTemplate(`vue/store/index.${fileExt}.ejs`, path.join(projectPath, 'src', 'store', `index.${fileExt}`));
  }
  
  // 创建.gitignore
  renderTemplate('vue/gitignore.ejs', path.join(projectPath, '.gitignore'));
  
  // 创建README.md
  renderTemplate('vue/README.md.ejs', path.join(projectPath, 'README.md'));
  
  // 复制Vue Logo
  const logoSourcePath = path.join(__dirname, '..', 'templates', 'vue', 'logo.png');
  const logoTargetPath = path.join(projectPath, 'src', 'assets', 'logo.png');
  
  if (fs.existsSync(logoSourcePath)) {
    fs.copyFileSync(logoSourcePath, logoTargetPath);
  } else {
    console.log('警告: Vue logo图片未找到，请手动添加一个logo图片到src/assets目录。');
  }
  
  // 如果选择了typescript，创建tsconfig.json
  if (config.features.includes('typescript')) {
    renderTemplate('vue/tsconfig.json.ejs', path.join(projectPath, 'tsconfig.json'));
    renderTemplate('vue/tsconfig.node.json.ejs', path.join(projectPath, 'tsconfig.node.json'));
  }
  
  // 如果选择了ESLint，创建.eslintrc.js
  if (config.features.includes('linter')) {
    renderTemplate('vue/eslintrc.js.ejs', path.join(projectPath, '.eslintrc.js'));
  }
  
  // 如果环境中有npm，初始化项目依赖
  try {
    process.chdir(projectPath);
    execSync('npm install', { stdio: 'ignore' });
  } catch (error) {
    console.log('无法自动安装依赖，请在创建后运行 npm install');
  }
}

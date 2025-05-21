# <%= config.name %>

This template should help get you started developing with Vue 3<%= config.features.includes('typescript') ? ' and TypeScript' : '' %> in Vite.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### <%= config.features.includes('typescript') ? 'Type-Check, ' : '' %>Compile and Minify for Production

```sh
npm run build
```
<% if (config.features.includes('linter')) { %>
### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
<% } %>
<% if (config.features.includes('unit-testing')) { %>
### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test
```
<% } %>
<% if (config.features.includes('e2e-testing')) { %>
### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e
```
<% } %>

const TemplateCache = require('../lib/template-cache');

/**
 * 创建Vue项目的函数
 * @param {string} projectPath - 项目路径
 * @param {Object} config - 项目配置
 */
async function createVueProject(projectPath, config) {
  const fs = require('fs');
  const path = require('path');
  const ejs = require('ejs');
  const { execSync } = require('child_process');
  
  // CDN基础URL
  const CDN_BASE_URL = 'https://your-cdn.com/templates/'; // 替换为您实际的CDN URL
  
  // 创建模板缓存
  const templateCache = new TemplateCache(CDN_BASE_URL);
  
  // 创建基本目录结构
  // ...existing code...
  
  // 使用TypeScript还是JavaScript
  const fileExt = config.features.includes('typescript') ? 'ts' : 'js';
  
  // 从CDN获取模板内容并渲染
  async function renderTemplateFromCDN(templatePath, targetPath, data = {}) {
    try {
      // 从缓存或CDN获取模板
      const templateContent = await templateCache.getTemplate(templatePath);
      
      const rendered = ejs.render(templateContent, { ...data, config });
      fs.writeFileSync(targetPath, rendered);
      console.log(`✓ 成功创建文件: ${path.basename(targetPath)}`);
    } catch (error) {
      console.error(`获取模板 ${templatePath} 失败: ${error.message}`);
      throw error;
    }
  }
  
  // 下载二进制文件(如图片)
  async function downloadBinaryFile(filePath, targetPath) {
    try {
      // 从缓存或CDN获取文件
      const fileContent = await templateCache.getBinaryFile(filePath);
      
      fs.writeFileSync(targetPath, fileContent);
      console.log(`✓ 成功下载文件: ${path.basename(targetPath)}`);
    } catch (error) {
      console.error(`下载文件 ${filePath} 失败: ${error.message}`);
      console.log('将使用占位符替代...');
      // 创建一个占位文件，告知用户需要手动替换
      fs.writeFileSync(targetPath, '/* 此文件需要被替换 */');
    }
  }
  
  // 创建所有必要的文件
  // ...existing code...
}

program
  .command('clear-cache')
  .description('清除模板缓存')
  .action(() => {
    const TemplateCache = require('../lib/template-cache');
    const CDN_BASE_URL = 'https://your-cdn.com/templates/';
    const templateCache = new TemplateCache(CDN_BASE_URL);
    
    templateCache.clearCache();
    console.log('模板缓存已清除！');
  });
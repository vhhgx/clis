export default function generateAppVue(config) {
  // 计算模板所需的各种变量
  const hasRouter = config.features.includes('router')
  const hasTypescript = config.features.includes('typescript')
  const hasSetup = config.features.includes('setup')

  // 处理不同的视图内容
  const viewContent = hasRouter
    ? '<router-view></router-view>'
    : `<HelloWorld msg="Welcome to Your Vue.js${
        hasTypescript ? ' + TypeScript' : ''
      } App"/>`

  // 处理脚本标签属性
  const scriptAttrs = []
  if (hasTypescript) scriptAttrs.push('lang="ts"')
  if (hasSetup) scriptAttrs.push('setup')
  const scriptTag = scriptAttrs.length
    ? `<script ${scriptAttrs.join(' ')}>`
    : '<script>'

  // 处理导入和组件定义
  let scriptContent = ''

  if (hasTypescript) {
    scriptContent = `import { defineComponent } from 'vue'
${!hasRouter ? "import HelloWorld from './components/HelloWorld.vue'\n" : ''}
export default defineComponent({
  name: 'App',
  ${
    !hasRouter
      ? `components: {
    HelloWorld
  },`
      : ''
  }
})`
  } else {
    scriptContent = `${
      !hasRouter ? "import HelloWorld from './components/HelloWorld.vue'\n" : ''
    }
export default {
  name: 'App',
  ${
    !hasRouter
      ? `components: {
    HelloWorld
  },`
      : ''
  }
}`
  }

  // 处理样式标签
  let styleTag = '<style'
  if (config.cssPreprocessor === 'sass') styleTag += ' lang="scss"'
  else if (config.cssPreprocessor === 'less') styleTag += ' lang="less"'
  else if (config.cssPreprocessor === 'stylus') styleTag += ' lang="stylus"'
  styleTag += '>'

  // 组合最终的模板字符串
  return `
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    ${viewContent}
  </div>
</template>

${scriptTag}
${scriptContent}
</script>

${styleTag}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
`
}

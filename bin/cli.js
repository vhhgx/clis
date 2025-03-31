#!/usr/bin/env node

const { program } = require('commander')
const packages = require('../package.json')
const { input } = require('@inquirer/prompts')

program.option('-v, --version').action(() => {
  console.log(`v${packages.version}`)
})

program.parse()

// 所有参数
// const options = program.opts();

program.command('create').description('创建模版').action(async () => {
  // 命名项目
  const projectName = await input({ message: '请输入项目名称：' })
  
  console.log('项目名称：', projectName)
})

// 解析用户执行命令传入参数
program.parse(process.argv)



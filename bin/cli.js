#!/usr/bin/env node

const { program } = require('commander')
// const packages = require('../package.json')
const { input, select, Separator } = require('@inquirer/prompts')

// program.option('-v, --version').action(() => {
//   console.log(`v${packages.version}`)
// })

// program.parse()

program
  .command('create [name]')
  .description('创建项目 create a project')
  .option('-t, --template <template>')
  .action(async (name, options) => {
    let answer
    if (!options.template) {
      // options.template = await input({ message: '请选择模版：' })

      answer = await select({
        message: '请选择模版：',
        choices: [
          {
            name: 'npm',
            value: 'npm',
            description: 'npm is the most popular package manager',
          },
          {
            name: 'yarn',
            value: 'yarn',
            description: 'yarn is an awesome package manager',
          },
          new Separator(),
          {
            name: 'jspm',
            value: 'jspm',
            disabled: true,
          },
          {
            name: 'pnpm',
            value: 'pnpm',
            disabled: '(pnpm is not available)',
          },
        ],
      })

      // console.log('选择的模版：', answer);
      
    }

    if (!name) {
      name = await input({ message: '请输入项目名称：' })
    }
    console.log('项目名称：', name, answer)
    console.log('项目参数：', options)
  })

program
  .command('list')
  .description('查看模版列表 check template list')
  .action(() => {
    console.log('查看模版')
  })

// program.option('-t, --template ').action(async (options) => {
//   // console.log(`v${packages.version}`)
//   console.log('模板：', options.template);
// })
// // 所有参数
// // const options = program.opts();

// program.command('create').description('创建模版').action(async (event) => {
//   // 命名项目
//   // const projectName = await input({ message: '请输入项目名称：' })

//   console.log('项目名称：', event)
// })

// // 解析用户执行命令传入参数
program.parse(process.argv)
// // .action(() => {
// //   console.log(process.argv, 'process.argv');
// // })

/**
 * 通过 create 这种命令来进行创建项目
 *
 */

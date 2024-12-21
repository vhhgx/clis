#!/usr/bin/env node

// const { Command } = require('commander');

const { program } = require('commander');


const inquirer = require("inquirer");

const package = require("../package.json");
// const program = new Command();

const { input } = require ('@inquirer/prompts')



// program
//   .version('0.1.0')
//   .description('A simple CLI tool')
//   .option('-n, --name <type>', 'Specify your name')
//   .action((options) => {
//     console.log(`Hello, ${options.name || 'World'}!`);
//   });



program.option("-v, --version").action(() => {
  console.log(`v${package.version}`);
});

program.parse();

const options = program.opts();

console.log('optss', options)

program
  .command("create")
  .description("创建模版")
  .action(async () => {
    // 命名项目
    const projectName = await input({ message: '请输入项目名称：' });
    
    
    // inquirer.prompt({
    //   type: "input",
    //   name: "projectName",
    //   message: "请输入项目名称：",
    // })
    // .then((answers) => {
    //   // Use user feedback for... whatever!!
    //   console.log('dddd', )
    // })
    // .catch((error) => {
    //   if (error.isTtyError) {
    //     // Prompt couldn't be rendered in the current environment
    //   } else {
    //     // Something else went wrong
    //   }
    // });
    console.log("项目名称：", name);
  });

// 解析用户执行命令传入参数
program.parse(process.argv);
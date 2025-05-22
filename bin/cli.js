#!/usr/bin/env node

import { program } from 'commander'
// import chooseFramework from '../src/prompts/chooseFramework.js';
// import { promptVueFeatures } from '../src/prompts/vue/features.js'
// import { promptNuxtFeatures } from '../src/prompts/nuxt/features.js'
// import { promptKoaFeatures } from '../src/prompts/koa/features.js'
// import { createProject } from '../src/create/index.js'
import prompts from 'prompts'
import path, { dirname } from 'path'
import fs from 'fs'
import { execSync } from 'child_process'
import ora from 'ora'
import { fileURLToPath } from 'url'

import {
  chooseFramework,
  frontEndFeatures,
  onCancel,
  preCssFeatures,
  backEndFeatures,
  createProject
} from '../src/prompts/questions.js'



program.command('create [name]').description('创建项目').option('-t, --template <template>').action(async (name, options) => {
  try {
    // 选择框架
    const questions = chooseFramework(name)
    
    // 获取基本答案
    let response = await prompts(questions, { onCancel })
    
    // todo 这里要加一个没有名称的逻辑
    const { projectType: type } = response
    
    // 前端项目
    if (type === 'vue' || type === 'nuxt') {
      // 获取前端项目需要的库（特性），内容是一个特性数组
      const features = await frontEndFeatures()
      
      response.features = features
      response.type = 'frontend'
      
      // css预处理器
      if (features.includes('css-preprocessor')) {
        response.preprocessor = await preCssFeatures()
      }
    } else if (type === 'koa') {
      // 获取后端项目需要的库（特性），内容是一个特性数组
      response.features = await backEndFeatures()
      response.type = 'backend'
    }
    
    console.log('response', response)
    
    if (!response.projectName) {
      response.projectName = name || 'my-project'
    }
    
    await createProject(response)
    
    // await createProject()
  } catch (error) {
    console.error('发生错误:', error)
    process.exit(1)
  }
})

// 项目创建函数

// 处理命令行参数
program.parse(process.argv)

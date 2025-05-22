import fs from 'fs/promises'
import path from 'path'
import { promisify } from 'util'

export class File {
  constructor(filePath) {
    // 文件路径
    this.filePath = filePath
    // 文件是否存在
    this.fileExists = false
  }
  
  /**
   * 检查文件是否存在
   * @returns {File} - 返回File实例以支持链式调用
   */
  async exists() {
    try {
      await fs.access(this.filePath)
      this.fileExists = true
    } catch {
      this.fileExists = false
    }
    
    // return this
    
    return this.fileExists
  }
}

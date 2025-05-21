const fs = require('fs');
const path = require('path');
const os = require('os');
const axios = require('axios');

class TemplateCache {
  constructor(cdnBaseUrl) {
    this.cdnBaseUrl = cdnBaseUrl;
    this.cacheDir = path.join(os.homedir(), '.vue-templates-cache');
    this.ensureCacheDir();
  }

  ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  getCachePath(templatePath) {
    return path.join(this.cacheDir, templatePath.replace(/\//g, '_'));
  }

  async getTemplate(templatePath) {
    const cachePath = this.getCachePath(templatePath);
    
    // 检查缓存是否存在且新鲜(7天内)
    if (this.isValidCache(cachePath)) {
      return fs.readFileSync(cachePath, 'utf8');
    }
    
    // 如果缓存不存在或已过期，从CDN获取
    try {
      const response = await axios.get(`${this.cdnBaseUrl}${templatePath}`);
      const templateContent = response.data;
      
      // 保存到缓存
      this.saveToCache(cachePath, templateContent);
      
      return templateContent;
    } catch (error) {
      throw new Error(`Failed to fetch template ${templatePath}: ${error.message}`);
    }
  }
  
  async getBinaryFile(filePath) {
    const cachePath = this.getCachePath(filePath);
    
    // 检查缓存
    if (this.isValidCache(cachePath)) {
      return fs.readFileSync(cachePath);
    }
    
    // 下载文件
    try {
      const response = await axios({
        method: 'get',
        url: `${this.cdnBaseUrl}${filePath}`,
        responseType: 'arraybuffer'
      });
      
      // 保存到缓存
      this.saveToCache(cachePath, response.data);
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to download file ${filePath}: ${error.message}`);
    }
  }
  
  isValidCache(cachePath) {
    if (!fs.existsSync(cachePath)) {
      return false;
    }
    
    // 检查文件是否在7天内创建的
    const stats = fs.statSync(cachePath);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    return (Date.now() - stats.mtimeMs) < maxAge;
  }
  
  saveToCache(cachePath, content) {
    // 确保缓存目录的父目录存在
    const dir = path.dirname(cachePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // 写入缓存
    if (Buffer.isBuffer(content)) {
      fs.writeFileSync(cachePath, content);
    } else {
      fs.writeFileSync(cachePath, content, 'utf8');
    }
  }
  
  clearCache() {
    if (fs.existsSync(this.cacheDir)) {
      fs.rmdirSync(this.cacheDir, { recursive: true });
      this.ensureCacheDir();
    }
  }
}

module.exports = TemplateCache;

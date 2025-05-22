/**
 * 示例模板文件，展示ESM格式
 */
export default function renderTemplate(config) {
  // 您可以在此处理配置并返回字符串
  return `// 这是一个示例文件
// 项目名称: ${config.name}
// 使用TypeScript: ${config.features.includes('typescript') ? '是' : '否'}

console.log('Hello from ${config.name}!');
`;
}

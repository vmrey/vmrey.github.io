---
title: JavaScript 字符串指定长度截断并自动追加省略号
date: 2022-01-05
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,文本截断,省略号,前端工具函数
summary: 纯 JavaScript 实现可自定义最大字符长度的文本截断函数，超出部分智能替换为 ... 省略号，支持严格边界保护。
readTime: 2 分钟阅读
---

# JavaScript 字符串指定长度截断并自动追加省略号

## 一、实现代码

```javascript
/**
 * 字符串超出指定长度后自动追加省略号
 * @param {String} text 输入文本
 * @param {Number} maxLen 最大允许展示长度 (-1 为不截断)
 * @returns {String} 处理后的字符串
 */
function truncateWithEllipsis(text, maxLen = 20) {
  if (!text) return '';
  const str = String(text);
  const limit = Number(maxLen);

  if (limit >= 0 && str.length > limit) {
    return str.substring(0, limit) + '...';
  }

  return str;
}

// 调用示例
console.log(truncateWithEllipsis('这是一篇关于Vue3组件设计的深度技术文章', 10));
// 输出: '这是一篇关于Vue3...'

console.log(truncateWithEllipsis('短文本', 10));
// 输出: '短文本'
```

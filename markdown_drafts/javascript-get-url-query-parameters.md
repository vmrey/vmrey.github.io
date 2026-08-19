---
title: JavaScript 获取当前页面 URL 查询参数的高效解析方案
date: 2021-01-25
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,URL参数,URLSearchParams,浏览器
summary: 详细解析获取 URL Query 参数的多种方案：现代 URLSearchParams 原生 API、正则表达式提取与字符串分割转换。
readTime: 3 分钟阅读
---

# JavaScript 获取当前页面 URL 查询参数的高效解析方案

## 一、现代原生 API：URLSearchParams（强烈推荐）

现代主流浏览器均内置了 `URLSearchParams`，无需自行编写复杂正则：

```javascript
// 示例 URL: https://example.com/index.html?name=vmrey&lang=zh-CN

const urlParams = new URLSearchParams(window.location.search);

// 获取单个参数
const name = urlParams.get('name'); // 'vmrey'
const lang = urlParams.get('lang'); // 'zh-CN'

// 转换为完整 JSON 对象
const paramsObj = Object.fromEntries(urlParams.entries());
console.log(paramsObj); // { name: 'vmrey', lang: 'zh-CN' }
```

---

## 二、经典通用字符串分割解析法（全环境兼容）

```javascript
/**
 * 提取 URL 查询参数并转换为键值对象
 * @param {String} customUrl 可选自定义 URL
 * @returns {Object} 参数键值对
 */
function getUrlParams(customUrl) {
  const url = customUrl || window.location.href;
  const queryIndex = url.indexOf('?');
  if (queryIndex === -1) return {};

  const queryString = url.slice(queryIndex + 1);
  const pairs = queryString.split('&');
  const result = {};

  pairs.forEach(pair => {
    if (!pair) return;
    const [key, value] = pair.split('=');
    result[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });

  return result;
}

// 调用示例
console.log(getUrlParams('https://vmrey.github.io/?tag=Vue&page=2'));
// 输出: { tag: 'Vue', page: '2' }
```

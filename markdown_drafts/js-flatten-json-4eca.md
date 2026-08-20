---
title: JavaScript 递归扁平化深层嵌套数组与 JSON 结构实战
date: 2021-04-12
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,扁平化,递归,数据处理
summary: 掌握多维数组扁平化为一维数组，以及将多层嵌套树形 JSON 数据结构展平成单层键值映射的通用算法。
readTime: 3 分钟阅读
---

# JavaScript 递归扁平化深层嵌套数组与 JSON 结构实战

## 一、多维数组扁平化为一维数组

```javascript
/**
 * 递归将多维数组扁平化为一维数组
 * @param {Array} arr 多维嵌套数组
 * @returns {Array} 展平后的一维数组
 */
function flattenArray(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flattenArray(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

// 现代浏览器原生方案 (ES2019)
const nestedArr = [1, [2, [3, [4, 5]]], 6];
console.log(nestedArr.flat(Infinity)); // [1, 2, 3, 4, 5, 6]
```

---

## 二、多层嵌套 JSON 扁平化展开

```javascript
/**
 * 递归将多层 JSON 展平成单层键值对
 * @param {Object} jsonObj 嵌套 JSON 对象
 * @param {String} prefix 键名前缀
 * @param {Object} result 结果容器
 */
function flattenJson(jsonObj, prefix = '', result = {}) {
  for (const key in jsonObj) {
    if (Object.prototype.hasOwnProperty.call(jsonObj, key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof jsonObj[key] === 'object' && jsonObj[key] !== null && !Array.isArray(jsonObj[key])) {
        flattenJson(jsonObj[key], fullKey, result);
      } else {
        result[fullKey] = jsonObj[key];
      }
    }
  }
  return result;
}

// 调用示例
const userProfile = {
  user: {
    name: '张三',
    detail: {
      email: 'zhangsan@example.com',
      city: '北京'
    }
  },
  status: 'active'
};

console.log(flattenJson(userProfile));
// 输出: { 'user.name': '张三', 'user.detail.email': '...', 'user.detail.city': '北京', status: 'active' }
```

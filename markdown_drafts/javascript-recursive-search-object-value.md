---
title: JavaScript 递归检索深层对象与数组中是否包含某个值
date: 2021-04-25
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,递归检索,对象遍历,算法
summary: 编写通用递归搜索函数，跨越任意深度嵌套的 JSON 对象与数组层级，快速判断某个基本类型值是否存在。
readTime: 3 分钟阅读
---

# JavaScript 递归检索深层对象与数组中是否包含某个值

## 一、函数设计需求

在处理复杂的多层树形数据时，我们常常需要快速判断一个数值或字符串（如 `T恤`、`user_1024`）是否存在于对象的任意深层属性中。

---

## 二、通用递归检索实现代码

```javascript
/**
 * 递归判断对象或数组是否包含指定值
 * @param {*} searchValue 要检索的目标值（基本数据类型）
 * @param {Object|Array} targetObj 待遍历的对象或数组
 * @returns {Boolean} 是否存在
 */
function isValueExist(searchValue, targetObj) {
  if (targetObj === null || targetObj === undefined) return false;

  // 如果当前直接匹配
  if (targetObj === searchValue) return true;

  if (typeof targetObj === 'object') {
    for (const key in targetObj) {
      if (Object.prototype.hasOwnProperty.call(targetObj, key)) {
        if (isValueExist(searchValue, targetObj[key])) {
          return true;
        }
      }
    }
  }

  return false;
}

// 调用示例
const complexUser = {
  user: {
    name: '张三',
    goods: {
      clothes: 'T恤',
      color: 'red',
      tags: ['热卖', '新品']
    },
    id: 5
  }
};

console.log(isValueExist('T恤', complexUser)); // true
console.log(isValueExist('新品', complexUser)); // true
console.log(isValueExist('iPhone', complexUser)); // false
```

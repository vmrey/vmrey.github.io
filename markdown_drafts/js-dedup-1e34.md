---
title: JavaScript 数组与字符串去重深度实战（支持嵌套对象去重）
date: 2021-03-25
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,去重,Set,算法
summary: 总结 JavaScript 中数组去重、字符串字符去重，以及支持包含嵌套 JSON 对象的深度去重完整解决方案。
readTime: 4 分钟阅读
---

# JavaScript 数组与字符串去重深度实战（支持嵌套对象去重）

## 一、基础数组与字符串极简去重 (Set)

对于基础数据类型的数组与字符串，ES6 的 `Set` 是最高效的去重方式：

```javascript
// 1. 普通数组去重
const arr = [1, 2, 2, 3, 4, 4, 5];
const uniqueArr = [...new Set(arr)];
console.log(uniqueArr); // [1, 2, 3, 4, 5]

// 2. 字符串字符去重
const str = 'abbcccdddde';
const uniqueStr = [...new Set(str)].join('');
console.log(uniqueStr); // 'abcde'
```

---

## 二、支持复杂 JSON 对象的全功能深度去重函数

```javascript
/**
 * 健壮的数组去重函数（支持内部包含 JSON 对象的深度比对）
 * @param {Array|String|Number} target 需要去重的数据
 * @returns {Array|String}
 */
function removeDuplicates(target) {
  if (typeof target === 'string' || typeof target === 'number') {
    const chars = String(target).split('');
    return [...new Set(chars)].join('');
  }

  if (!Array.isArray(target)) return target;

  const result = [];
  const stringCache = new Set();

  for (const item of target) {
    // 将对象转为序列化字符串进行精准特征比对
    const key = typeof item === 'object' && item !== null 
      ? JSON.stringify(item) 
      : item;

    if (!stringCache.has(key)) {
      stringCache.add(key);
      result.push(item);
    }
  }

  return result;
}

// 调用示例
const mixedList = [
  1, 5, 5, 6,
  { name: '张三', age: 18 },
  { name: '李四', age: 20 },
  { name: '张三', age: 18 } // 重复对象
];

console.log(removeDuplicates(mixedList));
// 输出: [1, 5, 6, { name: '张三', age: 18 }, { name: '李四', age: 20 }]
```

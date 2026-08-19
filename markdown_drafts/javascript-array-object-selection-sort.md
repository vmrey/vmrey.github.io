---
title: JavaScript 数组与对象数组自定义排序算法实战
date: 2021-03-20
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,选择排序,数组排序,算法
summary: 实现通用选择排序算法，支持对普通数值数组及包含特定 key 键的对象数组进行正序与逆序灵活排列。
readTime: 4 分钟阅读
---

# JavaScript 数组与对象数组自定义排序算法实战

## 一、通用数组选择排序算法

```javascript
/**
 * 基础数组选择排序
 * @param {Array} arr 待排序数组
 * @param {Number} order 1 为从小到大，-1 为从大到小
 * @returns {Array} 排序后的全新副本
 */
function selectionSort(arr = [], order = 1) {
  const result = [...arr];
  const len = result.length;

  for (let i = 0; i < len - 1; i++) {
    for (let j = i + 1; j < len; j++) {
      if (order === 1 && result[i] > result[j]) {
        [result[i], result[j]] = [result[j], result[i]];
      } else if (order === -1 && result[i] < result[j]) {
        [result[i], result[j]] = [result[j], result[i]];
      }
    }
  }

  return result;
}

// 调用示例
const numbers = [1, 8, 96, 666, 2, 3, 5, 68, 567];
console.log('从小到大:', selectionSort(numbers, 1));
console.log('从大到小:', selectionSort(numbers, -1));
```

---

## 二、对象数组根据 Key 键动态排序

```javascript
/**
 * 对象数组根据属性 key 排序
 * @param {Array} arrObj 对象数组
 * @param {Number} order 1 为从小到大，-1 为从大到小
 * @param {String} key 参与比较的对象属性字段
 */
function sortObjByKey(arrObj = [], order = 1, key) {
  const result = JSON.parse(JSON.stringify(arrObj));
  const len = result.length;

  for (let i = 0; i < len - 1; i++) {
    for (let j = i + 1; j < len; j++) {
      if (order === 1 && result[i][key] > result[j][key]) {
        [result[i], result[j]] = [result[j], result[i]];
      } else if (order === -1 && result[i][key] < result[j][key]) {
        [result[i], result[j]] = [result[j], result[i]];
      }
    }
  }

  return result;
}

// 调用示例
const userList = [
  { id: 265, name: '张三' },
  { id: 0, name: '李四' },
  { id: 2, name: '王五' },
  { id: 999, name: '赵六' }
];

console.log('按 id 正序:', sortObjByKey(userList, 1, 'id'));
console.log('按 id 倒序:', sortObjByKey(userList, -1, 'id'));
```

---
title: JavaScript 引用类型对象深拷贝与 JSON 序列化技巧
date: 2021-02-15
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,深拷贝,JSON,引用类型
summary: 深入分析 JavaScript 中引用类型的浅拷贝与深拷贝，探讨 JSON.parse(JSON.stringify()) 序列化方案与递归深克隆的边界处理。
readTime: 4 分钟阅读
---

# JavaScript 引用类型对象深拷贝与 JSON 序列化技巧

## 一、引用类型的引用传递问题

在 JavaScript 中，对象和数组均属于引用数据类型。如果直接使用赋值符 `const copy = obj`，修改新对象的同时会直接污染原对象。

---

## 二、基于 JSON 序列化的极简深拷贝

对于纯数据（没有函数、`undefined`、Symbol 或循环引用）的对象，JSON 序列化是最轻量的深克隆方式：

```javascript
const original = {
  id: 1,
  user: { name: 'admin', roles: ['editor', 'viewer'] }
};

// 极简深克隆
const cloned = JSON.parse(JSON.stringify(original));
cloned.user.name = 'super_admin';

console.log(original.user.name); // 输出: 'admin' (原对象未被污染)
console.log(cloned.user.name);   // 输出: 'super_admin'
```

---

## 三、通用深度递归克隆函数

支持数组、嵌套对象、日期等完整类型的递归拷贝：

```javascript
/**
 * 健壮的深度克隆函数
 * @param {*} target 目标对象
 * @returns {*} 克隆后的新副本
 */
function deepClone(target) {
  if (target === null || typeof target !== 'object') {
    return target;
  }

  if (target instanceof Date) return new Date(target);
  if (target instanceof RegExp) return new RegExp(target);

  const cloneTarget = Array.isArray(target) ? [] : {};

  for (let key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      cloneTarget[key] = deepClone(target[key]);
    }
  }

  return cloneTarget;
}
```

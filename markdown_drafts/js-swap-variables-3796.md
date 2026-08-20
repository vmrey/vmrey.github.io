---
title: JavaScript 中交换两个变量值的五种经典实现方法
date: 2021-02-20
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,ES6,解构赋值,基础算法
summary: 盘点 JavaScript 中对调两个变量的 5 种方式：临时变量法、ES6 解构赋值、算术加减法、异或运算与数组索引互换。
readTime: 3 分钟阅读
---

# JavaScript 中交换两个变量值的五种经典实现方法

## 一、ES6 解构赋值（现代推荐）

ES6 提供了优雅的数组解构语法，一行代码即可完成两个变量的值对调，且无需开辟显式临时变量：

```javascript
let a = 1;
let b = 2;

[a, b] = [b, a];

console.log(a, b); // 输出: 2, 1
```

---

## 二、经典临时中间变量法

最稳健直观、兼容所有浏览器环境的标准实现：

```javascript
var a = 1;
var b = 2;

var temp = a;
a = b;
b = temp;

console.log(a, b); // 输出: 2, 1
```

---

## 三、数值加减运算法（仅限数值类型）

无需借助临时变量，通过数学求和与求差完成互换（需注意大数溢出风险）：

```javascript
var a = 10;
var b = 20;

a = a + b; // a = 30
b = a - b; // b = 10
a = a - b; // a = 20

console.log(a, b); // 输出: 20, 10
```

---

## 四、位异或运算法 (XOR 仅限整数)

利用二进制异或性质进行原地无额外空间交换：

```javascript
var a = 5;  // 二进制 0101
var b = 9;  // 二进制 1001

a = a ^ b;
b = a ^ b;
a = a ^ b;

console.log(a, b); // 输出: 9, 5
```

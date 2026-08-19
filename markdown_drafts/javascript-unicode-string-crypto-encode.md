---
title: 基于 Unicode 编码的原生 JavaScript 字符串加解密方法
date: 2021-03-05
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,加密解密,Unicode,安全
summary: 利用 charCodeAt 与 fromCharCode 算法实现跨语言通用的轻量级字符串加密与解密函数。
readTime: 3 分钟阅读
---

# 基于 Unicode 编码的原生 JavaScript 字符串加解密方法

## 一、原理与设计思路

基于原生 JavaScript 的 `charCodeAt` 与 `fromCharCode`，将字符串中每个字符转化为 Unicode 数值并应用异或位移变换，解密时再按原算法反向还原。

**核心优势**：零第三方库依赖，算法跨平台跨语言通用，执行效率极高。

---

## 二、加解密完整实现代码

```javascript
/**
 * 字符串轻量可逆加密
 * @param {String} str 待加密原文
 * @param {Number} salt 混淆盐值 (默认为 13)
 * @returns {String} 加密后的密文
 */
function encryptString(str, salt = 13) {
  if (!str) return '';
  let encrypted = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) ^ salt;
    encrypted += code.toString(16).padStart(4, '0');
  }
  return encrypted;
}

/**
 * 密文解密还原
 * @param {String} cipher 密文
 * @param {Number} salt 混淆盐值
 * @returns {String} 解密后的明文
 */
function decryptString(cipher, salt = 13) {
  if (!cipher) return '';
  let decrypted = '';
  for (let i = 0; i < cipher.length; i += 4) {
    const hex = cipher.substr(i, 4);
    const code = parseInt(hex, 16) ^ salt;
    decrypted += String.fromCharCode(code);
  }
  return decrypted;
}

// 测试示例
const originalText = "Hello vmrey.github.io! 密码123456";
const cipher = encryptString(originalText);
console.log('加密后:', cipher);

const plain = decryptString(cipher);
console.log('解密后:', plain);
console.log('还原匹配成功:', originalText === plain);
```

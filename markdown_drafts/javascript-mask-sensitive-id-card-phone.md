---
title: JavaScript 身份证、手机号与敏感证件信息脱敏掩码处理
date: 2022-03-01
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,数据脱敏,信息安全,工具函数
summary: 前端数据展示安全规范：封装可自定义前置与后置保留位数的通用信息脱敏函数，将敏感数字快速替换为星号。
readTime: 2 分钟阅读
---

# JavaScript 身份证、手机号与敏感证件信息脱敏掩码处理

## 一、业务安全规范

在前端界面展示用户身份证号（18位）、手机号（11位）或银行卡号时，严禁直接明文全量展示，必须对中间核心位进行星号（`*`）掩码脱敏。

---

## 二、通用脱敏处理函数

```javascript
/**
 * 字符串关键信息脱敏隐藏
 * @param {String} str 原始字符串（如手机号、身份证）
 * @param {Number} frontLen 前面保留明文位数
 * @param {Number} endLen 后面保留明文位数
 * @returns {String} 脱敏后的字符串
 */
function maskSensitiveInfo(str, frontLen = 3, endLen = 4) {
  if (!str) return '';
  const text = String(str);
  const totalLen = text.length;

  if (frontLen + endLen >= totalLen) {
    return text;
  }

  const maskLen = totalLen - frontLen - endLen;
  const stars = '*'.repeat(maskLen);

  return text.substring(0, frontLen) + stars + text.substring(totalLen - endLen);
}

// 常见脱敏调用示例：
// 1. 手机号脱敏 (前3后4: 138****8888)
console.log(maskSensitiveInfo('13812348888', 3, 4));

// 2. 18位身份证脱敏 (前6后4: 370602********1234)
console.log(maskSensitiveInfo('370602199801011234', 6, 4));

// 3. 姓名脱敏 (前1后0: 张*)
console.log(maskSensitiveInfo('张三', 1, 0));
```

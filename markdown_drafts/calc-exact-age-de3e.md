---
title: JavaScript 根据出生年月日精准计算周岁年龄函数
date: 2022-02-15
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,年龄计算,Date日期,算法
summary: 严谨处理跨年、同月同日及生日未过情况，通过年月日时间差精准计算用户的实际周岁年龄并进行格式校验。
readTime: 3 分钟阅读
---

# JavaScript 根据出生年月日精准计算周岁年龄函数

## 一、实现思路

1. 解析传入的 `YYYY-MM-DD` 或 `YYYY/MM/DD` 日期字符串；
2. 计算当前年份与出生年份的差值；
3. 比对当前月份与生日月份（或同月下的日差），若今年生日未到，则周岁需要减 1。

---

## 二、完整实现代码

```javascript
/**
 * 根据出生日期精准计算周岁年龄
 * @param {String} birthDate 出生日期 (如 '1998-05-20')
 * @returns {Number|String} 周岁年龄或错误提示
 */
function getExactAge(birthDate) {
  if (!birthDate) return '出生日期为空';
  
  const parts = String(birthDate).split(/[-/]/);
  if (parts.length < 3) return '日期格式不正确';

  const birthYear = parseInt(parts[0], 10);
  const birthMonth = parseInt(parts[1], 10);
  const birthDay = parseInt(parts[2], 10);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  let age = currentYear - birthYear;
  if (age < 0) return '出生日期不能晚于今天';

  // 生日月还未到，或生日月已到但生日还没过
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age--;
  }

  return age < 0 ? 0 : age;
}

// 调用示例
console.log(getExactAge('1998-02-12')); // 正确返回周岁
console.log(getExactAge('2000/10/01')); // 支持斜杠分隔
```

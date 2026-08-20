---
title: JavaScript 获取指定年份与月份的起始日期和结束日期
date: 2022-01-10
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,Date日期,前端工具函数,时间处理
summary: 利用 JavaScript Date 构造函数的第 0 天特性巧妙获取当月最后一天，高效返回准确的 YYYY-MM-01 与 YYYY-MM-DD。
readTime: 2 分钟阅读
---

# JavaScript 获取指定年份与月份的起始日期和结束日期

## 一、核心原理

在 JavaScript 的 `new Date(year, month, 0)` 中，第三个参数传入 `0` 会自动获取到上一个月的最后一天。因此传入目标月份后，直接调用 `getDate()` 即可精确获取当月的总天数（自动处理 28/29/30/31 天及闰年）。

---

## 二、实现代码

```javascript
/**
 * 获取指定年月的首日与末日
 * @param {Number|String} year 年份 (如 2022)
 * @param {Number|String} month 月份 (1-12)
 * @returns {Object} 包含 startDate 与 endDate 的对象
 */
function getMonthStartEndDate(year, month) {
  const y = Number(year);
  const m = Number(month);
  
  // 巧妙获取该月总天数
  const totalDays = new Date(y, m, 0).getDate();
  const formatMonth = String(m).padStart(2, '0');

  return {
    startDate: `${y}-${formatMonth}-01`,
    endDate: `${y}-${formatMonth}-${String(totalDays).padStart(2, '0')}`
  };
}

// 调用示例
console.log(getMonthStartEndDate(2022, 1));
// 输出: { startDate: '2022-01-01', endDate: '2022-01-31' }

console.log(getMonthStartEndDate(2024, 2)); // 闰年2月
// 输出: { startDate: '2024-02-01', endDate: '2024-02-29' }
```

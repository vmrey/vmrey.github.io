---
title: 微信小程序中对象数组冒泡排序算法实现与实战
date: 2021-01-10
category: 前端开发
subcategory: 微信小程序
tags: 微信小程序,冒泡排序,数组对象,算法
summary: 详细解析在微信小程序环境下，对复杂对象数组根据价格、销量或 ID 字段进行冒泡升序与降序排序的稳定实现。
readTime: 3 分钟阅读
---

# 微信小程序中对象数组冒泡排序算法实现与实战

## 一、算法原理

冒泡排序（Bubble Sort）通过依次比较相邻两个元素的值，如果顺序不符合预期则交换位置。多次循环后，最值元素将如气泡般逐渐“浮”到数列顶端。

---

## 二、小程序对象数组排序函数

```javascript
/**
 * 微信小程序对象数组排序
 * @param {Array} arr 数据数组
 * @param {Number} sortOrder 1 为升序，-1 为降序
 * @param {String} key 比较的字段名称
 */
function bubbleSortObjects(arr = [], sortOrder = 1, key) {
  const result = JSON.parse(JSON.stringify(arr));
  const len = result.length;

  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      const valA = result[j][key];
      const valB = result[j + 1][key];

      if (sortOrder === 1 && valA > valB) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      } else if (sortOrder === -1 && valA < valB) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }

  return result;
}

// 示例：按商品价格从低到高排序
const goodsList = [
  { id: 1, name: '机械键盘', price: 299 },
  { id: 2, name: '无线鼠标', price: 99 },
  { id: 3, name: '4K显示器', price: 1899 }
];

console.log(bubbleSortObjects(goodsList, 1, 'price'));
```

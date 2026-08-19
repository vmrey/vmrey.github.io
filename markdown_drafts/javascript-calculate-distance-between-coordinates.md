---
title: JavaScript 根据经纬度计算两地直线距离算法实现
date: 2021-04-22
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,经纬度,LBS定位,数学公式
summary: 基于 Haversine 球面大圆距离公式，使用 JavaScript 精确计算两个经纬度坐标点之间的实际千米/公里直线距离。
readTime: 3 分钟阅读
---

# JavaScript 根据经纬度计算两地直线距离算法实现

## 一、算法原理：Haversine 半正矢公式

地球近似为一个半径约为 $6378.137\text{ km}$ 的球体。通过将两点的纬度（Latitude）与经度（Longitude）转换为弧度，即可利用三角函数计算出球面两点之间的最短距离。

---

## 二、JavaScript 实现代码

```javascript
/**
 * 根据经纬度计算两点之间的距离 (单位: km)
 * @param {Number} lat1 第一个点的纬度 (-90 ~ 90)
 * @param {Number} lng1 第一个点的经度 (-180 ~ 180)
 * @param {Number} lat2 第二个点的纬度
 * @param {Number} lng2 第二个点的经度
 * @returns {Number} 距离（保留两位小数，千米）
 */
function getDistanceBetweenCoordinates(lat1, lng1, lat2, lng2) {
  const EARTH_RADIUS = 6378.137; // 地球半径 (km)
  
  const radLat1 = (lat1 * Math.PI) / 180.0;
  const radLat2 = (lat2 * Math.PI) / 180.0;
  const a = radLat1 - radLat2;
  const b = ((lng1 * Math.PI) / 180.0) - ((lng2 * Math.PI) / 180.0);

  let distance = 2 * Math.asin(
    Math.sqrt(
      Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
    )
  );

  distance = distance * EARTH_RADIUS;
  return Number(distance.toFixed(2));
}

// 调用示例：计算烟台两地标距离
const dist = getDistanceBetweenCoordinates(37.48205260, 121.44577861, 37.48330837, 121.44820869);
console.log(`两地距离约为: ${dist} km`);
```

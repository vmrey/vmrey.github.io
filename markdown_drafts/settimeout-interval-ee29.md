---
title: 深入浅出：使用 setTimeout 精准模拟 setInterval 及其核心优势
date: 2021-03-01
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,定时器,事件循环,性能优化
summary: 为什么生产环境不推荐原生 setInterval？分析事件堆叠排队机制，使用递归 setTimeout 实现精确无阻塞的周期执行。
readTime: 4 分钟阅读
---

# 深入浅出：使用 setTimeout 精准模拟 setInterval 及其核心优势

## 一、为什么原生 setInterval 存在缺陷？

在复杂的前端任务或网络请求场景中，使用原生 `setInterval` 会遇到以下痛点：
1. **执行时间堆叠**：如果回调函数的执行耗时超过了设定的间隔时间，多个定时器回调会紧挨着执行，产生卡顿；
2. **误差累计**：浏览器主线程阻塞时，可能会跳过部分周期的执行。

---

## 二、使用递归 setTimeout 优雅实现

使用链式/递归 `setTimeout` 能够保证前一次异步任务完全执行完毕后，再精确等待指定毫秒数开启下一次执行：

```javascript
/**
 * 基于 setTimeout 实现的精准定时轮询器
 * @param {Function} callback 待执行回调函数
 * @param {Number} interval 轮询间隔毫秒数
 * @returns {Object} 包含 cancel 方法的定时器控制器
 */
function mySetInterval(callback, interval) {
  let timerId = null;
  let isCancelled = false;

  function loop() {
    if (isCancelled) return;
    timerId = setTimeout(() => {
      callback();
      loop();
    }, interval);
  }

  loop();

  return {
    clear() {
      isCancelled = true;
      clearTimeout(timerId);
    }
  };
}

// 调用示例
const poller = mySetInterval(() => {
  console.log('周期执行:', new Date().toLocaleTimeString());
}, 1000);

// 5秒后停止轮询
setTimeout(() => {
  poller.clear();
  console.log('定时器已安全销毁');
}, 5000);
```

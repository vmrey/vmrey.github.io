---
title: JavaScript 字符串即时搜索与智能匹配排序算法
date: 2021-04-18
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,搜索匹配,字符串算法,排序
summary: 模拟百度搜索关键词智能匹配，基于字符匹配位置、命中度与插入排序对搜索结果列表进行动态权重排序。
readTime: 4 分钟阅读
---

# JavaScript 字符串即时搜索与智能匹配排序算法

## 一、实现原理

当用户输入搜索关键词时，根据以下权重进行动态排序：
1. **完全匹配 / 前缀匹配**：优先级最高；
2. **包含匹配**：根据字符在目标串中的出现索引位置升序排列；
3. **模糊命中**：过滤无相关项。

---

## 二、核心搜索与排序算法

```javascript
/**
 * 模拟百度搜索结果权重匹配排序
 * @param {String} keyword 搜索关键词
 * @param {Array<String>} dataList 待检索的数据列表
 * @returns {Array<String>} 按匹配度排序后的搜索结果
 */
function searchAndRank(keyword, dataList = []) {
  if (!keyword || !keyword.trim()) return dataList;
  const kw = keyword.trim().toLowerCase();

  // 1. 过滤并计算命中权重
  const matched = [];
  for (const item of dataList) {
    const text = String(item).toLowerCase();
    const index = text.indexOf(kw);
    if (index !== -1) {
      matched.push({
        raw: item,
        score: index // 越靠前 index 越小，匹配度越高
      });
    }
  }

  // 2. 插入排序进行权重排列
  for (let i = 1; i < matched.length; i++) {
    let current = matched[i];
    let j = i - 1;
    while (j >= 0 && matched[j].score > current.score) {
      matched[j + 1] = matched[j];
      j--;
    }
    matched[j + 1] = current;
  }

  return matched.map(m => m.raw);
}

// 调用示例
const searchDatabase = [
  'JavaScript 权威指南',
  'Vue3 源码与组件设计',
  'JavaScript 异步编程',
  '现代 JavaScript 教程',
  'Linux Nginx 运维实战'
];

console.log(searchAndRank('JavaScript', searchDatabase));
// 优先返回以 JavaScript 开头的条目，再返回中间包含的条目
```

---
title: CSS 元素水平垂直居中的常用核心方案总结
date: 2021-03-15
category: 前端开发
subcategory: JS 与工具函数
tags: CSS,前端排版,居中对齐,Flexbox
summary: 系统总结 Flexbox 弹性盒、绝对定位搭配 transform 偏移以及行内块级元素在内的核心 CSS 垂直水平居中技巧。
readTime: 3 分钟阅读
---

# CSS 元素水平垂直居中的常用核心方案总结

## 一、Flexbox 弹性盒居中（现代前端推荐）

使用弹性盒布局是最简单、兼容性良好且最推荐的水平垂直居中方式：

```css
.parent {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
}
```

---

## 二、绝对定位配合 transform 负位移

适用于父级具有相对定位，子元素宽度或高度未知/动态的场景：

```css
.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

---

## 三、绝对定位搭配 margin: auto

适用于子元素具有固定宽度和高度的场景：

```css
.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 200px;
  height: 200px;
}
```

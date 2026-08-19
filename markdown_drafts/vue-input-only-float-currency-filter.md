---
title: Vue 中限制 input 输入框仅允许输入浮点数或金额格式
date: 2021-04-15
category: 前端开发
subcategory: Vue 与组件
tags: Vue,表单验证,金额输入,正则过滤
summary: 在 Vue 表单中通过 watch 监听与精确正则，限制用户输入金额时仅能输入数字与最多两位小数，杜绝非法字符。
readTime: 3 分钟阅读
---

# Vue 中限制 input 输入框仅允许输入浮点数或金额格式

## 一、实现思路

使用 Vue 的 `watch` 机制或 `@input` 事件监听，在用户键盘输入时实时通过正则表达式校验。如果输入了非法字符或超过两位小数，自动回退到上一次的合法值。

---

## 二、Vue 完整实现代码

```html
<template>
  <div class="money-input-container">
    <input 
      v-model="inputMoney" 
      placeholder="请输入金额 (最多两位小数)" 
      class="custom-input"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputMoney: ''
    };
  },
  watch: {
    inputMoney(newVal, oldVal) {
      if (!newVal) return;
      // 允许最多5位整数、最多2位小数的金额格式
      const reg = /^(\d{0,5})(\.(\d{0,2}))?$/;
      if (!reg.test(newVal)) {
        this.inputMoney = oldVal;
      }
    }
  }
};
</script>
```

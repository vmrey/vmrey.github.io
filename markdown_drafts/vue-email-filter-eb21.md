---
title: Vue 中 input 输入框实时校验与过滤邮箱格式输入
date: 2021-04-20
category: 前端开发
subcategory: Vue 与组件
tags: Vue,表单校验,邮箱验证,输入拦截
summary: 针对登录与注册表单，实现 Vue 输入框实时拦截非法特殊符号，保证仅能输入符合规范的 Email 邮箱字符。
readTime: 3 分钟阅读
---

# Vue 中 input 输入框实时校验与过滤邮箱格式输入

## 一、实现思路

1. 移除非法字符（仅保留字母、数字、`@`、`.` 与 `_`）；
2. 限制 `@` 符号全局唯一出现；
3. 限制 `@` 之后不能直接紧随 `.`；
4. 限制顶级域名后缀长度（通常为 2~4 位字符）。

---

## 二、Vue 核心实现代码

```html
<template>
  <div class="email-input-wrapper">
    <input 
      v-model="email" 
      placeholder="请输入您的邮箱地址" 
      class="email-input"
      @input="handleEmailInput"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: ''
    };
  },
  methods: {
    handleEmailInput() {
      let val = this.email.replace(/[^\d\w@._-]/g, '');

      if (val.indexOf('@') !== -1) {
        const parts = val.split('@');
        // 只允许一个 @ 符号
        if (parts.length > 2) {
          val = parts[0] + '@' + parts.slice(1).join('');
        }
        // 防止 @. 紧挨
        val = val.replace(/@\./g, '@');
      }

      this.email = val;
    }
  }
};
</script>
```

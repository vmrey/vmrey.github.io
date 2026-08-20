---
title: Vue 优雅一键重置组件 data 到初始状态的技巧
date: 2021-10-10
category: 前端开发
subcategory: Vue 与组件
tags: Vue,组件状态,重置表单,this.$options
summary: 告别繁琐的逐字段手动赋值，利用 this.$options.data() 结合 Object.assign 实现一行代码优雅重置 Vue 组件所有响应式数据。
readTime: 2 分钟阅读
---

# Vue 优雅一键重置组件 data 到初始状态的技巧

## 一、业务场景与痛点

在关闭弹窗或提交表单后，常常需要将组件内的 `form` 或全部 `data` 恢复到初始空值状态。如果字段很多，逐一写 `this.form.a = ''; this.form.b = '';` 极其繁琐且易遗漏。

---

## 二、一行代码优雅重置

在 Vue 实例中，`this.$options.data()` 可以获取到该组件在定义阶段最原始的未被修改的数据函数：

```javascript
// 1. 重置组件内的全部 data 数据
Object.assign(this.$data, this.$options.data.call(this));

// 2. 仅重置特定表单对象 (如 this.formData)
this.formData = this.$options.data.call(this).formData;
```

---

## 三、Vue 组件完整使用示例

```html
<script>
export default {
  data() {
    return {
      searchQuery: '',
      filterStatus: 1,
      userForm: {
        username: '',
        phone: '',
        address: ''
      }
    };
  },
  methods: {
    // 弹窗关闭或点击重置按钮时调用
    handleResetForm() {
      // 一键将 userForm 恢复为初始空值
      this.userForm = this.$options.data.call(this).userForm;
      console.log('表单已完全重置为初始状态');
    }
  }
};
</script>
```

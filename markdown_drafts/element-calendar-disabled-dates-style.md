---
title: Element UI 中 el-calendar 日历组件禁用与灰色置灰点击处理
date: 2021-05-12
category: 前端开发
subcategory: Vue 与组件
tags: Vue,ElementUI,el-calendar,组件实战
summary: 针对 Element UI 的 el-calendar 日历组件，利用 slot 插槽与 CSS 禁用非本月或过期日期的点击操作并展示灰色状态。
readTime: 3 分钟阅读
---

# Element UI 中 el-calendar 日历组件禁用与灰色置灰点击处理

## 一、实现需求

在订房系统或考勤排班中，使用 Element UI 的 `el-calendar` 组件时，需要将非本月或不可选日期置灰并禁止用户点击触发事件。

---

## 二、完整实现方案

```html
<template>
  <el-calendar>
    <template #dateCell="{ data }">
      <div 
        :class="['calendar-custom-cell', { 'is-disabled': isDisabledDate(data.day) }]"
        @click.stop="handleCellClick(data.day)"
      >
        <p>{{ data.day.split('-').slice(1).join('-') }}</p>
      </div>
    </template>
  </el-calendar>
</template>

<script>
export default {
  methods: {
    isDisabledDate(dayStr) {
      // 禁用今天之前的历史日期
      const today = new Date().toISOString().split('T')[0];
      return dayStr < today;
    },
    handleCellClick(dayStr) {
      if (this.isDisabledDate(dayStr)) return;
      console.log('用户选择了有效日期:', dayStr);
    }
  }
};
</script>

<style scoped>
.calendar-custom-cell.is-disabled {
  color: #c0c4cc;
  pointer-events: none;
  cursor: not-allowed;
  background-color: #f5f7fa;
}
</style>
```

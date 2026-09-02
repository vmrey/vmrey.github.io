---
title: Vue3 通用查询表单组件封装：JSON Schema 驱动与响应式联动
date: 2026-06-08
category: 前端开发
subcategory: Vue与组件
tags: 前端开发,Vue,组件封装,表单设计
summary: 基于 Vue 3 Composition API 与 Element Plus 打造轻量配置化查询表单组件，大幅提升后台开发效率。
readTime: 7 分钟阅读
---

## 一、组件源代码 (`QueryForm.vue`)

<div class="article-resource-card">
  <div class="article-resource-info">
    <div class="article-resource-icon">.VUE</div>
    <div class="article-resource-meta">
      <div class="article-resource-title-row">
        <span class="article-resource-name">QueryForm.vue</span>
        <span class="article-resource-badge">Vue 3 组件</span>
      </div>
      <div class="article-resource-desc">Vue3 + Element Plus 查询表单通用封装组件源码（响应式布局与重置联动）</div>
    </div>
  </div>
  <div class="article-resource-actions">
    <a href="../assets/files/QueryForm.vue" download class="article-resource-btn primary" title="直接下载 QueryForm.vue">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      <span>直接下载</span>
    </a>
    <a href="../files.html" class="article-resource-btn" title="前往全站文件中心在线预览与管理">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
      <span>文件中心</span>
    </a>
  </div>
</div>

## 二、父组件调用示范代码
```javascript
<template>
  <div class="page-container">
    <h2>查询表单示例</h2>
    
    <QueryForm
      v-model="queryParams"
      :formConfig="FORM_CONFIG"
      :dicts="MOCK_DICTS"
      :queryDebounce="200"
      componentSize="default"
      
      @query="handleQuery"
      @reset="handleReset"
    >
      <template #customSearch="{ prop }">
        <el-input 
          v-model="queryParams[prop]" 
          placeholder="插槽输入"
          style="width: 200px;"
          clearable
        />
      </template>
      
    </QueryForm>

    <div class="result-display">
      <h3>当前查询参数 (QueryParams)</h3>
      <pre>{{ JSON.stringify(queryParams, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
// 假设 QueryForm.vue 已经被正确导入
import QueryForm from './QueryForm.vue'; 
import { ElMessage } from 'element-plus'; // 仅用于演示消息提示

// --- 1. 定义数据源 ---
const MOCK_DICTS = {
  statusList: [
    { label: '待处理', value: 0 },
    { label: '已完成', value: 1 },
    { label: '已取消', value: 2 },
  ],
  channelList: [
    { label: 'PC 端', value: 'PC' },
    { label: '移动端', value: 'Mobile' },
  ],
};

const FORM_CONFIG = [
  { prop: 'keyword', label: '关键字', type: 'input', placeholder: '请输入订单号/用户ID' },
  { prop: 'status', label: '订单状态', type: 'select', dictKey: 'statusList' },
  { prop: 'channel', label: '渠道', type: 'radio', dictKey: 'channelList' },
  {
    prop: 'createDate',
    label: '创建时间',
    type: 'dateRange',
    dateProps: ['createTimeStart', 'createTimeEnd'],
    autoCompleteTime: true,
  },
  { prop: 'customSearch', label: '自定义', type: 'slot' },
];

// --- 2. 状态管理 ---
const queryParams = ref({
  // 初始化一些默认值是可选的
  keyword: '',
  status: 1, // 默认选中 '已完成'
  channel: 'PC',
});

// --- 3. 事件处理 ---

/**
 * 处理 QueryForm 触发的查询事件
 * @param {Object} params - 最终的查询参数对象
 */
const handleQuery = (params) => {
  console.log('--- 执行查询请求 ---');
  console.log('最终参数:', params);
  ElMessage.success('查询已触发，请查看控制台日志');
  
  // 实际项目中：调用 API 接口获取数据
  // fetchTableData(params);
};

/**
 * 处理 QueryForm 触发的重置事件
 * @param {Object} params - 重置后的查询参数对象 (通常为空)
 */
const handleReset = (params) => {
  console.log('--- 执行重置 ---');
  console.log('重置后的参数:', params);
  ElMessage.info('查询表单已重置');
};

// --- 4. 导出变量 ---
// 将这些常量导出，供 template 使用
</script>

<style scoped>
.page-container {
  padding: 20px;
}
.result-display {
  margin-top: 30px;
  padding: 15px;
  background-color: #f7f7f7;
  border-radius: 4px;
}
</style>
```

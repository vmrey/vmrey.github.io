---
title: Vue3 通用查询表单组件封装：JSON Schema 驱动与响应式联动
date: 2026-06-08
category: 前端开发
subcategory: Vue与组件
tags: 前端开发,Vue,组件封装,表单设计
summary: 基于 Vue 3 Composition API 与 Element Plus 打造轻量配置化查询表单组件，大幅提升后台开发效率。
readTime: 7 分钟阅读
---

## 一、组件源代码 (`FileUploader.vue`)
[QueryForm.vue 代码地址 ](../assets/files/QueryForm.vue)


## 父组件调用示范代码
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

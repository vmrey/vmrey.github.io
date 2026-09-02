---
title: Vue3 + Element Plus 文件上传组件封装：支持回显、批量与手动控制
date: 2026-06-15
category: 前端开发
subcategory: Vue与组件
tags: 前端开发,Vue,Element Plus,组件封装
summary: 在实际业务中深入封装 el-upload，实现文件列表回显、多文件批量上传、类型大小校验与手动提交控制。
readTime: 7 分钟阅读
---

# 🚀 Element Plus 进阶文件上传组件：实现文件回显、批量和手动控制

在实际业务开发中，我们经常需要一个组件来处理文件上传、展示已上传文件（回显/编辑模式）以及手动触发上传。Element Plus 的 `el-upload` 默认功能往往不够灵活。

本文将详细解析并教你如何使用一个功能增强的自定义文件上传组件。

---

## 一、组件源代码 (`FileUpload.vue`)

<div class="article-resource-card">
  <div class="article-resource-info">
    <div class="article-resource-icon">.VUE</div>
    <div class="article-resource-meta">
      <div class="article-resource-title-row">
        <span class="article-resource-name">FileUpload.vue</span>
        <span class="article-resource-badge">Vue 3 组件</span>
      </div>
      <div class="article-resource-desc">Vue3 + Element Plus 文件上传组件源码（支持回显、批量与手动控制提交）</div>
    </div>
  </div>
  <div class="article-resource-actions">
    <a href="../assets/files/FileUpload.vue" download class="article-resource-btn primary" title="直接下载 FileUpload.vue">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      <span>直接下载</span>
    </a>
    <a href="../files.html" class="article-resource-btn" title="前往全站文件中心在线预览与管理">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
      <span>文件中心</span>
    </a>
  </div>
</div>

## 二、父组件调用示范 (Vue 3 Composition API)
在父组件中使用此组件，实现编辑和新增模式的切换。

```javascript
<template>
  <el-card header="文件上传示例">
    <el-form :model="formData" label-width="120px">
      <el-form-item label="附件列表">
        <FileUploader
          ref="uploaderRef"
          v-model:attachment-ids="formData.attachmentIds"
          :initial-files="formData.initialFiles"
          :limit="3"
          :max-size_m-b="50"
          upload-url-path="/your/custom/upload/path"
          @change="handleFileChange"
        />
      </el-form-item>

      <el-form-item label="操作">
        <el-button type="primary" @click="handleSubmit"> 提交表单 </el-button>
        <el-button @click="handleReset"> 重置上传 </el-button>
        <el-button @click="toggleEditMode"> 模拟切换新增模式 </el-button>
      </el-form-item>
    </el-form>

    <el-divider />

    <p>
      **当前附件 ID 列表 (用于提交):** <el-tag v-for="id in formData.attachmentIds" :key="id" style="margin-right: 5px;">{{ id }}</el-tag>
      <span v-if="formData.attachmentIds.length === 0">无</span>
    </p>
  </el-card>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElMessage, ElCard, ElForm, ElFormItem, ElButton, ElDivider, ElTag } from "element-plus";
import FileUploader from "./FileUploader.vue"; // 确保导入路径正确

const uploaderRef = ref(null);

// 模拟后端返回的初始文件数据（用于编辑模式回显）
const mockInitialFiles = [
  { id: "f001", fileName: "项目需求文档.docx" }, 
  { id: "f002", fileName: "设计图.pdf" },
];

const formData = reactive({
  // 绑定：初始值应包含回显文件的 ID
  attachmentIds: ["f001", "f002"], 
  // 传入：回显文件列表
  initialFiles: mockInitialFiles, 
  title: "表单标题",
});

const handleFileChange = (fileList) => {
  console.log("文件列表更新了，当前文件总数:", fileList.length);
};

const handleSubmit = () => {
  const finalIds = formData.attachmentIds;
  if (finalIds.length === 0) {
    ElMessage.warning("请选择并上传文件后再提交！");
    return;
  }
  const payload = { title: formData.title, attachments: finalIds };
  console.log("最终提交的数据:", payload);
  ElMessage.success(`表单提交成功，附件ID: ${finalIds.join(", ")}`);
};

const handleReset = () => {
  // 1. 调用组件暴露的方法清空内部状态
  uploaderRef.value.clearFiles();
  // 2. 清空回显数据，确保下次打开是全新状态
  formData.initialFiles = []; 
  ElMessage.info("文件列表已重置。");
};

const toggleEditMode = () => {
    // 通过清空 initialFiles，组件内部的 watch 会清空回显文件
    formData.initialFiles = [];
    ElMessage.info("已清空初始文件列表，现在是新增模式。");
};
</script>
```

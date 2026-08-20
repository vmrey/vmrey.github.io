---
title: VSCode 前端开发高频实用正则表达式查找与批量替换清单
date: 2022-03-20
category: 效率工具与软件
subcategory: VSCode与正则
tags: VSCode,正则表达式,Vue,前端技巧
summary: 精选 VSCode 全局重构高频正则：快速批量将 v-model 改为 v-model.trim、清理行尾空格及修正多余空行。
readTime: 3 分钟阅读
---

# VSCode 前端开发高频实用正则表达式查找与批量替换清单

## 一、快捷操作指南

在 VSCode 中按下快捷键 **Ctrl + Shift + F**（全局搜索）或 **Ctrl + Shift + H**（全局替换），点击 **.*** 开启正则表达式支持。

---

## 二、高频常用正则匹配清单

### 1. 将所有 `v-model` 批量替换为 `v-model.trim`

- **查找正则**（匹配带或不带空格的 `v-model=`）：
    ```code
    v-model(\s+)?=
    ```

- **替换为**：
    ```code
    v-model.trim=
    ```

---

### 2. 删除代码中所有的 `console.log` 调试输出

- **查找正则**（匹配整行 console.log）：
    ```code
    console\.log\(.*(\)|;)$
    ```

- **替换为**：`（留空）`

---

### 3. 清除所有代码行尾的多余空格与 Tab

- **查找正则**：
    ```code
    [ \t]+$
    ```

- **替换为**：`（留空）`

---

### 4. 压缩多个连续空行为单个空行

- **查找正则**：
    ```code
    ^\s*(\r?\n){2,}
    ```

- **替换为**：
    ```code
    \n
    ```

---
title: VSCode 中使用正则表达式批量清理 console.log 打印语句
date: 2021-05-08
category: 效率工具与软件
subcategory: VSCode与正则
tags: VSCode,正则表达式,代码清洗,效率工具
summary: 项目打包上线前，利用 VSCode 强大的正则查找与替换功能，一键安全快速清除所有调试用 console.log 语句。
readTime: 2 分钟阅读
---

# VSCode 中使用正则表达式批量清理 console.log 打印语句

## 一、使用场景

在日常前端开发联调中，代码中往往会残留大量用于调试的 `console.log()` 打印。在生产打包前需要统一清理，避免泄露敏感业务数据或影响浏览器性能。

---

## 二、单文件批量删除

1. 在 VSCode 当前文件中按下快捷键 **Ctrl + H**（macOS: **Cmd + Option + F**）；
2. 开启搜索框右侧的 **正则匹配模式图标**（快捷键 **Alt + R**）；
3. 在查找框输入以下正则表达式：
   ```regex
   console\.log\(.*(\)|;)$
   ```
4. 替换框留空，点击 **全部替换（Ctrl + Alt + Enter）** 即可。

---

## 三、全工程文件夹全局批量清理

1. 按下全局查找替换快捷键 **Ctrl + Shift + H**（macOS: **Cmd + Shift + H**）；
2. 查找内容输入：
   ```regex
   console\.(log|info|debug)\(.*?\);?
   ```
3. 替换内容留空，点击一键替换即可。

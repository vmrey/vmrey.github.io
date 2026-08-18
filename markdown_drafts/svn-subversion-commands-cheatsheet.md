---
title: SVN (Subversion) 常用版本控制命令速查与使用指南
date: 2026-07-30
category: 效率工具与软件
subcategory: Git与版本控制
tags: 效率工具,SVN,版本控制
summary: 整理 SVN 常用操作命令：checkout 检出、commit 提交、update 更新、log 历史与 revert 回退。
readTime: 3 分钟阅读
---

# macbook 中使用命令

#### 如果你删除了很多文件，并且想删除所有状态为 '!' (missing) 的文件：
```sh
svn status | grep '^!' | sed 's/^! *//' | xargs svn delete
```
#### 添加新增的文件
```sh
svn status | grep '^?' | sed 's/^? *//' | xargs svn add
```

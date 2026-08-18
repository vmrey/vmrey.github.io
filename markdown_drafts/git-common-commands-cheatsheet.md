---
title: Git 常用高频命令与分支协同工作流速查清单
date: 2026-08-05
category: 效率工具与软件
subcategory: Git与版本控制
tags: 效率工具,Git,版本控制,工作流
summary: 整理日常开发中最常用的 Git 核心命令：分支切换、暂存管理、冲突解决、标签管理与远程同步。
readTime: 3 分钟阅读
---

#### 添加用户
```sh
ssh-keygen -t rsa -C 'admin@example.com'
```
#### 第二步：找到公钥文件
```sh
.ssh/id_rsa.pub
```
#### 初始化仓库命令
```sh
git init
```
#### git 全局配置
```sh
git config --global user.name "admin" && git config --global user.email "admin@example.com"
```

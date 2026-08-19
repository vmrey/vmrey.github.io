---
title: Git 常用高频命令与分支协同工作流速查清单
date: 2026-08-05
category: 效率工具与软件
subcategory: Git与SVN
tags: 效率工具,Git,版本控制,工作流,开发提效
summary: 系统整理日常开发中最常用的 Git 核心操作：SSH 密钥生成、全局身份配置、分支管理、暂存区操作、回退撤销与冲突解决速查。
readTime: 5 分钟阅读
---

# Git 常用高频命令与分支协同工作流速查清单

> **Git** 是现代软件工程不可或缺的分布式版本控制系统。本文精选日常敏捷开发中最常用、最容易遗忘的核心命令清单。

---

## 一、初始配置与 SSH 密钥生成

### 1. 配置全局用户名与邮箱
```bash
git config --global user.name "你的名字"
git config --global user.email "your_email@example.com"
```

### 2. 生成 SSH 密钥并添加到 GitHub / GitLab
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# 或传统 RSA 格式：
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

查看并复制生成的公钥内容（粘贴至 GitHub `Settings -> SSH Keys`）：
- **Linux / macOS**：`cat ~/.ssh/id_ed25519.pub` 或 `cat ~/.ssh/id_rsa.pub`
- **Windows**：`type %USERPROFILE%\.ssh\id_rsa.pub`

---

## 二、基础操作与提交工作流

| 操作场景 | 推荐命令 | 说明 |
| :--- | :--- | :--- |
| **初始化本地仓库** | `git init` | 在当前目录下创建 `.git` 版本库 |
| **克隆远程仓库** | `git clone <仓库URL>` | 完整下载远程代码库 |
| **查看工作区状态** | `git status` | 查看文件修改、暂存与未跟踪状态 |
| **添加所有更改至暂存区** | `git add .` | 暂存所有新建和被修改文件 |
| **提交并附带信息** | `git commit -m "feat: 提交说明"` | 提交暂存区内容到版本库 |
| **推送到远程默认分支** | `git push origin main` | 推送本地提交到远程仓库 |
| **拉取远程最新代码** | `git pull origin main` | 获取远程更新并自动合并 |

---

## 三、分支管理与协作流程

```bash
# 1. 查看本地与远程所有分支
git branch -a

# 2. 创建并切换到新特性分支
git checkout -b feature/login
# 或新版命令：
git switch -c feature/login

# 3. 切换回主分支
git checkout main
# 或新版命令：
git switch main

# 4. 合并指定分支到当前分支
git merge feature/login

# 5. 删除已合并的本地分支
git branch -d feature/login
```

---

## 四、暂存与撤销操作（救急锦囊）

### 1. 临时保存未完成的工作（Stash）
```bash
# 暂存当前未提交的工作区修改
git stash

# 查看暂存列表
git stash list

# 恢复最近一次暂存并从 stash 列表中删除
git stash pop
```

### 2. 撤销修改与版本回退
```bash
# 丢弃工作区中某个文件的未暂存修改
git checkout -- <文件名>
# 或新版：git restore <文件名>

# 撤销最近一次 commit，但保留工作区修改（软回退，最常用）
git reset --soft HEAD~1

# 彻底回退到某个历史 commit（危险：工作区未保存代码会丢失）
git reset --hard <commit-id>
```

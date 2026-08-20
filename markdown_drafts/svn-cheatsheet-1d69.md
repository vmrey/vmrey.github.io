---
title: SVN (Subversion) 常用版本控制命令速查与批量清理指南
date: 2026-07-30
category: 效率工具与软件
subcategory: Git与SVN
tags: 效率工具,SVN,版本控制,命令行技巧
summary: 整理 SVN 核心操作命令速查表，重点讲解在 macOS/Linux 终端下一键批量添加未跟踪文件 (?) 与批量删除丢失文件 (!) 的 Shell 管道组合技巧。
readTime: 4 分钟阅读
---

# SVN 常用版本控制命令速查与批量清理指南

> **SVN (Apache Subversion)** 是经典集中式版本控制系统。在日常使用终端管理 SVN 仓库时，经常需要处理本地文件批量增删的同步问题。本文精选高频实用命令与批量处理技巧。

---

## 一、日常核心命令速查表

| 操作场景 | 推荐命令 | 简要说明 |
| :--- | :--- | :--- |
| **检出仓库 (Checkout)** | `svn checkout <URL> [目录名]` | 首次下载远程仓库到本地（可缩写为 `svn co`） |
| **更新代码 (Update)** | `svn update` | 将远程最新提交同步到当前工作区（可缩写为 `svn up`） |
| **查看修改状态 (Status)** | `svn status` | 查看当前工作区状态（可缩写为 `svn st`） |
| **提交修改 (Commit)** | `svn commit -m "提交说明"` | 提交已修改内容至远程版本库（可缩写为 `svn ci`） |
| **添加新文件 (Add)** | `svn add <文件名/目录>` | 将新建文件纳入版本控制 |
| **还原修改 (Revert)** | `svn revert <文件名>` | 撤销本地未提交的修改 |
| **查看日志 (Log)** | `svn log -l 10` | 查看最近 10 条提交历史记录 |

---

## 二、终端高效技巧：批量处理增删文件（重点）

在日常重构或通过外部工具（如 Finder / VSCode）批量操作了大量文件后，`svn status` 会出现大量 `?`（未跟踪）或 `!`（本地已丢失）状态。使用以下单行 Shell 管道命令可一键批量处理：

### 1. 批量删除所有丢失的文件（状态为 `!`）
如果你在本地物理删除了很多文件，需要同步从 SVN 版本控制中标记删除：

```bash
svn status | grep '^!' | sed 's/^! *//' | xargs svn delete
```

### 2. 批量添加所有新创建的文件（状态为 `?`）
如果你在本地新建了许多文件，需要一次性全部纳入 SVN 追踪：

```bash
svn status | grep '^?' | sed 's/^? *//' | xargs svn add
```

---

## 三、解决版本冲突 (Conflict Resolution)

当执行 `svn update` 产生代码冲突时，冲突文件会标记为 `C`：

1. **查看冲突状态**：`svn status`
2. **选择解决方案**：
   - 保留我的版本（覆盖远程）：`svn resolve --accept mine-full <文件名>`
   - 保留远程版本（放弃本地）：`svn resolve --accept theirs-full <文件名>`
3. **标记冲突已解决**：`svn resolved <文件名>`
4. **提交代码**：`svn commit -m "fix: 解决合并冲突"`

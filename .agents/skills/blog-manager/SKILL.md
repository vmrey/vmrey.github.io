---
name: blog-manager
description: Comprehensive management workflows for vmrey.github.io. Use whenever the user asks to add, modify, delete, or maintain blog articles (markdown_drafts/) or resource files (assets/files/ and data/files-meta.json), build the static site, or audit link integrity.
---

# 🛠️ vmrey.github.io 文章与文件自动化维护技能 (Blog Management Skill)

本技能定义了在 `vmrey.github.io` 静态博客体系中**添加、修改、删除文章与附件文件**的标准作业流程（SOP）。

---

## 📖 核心规则与原则 (Crucial Rules)

1. **唯一数据源（Single Source of Truth）**：
   - 文章唯一修改入口：`markdown_drafts/*.md`，**绝对不要**直接手改 `posts/*.html`；
   - 文件唯一存放目录：`assets/files/`，**绝对不要**硬编码放入其他目录；
2. **状态自动闭环**：
   - 任何增删改操作完成后，**必须立即运行 `node build.js`**；
   - 构建脚本会自动完成：HTML 页面生成、侧边栏专栏篇数实时统计、全文搜索索引（`data/search-index.js`）更新、废弃静态页自动物理清除。

---

## 📝 1. 文章全生命周期维护指南 (Article Operations)

### ➕ 添加新文章 (Create Article)

#### 步骤 A：通过 CLI 命令快速脚手架（推荐）
```bash
node build.js -n "你的文章标题" [可选英文短前缀]
# 或
npm run new "你的文章标题"
```
这将在 `markdown_drafts/` 自动生成对应的 `[语义短前缀]-[4位Hash].md` 骨架文件（如 `vue3-comp-a7f3.md`，平均 15~18 字符），保证链接美观且永久唯一。

#### 步骤 B：标准 FrontMatter 元数据格式
确保文档顶部包含标准的 YAML FrontMatter：
```markdown
---
title: Vue 3 核心业务组件深度封装实战
date: 2026-08-19
category: 前端开发
subcategory: Vue与组件
tags: 前端开发,Vue,组件封装,TypeScript
summary: 深度解析高阶组件封装技巧，提供完整的 TypeScript 类型定义与生产级实战代码...
readTime: 6 分钟阅读
---

# Vue 3 核心业务组件深度封装实战

## 一、核心背景与问题定义
...
```

**专栏分类参考**（定义在 `js/config.js`）：
- **前端开发**：`Vue 与组件` / `JS 与工具函数` / `微信小程序`
- **Linux 与服务端**：`Docker 与容器` / `网络与反代` / `性能与压测`
- **效率工具与软件**：`Git 与 SVN` / `Claude 与 AI`

#### 步骤 C：执行全自动发布构建
```bash
node build.js
```

---

### ✏️ 修改已有文章 (Edit Article)

1. 直接使用编辑工具修改 `markdown_drafts/对应文章.md`（可修改标题、日期、正文、代码块、分类等）；
2. 修改完成后，运行 `node build.js`；
3. `posts/对应文章.html`、首页卡片、全文检索索引将自动同步更新。

---

### 🗑️ 删除文章 (Delete Article)

1. 直接从 `markdown_drafts/` 目录中删除对应的 `.md` 文件：
   ```bash
   rm markdown_drafts/xxx.md
   ```
2. 运行 `node build.js`：
   - 构建系统会自动检测到该草稿已删除；
   - 自动安全物理移除 `posts/xxx.html`；
   - 自动从 `data/search-index.js` 搜索库与首页列表中剔除该文章；
   - 自动重新计算左侧导航专栏的文章篇数徽标。

---

## 📁 2. 资源附件全生命周期维护指南 (File Operations)

所有供用户直接下载或在线代码免跳转预览的附件统一存储在 `assets/files/`。

### ➕ 添加新文件 (Add File)

1. **放置文件**：将附件直接放入 `assets/files/` 目录（例如 `assets/files/my-script.sh`）；
2. **（可选）配置描述与徽标色**：在 `data/files-meta.json` 中追加该文件的中文说明与分类：
   ```json
   "my-script.sh": {
     "desc": "Linux 服务器环境一键初始化与防护加固脚本",
     "category": "Linux 与服务端",
     "badgeColor": "#a855f7"
   }
   ```
3. **编译生效**：运行 `node build.js`：
   - 自动使用 `fs.statSync` 读取字节大小并格式化（如 `12.4 KB`）；
   - 自动根据文件扩展名归类到文件夹树（前端源码 / Linux脚本 / Windows批处理 / 压缩包归档）；
   - 自动生成 `files.html` 嵌套树状视图并开启在线高亮预览。

---

### ✏️ 修改 / 覆盖文件 (Update File)

1. 直接用新版本文件覆盖 `assets/files/对应文件名`；
2. （可选）更新 `data/files-meta.json` 中的功能说明；
3. 运行 `node build.js` 同步文件大小与更新时间。

---

### 🗑️ 删除文件 (Delete File)

1. 直接删除 `assets/files/` 下的文件：
   ```bash
   rm assets/files/xxx.ext
   ```
2. （可选）删除 `data/files-meta.json` 中对应的 JSON key；
3. 运行 `node build.js` 重新生成 `files.html`。

---

## 🔍 3. 完整性审计与死链扫描 (Audit & Integrity Check)

每次对文章或文件进行批量变动后，运行内建自动化审计命令：

```bash
npm run audit
```
构建审计器将全量扫描全站 70+ 个 HTML 页面与 2300+ 条链接资源引用，并验证 `robots.txt`、`sitemap.xml`、`feed.xml` 与 `llms.txt` 的完整性。


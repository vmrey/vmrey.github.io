# CLAUDE.md - vmrey.github.io 项目工程规范与 AI 上下文指引

本文件是专为 **AI 编程助手（Claude Code / Antigravity / Cursor / Copilot）** 编写的项目上下文、工程规范与内置自动化维护技能。AI 在接手本仓库进行阅读、维护、新增功能或修改代码前，**必须优先阅读并严格遵守**本指引。

---

## 1. 项目定位与架构哲学 (Architecture & Principles)

- **项目定位**：极简、高性能、全静态现代个人技术博客与工程资源库。
- **技术栈**：
  - **核心**：原生 HTML5 + Vanilla JavaScript (ES6+) + 原生 CSS3（严格遵循 Web 标准）。
  - **构建引擎**：零外部运行时依赖的 Node.js 自动化管道流（[build.js](build.js)）。
  - **语法高亮**：Prism.js 原生轻量高亮库。
- **核心哲学**：
  1. **零运行时依赖**：拒绝庞大前端框架或臃肿构建链，全站静态秒开，长期稳定运行；
  2. **单一数据源（Single Source of Truth）**：
     - 文章源文件**只存在于** `markdown_drafts/*.md`，严禁直接手写修改 `posts/*.html`；
     - 资源附件源文件**只存在于** `assets/files/`，由 `data/files-meta.json` 配置描述；
     - 所有 HTML 页面均由 `node build.js` 从数据源和组件模板全自动编译生成。

---

## 2. 核心工作流与常用命令 (CLI Commands & Workflows)

### 常用命令集 (CLI Quick Reference)
```bash
# 1. 快速创建一篇新文章草稿 (自动生成语义短词 + 4位短Hash)
npm run new "文章标题"          # 或 node build.js -n "文章标题" [可选英文短前缀]

# 2. 全自动编译构建整站（输出 HTML、SEO/AI 协议、检索索引与分类统计）
npm run build                  # 或 node build.js

# 3. 本地启动 HTTP 服务器实时预览 (0 缓存)
npm run serve                  # 或 npx serve .

# 4. 全站超链接完整性与 SEO/AI 基建自动化审计 (0 死链检测器)
npm run audit                  # 或 node scripts/audit-links.js

# 5. 🧭 导航站点智能运维 (查重 / 死链巡检 / 熔断清理)
node .agents/skills/nav-manager/scripts/manage-nav.js check-alive  # 全站导航连通性巡检
node .agents/skills/nav-manager/scripts/manage-nav.js prune        # 自动探测并清理失效死链
node .agents/skills/nav-manager/scripts/manage-nav.js check        # 全库跨库唯一性查重

# 6. 一键提交部署至 GitHub Pages
npm run deploy                 # 或 git add . && git commit -m "feat: 发布新文章" && git push
```

---

## 3. 项目目录结构全景 (Directory Layout)

```text
├── build.js                     # 核心全自动构建调度引擎 (读取草稿/扫描文件 -> 组装组件 -> 输出HTML)
├── package.json                 # 极简 npm scripts
├── CLAUDE.md                    # AI 上下文、工程规范与内置维护技能 (本文件)
├── AGENTS.md                    # Agent 指引文件 (指向 CLAUDE.md)
├── README.md                    # 人类开发者阅读指南
│
├── markdown_drafts/             # 📝 Markdown 文章草稿源文件（所有文章编辑在此进行）
│   ├── xxx.md
│   └── README.md
│
├── templates/                   # 🧩 模块化 UI 组件与布局模板体系
│   ├── components/              # 纯净公共基础组件
│   │   ├── sidebar.js           # 常驻左侧导航栏（Logo/⌘K入口/专栏树/日夜切换/版权）
│   │   ├── mobile-header.js     # 移动端顶部导航栏与抽屉遮罩
│   │   ├── post-card.js         # 首页文章卡片（16:9 封面、胶囊时长、标签与阅读链接）
│   │   ├── feed-header.js       # 列表流头部与即时搜索框
│   │   ├── toc.js               # 文章详情页右侧 Sticky 目录大纲
│   │   └── empty-state.js       # 搜索/筛选无结果时的空状态插画
│   └── layouts/                 # 页面级装配布局模板
│       ├── base.js              # 全站基础 HTML5 骨架（统一 Meta、Favicon、样式与 JS 引入）
│       ├── home.js              # 博客首页装配模板 (index.html)
│       ├── post.js              # 文章详情页装配模板 (posts/*.html)
│       ├── files.js             # 资源文件库装配模板 (files.html)
│       ├── nav.js               # GitHub 开源导航页装配模板 (nav.html)
│       ├── tools.js             # 实用工具导航页装配模板 (tools.html)
│       ├── ai.js                # 顶级 AI 导航页装配模板 (ai.html)
│       ├── node-vle.js          # VLESS 节点生成器装配模板 (node-vle.html)
│       └── about.js             # 关于本站页装配模板 (about.html)
│
├── assets/                      # 静态资源目录
│   ├── files/                   # 📁 资源文件下载与在线高亮预览中心
│   ├── images/                  # 🖼️ 文章插入的图片
│   └── favicon.svg              # 站点矢量图标
│
├── data/                        # 数据仓库
│   ├── search-index.js          # 全局全文深度检索索引数据库 (由 build.js 自动生成)
│   ├── github-nav.json          # GitHub 优质开源项目导航数据源 (分类、仓库、标签)
│   ├── tools-nav.json           # 实用在线开发工具导航数据源 (分类、工具、描述)
│   ├── ai-nav.json              # 顶级 AI 导航数据源 (大模型、Agent、多模态、API网关)
│   └── files-meta.json          # 资源附件详细元数据（描述、分类、专属徽标色）
│
├── js/                          # 客户端核心交互脚本
│   ├── config.js                # 站点全局配置 (名称、专栏分类结构、每页条数等)
│   ├── main.js                  # 核心交互逻辑 (翻页、就地筛选、树状专栏联动、日夜切换)
│   ├── search.js                # ⌘K 全局全文检索弹窗控制器
│   ├── node-vle.js              # VLESS 节点生成器客户端交互引擎
│   ├── file-preview.js          # 附件源码免跳转在线高亮预览与复制弹窗
│   └── prism.js                 # 代码语法高亮核心库
│
├── css/                         # 样式表
│   ├── style.css                # 全站设计系统、CSS 变量、响应式断点与组件样式
│   └── prism.css                # 代码高亮主题配色
│
├── scripts/                     # 辅助脚本
│   └── audit-links.js           # 0 死链与静态资源完整性自动化审计工具
│
├── .agents/skills/              # 项目专属 AI 技能包
│   ├── blog-manager/SKILL.md    # 文章与附件自动化运维技能文档
│   └── nav-manager/             # 🧭 导航生态运维与全库智能查重技能包
│       ├── SKILL.md             # 导航维护技能 SOP 说明
│       └── scripts/
│           └── manage-nav.js    # 跨库查重、增删改查 CLI 自动化引擎
│
└── [输出静态、SEO 与 AI 产物]   # 由 build.js 全自动编译输出，无需手动维护
    ├── index.html               # 博客首页
    ├── files.html               # 资源文件库
    ├── nav.html                 # GitHub 优质开源导航中心
    ├── tools.html               # 实用在线工具导航中心
    ├── ai.html                  # 顶级 AI 前沿大模型与智能体导航中心
    ├── about.html               # 关于本站
    ├── sitemap.xml              # SEO 站点全景地图 (收录全站 70+ URL)
    ├── robots.txt               # 搜索引擎爬虫协议
    ├── feed.xml                 # RSS 2.0 订阅源
    ├── llms.txt                 # 面向 AI 智能体的精简站点知识索引协议
    ├── llms-full.txt            # 面向大模型与 RAG 的全量知识库快照
    └── posts/                   # 编译生成的独立静态文章详情页 (*.html)
```

---

## 4. 博客专属维护技能 (blog-manager Skill SOP)

本节集成了 `blog-manager` 技能的完整执行标准，AI 必须严格按以下 SOP 流程执行日常运维：

### 📝 4.1 文章全生命周期管理 (Article SOP)

#### ➕ 步骤一：创建文章
运行 `node build.js -n "文章标题" [可选英文短前缀]`（或直接在 `markdown_drafts/` 下创建 `[语义短前缀]-[4位Hash].md`，如 `vue3-comp-a7f3.md`），确保文件名在 15~20 字符以内且永久唯一，并包含标准 YAML FrontMatter：

```markdown
---
title: Vue 3 核心业务组件深度封装实战
date: 2026-08-19
category: 前端开发          # 必填主专栏：前端开发 / Linux 与服务端 / 效率工具与软件
subcategory: Vue与组件       # 选填子分类
tags: 前端开发,Vue,组件封装,TypeScript # 逗号分隔的技术标签
summary: 深入解析高阶组件封装技巧，提供完整的 TypeScript 类型定义与生产级实战代码...
readTime: 6 分钟阅读
---

# 文章标题

## 一、核心背景与问题定义
正文内容...
```

#### ✏️ 步骤二：修改文章
直接编辑 `markdown_drafts/对应文章.md`，编辑完成后运行 `node build.js`。

#### 🗑️ 步骤三：删除文章
直接从 `markdown_drafts/` 物理删除 `.md` 文件，然后运行 `node build.js`。
> **注意**：构建引擎具备 **Orphan HTML 自动感知与物理清理** 功能，会自动安全删除 `posts/对应文章.html` 并更新索引与侧边栏篇数。

---

### 📁 4.2 资源附件全生命周期管理 (File SOP)

所有附件均集中存放于 `assets/files/`，并在 `files.html` 提供文件夹树状管理与免跳转在线高亮预览。

#### ➕ 步骤一：添加附件
1. 将附件放置到 `assets/files/`；
2. （可选）在 `data/files-meta.json` 中配置该文件的中文描述与徽标色：
   ```json
   "my-script.sh": {
     "desc": "Linux 服务器环境一键初始化与防护加固脚本",
     "category": "Linux 与服务端",
     "badgeColor": "#a855f7"
   }
   ```
3. 运行 `node build.js`。构建脚本会自动提取文件字节大小（如 `12.4 KB`），按扩展名智能归类至对应文件夹树，并开放代码高亮预览。

#### 🗑️ 步骤二：删除附件
直接从 `assets/files/` 删除该文件，清理 `data/files-meta.json` 中的对应配置项，然后运行 `node build.js`。

---

### 🧭 4.3 全站导航生态运维与查重技能 (nav-manager Skill SOP)

全站导航数据完全由 JSON 单一数据源驱动（`data/ai-nav.json`、`data/tools-nav.json`、`data/github-nav.json`）。AI 在维护导航时必须遵循**跨库智能查重**、**真实网络可访问性探测**与**失效死链自动熔断清理**标准：

#### 🔍 核心查重与可达性检测规则
- **URL 规范化碰撞检测**：自动剥离协议 (`http/https`)、`www.` 二级域、结尾斜杠 `/` 与杂项参数，跨 AI/工具/GitHub 三大库进行唯一性检测；
- **名称模糊排重**：去除空格、符号并统一转小写，防止不同写法导致重复收录；
- **添加前真实网络连通性探测 (Pre-Add Connectivity Check)**：添加新站点前必须通过真实的 HTTP 请求验证，若目标站点 DNS 失败、连接超时或返回 404/410，**严禁收录并立即终止**；
- **失效死链自动熔断清理 (Dead Link Auto-Pruning)**：全站巡检时发现任何打不开、域名失效或 404 的站点，**必须自动从 JSON 数据源物理删除并重新编译整站**；
- **自动归类原则**：
  - AI 大模型、Prompt 工具、Agent 智能体 ➔ 归入 **AI 导航** (`data/ai-nav.json`)；
  - 在线工具、格式转换、网络检测、效率辅助 ➔ 归入 **工具导航** (`data/tools-nav.json`)；
  - 重点推荐开源代码仓库与架构 ➔ 归入 **GitHub 导航** (`data/github-nav.json`)。

#### 🛠️ 常用 CLI 维护命令
```bash
# 1. 全库智能查重检测
node .agents/skills/nav-manager/scripts/manage-nav.js check

# 2. 全站导航可达性健康巡检 (仅报告不删除)
node .agents/skills/nav-manager/scripts/manage-nav.js check-alive

# 3. 全站死链自动熔断清理 (检测并直接删除打不开的失效链接)
node .agents/skills/nav-manager/scripts/manage-nav.js prune

# 4. 查看全站导航分类与收录汇总
node .agents/skills/nav-manager/scripts/manage-nav.js list

# 5. 添加新站点 (自动触发跨库查重 + 真实网络可达性测试，重复或死链直接拦截)
node .agents/skills/nav-manager/scripts/manage-nav.js add <ai|tools|github> <分类名称> <站点名称> <URL> [一句话介绍] [详细说明] [标签1,标签2] [徽标文字]

# 6. 修改已有站点信息 (name/url/tagline/desc/tags/badge)
node .agents/skills/nav-manager/scripts/manage-nav.js modify <搜索关键词> <字段名> <新值>

# 7. 删除导航站点 (自动清理空分类并触发重构)
node .agents/skills/nav-manager/scripts/manage-nav.js delete <名称或URL关键词>
```

---

### 🔍 4.4 质量、死链与 SEO / AI 自动化审计 (Audit SOP)
在每次大规模增删改内容、导航或模板后，AI 必须主动运行：
```bash
npm run audit
```
确保全站 70+ 个 HTML 文件、2300+ 条链接与资源引用的死链数为 0，且 `robots.txt`、`sitemap.xml`、`feed.xml`、`llms.txt` 和 `llms-full.txt` 100% 完备。

---

### 🌐 4.5 SEO、AI 智能体抓取与永久短链体系架构 (SEO, AI & Permalinks Architecture)

构建引擎 [`build.js`](build.js) 在每次执行编译时，会自动闭环执行以下 4 大核心基建：

#### 1. 永久短链体系 (Permanent Short Slug Architecture)
- **命名结构**：`[语义短前缀]-[4位短Hash].html`（如 `vue3-file-upload-5890.html`、`claude-perms-08be.html`）；
- **永久锁定**：URL 在文章创建时固化为 Permalink，后续无论修改正文、标题或修复 Bug 100 次，URL 永远锁定不变，杜绝外链失效与 SEO 权重流失；
- **0 碰撞安全保障**：`build.js` 内置同名物理文件冲突检测与自增哈希安全锁，确保全站 URL 100% 绝对唯一。

#### 2. 全自动化 SEO 闭环体系 (Automated SEO Pipeline)
- **`sitemap.xml` 站点地图**：自动扫描全站 70+ 页面，精准生成 `<lastmod>`、`<priority>` 与 `<changefreq>`，便于 Google Search Console、百度与 Bing 极速收录；
- **`robots.txt` 爬虫协议**：声明对所有搜索引擎蜘蛛与 AI 爬虫开放，显式指向 Sitemap 地址；
- **`feed.xml` RSS 2.0 聚合订阅**：自动收录最新 30 篇文章，提供标准 XML 供技术社区与 RSS 阅读器聚合；
- **OpenGraph & Twitter Card**：70 个 HTML 页面全量注入社交卡片元数据，在微信、QQ、Telegram、Twitter 分享时自动展示精美大卡片；
- **Schema.org JSON-LD 结构化数据**：自动生成 `BlogPosting` 与 `WebSite` 结构模型，助力搜索引擎生成 Rich Snippets 富媒体卡片；
- **Canonical 权威链接**：全站所有页面均注入 `<link rel="canonical">` 规范化 URL。

#### 3. 面向 AI 智能体与大模型的抓取协议 (AI Agent & LLMs.txt Protocol)
- **`llms.txt` 规范**：遵循全球最新 AI 智能体索引协议，将全站核心路由与 64 篇文章按专栏结构化整理，供 Cursor、Claude Code、ChatGPT 1 秒读懂整站知识；
- **`llms-full.txt` 知识库快照**：包含全站所有文章的标题、URL、标签与核心技术要点大纲，专为大模型上下文加载与 RAG 向量知识库构建；
- **零阻碍抓取友好**：100% 纯静态 SSG 预渲染、0 广告弹窗噪音、标准 `<pre><code class="...">` 代码块，AI 爬虫 GET 请求 0 毫秒直出全文。

#### 4. 三大导航中心数据流与健康生态 (Three Navigation Centers)
- **AI 导航中心 (`ai.html`)**：`data/ai-nav.json` 单一数据源驱动，收录 Gemini, ChatGPT, Claude, DeepSeek, Cursor 等顶尖 AI 工具；
- **实用工具导航 (`tools.html`)**：`data/tools-nav.json` 单一数据源驱动，收录 FlyEnv, DBeaver, 草料二维码等开发者利器；
- **GitHub 优质开源导航 (`nav.html`)**：`data/github-nav.json` 单一数据源驱动，收录 fnm, nvm, Ventoy, Fail2Ban 等开源项目；
- **健康熔断机制**：`manage-nav.js` 提供跨库唯一性查重、入库前真实网络连通性探测 (`check-alive`) 与失效死链自动清理 (`prune`)。

### 🔘 4.6 全站 UI 按钮与资源卡片统一规范 (Button Design & File Card Parity Specification)

全站所有按钮与文章内嵌资源下载卡片严格遵循**「相同功能，100% 相同样式与度量」**的核心设计原则，AI 在编写新文章、扩展模板或新增组件时**必须严格遵守**：

#### 1. 文章内嵌资源下载卡片 (`.nested-file-row.standalone-file-card`)
在 Markdown 文章中提供附件资源下载时，其结构与外观必须与资源文件库（`files.html`）保持 **1:1 像素级完全一致**，严禁使用任何杂乱的内联样式或私有变体，必须采用以下标准语义化结构：

```html
<div class="nested-file-row standalone-file-card">
  <div class="file-row-left">
    <div class="file-type-pill" style="color: #0284c7; border-color: #0284c740; background: rgba(2, 132, 199, 0.1);">
      .JS
    </div>
    <div class="file-name-meta">
      <div class="file-name-line">
        <span class="file-main-name">文件名.js</span>
        <span class="file-size-tag">技术标签/大小</span>
      </div>
      <div class="file-desc-line" title="中文功能描述">中文功能描述与核心用途说明</div>
    </div>
  </div>
  <div class="file-row-actions">
    <a href="../assets/files/文件名.js" download="文件名.js" class="file-action-btn primary" title="直接下载该文件">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      <span>直接下载</span>
    </a>
    <a href="../files.html" class="file-action-btn" title="前往全站文件中心在线预览与管理">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
      <span>文件中心</span>
    </a>
  </div>
</div>
```

#### 2. 全站 UI 按钮度量与层级规范 (Button Metrics & Sizing Standards)

| 按钮类型 | 高度 (Height) | 内边距 (Padding) | 字号 (Font Size) | 字重 (Weight) | 图标尺寸 (SVG) | 典型应用场景 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **标准操作按钮 (`.file-action-btn` / `.repo-visit-btn`)** | **`32px`** | **`0 0.75rem`** (12px) | **`0.8rem`** (12.8px) | **`600`** | `14px * 14px` | 文件管理中心操作、文章内嵌下载卡片、GitHub 仓库访问、工具/AI 直达 |
| **分类筛选胶囊 (`.nav-pill-btn`)** | **`32px`** | **`0 0.85rem`** (13.6px) | **`0.8rem`** (12.8px) | **`500`** | `14px * 14px` | 导航中心快捷分类筛选、文章列表标签过滤 |
| **工具栏紧凑小按钮 (`.code-copy-btn` / `.mermaid-fullscreen-btn`)** | **`28px`** | **`0 0.6rem`** (9.6px) | **`0.75rem`** (12px) | **`500`** | `13px * 13px` | 代码块右上角一键复制、Mermaid 流程图全屏灯箱操作 |
| **正方/圆形图标控制器** | **`32/36/42px`** | 居中 Flex 对齐 | **`0.875rem`** (14px) | **`600`** | `16~20px` | 翻页器 (`.page-btn`, 36px)、暗黑切换 (`#theme-toggle`, 36px)、回到顶部 (`.back-to-top-btn`, 42px) |

#### 3. 按钮状态与交互规范
- **Primary 强调态**：`background: var(--primary) !important; border-color: var(--primary) !important; color: #ffffff !important;`（暗黑模式文字自动切换为高对比深色 `#0b0d11`），悬停微上浮 `-1px`；
- **Secondary 次要/轮廓态**：`background: var(--surface); border: 1px solid var(--border); color: var(--text-main) !important;`，悬停边框高亮为 `var(--border-focus)`；
- **排版一致性**：所有按钮 `line-height: 1; vertical-align: middle;`，SVG 图标统一设置 `flex-shrink: 0; width: 14px; height: 14px;`，文字基线与图标绝对居中。

---

## 5. 规范与约束 (Rules & Constraints for AI)

### 必须遵守的规则 (DOs)
- **严格在模板与草稿中修改**：修改公共结构请改 `templates/`，修改文章请改 `markdown_drafts/`，修改样式请改 `css/style.css`。
- **必须严格兼容 PC / 平板 / 手机三端全场景响应式自适应**：
  - **PC 宽屏端（> 1024px）**：左侧侧边栏固定（支持折叠/展开）、右侧文章大纲 TOC 相对屏幕右侧固定、正文内容区铺满自适应、回到顶部按钮（滚动 > 300px 显示）。
  - **平板横竖屏（768px ~ 1024px）**：侧边栏尺寸与间距紧凑自适应，右侧大纲 TOC 优雅收拢，保证正文主体阅读体验。
  - **移动端手机（< 768px / <= 900px）**：启用顶部 Header + 抽屉式手势遮罩导航栏，所有按钮、表格、代码块及预览弹窗必须 100% 适配触屏与窄屏，严禁出现意外横向溢出。
- **修改后必须执行构建与审计**：任何影响内容、模板或数据的更改，必须运行 `node build.js` 重新编译全站并运行 `npm run audit` 验证 0 死链。
- **保持极致的性能与纯净**：严禁引入庞大的前端打包工具（如 Webpack/Vite）或臃肿库（如 Tailwind/Bootstrap），保持 Vanilla CSS 原生设计系统的优雅性。
- **保持 1:1 标准 Markdown 排版字号比例（Markdown-Native Typography）**：
  - 文章页的文字排版必须与标准 Markdown 预览窗口（如 VSCode / GitHub GFM）保持 1:1 一致，严禁随意放大标题与正文字号；
  - 核心比例规范：主标题/H1 为 `1.5rem (24px)`，H2 为 `1.3rem (20.8px)`，H3 为 `1.125rem (18px)`，H4 为 `1.0rem (16px)`，正文为标准 `1.0rem (16px)`，代码块为 `0.875rem (14px)`。
- **所有架构流程图 (Mermaid) 与文章插图必须 100% 支持全屏高清灯箱查看 (Fullscreen Lightbox & Zoom)**：
  - 全站所有文章中使用 ```` ```mermaid ```` 绘制的流程图、架构图、时序图以及正文插图，构建系统与前端脚本（`js/main.js`）必须保持全局灯箱控制器常驻；
  - 每个 `.mermaid-wrap` 容器右上角必须自动挂载「全屏查看」操作按钮并支持点击放大（`cursor: zoom-in`）；
  - 全屏灯箱必须支持**鼠标滚轮无级缩放（0.2x~5.0x）**、**鼠标/触屏拖拽平移 (Pan & Drag)**、**双击快速切换 1x/2x**、**键盘 Esc 退出 / +/- 缩放 / 0 复位**，以及**矢量 SVG 一键无损导出下载**；
  - 必须确保 Mermaid SVG 矢量图在全屏放大至 500% 时保持绝对高清无锯齿，且深浅色主题无缝自适应。
- **严格遵守全站 UI 按钮与资源卡片统一度量规范**：中号按钮必须统一为 `34px`（文章资源卡片、文件库操作等），小号按钮统一为 `28px`（复制、全屏查看等），图标按钮锁定 `32/36/42px`；文章内嵌附件必须使用标准 `.article-resource-card` 结构。
- **保护交互与类名一致性**：`css/style.css` 与 `templates/` 中的 CSS 类名有精密绑定，重构时必须保证选择器与 DOM 结构严格一致。

### 严禁的操作 (DON'Ts)
- **严禁擅自修改已发布文章的 slug 文件名**：文章 URL 一经生成即为永久外链 (Permalink)，严禁在编辑或更新正文时随意重命名 `.md` 文件，以防破坏搜索引擎已收录索引与外部引用链接。
- **严禁直接编辑 `posts/*.html`**：这些文件每次执行 `npm run build` 都会被全量重写。
- **严禁破坏全设备响应式兼容**：无论新增组件、修改样式或调整排版，必须无条件通过 PC 宽屏、平板中屏与手机窄屏三端兼容验证，严禁任何破坏响应式的修改。
- **严禁破坏 1:1 Markdown 阅读比例**：严禁将博客正文或标题放大为营销落地页风格的大字号，确保技术文档沉浸阅读体验。
- **严禁手写内联按钮样式或随意定义散乱的按钮高度与色值**：严禁在文章或组件中编写硬编码颜色与散乱的 padding/height，杜绝各页面按钮忽大忽小、风格割裂或暗色模式失效。
- **严禁破坏深浅色主题适配**：所有新样式必须同时测试 `data-theme="dark"` 与 `data-theme="light"`。
- **严禁在根目录堆放未归档临时脚本**：正式附件与脚本必须统一归档至 `assets/files/` 并在 `data/files-meta.json` 维护元数据。
- **严禁破坏图表与图片全屏查看能力**：任何对模板、样式或核心脚本的重构，必须确保全站 Mermaid 流程图与正文插图的全屏灯箱查看、缩放、平移与下载功能正常运转。

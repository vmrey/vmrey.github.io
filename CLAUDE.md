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

### 常用命令集
```bash
# 1. 快速创建一篇新文章草稿
npm run new "文章标题"          # 或 node build.js -n "文章标题"

# 2. 全自动编译构建整站（更新所有 HTML、侧边栏、分类统计与全文搜索索引）
npm run build                  # 或 node build.js

# 3. 本地启动 HTTP 服务器实时预览
npm run serve                  # 或 npx serve .

# 4. 全站超链接完整性审计 (0 死链检测)
npm run audit                  # 或 node scripts/audit-links.js

# 5. 提交部署至 GitHub Pages
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
│   │   ├── pagination.js        # 翻页控制器结构
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
└── [输出 HTML 产物]              # 由 build.js 全自动编译输出，无需手动维护
    ├── index.html               # 博客首页
    ├── files.html               # 资源文件库
    ├── nav.html                 # GitHub 优质开源导航中心
    ├── tools.html               # 实用在线工具导航中心
    ├── ai.html                  # 顶级 AI 前沿大模型与智能体导航中心
    ├── about.html               # 关于本站
    └── posts/                   # 编译生成的独立静态文章详情页 (*.html)
```

---

## 4. 博客专属维护技能 (blog-manager Skill SOP)

本节集成了 `blog-manager` 技能的完整执行标准，AI 必须严格按以下 SOP 流程执行日常运维：

### 📝 4.1 文章全生命周期管理 (Article SOP)

#### ➕ 步骤一：创建文章
运行 `node build.js -n "文章标题"` 或直接在 `markdown_drafts/` 下创建 `.md` 文件，确保包含标准 YAML FrontMatter：

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

全站导航数据完全由 JSON 单一数据源驱动（`data/ai-nav.json`、`data/tools-nav.json`、`data/github-nav.json`）。AI 在维护导航时必须遵循**跨库智能查重**与标准生命周期：

#### 🔍 核心查重规则 (Duplicate Detection Rules)
- **URL 规范化碰撞检测**：自动剥离协议 (`http/https`)、`www.` 二级域、结尾斜杠 `/` 与杂项参数，跨 AI/工具/GitHub 三大库进行唯一性检测；
- **名称模糊排重**：去除空格、符号并统一转小写，防止不同写法导致重复收录；
- **自动归类原则**：
  - AI 大模型、Prompt 工具、Agent 智能体 ➔ 归入 **AI 导航** (`data/ai-nav.json`)；
  - 在线工具、格式转换、网络检测、效率辅助 ➔ 归入 **工具导航** (`data/tools-nav.json`)；
  - 重点推荐开源代码仓库与架构 ➔ 归入 **GitHub 导航** (`data/github-nav.json`)。

#### 🛠️ 常用 CLI 维护命令
```bash
# 1. 全库智能查重检测
node .agents/skills/nav-manager/scripts/manage-nav.js check

# 2. 查看全站导航分类与收录汇总
node .agents/skills/nav-manager/scripts/manage-nav.js list

# 3. 添加新站点 (自动触发跨库查重，重复则直接拦截并报警)
node .agents/skills/nav-manager/scripts/manage-nav.js add <ai|tools|github> <分类名称> <站点名称> <URL> [一句话介绍] [详细说明] [标签1,标签2] [徽标文字]

# 4. 修改已有站点信息 (name/url/tagline/desc/tags/badge)
node .agents/skills/nav-manager/scripts/manage-nav.js modify <搜索关键词> <字段名> <新值>

# 5. 删除导航站点 (自动清理空分类并触发重构)
node .agents/skills/nav-manager/scripts/manage-nav.js delete <名称或URL关键词>
```

---

### 🔍 4.4 质量与死链全自动化审计 (Audit SOP)
在每次大规模增删改内容、导航或模板后，AI 必须主动运行：
```bash
npm run audit
```
确保全站 70+ 个 HTML 文件、2100+ 条链接与资源引用的死链数为 0。

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
- **保护交互与类名一致性**：`css/style.css` 与 `templates/` 中的 CSS 类名有精密绑定，重构时必须保证选择器与 DOM 结构严格一致。

### 严禁的操作 (DON'Ts)
- **严禁破坏全设备响应式兼容**：无论新增组件、修改样式或调整排版，必须无条件通过 PC 宽屏、平板中屏与手机窄屏三端兼容验证，严禁任何破坏响应式的修改。
- **严禁破坏 1:1 Markdown 阅读比例**：严禁将博客正文或标题放大为营销落地页风格的大字号，确保技术文档沉浸阅读体验。
- **严禁直接编辑 `posts/*.html`**：这些文件每次执行 `npm run build` 都会被全量重写。
- **严禁破坏深浅色主题适配**：所有新样式必须同时测试 `data-theme="dark"` 与 `data-theme="light"`。

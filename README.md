# vmrey.github.io 个人技术博客与工程资源库

> 极简、零依赖、高性能纯静态个人博客与全自动构建引擎。

---

## 🚀 快速开始 (Quick Start)

### 常用命令
```bash
# 1. 创建一篇新文章草稿
npm run new "你的文章标题"

# 2. 全自动一键编译构建静态全站
npm run build

# 3. 本地启动服务预览
npm run serve

# 4. 全站超链接完整性审计 (0 死链检测)
npm run audit

# 5. 一键提交并发布到 GitHub Pages
npm run deploy
```

---

## 🛠️ 维护与开发规范

- **AI 智能助手协作指南**：详见 [CLAUDE.md](CLAUDE.md) 与 [AGENTS.md](AGENTS.md)。
- **文章与文件管理技能 (Skill)**：详见 [.agents/skills/blog-manager/SKILL.md](.agents/skills/blog-manager/SKILL.md)。
- **文章写作目录**：全部在 `markdown_drafts/` 下以 Markdown 格式撰写，编辑完成后运行 `npm run build` 即可发布。
- **资源附件目录**：将文件放入 `assets/files/`，并在 `data/files-meta.json` 中配置描述，运行 `npm run build` 自动生成在线预览与下载。

---

## 📂 项目结构

```text
├── index.html                   # 博客首页
├── files.html                   # 资源文件库（树状文件夹视图）
├── about.html                   # 关于本站
├── posts/                       # 编译后的静态文章详情页
├── markdown_drafts/             # Markdown 文章草稿源文件
├── assets/files/                # 附件下载与在线代码高亮预览中心
├── templates/                   # 模块化 UI 组件与布局模板
├── data/                        # 全文搜索索引与资源元数据
├── js/                          # 核心交互逻辑与主题控制器
├── css/                         # 样式表与代码高亮主题
├── scripts/                     # 辅助工具（如死链审计脚本）
├── .agents/skills/              # 项目专属 AI 维护技能（跟随版本库）
├── build.js                     # 核心自动化构建发布引擎
├── CLAUDE.md                    # AI 工程规范与上下文指引
└── package.json                 # npm 脚本指令集
```

---

## 📄 License
MIT © [vmrey.github.io](https://vmrey.github.io)

---
name: nav-manager
description: 全站导航站点自动化运维技能 (AI导航/工具导航/GitHub导航)，专用于导航网站的添加、修改、删除与严格跨库实时查重检测。
---

# 🧭 vmrey.github.io 导航站点自动化管理技能 (Nav Manager Skill)

本技能专用于 **vmrey.github.io** 导航生态系统（**AI 导航**、**工具导航** 与 **GitHub 优质开源导航**）的全生命周期管理。提供标准化的 **添加、修改、删除** 操作规范，并在每次操作前/后执行**跨库实时查重检测**与全自动化静态编译。

---

## 📂 1. 核心导航数据源 (Single Source of Truth)

全站导航数据完全由 JSON 单一真实数据源驱动：

| 导航模块 | 页面路由 | 对应 JSON 数据源 | 主要收录对象 |
| :--- | :--- | :--- | :--- |
| **🤖 AI 导航** | `ai.html` | `data/ai-nav.json` | 前沿大模型 (LLM)、AI 编程智能体 (Agent)、多模态生图/视频、API 聚合网关 |
| **🛠️ 工具导航** | `tools.html` | `data/tools-nav.json` | 在线生成、终端运维、架构绘图、系统工具、媒体转换、网络与安全检测 |
| **🧭 GitHub 导航** | `nav.html` | `data/github-nav.json` | 优质开源项目、版本管理器、装机利器、服务器防护、前端风控库 |

> [!IMPORTANT]
> **严禁直接手改生成的 HTML 页面** (`ai.html`, `tools.html`, `nav.html`)。所有变更必须通过修改对应 `data/*.json` 数据源，或运行 `manage-nav.js` CLI 脚本完成，构建引擎会自动重新编译全站并更新索引。

---

## 🔍 2. 跨库查重核心规则 (Duplicate Detection Rules)

为了保持导航系统的高质量、精简度与数据严谨性，每次添加或修改站点时必须遵守以下**三层查重机制**：

1. **URL 规范化比对 (Normalized URL Collision)**：
   - 自动去除协议前缀 (`http://`, `https://`)、`www.` 二级域名、URL 结尾斜杠 `/` 与多余锚点；
   - 跨库检查该站点是否已在 `data/ai-nav.json`、`data/tools-nav.json` 或 `data/github-nav.json` 中存在。
2. **名称拼音与去空比对 (Normalized Name Collision)**：
   - 去除空格、下划线、中划线并统一转小写，防止同一产品因大小写或符号差异重复录入。
3. **分类与定位判定**：
   - 若产品属于 AI Agent / 大模型生态，优先录入 **AI 导航**；
   - 若产品属于在线工具 / 独立软件，优先录入 **工具导航**；
   - 若重点推荐其 GitHub 源码仓库，优先录入 **GitHub 导航**。

---

## 🛠️ 3. 自动化 CLI 管理指令 (CLI Quick Reference)

可以使用本技能内置的专用脚本 `manage-nav.js` 进行一键安全操作：

### 1️⃣ 全库智能查重与巡检
```bash
node .agents/skills/nav-manager/scripts/manage-nav.js check
```

### 2️⃣ 查看当前全站导航汇总清单
```bash
node .agents/skills/nav-manager/scripts/manage-nav.js list
```

### 3️⃣ 添加新站点 (自动触发查重与全站构建)
```bash
node .agents/skills/nav-manager/scripts/manage-nav.js add <ai|tools|github> <分类名称> <站点名称> <URL> [一句话介绍] [详细说明] [标签1,标签2] [徽标文字]
```
*示例：*
```bash
node .agents/skills/nav-manager/scripts/manage-nav.js add tools "实用生成与办公工具" "草料二维码" "https://cli.im/" "专业二维码在线生成平台" "支持文本链接扫码生成..." "二维码,生成器" "二维码首选"
```

### 4️⃣ 修改已有站点字段
```bash
node .agents/skills/nav-manager/scripts/manage-nav.js modify <搜索关键词> <name|url|tagline|desc|tags|badge> <新值>
```
*示例：*
```bash
node .agents/skills/nav-manager/scripts/manage-nav.js modify "草料二维码" tagline "国内领先的二维码在线生成与美化平台"
```

### 5️⃣ 删除导航站点 (自动清理空分类并重构)
```bash
node .agents/skills/nav-manager/scripts/manage-nav.js delete <名称或URL关键词>
```
*示例：*
```bash
node .agents/skills/nav-manager/scripts/manage-nav.js delete "草料二维码"
```

---

## 📋 4. JSON 数据项标准字段规范

每个导航卡片项包含以下标准字段：

```json
{
  "name": "产品名称（如：Google Gemini）",
  "url": "官方网站或在线地址（如：https://gemini.google.com/）",
  "tagline": "一句话精炼亮点总结（展示于卡片副标题）",
  "description": "详细功能特性说明与推荐理由（2-3句话）",
  "category": "细分技术标签（如：多模态模型）",
  "badge": "右上角专属高亮徽标（如：Google 旗舰）",
  "tags": ["Gemini", "Google", "多模态", "超长上下文", "LLM"]
}
```

*(若为 GitHub 仓库，额外增加 `"repo": "owner/repo"` 与 `"language": "Rust/Shell/C"` 字段)*

---

## 🚀 5. 全流程标准化作业 SOP

无论通过 CLI 还是手动编辑 JSON，操作完成后必须执行以下闭环检查：

```bash
# 1. 运行全站静态编译与分类汇总
node build.js

# 2. 运行自动化超链接完整性审计（确保 0 死链）
npm run audit

# 3. 运行全库导航查重验证
node .agents/skills/nav-manager/scripts/manage-nav.js check

# 4. 提交并同步至远程仓库
git add .
git commit -m "feat(nav): 更新导航站点数据并完成查重验证"
git push origin main
```

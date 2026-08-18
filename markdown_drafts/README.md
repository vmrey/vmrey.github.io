# vmrey.github.io 博客文章统一管理规范与草稿库

欢迎来到 **vmrey.github.io** 文章库！

## 📁 目录结构划分

- 📄 **`posts/`（正式发布文章库）**：
  - 存放所有正式对外发布的纯静态 HTML 页面（例如 `posts/hello-world.html`、`posts/ai-agent-guide.html` 等）；
  - 所有文章统一具备：**左侧全景导航 + 宽屏沉浸式正文 + 纯净代码高亮 + 右侧「本文大纲 · 章节直达」+ 全局全文检索 `Cmd+K`**。

- 📝 **`markdown_drafts/`（Markdown 草稿与原稿库）**：
  - 您可以直接把写好的 `.md` Markdown 文件或文本原稿丢到这个文件夹中统一备份；
  - 随时发给我，我来直接帮您将 Markdown 自动转换为 `posts/` 下对应的正式 HTML，并一键同步更新 `data/search-index.js` 搜索索引。

- ⚙️ **`js/config.js`（全站公共配置文件）**：
  - 统一集中配置：博客名称、描述、起步年份、每页文章显示篇数（`pageSize`）、默认主题、GitHub 链接与专栏子菜单结构等；
  - 以后凡是需要调整站点信息，**只需修改这一个文件**，全站所有页面自动同步生效。

- 🔍 **`data/search-index.js`（全局全文检索库）**：
  - 统一存储全站所有文章的标题、段落、代码、标签与章节锚点，供全站秒级全文检索。

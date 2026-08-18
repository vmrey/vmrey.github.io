# 📦 全局多媒体与静态资产库 (`assets/`)

本目录统一管理博客全站所用到的多媒体资源与下载附件：

```
assets/
├── 🖼️ images/   # 图片、架构图、UI 截图、插图、SVG
├── 🎬 videos/   # 操作演示录屏、技术视频片段 (MP4, WebM)
├── 💻 scripts/  # 独立脚本与代码文件 (Shell 脚本 .sh, Python .py, SQL, Dockerfile, YAML)
├── 📁 files/    # 供下载的 PDF 白皮书、源码压缩包 (ZIP)、思维导图
└── 🎙️ audio/    # 音频、播客片段 (MP3)
```

## 🔗 相对路径引用规则速查：

- **在文章详情页 (`posts/*.html` 或 `markdown_drafts/*.md`) 中引用**：
  - 图片：`../assets/images/xxx.png`
  - 脚本：`../assets/scripts/xxx.sh`
  - 视频：`../assets/videos/xxx.mp4`
  - 附件：`../assets/files/xxx.zip`
- **在首页 (`index.html`) 或关于页 (`about.html`) 中引用**：
  - 图片：`assets/images/xxx.png`
  - 脚本：`assets/scripts/xxx.sh`
  - 视频：`assets/videos/xxx.mp4`
  - 附件：`assets/files/xxx.zip`

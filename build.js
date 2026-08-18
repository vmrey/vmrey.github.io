/**
 * ==============================================================================
 * vmrey.github.io 博客全自动构建与发布脚本 (Zero-Dependency Blog Engine)
 * 基于模块化组件体系 (Modular Component-Based Template Architecture)
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');

// 导入公共组件与页面布局模板
const { renderSidebar } = require('./templates/components/sidebar');
const { renderHomeLayout } = require('./templates/layouts/home');
const { renderPostLayout } = require('./templates/layouts/post');
const { renderFilesLayout } = require('./templates/layouts/files');
const { renderAboutLayout } = require('./templates/layouts/about');

const ROOT_DIR = __dirname;
const DRAFTS_DIR = path.join(ROOT_DIR, 'markdown_drafts');
const POSTS_DIR = path.join(ROOT_DIR, 'posts');
const SEARCH_INDEX_PATH = path.join(ROOT_DIR, 'data', 'search-index.js');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');
const ABOUT_HTML_PATH = path.join(ROOT_DIR, 'about.html');
const FILES_HTML_PATH = path.join(ROOT_DIR, 'files.html');
const CONFIG_PATH = path.join(ROOT_DIR, 'js', 'config.js');
const FILES_DIR = path.join(ROOT_DIR, 'assets', 'files');
const FILES_META_PATH = path.join(ROOT_DIR, 'data', 'files-meta.json');

if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });
if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });

// 获取命令行参数
const args = process.argv.slice(2);

// ==============================================================================
// 1. 命令：创建新文章草稿 (npm run new "标题")
// ==============================================================================
if (args[0] === '--new' || args[0] === '-n') {
  const postTitle = args[1] || '我的新文章';
  const today = new Date().toISOString().split('T')[0];
  const slug = postTitle.toLowerCase().replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '') || `post-${Date.now()}`;
  const targetMdFile = path.join(DRAFTS_DIR, `${slug}.md`);

  if (fs.existsSync(targetMdFile)) {
    console.log(`⚠️ 文件已存在: markdown_drafts/${slug}.md`);
    process.exit(0);
  }

  const templateContent = `---
title: ${postTitle}
date: ${today}
category: 前端开发
subcategory: Vue与组件
tags: 前端开发,Vue,JavaScript
summary: 在此填写文章的简明摘要介绍，用于展示在列表卡片和搜索引擎中...
readTime: 5 分钟阅读
---

# ${postTitle}

## 一、核心背景与问题定义

在此编写本章节的正文内容...

\`\`\`javascript
// 示例代码
function helloBlog() {
  console.log("Hello from vmrey.github.io!");
}
helloBlog();
\`\`\`

## 二、技术方案与深入剖析

详细的技术分析与实现思路...

## 三、总结与后续展望

回顾核心收益与实践心得...
`;

  fs.writeFileSync(targetMdFile, templateContent, 'utf-8');
  console.log(`\n🎉 新文章草稿创建成功！`);
  console.log(`📄 文件路径: markdown_drafts/${slug}.md`);
  console.log(`💡 编辑完成后，运行 npm run build 即可一键全自动发布！\n`);
  process.exit(0);
}

// ==============================================================================
// 2. 命令：全自动构建与发布 (npm run build)
// ==============================================================================
console.log(`\n🚀 开始构建 vmrey.github.io 静态博客...`);

// 提取 config 配置
let blogConfig = {
  siteName: 'vmrey.github.io',
  tagline: '构建工具，写干净的代码',
  startYear: 2018,
  copyrightNotice: '用代码与文字记录探索',
  pageSize: 8,
  githubUrl: 'https://github.com/vmrey/vmrey.github.io',
  categories: [
    {
      name: '前端开发',
      tag: '前端开发',
      children: [
        { name: 'Vue 与组件', tag: 'Vue' },
        { name: 'JS 与工具函数', tag: 'JavaScript' },
        { name: '微信小程序', tag: '微信小程序' }
      ]
    },
    {
      name: 'Linux 与服务端',
      tag: 'Linux',
      children: [
        { name: 'Docker 与容器', tag: 'Docker' },
        { name: '网络与反代', tag: 'Nginx' },
        { name: '性能与压测', tag: '压力测试' }
      ]
    },
    {
      name: '效率工具与软件',
      tag: '效率工具',
      children: [
        { name: 'Git 与 SVN', tag: 'Git' },
        { name: '开源软件与脚本', tag: '软件' },
        { name: 'Claude 与 AI', tag: 'Claude' }
      ]
    }
  ]
};

if (fs.existsSync(CONFIG_PATH)) {
  try {
    const configCode = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const fakeWindow = {};
    const fn = new Function('window', configCode);
    fn(fakeWindow);
    if (fakeWindow.BLOG_CONFIG) {
      blogConfig = Object.assign(blogConfig, fakeWindow.BLOG_CONFIG);
    }
  } catch (e) {
    console.warn('⚠️ 读取 config.js 失败，使用内置默认配置');
  }
}

// 增强型轻量 Markdown 解析器
function parseFrontMatterAndMarkdown(raw) {
  let meta = {
    title: '未命名文章',
    date: new Date().toISOString().split('T')[0],
    category: '前端开发',
    subcategory: '',
    tags: '前端开发',
    summary: '',
    readTime: '5 分钟阅读'
  };

  let content = raw;
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (fmMatch) {
    const yamlLines = fmMatch[1].split('\n');
    yamlLines.forEach(line => {
      const idx = line.indexOf(':');
      if (idx !== -1) {
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (key && val) meta[key] = val;
      }
    });
    content = fmMatch[2];
  }

  const headings = [];
  const lines = content.split('\n');
  const processedLines = [];
  let inCodeBlock = false;
  let codeLang = '';
  let codeBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 代码块
    const codeMatch = line.match(/^```(\w+)?/);
    if (codeMatch) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = codeMatch[1] || 'bash';
        if (codeLang === 'code') codeLang = 'javascript';
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        const codeText = escapeHtml(codeBuffer.join('\n'));
        processedLines.push(`<pre><code class="language-${codeLang}">${codeText}</code></pre>`);
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // 标题
    const h4Match = line.match(/^####\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);
    const h1Match = line.match(/^#\s+(.+)$/);

    if (h4Match) {
      const title = h4Match[1].trim();
      const id = slugify(title);
      headings.push({ level: 4, title, id });
      processedLines.push(`<h4 id="${id}">${title}</h4>`);
      continue;
    }
    if (h3Match) {
      const title = h3Match[1].trim();
      const id = slugify(title);
      headings.push({ level: 3, title, id });
      processedLines.push(`<h3 id="${id}">${title}</h3>`);
      continue;
    }
    if (h2Match) {
      const title = h2Match[1].trim();
      const id = slugify(title);
      headings.push({ level: 2, title, id });
      processedLines.push(`<h2 id="${id}">${title}</h2>`);
      continue;
    }
    if (h1Match) {
      const title = h1Match[1].trim();
      continue; // 正文最顶部大标题由页面模板渲染，不重复输出
    }

    // 提示块 (Callout)
    const quoteMatch = line.match(/^>\s+(.+)$/);
    if (quoteMatch) {
      processedLines.push(`<div class="callout"><p>${formatInlineMarkdown(quoteMatch[1])}</p></div>`);
      continue;
    }

    // 分割线
    if (line.match(/^---$/) || line.match(/^\*\*\*$/)) {
      processedLines.push(`<hr>`);
      continue;
    }

    // 空行
    if (line.trim() === '') {
      processedLines.push('');
      continue;
    }

    // 无序列表
    const ulMatch = line.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      processedLines.push(`<li>${formatInlineMarkdown(ulMatch[1])}</li>`);
      continue;
    }

    // 有序列表
    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      processedLines.push(`<li>${formatInlineMarkdown(olMatch[1])}</li>`);
      continue;
    }

    // 默认段落
    processedLines.push(`<p>${formatInlineMarkdown(line)}</p>`);
  }

  // 拼接 HTML 并规整列表标签
  let html = processedLines.join('\n');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, match => `<ul>\n${match}</ul>\n`);

  return { meta, html, headings, rawText: content };
}

function formatInlineMarkdown(text) {
  let res = escapeHtml(text);
  // 加粗
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // 斜体
  res = res.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // 行内代码
  res = res.replace(/`(.*?)`/g, '<code>$1</code>');
  // 图片
  res = res.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="article-image">');
  // 链接
  res = res.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return res;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(text) {
  return text.trim().toLowerCase().replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '') || `sec-${Math.random().toString(36).slice(2, 7)}`;
}

// ==============================================================================
// 3. 读取并解析 markdown_drafts/ 所有文章
// ==============================================================================
const draftFiles = fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md' && !f.startsWith('.'));
console.log(`📁 在 markdown_drafts/ 发现 ${draftFiles.length} 篇 Markdown 草稿文档。`);

const postsList = [];

draftFiles.forEach(file => {
  const filePath = path.join(DRAFTS_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { meta, html, headings, rawText } = parseFrontMatterAndMarkdown(raw);
  const slug = file.replace(/\.md$/, '');
  const htmlFilename = `${slug}.html`;

  postsList.push({
    slug,
    url: `posts/${htmlFilename}`,
    filename: htmlFilename,
    title: meta.title,
    date: meta.date,
    category: meta.category || '前端开发',
    subcategory: meta.subcategory || '',
    tags: (meta.tags || '').split(',').map(t => t.trim()).filter(Boolean),
    summary: meta.summary || '',
    readTime: meta.readTime || '5 分钟阅读',
    content: rawText,
    bodyHtml: html,
    headings: headings
  });
});

// 按日期倒序排序
postsList.sort((a, b) => new Date(b.date) - new Date(a.date));

// 自动清理 posts/ 目录中已在 markdown_drafts 中删除的废弃 HTML 文件
const activeHtmlFilenames = new Set(postsList.map(p => p.filename));
if (fs.existsSync(POSTS_DIR)) {
  fs.readdirSync(POSTS_DIR).forEach(f => {
    if (f.endsWith('.html') && !activeHtmlFilenames.has(f)) {
      fs.unlinkSync(path.join(POSTS_DIR, f));
      console.log(`🗑️ 自动清理废弃文章页面: posts/${f}`);
    }
  });
}

// ==============================================================================
// 4. 动态文件扫描引擎 (自动扫描 assets/files/ 生成资源库)
// ==============================================================================
let filesMeta = {};
if (fs.existsSync(FILES_META_PATH)) {
  try {
    filesMeta = JSON.parse(fs.readFileSync(FILES_META_PATH, 'utf-8'));
  } catch (e) {}
}

const folderCategories = [
  {
    folderId: 'folder-frontend',
    folderName: '前端组件与工具源码',
    folderPath: 'assets/files/frontend/',
    desc: 'Vue3 核心业务组件与 JavaScript 通用高频工具函数',
    matchExt: ['vue', 'js', 'ts', 'jsx', 'tsx', 'css', 'html'],
    defaultBadgeColor: '#10b981',
    files: []
  },
  {
    folderId: 'folder-linux',
    folderName: 'Linux 与服务端运维脚本',
    folderPath: 'assets/files/linux/',
    desc: 'Linux 核心服务一键自动化安装、系统守护进程与反代配置脚本',
    matchExt: ['sh', 'bash', 'zsh', 'py'],
    defaultBadgeColor: '#a855f7',
    files: []
  },
  {
    folderId: 'folder-windows',
    folderName: 'Windows 自动化批处理脚本',
    folderPath: 'assets/files/windows/',
    desc: 'Windows 桌面环境批量修改文件名与终端快捷代理环境脚本',
    matchExt: ['bat', 'cmd', 'ps1', 'vbs'],
    defaultBadgeColor: '#0ea5e9',
    files: []
  },
  {
    folderId: 'folder-archives',
    folderName: '工程归档与设计资源包',
    folderPath: 'assets/files/archives/',
    desc: '包含完整 Vue 前端交互组件工程、Photoshop 批量动作脚本与图表资源压缩包',
    matchExt: ['zip', 'rar', '7z', 'tar', 'gz'],
    defaultBadgeColor: '#ec4899',
    files: []
  }
];

if (fs.existsSync(FILES_DIR)) {
  const allDiskFiles = fs.readdirSync(FILES_DIR).filter(f => !f.startsWith('.') && f !== 'README.md');
  
  allDiskFiles.forEach(file => {
    const fullPath = path.join(FILES_DIR, file);
    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) return;

    const ext = path.extname(file).slice(1).toLowerCase();
    const sizeStr = stat.size < 1024 
      ? `${stat.size} B` 
      : `${(stat.size / 1024).toFixed(1)} KB`;

    const custom = filesMeta[file] || {};
    const previewable = !['zip', 'rar', '7z', 'tar', 'gz', 'exe', 'dmg', 'bin', 'iso'].includes(ext);

    let targetFolder = folderCategories.find(fc => fc.matchExt.includes(ext)) || folderCategories[0];
    const badgeColor = custom.badgeColor || targetFolder.defaultBadgeColor;

    targetFolder.files.push({
      name: file,
      path: `assets/files/${file}`,
      ext: ext,
      category: custom.category || targetFolder.folderName.split('与')[0],
      badgeColor: badgeColor,
      badgeBg: `${badgeColor}15`,
      size: sizeStr,
      desc: custom.desc || `${file} 资源文件（大小：${sizeStr}）`,
      article: custom.article || '',
      articleUrl: custom.articleUrl || 'index.html',
      previewable: previewable
    });
  });
}

const resourceFolders = folderCategories.filter(fc => fc.files.length > 0);
const resourceFiles = resourceFolders.flatMap(folder => folder.files);

// 计算各专栏篇数统计
const categoryStats = { all: postsList.length };
blogConfig.categories.forEach(cat => {
  categoryStats[cat.name] = postsList.filter(p => p.category === cat.name || p.tags.some(t => t.toLowerCase() === cat.tag.toLowerCase())).length;
  (cat.children || []).forEach(sub => {
    categoryStats[sub.name] = postsList.filter(p => p.tags.some(t => t.toLowerCase().includes(sub.tag.toLowerCase()) || sub.tag.toLowerCase().includes(t.toLowerCase())) || p.subcategory === sub.name).length;
  });
});

// ==============================================================================
// 5. 编译生成所有文章详情页 (posts/*.html)
// ==============================================================================
postsList.forEach(post => {
  const sidebarHtml = renderSidebar({
    isSubfolder: true,
    activePage: 'post',
    blogConfig: blogConfig,
    categoryStats: categoryStats,
    resourceFilesCount: resourceFiles.length
  });

  const postHtml = renderPostLayout({
    post: post,
    sidebarHtml: sidebarHtml,
    blogConfig: blogConfig
  });

  const outPath = path.join(POSTS_DIR, post.filename);
  fs.writeFileSync(outPath, postHtml, 'utf-8');
});

console.log(`✅ 已全量生成 ${postsList.length} 篇静态 HTML 文章到 posts/ 目录！`);

// ==============================================================================
// 6. 同步更新 data/search-index.js 深度搜索库
// ==============================================================================
const searchIndexItems = postsList.map(p => {
  const cleanBody = p.content.replace(/#|\*|`|\[|\]|\(|\)/g, ' ').replace(/\s+/g, ' ').trim();
  const fullText = (p.title + ' ' + p.summary + ' ' + p.tags.join(' ') + ' ' + cleanBody).replace(/\s+/g, ' ').trim();

  return {
    id: p.slug,
    title: p.title,
    url: p.url,
    category: p.category,
    date: p.date,
    tags: p.tags,
    summary: p.summary,
    content: cleanBody,
    fullText: fullText,
    sections: p.headings.map(h => ({ title: h.title, anchor: `#${h.id}`, id: h.id }))
  };
});

const searchIndexJsContent = `/**
 * vmrey.github.io 全局全文检索索引数据库
 * 由 build.js 自动生成构建
 */
window.SEARCH_DATABASE = window.BLOG_SEARCH_INDEX = ${JSON.stringify(searchIndexItems, null, 2)};
`;

fs.writeFileSync(SEARCH_INDEX_PATH, searchIndexJsContent, 'utf-8');
console.log(`🔍 已全量更新全局全文搜索索引: data/search-index.js (${searchIndexItems.length} 篇文章)`);

// ==============================================================================
// 7. 编译生成 files.html 资源文件库
// ==============================================================================
const filesSidebarHtml = renderSidebar({
  isSubfolder: false,
  activePage: 'files',
  blogConfig: blogConfig,
  categoryStats: categoryStats,
  resourceFilesCount: resourceFiles.length
});

const filesPageHtml = renderFilesLayout({
  sidebarHtml: filesSidebarHtml,
  resourceFolders: resourceFolders,
  resourceFilesCount: resourceFiles.length,
  blogConfig: blogConfig
});

fs.writeFileSync(FILES_HTML_PATH, filesPageHtml, 'utf-8');
console.log(`📁 已成功生成资源文件库与在线预览中心: files.html (${resourceFiles.length} 个附件)`);

// ==============================================================================
// 8. 编译生成 index.html 首页
// ==============================================================================
const homeSidebarHtml = renderSidebar({
  isSubfolder: false,
  activePage: 'home',
  blogConfig: blogConfig,
  categoryStats: categoryStats,
  resourceFilesCount: resourceFiles.length
});

const indexPageHtml = renderHomeLayout({
  sidebarHtml: homeSidebarHtml,
  postsList: postsList,
  blogConfig: blogConfig
});

fs.writeFileSync(INDEX_HTML_PATH, indexPageHtml, 'utf-8');
console.log(`📄 已同步更新首页文章列表与侧边栏: index.html`);

// ==============================================================================
// 9. 编译生成 about.html 关于页
// ==============================================================================
const aboutSidebarHtml = renderSidebar({
  isSubfolder: false,
  activePage: 'about',
  blogConfig: blogConfig,
  categoryStats: categoryStats,
  resourceFilesCount: resourceFiles.length
});

const aboutPageHtml = renderAboutLayout({
  sidebarHtml: aboutSidebarHtml,
  blogConfig: blogConfig
});

fs.writeFileSync(ABOUT_HTML_PATH, aboutPageHtml, 'utf-8');
console.log(`📄 已同步更新关于页侧边栏: about.html`);

console.log(`\n✨ 全部构建成功！共发布 ${postsList.length} 篇正式文章 & ${resourceFiles.length} 个资源文件！随时可以运行 npm run serve 本地预览或 git push 部署！\n`);

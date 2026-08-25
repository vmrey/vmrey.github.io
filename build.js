/**
 * ==============================================================================
 * vmrey.github.io 博客全自动构建与发布脚本 (Zero-Dependency Blog Engine)
 * 基于模块化组件体系 (Modular Component-Based Template Architecture)
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 导入公共组件与页面布局模板
const { renderSidebar } = require('./templates/components/sidebar');
const { renderHomeLayout } = require('./templates/layouts/home');
const { renderPostLayout } = require('./templates/layouts/post');
const { renderFilesLayout } = require('./templates/layouts/files');
const { renderAboutLayout } = require('./templates/layouts/about');
const { renderNavLayout } = require('./templates/layouts/nav');
const { renderToolsLayout } = require('./templates/layouts/tools');
const { renderAiLayout } = require('./templates/layouts/ai');
const { renderNodeVleLayout } = require('./templates/layouts/node-vle');

const ROOT_DIR = __dirname;
const DRAFTS_DIR = path.join(ROOT_DIR, 'markdown_drafts');
const POSTS_DIR = path.join(ROOT_DIR, 'posts');
const SEARCH_INDEX_PATH = path.join(ROOT_DIR, 'data', 'search-index.js');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');
const ABOUT_HTML_PATH = path.join(ROOT_DIR, 'about.html');
const FILES_HTML_PATH = path.join(ROOT_DIR, 'files.html');
const NAV_HTML_PATH = path.join(ROOT_DIR, 'nav.html');
const TOOLS_HTML_PATH = path.join(ROOT_DIR, 'tools.html');
const AI_HTML_PATH = path.join(ROOT_DIR, 'ai.html');
const VLESS_HTML_PATH = path.join(ROOT_DIR, 'node-vle.html');
const CONFIG_PATH = path.join(ROOT_DIR, 'js', 'config.js');
const FILES_DIR = path.join(ROOT_DIR, 'assets', 'files');
const FILES_META_PATH = path.join(ROOT_DIR, 'data', 'files-meta.json');
const NAV_DATA_PATH = path.join(ROOT_DIR, 'data', 'github-nav.json');
const TOOLS_DATA_PATH = path.join(ROOT_DIR, 'data', 'tools-nav.json');
const AI_DATA_PATH = path.join(ROOT_DIR, 'data', 'ai-nav.json');
const ROBOTS_TXT_PATH = path.join(ROOT_DIR, 'robots.txt');
const SITEMAP_XML_PATH = path.join(ROOT_DIR, 'sitemap.xml');
const FEED_XML_PATH = path.join(ROOT_DIR, 'feed.xml');
const LLMS_TXT_PATH = path.join(ROOT_DIR, 'llms.txt');
const LLMS_FULL_TXT_PATH = path.join(ROOT_DIR, 'llms-full.txt');

if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });
if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });

const todayDateStr = new Date().toISOString().split('T')[0];

// 获取命令行参数
const args = process.argv.slice(2);

// ==============================================================================
// 1. 命令：创建新文章草稿 (npm run new "标题" 或 node build.js -n "标题" [可选英文短前缀])
// ==============================================================================
if (args[0] === '--new' || args[0] === '-n') {
  const postTitle = args[1] || '我的新文章';
  const customPrefix = args[2] || '';
  const today = new Date().toISOString().split('T')[0];
  
  // 提取语义前缀 (截断至 16 个字符) + 4 位唯一短 Hash
  let basePrefix = customPrefix ? customPrefix.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
  if (!basePrefix) {
    const rawClean = postTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    basePrefix = rawClean.slice(0, 16).replace(/-+$/, '') || 'post';
  }
  const hash = crypto.createHash('sha256').update(postTitle + today + Date.now()).digest('hex').slice(0, 4);
  const slug = `${basePrefix}-${hash}`;
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

// 全功能零依赖 GFM (GitHub Flavored Markdown) + Mermaid 图表解析引擎
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

  // 提取脚注定义 (如 [^1]: 这是脚注内容)
  const footnotes = {};
  const footnoteKeys = [];
  content = content.replace(/^\[\^([a-zA-Z0-9_-]+)\]:\s*([\s\S]*?)(?=\n\[\^|\n\n|\n*$)/gm, (match, fnId, fnText) => {
    footnotes[fnId] = fnText.trim();
    footnoteKeys.push(fnId);
    return '';
  });

  const headings = [];
  const lines = content.split(/\r?\n/);
  const out = [];

  let inCodeBlock = false;
  let codeLang = '';
  let codeBuffer = [];

  let inTable = false;
  let tableHeader = [];
  let tableAligns = [];
  let tableRows = [];

  let inList = false;
  let listStack = []; // 嵌套列表栈管理

  let inBlockquote = false;
  let blockquoteBuffer = [];

  function closeTable() {
    if (!inTable) return;
    let tblHtml = '<div class="table-container">\n<table class="markdown-table">\n';
    if (tableHeader.length > 0) {
      tblHtml += '  <thead>\n    <tr>\n';
      tableHeader.forEach((cell, idx) => {
        const align = tableAligns[idx] ? ` style="text-align: ${tableAligns[idx]}"` : '';
        tblHtml += `      <th${align}>${formatInlineMarkdown(cell)}</th>\n`;
      });
      tblHtml += '    </tr>\n  </thead>\n';
    }
    if (tableRows.length > 0) {
      tblHtml += '  <tbody>\n';
      tableRows.forEach(row => {
        tblHtml += '    <tr>\n';
        row.forEach((cell, idx) => {
          const align = tableAligns[idx] ? ` style="text-align: ${tableAligns[idx]}"` : '';
          tblHtml += `      <td${align}>${formatInlineMarkdown(cell)}</td>\n`;
        });
        tblHtml += '    </tr>\n';
      });
      tblHtml += '  </tbody>\n';
    }
    tblHtml += '</table>\n</div>\n';
    out.push(tblHtml);
    inTable = false;
    tableHeader = [];
    tableAligns = [];
    tableRows = [];
  }

  function closeList() {
    if (!inList) return;
    while (listStack.length > 0) {
      const top = listStack.pop();
      out.push(`</li>\n</${top.type}>`);
    }
    inList = false;
  }

  function closeBlockquote() {
    if (!inBlockquote) return;
    const bqContent = blockquoteBuffer.map(b => formatInlineMarkdown(b)).join('<br>');
    out.push(`<div class="callout"><p>${bqContent}</p></div>`);
    inBlockquote = false;
    blockquoteBuffer = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. 代码块与结构图 (```mermaid / ```js / ```bash 等)
    const codeMatch = line.match(/^\s*```(\w+)?/);
    if (codeMatch) {
      closeTable();
      closeList();
      closeBlockquote();

      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = (codeMatch[1] || 'bash').toLowerCase();
        if (codeLang === 'code') codeLang = 'javascript';
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        // 智能去除首行/多行因为 Markdown 缩进而带来的公共缩进空格
        let codeLines = [...codeBuffer];
        // 去除首尾多余空行
        while (codeLines.length > 0 && codeLines[0].trim() === '') codeLines.shift();
        while (codeLines.length > 0 && codeLines[codeLines.length - 1].trim() === '') codeLines.pop();
        
        const nonEmptyLines = codeLines.filter(l => l.trim().length > 0);
        if (nonEmptyLines.length > 0) {
          const minIndent = Math.min(...nonEmptyLines.map(l => l.match(/^(\s*)/)[1].length));
          if (minIndent > 0) {
            codeLines = codeLines.map(l => l.length >= minIndent ? l.slice(minIndent) : l);
          }
        }

        if (codeLang === 'mermaid') {
          // Mermaid 流程图/时序图/结构图
          const chartCode = escapeHtml(codeLines.join('\n'));
          out.push(`<div class="mermaid-wrap"><pre class="mermaid">${chartCode}</pre></div>`);
        } else {
          // 语法高亮代码块
          const codeText = escapeHtml(codeLines.join('\n'));
          out.push(`<pre><code class="language-${codeLang}">${codeText}</code></pre>`);
        }
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // 2. 表格 (GFM Table)
    const isTableRow = /^\|(.+)\|$/.test(line.trim());
    if (isTableRow) {
      closeList();
      closeBlockquote();
      const cells = line.trim().slice(1, -1).split('|').map(c => c.trim());
      
      // 判断是否是分隔线 (如 | --- | :---: | ---: |)
      const isAlignRow = cells.every(c => /^:?-+:?$/.test(c));
      if (isAlignRow) {
        tableAligns = cells.map(c => {
          if (c.startsWith(':') && c.endsWith(':')) return 'center';
          if (c.endsWith(':')) return 'right';
          if (c.startsWith(':')) return 'left';
          return 'left';
        });
        inTable = true;
      } else if (!inTable) {
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      closeTable();
    }

    // 3. 引用块 / 提示卡片 (Blockquote)
    const quoteMatch = line.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      closeTable();
      closeList();
      inBlockquote = true;
      blockquoteBuffer.push(quoteMatch[1]);
      continue;
    } else if (inBlockquote) {
      closeBlockquote();
    }

    // 4. 水平分割线
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
      closeTable();
      closeList();
      closeBlockquote();
      out.push('<hr>');
      continue;
    }

    // 5. 标题 (Headers # ~ ######)
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      closeTable();
      closeList();
      closeBlockquote();
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();
      const id = slugify(title);

      if (level === 1) {
        // 文章首行 H1 由页面顶部模板统一渲染
        continue;
      }
      headings.push({ level, title, id });
      out.push(`<h${level} id="${id}">${formatInlineMarkdown(title)}</h${level}>`);
      continue;
    }

    // 6. 列表（支持深层多级嵌套、无序、有序、任务列表 Task List）
    const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      closeTable();
      closeBlockquote();

      const indent = listMatch[1].length;
      const bullet = listMatch[2];
      let itemContent = listMatch[3];
      const isOrdered = /^\d+\./.test(bullet);
      const listType = isOrdered ? 'ol' : 'ul';

      // 任务列表解析 (GFM Task List: - [ ] 或 - [x])
      let isTaskItem = false;
      let taskChecked = false;
      if (!isOrdered) {
        const taskMatch = itemContent.match(/^\[([ xX])\]\s+(.*)$/);
        if (taskMatch) {
          isTaskItem = true;
          taskChecked = taskMatch[1].toLowerCase() === 'x';
          itemContent = taskMatch[2];
        }
      }

      const formattedItem = formatInlineMarkdown(itemContent);
      const itemHtml = isTaskItem
        ? `<li class="task-list-item"><input type="checkbox" disabled ${taskChecked ? 'checked' : ''} class="task-checkbox"> <span>${formattedItem}</span>`
        : `<li>${formattedItem}`;

      if (!inList) {
        inList = true;
        listStack = [{ indent, type: listType }];
        out.push(`<${listType}${isTaskItem ? ' class="task-list"' : ''}>\n${itemHtml}`);
      } else {
        let top = listStack[listStack.length - 1];
        if (indent > top.indent) {
          // 深度进入下一级嵌套
          listStack.push({ indent, type: listType });
          out.push(`\n<${listType}${isTaskItem ? ' class="task-list"' : ''}>\n${itemHtml}`);
        } else if (indent < top.indent) {
          // 回退上一级列表
          while (listStack.length > 0 && indent < listStack[listStack.length - 1].indent) {
            const popped = listStack.pop();
            out.push(`</li>\n</${popped.type}>`);
          }
          out.push(`</li>\n${itemHtml}`);
        } else {
          // 同级列表项
          out.push(`</li>\n${itemHtml}`);
        }
      }
      continue;
    } else if (inList && line.trim() === '') {
      // 遇到空行暂不立即关闭，看下一行是否还是列表
      continue;
    } else if (inList) {
      closeList();
    }

    // 7. 空行
    if (line.trim() === '') {
      continue;
    }

    // 遇到非列表内容，立即闭合未关闭的列表
    closeList();

    // 8. 定义列表 (Definition List: 术语\n: 定义)
    if (line.startsWith(': ') && out.length > 0 && out[out.length - 1].startsWith('<p>')) {
      const prevParagraph = out.pop();
      const term = prevParagraph.replace(/^<p>|<\/p>$/g, '');
      const def = formatInlineMarkdown(line.slice(2));
      out.push(`<dl class="markdown-dl"><dt>${term}</dt><dd>${def}</dd></dl>`);
      continue;
    }

    // 9. 普通段落
    out.push(`<p>${formatInlineMarkdown(line)}</p>`);
  }

  closeTable();
  closeList();
  closeBlockquote();

  // 10. 如果存在脚注，在文末生成现代脚注列表
  if (footnoteKeys.length > 0) {
    let fnHtml = '<div class="footnotes-section">\n<hr class="footnotes-divider">\n<div class="footnotes-title">参考与注释</div>\n<ol class="footnotes-list">\n';
    footnoteKeys.forEach(fnId => {
      const fnText = formatInlineMarkdown(footnotes[fnId]);
      fnHtml += `  <li id="fn-${fnId}">${fnText} <a href="#fnref-${fnId}" class="footnote-backref" title="返回正文引用处">↩</a></li>\n`;
    });
    fnHtml += '</ol>\n</div>\n';
    out.push(fnHtml);
  }

  const html = out.join('\n');
  return { meta, html, headings, rawText: content };
}

// 增强型行内 Markdown 解析器 (支持加粗、斜体、删除线、代码、图片、链接、脚注引用、徽章等)
function formatInlineMarkdown(text) {
  if (!text) return '';

  const placeholders = [];
  let tokenIdx = 0;

  function storeToken(html) {
    const key = `%%MD_TOKEN_${tokenIdx++}%%`;
    placeholders.push({ key, html });
    return key;
  }

  let str = text;

  // 1. 优先提取并保护行内代码 (`code`)，内部进行 HTML 转义
  str = str.replace(/`([^`]+)`/g, (match, code) => {
    return storeToken(`<code>${escapeHtml(code)}</code>`);
  });

  // 2. 提取并保护图片 (![alt](url))，注入 loading="lazy" decoding="async"
  str = str.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
    return storeToken(`<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" class="article-image" loading="lazy" decoding="async">`);
  });

  // 3. 提取并保护超链接 ([text](url))
  str = str.replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, url) => {
    const isExternal = url.startsWith('http://') || url.startsWith('https://');
    const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    // 递归格式化链接内的文字（如链接内加粗）
    const formattedLinkText = formatInlineMarkdown(linkText);
    return storeToken(`<a href="${escapeHtml(url)}"${targetAttr}>${formattedLinkText}</a>`);
  });

  // 4. 提取并保护脚注引用 ([^1])
  str = str.replace(/\[\^([a-zA-Z0-9_-]+)\]/g, (match, fnId) => {
    return storeToken(`<sup class="footnote-ref"><a href="#fn-${fnId}" id="fnref-${fnId}">[${fnId}]</a></sup>`);
  });

  // 5. 对剩余的纯文本部分进行安全 HTML 转义
  let res = escapeHtml(str);

  // 6. 删除线 (~~内容~~)
  res = res.replace(/~~(.*?)~~/g, '<del>$1</del>');

  // 7. 加粗 (**内容** 或 __内容__)
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  res = res.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // 8. 斜体 (*内容* 或 _内容_)
  res = res.replace(/\*(.*?)\*/g, '<em>$1</em>');
  res = res.replace(/(^|[^\w])_([^_]+)_(?=[^\w]|$)/g, '$1<em>$2</em>');

  // 9. 循环还原所有被保护的占位符（彻底解决嵌套占位符泄漏问题）
  let maxPasses = 10;
  while (maxPasses-- > 0 && /%%MD_TOKEN_\d+%%/.test(res)) {
    placeholders.forEach(({ key, html }) => {
      res = res.replace(key, html);
    });
  }

  return res;
}

function escapeHtml(str) {
  return (str || '')
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
// 6. 同步更新 data/search-index.js 全站全量深度搜索库 (文章 + AI导航 + 工具 + GitHub + 资源库)
// ==============================================================================
let allNavGithub = [];
if (fs.existsSync(NAV_DATA_PATH)) {
  try { allNavGithub = JSON.parse(fs.readFileSync(NAV_DATA_PATH, 'utf-8')); } catch (e) {}
}
let allNavTools = [];
if (fs.existsSync(TOOLS_DATA_PATH)) {
  try { allNavTools = JSON.parse(fs.readFileSync(TOOLS_DATA_PATH, 'utf-8')); } catch (e) {}
}
let allNavAi = [];
if (fs.existsSync(AI_DATA_PATH)) {
  try { allNavAi = JSON.parse(fs.readFileSync(AI_DATA_PATH, 'utf-8')); } catch (e) {}
}

const postSearchItems = postsList.map(p => {
  const cleanBody = p.content.replace(/#|\*|`|\[|\]|\(|\)/g, ' ').replace(/\s+/g, ' ').trim();
  return {
    id: p.slug,
    type: 'post',
    title: p.title,
    url: p.url,
    category: p.category,
    date: p.date,
    tags: p.tags,
    summary: p.summary,
    content: cleanBody,
    sections: p.headings.map(h => ({ title: h.title, anchor: `#${h.id}`, id: h.id }))
  };
});

const aiSearchItems = [];
allNavAi.forEach(cat => {
  (cat.items || []).forEach(item => {
    aiSearchItems.push({
      id: `ai-${slugify(item.name)}`,
      type: 'ai',
      title: item.name,
      url: 'ai.html',
      category: `AI 导航 · ${cat.category}`,
      date: todayDateStr,
      tags: item.tags || [],
      summary: `${item.tagline} — ${item.description}`,
      content: `${item.name} ${item.url} ${item.tagline} ${item.description} ${(item.tags || []).join(' ')}`,
      sections: []
    });
  });
});

const toolsSearchItems = [];
allNavTools.forEach(cat => {
  (cat.items || []).forEach(item => {
    toolsSearchItems.push({
      id: `tool-${slugify(item.name)}`,
      type: 'tool',
      title: item.name,
      url: 'tools.html',
      category: `工具导航 · ${cat.category}`,
      date: todayDateStr,
      tags: item.tags || [],
      summary: `${item.tagline} — ${item.description}`,
      content: `${item.name} ${item.url} ${item.tagline} ${item.description} ${(item.tags || []).join(' ')}`,
      sections: []
    });
  });
});

const githubSearchItems = [];
allNavGithub.forEach(cat => {
  (cat.items || []).forEach(item => {
    githubSearchItems.push({
      id: `github-${slugify(item.name)}`,
      type: 'github',
      title: `${item.name} (${item.repo})`,
      url: 'nav.html',
      category: `GitHub 导航 · ${cat.category}`,
      date: todayDateStr,
      tags: item.tags || [],
      summary: `${item.tagline} — ${item.description}`,
      content: `${item.name} ${item.repo} ${item.url} ${item.tagline} ${item.description} ${(item.tags || []).join(' ')}`,
      sections: []
    });
  });
});

const fileSearchItems = (resourceFiles || []).map(f => ({
  id: `file-${slugify(f.name)}`,
  type: 'file',
  title: f.name,
  url: 'files.html',
  category: `资源文件 · ${f.category}`,
  date: todayDateStr,
  tags: [f.ext, f.category],
  summary: `${f.desc} (${f.size}, ${f.lines} 行)`,
  content: `${f.name} ${f.desc} ${f.category} ${f.ext}`,
  sections: []
}));

const searchIndexItems = [
  ...postSearchItems,
  ...aiSearchItems,
  ...toolsSearchItems,
  ...githubSearchItems,
  ...fileSearchItems
];

const searchIndexJsContent = `/**
 * vmrey.github.io 全局全文检索索引数据库
 * 由 build.js 自动生成构建 (全量收录文章、AI导航、工具、GitHub与附件)
 */
window.SEARCH_DATABASE = window.BLOG_SEARCH_INDEX = ${JSON.stringify(searchIndexItems, null, 2)};
`;

fs.writeFileSync(SEARCH_INDEX_PATH, searchIndexJsContent, 'utf-8');
console.log(`🔍 已全量更新全局全文搜索索引: data/search-index.js (共 ${searchIndexItems.length} 个条目: ${postSearchItems.length} 文章 + ${aiSearchItems.length} AI + ${toolsSearchItems.length} 工具 + ${githubSearchItems.length} GitHub + ${fileSearchItems.length} 附件)`);

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

// ==============================================================================
// 10. 编译生成 nav.html GitHub 开源导航页
// ==============================================================================
let navCategories = [];
if (fs.existsSync(NAV_DATA_PATH)) {
  try {
    navCategories = JSON.parse(fs.readFileSync(NAV_DATA_PATH, 'utf-8'));
  } catch (e) {
    console.warn('⚠️ 读取 data/github-nav.json 失败:', e.message);
  }
}

const navSidebarHtml = renderSidebar({
  isSubfolder: false,
  activePage: 'nav',
  blogConfig: blogConfig,
  categoryStats: categoryStats,
  resourceFilesCount: resourceFiles.length
});

const navPageHtml = renderNavLayout({
  sidebarHtml: navSidebarHtml,
  navCategories: navCategories,
  blogConfig: blogConfig
});

fs.writeFileSync(NAV_HTML_PATH, navPageHtml, 'utf-8');
const totalNavRepos = navCategories.reduce((acc, cat) => acc + (cat.items ? cat.items.length : 0), 0);
console.log(`🧭 已成功生成 GitHub 开源导航中心: nav.html (${totalNavRepos} 个项目)`);

// ==============================================================================
// 11. 编译生成 tools.html 实用工具导航页
// ==============================================================================
let toolsCategories = [];
if (fs.existsSync(TOOLS_DATA_PATH)) {
  try {
    toolsCategories = JSON.parse(fs.readFileSync(TOOLS_DATA_PATH, 'utf-8'));
  } catch (e) {
    console.warn('⚠️ 读取 data/tools-nav.json 失败:', e.message);
  }
}

const toolsSidebarHtml = renderSidebar({
  isSubfolder: false,
  activePage: 'tools',
  blogConfig: blogConfig,
  categoryStats: categoryStats,
  resourceFilesCount: resourceFiles.length
});

const toolsPageHtml = renderToolsLayout({
  sidebarHtml: toolsSidebarHtml,
  toolsCategories: toolsCategories,
  blogConfig: blogConfig
});

fs.writeFileSync(TOOLS_HTML_PATH, toolsPageHtml, 'utf-8');
const totalTools = toolsCategories.reduce((acc, cat) => acc + (cat.items ? cat.items.length : 0), 0);
console.log(`🛠️ 已成功生成实用工具导航中心: tools.html (${totalTools} 个工具)`);

// ==============================================================================
// 12. 编译生成 ai.html 顶级 AI 导航页
// ==============================================================================
let aiCategories = [];
if (fs.existsSync(AI_DATA_PATH)) {
  try {
    aiCategories = JSON.parse(fs.readFileSync(AI_DATA_PATH, 'utf-8'));
  } catch (e) {
    console.warn('⚠️ 读取 data/ai-nav.json 失败:', e.message);
  }
}

const aiSidebarHtml = renderSidebar({
  isSubfolder: false,
  activePage: 'ai',
  blogConfig: blogConfig,
  categoryStats: categoryStats,
  resourceFilesCount: resourceFiles.length
});

const aiPageHtml = renderAiLayout({
  sidebarHtml: aiSidebarHtml,
  aiCategories: aiCategories,
  blogConfig: blogConfig
});

fs.writeFileSync(AI_HTML_PATH, aiPageHtml, 'utf-8');
const totalAi = aiCategories.reduce((acc, cat) => acc + (cat.items ? cat.items.length : 0), 0);
console.log(`🤖 已成功生成顶级 AI 导航中心: ai.html (${totalAi} 个 AI 工具与模型)`);

// ==============================================================================
// 13. 编译生成 node-vle.html 节点生成器页面
// ==============================================================================
const vlessSidebarHtml = renderSidebar({
  isSubfolder: false,
  activePage: 'vless',
  blogConfig: blogConfig,
  categoryStats: categoryStats,
  resourceFilesCount: resourceFiles.length
});

const nodeVlePageHtml = renderNodeVleLayout({
  sidebarHtml: vlessSidebarHtml,
  blogConfig: blogConfig
});

fs.writeFileSync(VLESS_HTML_PATH, nodeVlePageHtml, 'utf-8');
console.log(`⚡ 已成功生成 VLESS 节点生成器导航功能页: node-vle.html`);

// ==============================================================================
// 14. 自动生成 robots.txt 搜索引擎爬虫协议
// ==============================================================================
const robotsTxtContent = `User-agent: *
Allow: /

Sitemap: https://vmrey.github.io/sitemap.xml
`;
fs.writeFileSync(ROBOTS_TXT_PATH, robotsTxtContent, 'utf-8');
console.log('🤖 已全自动生成搜索引擎爬虫协议: robots.txt');

// ==============================================================================
// 15. 自动生成全量 sitemap.xml 站点地图
// ==============================================================================
function escapeXml(unsafeStr) {
  if (!unsafeStr) return '';
  return String(unsafeStr)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const staticPages = [
  { loc: 'https://vmrey.github.io/', priority: '1.0', changefreq: 'daily', lastmod: todayDateStr },
  { loc: 'https://vmrey.github.io/ai.html', priority: '0.9', changefreq: 'weekly', lastmod: todayDateStr },
  { loc: 'https://vmrey.github.io/tools.html', priority: '0.9', changefreq: 'weekly', lastmod: todayDateStr },
  { loc: 'https://vmrey.github.io/node-vle.html', priority: '0.9', changefreq: 'weekly', lastmod: todayDateStr },
  { loc: 'https://vmrey.github.io/nav.html', priority: '0.8', changefreq: 'weekly', lastmod: todayDateStr },
  { loc: 'https://vmrey.github.io/files.html', priority: '0.8', changefreq: 'weekly', lastmod: todayDateStr },
  { loc: 'https://vmrey.github.io/about.html', priority: '0.7', changefreq: 'monthly', lastmod: todayDateStr }
];

const postUrlNodes = postsList.map(p => `  <url>
    <loc>https://vmrey.github.io/posts/${escapeXml(p.slug)}.html</loc>
    <lastmod>${escapeXml(p.date || todayDateStr)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

const staticUrlNodes = staticPages.map(p => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n');

const sitemapXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrlNodes}
${postUrlNodes}
</urlset>
`;
fs.writeFileSync(SITEMAP_XML_PATH, sitemapXmlContent, 'utf-8');
console.log(`🗺️ 已全自动生成 SEO 全站站点地图: sitemap.xml (收录 ${staticPages.length + postsList.length} 个页面)`);

// ==============================================================================
// 15. 自动生成标准 RSS 订阅源 feed.xml (RSS 2.0)
// ==============================================================================
const rssItems = postsList.slice(0, 30).map(p => {
  let pubDateStr;
  try {
    pubDateStr = new Date(p.date).toUTCString();
  } catch (e) {
    pubDateStr = new Date().toUTCString();
  }
  return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>https://vmrey.github.io/posts/${p.slug}.html</link>
      <guid isPermaLink="true">https://vmrey.github.io/posts/${p.slug}.html</guid>
      <pubDate>${pubDateStr}</pubDate>
      <category>${escapeXml(p.category)}</category>
      <description>${escapeXml(p.summary || p.title)}</description>
    </item>`;
}).join('\n');

const feedXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(blogConfig.siteName || 'vmrey.github.io')}</title>
    <link>https://vmrey.github.io/</link>
    <description>${escapeXml(blogConfig.tagline || '专注前端工程化、Vue组件设计、Linux系统运维与自动化脚本实战')}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://vmrey.github.io/feed.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>
`;
fs.writeFileSync(FEED_XML_PATH, feedXmlContent, 'utf-8');
console.log(`📡 已全自动生成 RSS 2.0 聚合订阅源: feed.xml (收录最新 ${Math.min(postsList.length, 30)} 篇)`);

// ==============================================================================
// 16. 自动生成面向 AI 智能体与大模型的 llms.txt & llms-full.txt 协议
// ==============================================================================
// 按分类对文章进行整理
const postsByCategory = {};
postsList.forEach(p => {
  const cat = p.category || '未分类';
  if (!postsByCategory[cat]) postsByCategory[cat] = [];
  postsByCategory[cat].push(p);
});

let llmsArticlesMarkdown = '';
for (const [catName, cPosts] of Object.entries(postsByCategory)) {
  llmsArticlesMarkdown += `### ${catName} (${cPosts.length} 篇)\n`;
  cPosts.forEach(p => {
    llmsArticlesMarkdown += `- [${p.title}](https://vmrey.github.io/posts/${p.slug}.html): ${p.summary || p.title}\n`;
  });
  llmsArticlesMarkdown += '\n';
}

const llmsTxtContent = `# vmrey.github.io

> 专注于前端工程化、Vue 组件设计、Linux 系统运维与自动化脚本实战的技术博客与导航生态中心。

## 站点核心结构与路由 (Core Site Structure)
- [博客首页 (Blog Home)](https://vmrey.github.io/): 全部技术文章列表与专栏分类浏览
- [AI 导航中心 (AI Navigation)](https://vmrey.github.io/ai.html): 精选收录 Gemini, ChatGPT, Claude, DeepSeek, Cursor 等 17+ 顶尖 AI 工具与智能体
- [实用工具导航 (Developer Tools)](https://vmrey.github.io/tools.html): 精选收录 FlyEnv, DBeaver, 草料二维码, 1Password 等 15+ 开发者效率利器
- [节点生成器 (VLESS Generator)](https://vmrey.github.io/node-vle.html): 全协议 VLESS 节点批量生成与智能去重配置工具
- [GitHub 导航中心 (GitHub Repos)](https://vmrey.github.io/nav.html): 精选收录 fnm, nvm, Ventoy, Fail2Ban, acme.sh 等优质开源仓库
- [资源文件库 (Resource Files)](https://vmrey.github.io/files.html): Vue 组件源码、Shell 脚本与配置附件在线高亮预览与下载
- [关于本站 (About Author)](https://vmrey.github.io/about.html): 博主个人简介、技术栈与工程理念
- [完整知识库快照 (Full Knowledge Digest)](https://vmrey.github.io/llms-full.txt): 全站技术文章详细摘要与纯文本知识库

## 技术文章全景大纲 (Technical Articles - 共 ${postsList.length} 篇)

${llmsArticlesMarkdown}
`;

fs.writeFileSync(LLMS_TXT_PATH, llmsTxtContent, 'utf-8');
console.log(`🤖 已全自动生成面向 AI 智能体的知识索引协议: llms.txt (收录 ${postsList.length} 篇文章大纲)`);

// 生成 llms-full.txt 全量纯文本快照
let llmsFullContent = `# vmrey.github.io 全量技术文章知识库快照 (Full Knowledge Base for LLMs & RAG)

> 本文件专为 AI 智能体 (Claude Code, Cursor, ChatGPT, Gemini, DeepSeek) 与 RAG 向量知识库检索构建。
> 包含全站 ${postsList.length} 篇技术文章的完整摘要与核心技术要点。

`;

postsList.forEach((p, idx) => {
  llmsFullContent += `---
## [${idx + 1}] ${p.title}
- **永久链接 (URL)**: https://vmrey.github.io/posts/${p.slug}.html
- **所属专栏 (Category)**: ${p.category}
- **发布日期 (Date)**: ${p.date}
- **技术标签 (Tags)**: ${Array.isArray(p.tags) ? p.tags.join(', ') : p.category}
- **核心摘要**: ${p.summary || p.title}

### 核心内容要点与大纲:
${(p.headings || []).map(s => `- ${s.title}`).join('\n') || '- 详见正文实战代码与解析'}

`;
});

fs.writeFileSync(LLMS_FULL_TXT_PATH, llmsFullContent, 'utf-8');
console.log(`🧠 已全自动生成面向大模型的全量知识库快照: llms-full.txt (包含 ${postsList.length} 篇全量知识要点)`);

console.log(`\n✨ 全部构建成功！共发布 ${postsList.length} 篇正式文章、${resourceFiles.length} 个资源文件、${totalNavRepos} 个 GitHub 项目、${totalTools} 个实用在线工具 & ${totalAi} 个顶尖 AI 产品！随时可以运行 npm run serve 本地预览或 git push 部署！\n`);

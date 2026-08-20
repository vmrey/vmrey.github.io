/**
 * 基础页面骨架模板 (Base HTML5 Layout Template)
 */
const { renderMobileHeader } = require('../components/mobile-header');

function renderBaseLayout({
  title = 'vmrey.github.io',
  description = '专注前端工程化、Vue组件设计、Linux系统运维与自动化脚本实战',
  keywords = '前端开发,Vue3,Linux,Docker,Nginx,自动化脚本,工程师博客',
  canonicalPath = '',
  ogType = 'website',
  jsonLd = null,
  isSubfolder = false,
  extraCss = [],
  extraScripts = [],
  sidebarHtml = '',
  mainContentHtml = '',
  inlineScripts = ''
}) {
  const assetPrefix = isSubfolder ? '../' : '';
  const siteUrl = 'https://vmrey.github.io';
  const fullCanonicalUrl = canonicalPath ? `${siteUrl}/${canonicalPath.replace(/^\/+/, '')}` : siteUrl;

  const cssTags = [
    `${assetPrefix}css/style.css`,
    ...extraCss.map(c => c.startsWith('http') ? c : `${assetPrefix}${c}`)
  ].map(href => `<link rel="stylesheet" href="${href}">`).join('\n  ');

  const scriptTags = [
    `${assetPrefix}js/config.js`,
    `${assetPrefix}data/search-index.js`,
    `${assetPrefix}js/main.js`,
    `${assetPrefix}js/prism.js`,
    `${assetPrefix}js/search.js`,
    `${assetPrefix}js/file-preview.js`,
    ...extraScripts.map(s => s.startsWith('http') ? s : `${assetPrefix}${s}`)
  ].map(src => `<script src="${src}"></script>`).join('\n  ');

  const jsonLdScript = jsonLd ? `\n  <script type="application/ld+json">\n  ${JSON.stringify(jsonLd, null, 2).replace(/\n/g, '\n  ')}\n  </script>` : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <meta name="author" content="vmrey">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${fullCanonicalUrl}">
  <link rel="alternate" type="application/rss+xml" title="vmrey.github.io RSS 订阅源" href="${siteUrl}/feed.xml">
  <link rel="icon" type="image/svg+xml" href="${assetPrefix}favicon.svg">

  <!-- Open Graph 社交卡片 (微信/QQ/Telegram/GitHub) -->
  <meta property="og:site_name" content="vmrey's Blog">
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${fullCanonicalUrl}">
  <meta property="og:image" content="${siteUrl}/favicon.svg">

  <!-- Twitter / X 社交卡片 -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${siteUrl}/favicon.svg">
  ${jsonLdScript}
  ${cssTags}
</head>
<body>

${renderMobileHeader('vmrey.github.io')}

  <div class="app-layout">
    
${sidebarHtml}

    <!-- 主内容区 -->
    <main class="app-main">
${mainContentHtml}
    </main>

  </div>

  <!-- 全局回到顶部按钮 (右下角固定) -->
  <button id="back-to-top-btn" class="back-to-top-btn" type="button" title="回到顶部" aria-label="回到顶部">
    <svg class="back-to-top-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  </button>

  ${scriptTags}
${inlineScripts ? `  <script>\n${inlineScripts}\n  </script>` : ''}
</body>
</html>`;
}

module.exports = { renderBaseLayout };

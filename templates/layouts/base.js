/**
 * 基础页面骨架模板 (Base HTML5 Layout Template)
 */
const { renderMobileHeader } = require('../components/mobile-header');

function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function slugify(text) {
  return String(text || '').trim().toLowerCase().replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '') || `sec-${Math.random().toString(36).slice(2, 7)}`;
}

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

  const safeTitle = escapeAttr(title);
  const safeDescription = escapeAttr(description);
  const safeKeywords = escapeAttr(keywords);

  // 生成基于 CSS 变动特征的版本号，实现全网 CDN 与浏览器零延迟即时刷新 (Cache-Busting)
  const assetVersion = '20260902f';

  const cssTags = [
    `${assetPrefix}css/style.css?v=${assetVersion}`,
    ...extraCss.map(c => c.startsWith('http') ? c : `${assetPrefix}${c}?v=${assetVersion}`)
  ].map(href => `<link rel="stylesheet" href="${href}">`).join('\n  ');

  const scriptTags = [
    `${assetPrefix}js/config.js?v=${assetVersion}`,
    `${assetPrefix}data/search-index.js?v=${assetVersion}`,
    `${assetPrefix}js/main.js?v=${assetVersion}`,
    `${assetPrefix}js/prism.js?v=${assetVersion}`,
    `${assetPrefix}js/search.js?v=${assetVersion}`,
    `${assetPrefix}js/file-preview.js?v=${assetVersion}`,
    ...extraScripts.map(s => s.startsWith('http') ? s : `${assetPrefix}${s}?v=${assetVersion}`)
  ].map(src => `<script defer src="${src}"></script>`).join('\n  ');

  const jsonLdScript = jsonLd ? `\n  <script type="application/ld+json">\n  ${JSON.stringify(jsonLd, null, 2).replace(/\n/g, '\n  ')}\n  </script>` : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}">
  <meta name="keywords" content="${safeKeywords}">
  <meta name="author" content="vmrey">
  <meta name="robots" content="index, follow">
  <meta name="google-site-verification" content="Vi8ircfK8SuZNzZBrtU7av_aXeiUKrLDKgef-84unTM">
  <link rel="canonical" href="${fullCanonicalUrl}">
  <link rel="alternate" type="application/rss+xml" title="vmrey.github.io RSS 订阅源" href="${siteUrl}/feed.xml">
  <link rel="alternate" type="text/plain" title="LLMs.txt AI 知识索引" href="${siteUrl}/llms.txt">
  <link rel="icon" type="image/svg+xml" href="${assetPrefix}favicon.svg">

  <!-- Open Graph 社交卡片 (微信/QQ/Telegram/GitHub) -->
  <meta property="og:site_name" content="vmrey's Blog">
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:url" content="${fullCanonicalUrl}">
  <meta property="og:image" content="${siteUrl}/favicon.svg">

  <!-- Twitter / X 社交卡片 -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDescription}">
  <meta name="twitter:image" content="${siteUrl}/favicon.svg">

  <!-- 页面绘制前同步初始化深浅色主题，彻底杜绝首屏白屏闪烁 (Anti-FOUC) -->
  <script>
    (function() {
      try {
        var t = localStorage.getItem('theme');
        if (!t) {
          var isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          t = isDark ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', t);
      } catch(e) {}
    })();
  </script>
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

module.exports = { renderBaseLayout, slugify, escapeAttr };

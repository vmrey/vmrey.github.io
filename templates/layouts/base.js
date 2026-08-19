/**
 * 基础页面骨架模板 (Base HTML5 Layout Template)
 */
const { renderMobileHeader } = require('../components/mobile-header');

function renderBaseLayout({
  title = 'vmrey.github.io',
  description = '专注前端工程化、Vue组件设计、Linux系统运维与自动化脚本实战',
  isSubfolder = false,
  extraCss = [],
  extraScripts = [],
  sidebarHtml = '',
  mainContentHtml = '',
  inlineScripts = ''
}) {
  const assetPrefix = isSubfolder ? '../' : '';

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

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="icon" type="image/svg+xml" href="${assetPrefix}favicon.svg">
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

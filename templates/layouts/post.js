/**
 * 文章详情阅读页布局模板 (Post Detail Reading Layout Template)
 */
const { renderToc } = require('../components/toc');
const { renderBaseLayout } = require('./base');

function renderPostLayout({
  post,
  sidebarHtml,
  blogConfig
}) {
  const mainContentHtml = `      <div class="article-container">
        <!-- 文章标题与元数据头部 -->
        <header class="article-header">
          <a href="../index.html" class="back-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            <span>返回文章列表</span>
          </a>
          <h1 class="article-title">${post.title}</h1>
          <div class="article-meta">
            <span class="post-block-tag">${post.category}</span>
            <span>·</span>
            <time datetime="${post.date}">${post.date}</time>
            <span>·</span>
            <span>${post.readTime || '5 分钟阅读'}</span>
          </div>
        </header>

        <!-- 正文内容区 -->
        <div class="article-layout">
          <article class="article-content" id="main-content">
            <div class="prose">
${post.bodyHtml}
            </div>

            <div class="post-block-footer" style="margin-top: 3.5rem; padding-top: 1.5rem;">
              <a href="../index.html" class="read-more-text">
                <span>← 返回文章专栏</span>
              </a>
            </div>
          </article>
        </div>
      </div>

${renderToc(post.headings)}`;

  const hasMermaid = post.bodyHtml.includes('class="mermaid"');
  const postKeywords = Array.isArray(post.tags) ? post.tags.join(', ') : (post.category || '前端开发,技术博客');
  const canonicalPath = `posts/${post.slug}.html`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.summary || post.title,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Person",
      "name": "vmrey",
      "url": "https://vmrey.github.io/about.html"
    },
    "publisher": {
      "@type": "Organization",
      "name": blogConfig.siteName || "vmrey.github.io",
      "logo": {
        "@type": "ImageObject",
        "url": "https://vmrey.github.io/favicon.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://vmrey.github.io/${canonicalPath}`
    },
    "keywords": postKeywords,
    "articleSection": post.category
  };

  return renderBaseLayout({
    title: `${post.title} - ${blogConfig.siteName}`,
    description: post.summary || post.title,
    keywords: postKeywords,
    canonicalPath: canonicalPath,
    ogType: 'article',
    jsonLd: jsonLd,
    isSubfolder: true,
    extraCss: ['css/prism.css'],
    extraScripts: hasMermaid ? ['https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js'] : [],
    sidebarHtml: sidebarHtml,
    mainContentHtml: mainContentHtml,
    inlineScripts: hasMermaid ? `
    if (window.mermaid) {
      mermaid.initialize({
        startOnLoad: true,
        theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'neutral',
        securityLevel: 'loose'
      });
    }` : ''
  });
}

module.exports = { renderPostLayout };

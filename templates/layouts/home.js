/**
 * 首页文章流布局模板 (Home Feed Layout Template)
 */
const { renderFeedHeader } = require('../components/feed-header');
const { renderPostCard } = require('../components/post-card');
const { renderEmptyState } = require('../components/empty-state');
const { renderBaseLayout } = require('./base');

function renderHomeLayout({
  sidebarHtml,
  postsList,
  blogConfig
}) {
  const postsHtml = postsList.map(post => renderPostCard(post)).join('\n\n');

  const mainContentHtml = `${renderFeedHeader({
    title: '全部文章',
    totalCount: postsList.length,
    pageSize: blogConfig.pageSize || 8
  })}

      <!-- 文章卡片流容器 -->
      <section class="posts-stream" id="posts-stream-container" aria-label="文章列表">
${postsHtml}
      </section>

${renderEmptyState({
  id: 'no-results',
  title: '暂无更多内容',
  desc: '当前专栏暂无发布文章，博主正在持续整理撰写中'
})}

      <!-- 分页导航容器 -->
      <div id="pagination-container" class="pagination-container"></div>`;

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": blogConfig.siteName || "vmrey.github.io",
    "url": "https://vmrey.github.io/",
    "description": "专注前端工程化、Vue组件设计、Linux系统运维与自动化脚本实战",
    "author": {
      "@type": "Person",
      "name": "vmrey"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://vmrey.github.io/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return renderBaseLayout({
    title: `${blogConfig.siteName} - ${blogConfig.tagline}`,
    description: '专注前端工程化、Vue组件设计、Linux系统运维与自动化脚本实战',
    keywords: '前端开发,Vue3,Linux运维,Docker,Nginx,Shell脚本,自动化运维,技术博客',
    canonicalPath: '',
    ogType: 'website',
    jsonLd: homeJsonLd,
    isSubfolder: false,
    extraCss: ['css/prism.css'],
    sidebarHtml: sidebarHtml,
    mainContentHtml: mainContentHtml
  });
}

module.exports = { renderHomeLayout };

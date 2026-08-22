/**
 * 顶级 AI 导航页面布局模板 (AI Tools & Frontier Models Layout Template)
 */
const { renderBaseLayout } = require('./base');

function renderAiLayout({
  sidebarHtml,
  aiCategories,
  blogConfig
}) {
  const totalAiTools = aiCategories.reduce((acc, cat) => acc + (cat.items ? cat.items.length : 0), 0);

  // 1. 顶部快捷分类切换胶囊
  const quickPillsHtml = `
      <div class="nav-quick-filters">
        <button type="button" class="nav-pill-btn active" data-filter-cat="all">
          <span>全部 AI 工具</span>
          <span class="nav-pill-count">${totalAiTools}</span>
        </button>
        ${aiCategories.map(cat => `
        <button type="button" class="nav-pill-btn" data-filter-cat="${cat.category}">
          <span>${cat.category}</span>
          <span class="nav-pill-count">${cat.items.length}</span>
        </button>
        `).join('\n')}
      </div>
  `;

  const iconSvgs = {
    '前沿大模型与对话平台': `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>`,
    'AI 智能体与自主编程': `<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>`,
    'AI 图像与多媒体创作': `<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>`,
    'AI 聚合平台与 API 服务': `<rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>`
  };

  // 2. 渲染各分类 AI 卡片矩阵
  const categoriesHtml = aiCategories.map(cat => {
    const catIconSvg = iconSvgs[cat.category] || `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>`;

    const cardsHtml = cat.items.map(item => {
      const tagsHtml = (item.tags || []).map(tag => `<span class="repo-tag">#${tag}</span>`).join('');
      
      return `          <!-- AI Card: ${item.name} -->
          <div class="nav-repo-card" data-name="${item.name.toLowerCase()}" data-url="${(item.url || '').toLowerCase()}" data-desc="${(item.tagline + ' ' + item.description).toLowerCase()}" data-tags="${(item.tags || []).join(',').toLowerCase()}" data-cat="${cat.category}">
            <div class="repo-card-top">
              <div class="repo-header-info">
                <div class="repo-icon-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div class="repo-title-meta">
                  <div class="repo-name-line">
                    <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="repo-main-name" title="前往 ${item.name} 官网">
                      ${item.name}
                    </a>
                    <span class="repo-badge">${item.badge || item.category}</span>
                  </div>
                  <div class="repo-fullname">${item.url.replace(/^https?:\/\//, '')}</div>
                </div>
              </div>
            </div>

            <div class="repo-tagline-text">${item.tagline}</div>
            <p class="repo-desc-text">${item.description}</p>

            <div class="repo-card-bottom">
              <div class="repo-tags-wrap">
                ${tagsHtml}
              </div>
              <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="repo-visit-btn" title="在新窗口立即直达 ${item.name}">
                <span>直达访问</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>`;
    }).join('\n');

    return `      <!-- 分类矩阵：${cat.category} -->
      <section class="nav-category-section" data-cat-name="${cat.category}">
        <div class="nav-category-header">
          <div class="nav-cat-title-left">
            <div class="nav-cat-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${catIconSvg}
              </svg>
            </div>
            <h2 class="nav-cat-title">${cat.category}</h2>
            <span class="nav-cat-desc">${cat.description}</span>
          </div>
          <span class="nav-cat-count">${cat.items.length} 个工具</span>
        </div>

        <div class="nav-repo-grid">
${cardsHtml}
        </div>
      </section>`;
  }).join('\n\n');

  const mainContentHtml = `      <!-- 顶部头部与即时搜索框 -->
      <header class="feed-header">
        <div class="feed-title-wrap">
          <div class="feed-title-row">
            <h1>AI 导航</h1>
            <div class="feed-stats-pills">
              <span class="stat-pill highlight" id="ai-count-badge">共 ${aiCategories.length} 个分类 · ${totalAiTools} 个顶尖 AI 工具</span>
              <span class="stat-pill">前沿大模型与智能体精选</span>
            </div>
          </div>
        </div>

        <div class="search-box-wrap">
          <svg class="search-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="search" 
            id="ai-filter-input" 
            class="search-input" 
            placeholder="输入大模型、厂商、Agent、功能描述即时定位 AI 工具..." 
            aria-label="检索 AI 工具"
            autocomplete="off"
            enterkeyhint="search"
          >
        </div>
      </header>

      ${quickPillsHtml}

      <!-- AI 卡片展示流 -->
      <div class="nav-sections-container" id="ai-sections-container">
${categoriesHtml}
      </div>

      <!-- 搜索空状态 -->
      <div class="empty-state-card" id="ai-empty-state" style="display: none;">
        <div class="empty-state-illustration">
          <div class="empty-state-glow"></div>
          <svg class="empty-state-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="28" cy="28" r="16" stroke-dasharray="4 4" opacity="0.6"/>
            <circle cx="44" cy="44" r="12" fill="var(--surface)" stroke="var(--primary)" stroke-width="2"/>
            <line x1="52.5" y1="52.5" x2="60" y2="60" stroke="var(--primary)" stroke-width="2.5"/>
          </svg>
        </div>
        <h3 class="empty-state-title">未匹配到相关 AI 工具</h3>
        <p class="empty-state-desc">未能在此页面找到相关 AI 工具，可在全站深度搜索中查找文章、开源项目与代码。</p>
        <div class="empty-actions-row" style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; margin-top: 1rem;">
          <button type="button" class="empty-state-reset-btn" id="ai-empty-reset-btn">
            <span>清空筛选条件</span>
          </button>
          <button type="button" class="empty-state-reset-btn open-search-modal-with-query" style="background: var(--primary); color: #fff; border-color: var(--primary);">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span>在全站深度搜索 <span class="search-query-text"></span></span>
          </button>
        </div>
      </div>`;

  const inlineScripts = `    document.addEventListener('DOMContentLoaded', () => {
      if (typeof window.initNavFilter === 'function') {
        window.initNavFilter({
          inputId: 'ai-filter-input',
          pillSelector: '.nav-pill-btn',
          cardSelector: '.nav-repo-card',
          sectionSelector: '.nav-category-section',
          emptyId: 'ai-empty-state',
          countId: 'ai-count-badge',
          typeName: '顶尖 AI 工具'
        });
      }
    });`;

  return renderBaseLayout({
    title: `AI 导航 · ${blogConfig.siteName}`,
    description: `精选收录全球顶尖前沿大语言模型、Gemini、ChatGPT、DeepSeek、Claude 与 AI 编程智能体`,
    keywords: `AI导航, Gemini, ChatGPT, DeepSeek, Claude, Cursor, AI智能体, 大模型, ${blogConfig.siteName}`,
    canonicalPath: 'ai.html',
    sidebarHtml,
    mainContentHtml,
    inlineScripts,
    isSubfolder: false
  });
}

module.exports = { renderAiLayout };

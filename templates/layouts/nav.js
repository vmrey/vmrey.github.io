/**
 * GitHub 优质开源项目导航页面布局模板 (GitHub Navigation Layout Template)
 */
const { renderBaseLayout } = require('./base');

function renderNavLayout({
  sidebarHtml,
  navCategories,
  blogConfig
}) {
  const totalRepos = navCategories.reduce((acc, cat) => acc + (cat.items ? cat.items.length : 0), 0);

  // 1. 顶部快捷分类切换胶囊
  const quickPillsHtml = `
      <div class="nav-quick-filters">
        <button type="button" class="nav-pill-btn active" data-filter-cat="all">
          <span>全部项目</span>
          <span class="nav-pill-count">${totalRepos}</span>
        </button>
        ${navCategories.map(cat => `
        <button type="button" class="nav-pill-btn" data-filter-cat="${cat.category}">
          <span>${cat.category}</span>
          <span class="nav-pill-count">${cat.items.length}</span>
        </button>
        `).join('\n')}
      </div>
  `;

  const iconSvgs = {
    'Node.js 版本管理': `<polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line>`,
    '系统与装机利器': `<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle>`,
    '服务器安全与防护': `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>`,
    '前端安全与设备识别': `<path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"></path><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 11.5-2.5"></path><path d="M12 12a2 2 0 0 1 2 2c0 3-1 6-2 8"></path><path d="M8 22c1-2 1.5-4 1.5-6a2.5 2.5 0 0 1 5 0c0 2.5-.5 4.5-1.5 6"></path><path d="M17 18c1-1.5 2-3.5 2-6a8 8 0 0 0-16 0c0 1.5.3 3 .8 4.5"></path>`,
    '网络加速与穿透工具': `<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>`
  };

  // 2. 渲染各分类项目卡片矩阵
  const categoriesHtml = navCategories.map(cat => {
    const catIconSvg = iconSvgs[cat.category] || `<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>`;

    const cardsHtml = cat.items.map(item => {
      const tagsHtml = (item.tags || []).map(tag => `<span class="repo-tag">#${tag}</span>`).join('');
      
      return `          <!-- Repo Card: ${item.name} -->
          <div class="nav-repo-card" data-name="${item.name.toLowerCase()}" data-repo="${item.repo.toLowerCase()}" data-desc="${(item.tagline + ' ' + item.description).toLowerCase()}" data-tags="${(item.tags || []).join(',').toLowerCase()}" data-cat="${cat.category}">
            <div class="repo-card-top">
              <div class="repo-header-info">
                <div class="repo-icon-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0 9 18.13V22"></path>
                  </svg>
                </div>
                <div class="repo-title-meta">
                  <div class="repo-name-line">
                    <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="repo-main-name" title="前往 ${item.repo} 仓库">
                      ${item.name}
                    </a>
                    <span class="repo-badge">${item.badge || item.language}</span>
                  </div>
                  <div class="repo-fullname">${item.repo}</div>
                </div>
              </div>
            </div>

            <div class="repo-tagline-text">${item.tagline}</div>
            <p class="repo-desc-text">${item.description}</p>

            <div class="repo-card-bottom">
              <div class="repo-tags-wrap">
                ${tagsHtml}
              </div>
              <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="repo-visit-btn" title="在新窗口打开 GitHub 仓库">
                <span>访问仓库</span>
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
          <span class="nav-cat-count">${cat.items.length} 个项目</span>
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
            <h1>GitHub 导航</h1>
            <div class="feed-stats-pills">
              <span class="stat-pill highlight" id="nav-count-badge">共 ${navCategories.length} 个分类 · ${totalRepos} 个精选项目</span>
              <span class="stat-pill">开源利器精选收录</span>
            </div>
          </div>
        </div>

        <div class="search-box-wrap">
          <svg class="search-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            id="nav-filter-input" 
            class="search-input" 
            placeholder="输入项目名、语言、标签或描述即时检索开源项目..." 
            aria-label="检索开源项目"
            autocomplete="off"
          >
        </div>
      </header>

      ${quickPillsHtml}

      <!-- 仓库卡片展示流 -->
      <div class="nav-sections-container" id="nav-sections-container">
${categoriesHtml}
      </div>

      <!-- 搜索空状态 -->
      <div class="empty-state-card" id="nav-empty-state" style="display: none;">
        <div class="empty-state-illustration">
          <div class="empty-state-glow"></div>
          <svg class="empty-state-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="28" cy="28" r="16" stroke-dasharray="4 4" opacity="0.6"/>
            <circle cx="44" cy="44" r="12" fill="var(--surface)" stroke="var(--primary)" stroke-width="2"/>
            <line x1="52.5" y1="52.5" x2="60" y2="60" stroke="var(--primary)" stroke-width="2.5"/>
          </svg>
        </div>
        <h3 class="empty-state-title">未匹配到相关开源项目</h3>
        <p class="empty-state-desc">未能找到包含关键词的 GitHub 项目，请尝试更换关键词或切换分类筛选。</p>
        <button type="button" class="empty-state-reset-btn" id="nav-empty-reset-btn">
          <span>清空搜索条件</span>
        </button>
      </div>`;

  const inlineScripts = `    document.addEventListener('DOMContentLoaded', () => {
      if (typeof window.initNavFilter === 'function') {
        window.initNavFilter({
          inputId: 'nav-filter-input',
          pillSelector: '.nav-pill-btn',
          cardSelector: '.nav-repo-card',
          sectionSelector: '.nav-category-section',
          emptyId: 'nav-empty-state',
          countId: 'nav-count-badge',
          typeName: '精选项目'
        });
      }
    });`;

  return renderBaseLayout({
    title: `GitHub 导航 · ${blogConfig.siteName}`,
    description: `精选收录高价值 GitHub 开源项目、Node.js 版本管理器与优质工程工具链`,
    keywords: `GitHub, 开源导航, fnm, nvm, Ventoy, Fail2Ban, Node.js, 开发者工具, ${blogConfig.siteName}`,
    canonicalPath: 'nav.html',
    sidebarHtml,
    mainContentHtml,
    inlineScripts,
    isSubfolder: false
  });
}

module.exports = { renderNavLayout };

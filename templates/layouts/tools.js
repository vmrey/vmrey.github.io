/**
 * 实用在线开发工具导航页面布局模板 (Tools Navigation Layout Template)
 */
const { renderBaseLayout } = require('./base');

function renderToolsLayout({
  sidebarHtml,
  toolsCategories,
  blogConfig
}) {
  const totalTools = toolsCategories.reduce((acc, cat) => acc + (cat.items ? cat.items.length : 0), 0);

  // 1. 顶部快捷分类切换胶囊
  const quickPillsHtml = `
      <div class="nav-quick-filters">
        <button type="button" class="nav-pill-btn active" data-filter-cat="all">
          <span>全部工具</span>
          <span class="nav-pill-count">${totalTools}</span>
        </button>
        ${toolsCategories.map(cat => `
        <button type="button" class="nav-pill-btn" data-filter-cat="${cat.category}">
          <span>${cat.category}</span>
          <span class="nav-pill-count">${cat.items.length}</span>
        </button>
        `).join('\n')}
      </div>
  `;

  const iconSvgs = {
    '实用生成与办公工具': `<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>`,
    '终端与远程运维工具': `<polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line>`,
    '架构设计与思维导图': `<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>`,
    '系统优化与效率工具': `<rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>`,
    '图像与多媒体处理': `<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>`,
    '编辑与写作工具': `<path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>`,
    '网络诊断与安全检测': `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>`,
    '数据转换与格式化': `<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>`,
    '研发与运维工具链': `<rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>`,
    '在线开发与云端沙箱': `<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>`
  };

  // 2. 渲染各分类工具卡片矩阵
  const categoriesHtml = toolsCategories.map(cat => {
    const catIconSvg = iconSvgs[cat.category] || `<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>`;

    const cardsHtml = cat.items.map(item => {
      const tagsHtml = (item.tags || []).map(tag => `<span class="repo-tag">#${tag}</span>`).join('');
      
      return `          <!-- Tool Card: ${item.name} -->
          <div class="nav-repo-card" data-name="${item.name.toLowerCase()}" data-url="${(item.url || '').toLowerCase()}" data-desc="${(item.tagline + ' ' + item.description).toLowerCase()}" data-tags="${(item.tags || []).join(',').toLowerCase()}" data-cat="${cat.category}">
            <div class="repo-card-top">
              <div class="repo-header-info">
                <div class="repo-icon-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
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
              <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="repo-visit-btn" title="在新窗口直达 ${item.name} 在线工具">
                <span>直达工具</span>
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
            <h1>工具导航</h1>
            <div class="feed-stats-pills">
              <span class="stat-pill highlight" id="tools-count-badge">共 ${toolsCategories.length} 个分类 · ${totalTools} 个实用工具</span>
              <span class="stat-pill">开发效能利器精选</span>
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
            id="tools-filter-input" 
            class="search-input" 
            placeholder="输入工具名称、标签、功能描述即时定位实用工具..." 
            aria-label="检索在线工具"
            autocomplete="off"
            enterkeyhint="search"
          >
        </div>
      </header>

      ${quickPillsHtml}

      <!-- 工具卡片展示流 -->
      <div class="nav-sections-container" id="tools-sections-container">
${categoriesHtml}
      </div>

      <!-- 搜索空状态 -->
      <div class="empty-state-card" id="tools-empty-state" style="display: none;">
        <div class="empty-state-illustration">
          <div class="empty-state-glow"></div>
          <svg class="empty-state-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="28" cy="28" r="16" stroke-dasharray="4 4" opacity="0.6"/>
            <circle cx="44" cy="44" r="12" fill="var(--surface)" stroke="var(--primary)" stroke-width="2"/>
            <line x1="52.5" y1="52.5" x2="60" y2="60" stroke="var(--primary)" stroke-width="2.5"/>
          </svg>
        </div>
        <h3 class="empty-state-title">未匹配到相关在线工具</h3>
        <p class="empty-state-desc">未能在此页面找到相关工具，可在全站深度搜索中查找文章、开源项目与代码。</p>
        <div class="empty-actions-row" style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; margin-top: 1rem;">
          <button type="button" class="empty-state-reset-btn" id="tools-empty-reset-btn">
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
          inputId: 'tools-filter-input',
          pillSelector: '.nav-pill-btn',
          cardSelector: '.nav-repo-card',
          sectionSelector: '.nav-category-section',
          emptyId: 'tools-empty-state',
          countId: 'tools-count-badge',
          typeName: '实用工具'
        });
      }
    });`;

  return renderBaseLayout({
    title: `工具导航 · ${blogConfig.siteName}`,
    description: `精选收录高价值开发者在线工具、数据格式化、图像压缩与云端开发利器`,
    keywords: `工具导航, 在线工具, MQTTX, JSON格式化, 图片压缩, 开发效能, ${blogConfig.siteName}`,
    canonicalPath: 'tools.html',
    sidebarHtml,
    mainContentHtml,
    inlineScripts,
    isSubfolder: false
  });
}

module.exports = { renderToolsLayout };

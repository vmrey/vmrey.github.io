/**
 * 公共左侧常驻侧边栏组件 (Global Sidebar Navigation Component)
 */
function renderSidebar({
  isSubfolder = false,
  activePage = 'home', // 'home' | 'files' | 'about' | 'post'
  blogConfig,
  categoryStats,
  resourceFilesCount = 10
}) {
  const homeUrl = isSubfolder ? '../index.html' : 'index.html';
  const aboutUrl = isSubfolder ? '../about.html' : 'about.html';
  const filesUrl = isSubfolder ? '../files.html' : 'files.html';

  const iconSvgs = {
    '前端开发': `<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>`,
    'Linux 与服务端': `<rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>`,
    '效率工具与软件': `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>`
  };

  const isLinkMode = isSubfolder || activePage !== 'home';

  let navCategoriesHtml = `        <!-- 导航分组 1：分类专栏 (支持多层级子专栏) -->
        <div class="sidebar-nav-group">
          <div class="nav-group-title">文章专栏</div>
          
          <!-- 全部文章 -->
          <${isLinkMode ? 'a href="' + homeUrl + '"' : 'button type="button"'} class="sidebar-nav-item ${isLinkMode ? '' : 'active'} category-filter-btn" data-tag="all" data-label="全部文章" title="全部文章">
            <span class="nav-item-left">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <span class="nav-item-text">全部文章</span>
            </span>
          </${isLinkMode ? 'a' : 'button'}>
`;

  blogConfig.categories.forEach(cat => {
    const parentCount = categoryStats[cat.name] || 0;
    if (parentCount === 0) return; // 0 篇文章的父专栏自动剔除不显示

    const catIcon = iconSvgs[cat.name] || `<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>`;
    const catLinkHref = isLinkMode ? `${homeUrl}?tag=${encodeURIComponent(cat.tag)}` : '';
    
    const validChildren = (cat.children || []).filter(sub => {
      const subCount = categoryStats[sub.name] || 0;
      return subCount > 0; // 0 篇文章的子专栏自动剔除不显示
    });

    if (validChildren.length === 0) {
      navCategoriesHtml += `
          <!-- 专栏：${cat.name} -->
          <${isLinkMode ? 'a href="' + catLinkHref + '"' : 'button type="button"'} class="sidebar-nav-item category-filter-btn" data-tag="${cat.tag}" data-label="${cat.name}" title="${cat.name}">
            <span class="nav-item-left">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${catIcon}</svg>
              <span class="nav-item-text">${cat.name}</span>
            </span>
          </${isLinkMode ? 'a' : 'button'}>
`;
    } else {
      let childrenHtml = validChildren.map(sub => {
        const subLinkHref = isLinkMode ? `${homeUrl}?tag=${encodeURIComponent(sub.tag)}` : '';
        return `              <${isLinkMode ? 'a href="' + subLinkHref + '"' : 'button type="button"'} class="subtree-item category-filter-btn" data-tag="${sub.tag}" data-label="${sub.name}" title="${sub.name}">
                <span class="subtree-item-left">
                  <span class="subtree-item-dot"></span>
                  <span class="subtree-item-name">${sub.name}</span>
                </span>
              </${isLinkMode ? 'a' : 'button'}>`;
      }).join('\n');

      navCategoriesHtml += `
          <!-- 专栏：${cat.name} -->
          <div class="nav-item-tree open">
            <div class="tree-header-row">
              <${isLinkMode ? 'a href="' + catLinkHref + '"' : 'button type="button"'} class="sidebar-nav-item category-filter-btn" data-tag="${cat.tag}" data-label="${cat.name}" title="${cat.name}">
                <span class="nav-item-left">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${catIcon}</svg>
                  <span class="nav-item-text">${cat.name}</span>
                </span>
              </${isLinkMode ? 'a' : 'button'}>
              <button type="button" class="subtree-toggle-btn" aria-label="展开或折叠${cat.name}子菜单" title="展开或折叠${cat.name}">
                <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>
            <div class="nav-subtree">
${childrenHtml}
            </div>
          </div>
`;
    }
  });

  navCategoriesHtml += `        </div>`;

  return `    <!-- 左侧常驻导航 -->
    <aside class="app-sidebar" id="app-sidebar">
      <!-- 顶部固定区域：Logo、标题与全局搜索 -->
      <div class="sidebar-header-section">
        <div class="sidebar-header-row">
          <a href="${homeUrl}" class="sidebar-brand">
            <div class="sidebar-avatar" title="${blogConfig.siteName} 博客">
              <svg class="sidebar-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                <line x1="9" y1="7" x2="15" y2="7"></line>
                <line x1="9" y1="11" x2="13" y2="11"></line>
              </svg>
            </div>
            <div class="sidebar-info">
              <div class="sidebar-name">${blogConfig.siteName}</div>
              <div class="sidebar-tagline">${blogConfig.tagline}</div>
            </div>
          </a>
          <button type="button" id="sidebar-collapse-btn" class="sidebar-collapse-btn" title="折叠/展开侧边栏 (PC)" aria-label="折叠侧边栏">
            <svg class="collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>

        <!-- 左侧全局搜索快捷入口 (支持 ⌘K) -->
        <button class="sidebar-search-btn open-search-modal" type="button" title="全站深度全文搜索 (Cmd+K)">
          <span class="search-btn-left">
            <svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span class="search-btn-text">全文搜索...</span>
          </span>
          <kbd class="kbd-badge">⌘K</kbd>
        </button>
      </div>

      <!-- 侧边栏菜单列表 -->
      <div class="sidebar-nav-body">
${navCategoriesHtml}

        <div class="sidebar-nav-group">
          <div class="nav-group-title">导航与资源</div>
          <a href="${filesUrl}" class="sidebar-nav-item ${activePage === 'files' ? 'active' : ''}" title="资源文件库">
            <span class="nav-item-left">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
              <span class="nav-item-text">资源文件库</span>
            </span>
          </a>
          <a href="${aboutUrl}" class="sidebar-nav-item ${activePage === 'about' ? 'active' : ''}" title="关于本站">
            <span class="nav-item-left">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span class="nav-item-text">关于本站</span>
            </span>
          </a>
          <a href="${blogConfig.githubUrl}" target="_blank" rel="noopener noreferrer" class="sidebar-nav-item" title="GitHub 源码">
            <span class="nav-item-left">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0 9 18.13V22"></path></svg>
              <span class="nav-item-text">GitHub 源码</span>
            </span>
          </a>
        </div>
      </div>

      <!-- 底部区域：主题切换与版权声明 -->
      <div class="sidebar-footer">
        <div class="theme-toggle-row">
          <span id="theme-mode-text">深色模式</span>
          <button id="theme-toggle" class="theme-toggle-btn" type="button" title="切换主题外观"></button>
        </div>
        <div class="sidebar-copyright">
          © ${blogConfig.startYear}-<span class="current-year">${new Date().getFullYear()}</span> ${blogConfig.siteName}<br>${blogConfig.copyrightNotice}
        </div>
      </div>
    </aside>`;
}

module.exports = { renderSidebar };

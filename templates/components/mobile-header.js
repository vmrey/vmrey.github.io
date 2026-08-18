/**
 * 公共移动端顶部导航栏组件 (Mobile Header & Drawer Overlay Component)
 */
function renderMobileHeader(siteName = 'vmrey.github.io') {
  return `  <!-- 移动端顶部标题导航条 -->
  <div class="mobile-header">
    <div class="mobile-title-wrap">
      <svg class="mobile-book-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        <line x1="9" y1="7" x2="15" y2="7"></line>
        <line x1="9" y1="11" x2="13" y2="11"></line>
      </svg>
      <div class="mobile-title">${siteName}</div>
    </div>
    <button id="menu-toggle-btn" class="menu-toggle-btn" aria-label="切换侧边栏菜单">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
  </div>

  <div id="sidebar-overlay" class="sidebar-overlay"></div>`;
}

module.exports = { renderMobileHeader };

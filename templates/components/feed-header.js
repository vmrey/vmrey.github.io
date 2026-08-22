/**
 * 公共列表流头部组件 (Feed Header & In-page Filter Box Component)
 */
function renderFeedHeader({
  title = '全部文章',
  totalCount = 27,
  pageSize = 8,
  placeholder = '搜索当前列表文章标题、正文、标签...'
}) {
  return `      <header class="feed-header">
        <div class="feed-title-wrap">
          <div class="feed-title-row">
            <h1 id="feed-header-title">${title}</h1>
            <div class="feed-stats-pills">
              <span class="stat-pill highlight" id="feed-stat-count">共 ${totalCount} 篇内容</span>
              <span class="stat-pill" id="feed-stat-pagesize">每页 ${pageSize} 条</span>
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
            id="feed-search-input" 
            class="search-input" 
            placeholder="${placeholder}" 
            aria-label="过滤文章列表"
            autocomplete="off"
            enterkeyhint="search"
          >
        </div>
      </header>`;
}

module.exports = { renderFeedHeader };

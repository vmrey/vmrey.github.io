/**
 * 公共空状态矢量卡片组件 (Empty State Card Component)
 */
function renderEmptyState({
  id = 'no-results',
  title = '暂无更多内容',
  desc = '当前专栏暂无发布文章，博主正在持续整理撰写中',
  hidden = true
}) {
  return `      <!-- 空结果提示 -->
      <div id="${id}" class="empty-state-card" style="display: ${hidden ? 'none' : 'flex'};">
        <div class="empty-state-illustration">
          <div class="empty-state-glow"></div>
          <svg class="empty-state-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="14" y="8" width="36" height="48" rx="6" stroke-dasharray="4 4" opacity="0.6"/>
            <path d="M22 22h20M22 30h14M22 38h8" opacity="0.4"/>
            <circle cx="44" cy="44" r="12" fill="var(--surface)" stroke="var(--primary)" stroke-width="2"/>
            <line x1="52.5" y1="52.5" x2="60" y2="60" stroke="var(--primary)" stroke-width="2.5"/>
          </svg>
        </div>
        <h3 class="empty-state-title" id="empty-state-title">${title}</h3>
        <p class="empty-state-desc" id="empty-state-desc">${desc}</p>
        <button type="button" class="empty-state-reset-btn" id="empty-state-reset-btn">
          <span>浏览全部文章</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>`;
}

module.exports = { renderEmptyState };

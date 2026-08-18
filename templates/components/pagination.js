/**
 * 公共分页容器占位与结构组件 (Pagination Container Component)
 */
function renderPaginationContainer(id = 'pagination-container') {
  return `      <!-- 分页导航挂载容器 -->
      <div id="${id}" class="pagination-container"></div>`;
}

module.exports = { renderPaginationContainer };

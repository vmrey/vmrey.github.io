/**
 * 文章详情页目录大纲 (Sticky TOC Component)
 */
function renderToc(headings = []) {
  if (!headings || headings.length === 0) {
    return '';
  }

  const tocLinksHtml = headings.map(h => {
    return `            <li>
              <a href="#${h.id}" class="toc-link" title="${h.title}">${h.title}</a>
            </li>`;
  }).join('\n');

  return `        <!-- 右侧文章大纲 TOC -->
        <aside class="article-toc-panel" aria-label="文章目录大纲">
          <div class="toc-box">
            <div class="toc-box-title">本页导读 · 快速直达</div>
            <ul class="toc-list">
${tocLinksHtml}
            </ul>
          </div>
        </aside>`;
}

module.exports = { renderToc };

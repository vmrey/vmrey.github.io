// 全局全功能全文搜索引擎 (Full-Text Search Engine with Modal & Highlighting)
(function initSearch() {
  // 注入全局搜索弹窗 HTML 模板
  function createSearchModal() {
    if (document.getElementById('search-modal-container')) return;

    const modalHTML = `
      <div id="search-modal-container" class="search-modal-backdrop" style="display: none;" aria-hidden="true">
        <div class="search-modal-dialog" role="dialog" aria-modal="true" aria-label="全站全文搜索">
          <!-- 搜索输入框头部 -->
          <div class="search-modal-header">
            <svg class="search-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="global-search-input" class="search-modal-input" placeholder="搜索文章标题、正文内容、标签、专栏..." autocomplete="off" spellcheck="false">
            <button id="search-modal-close" class="search-modal-close-btn" title="关闭搜索" aria-label="关闭搜索">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- 搜索结果状态栏 -->
          <div class="search-modal-status" id="search-modal-status">
            <span id="search-status-text">输入关键词开始全站深度搜索（支持标题、正文、代码、标签）</span>
            <span id="search-shortcut-hint" class="search-shortcut-hint">
              <kbd>↑</kbd> <kbd>↓</kbd> 导航 <kbd>↵</kbd> 打开
            </span>
          </div>

          <!-- 搜索结果列表容器 -->
          <div class="search-modal-results" id="search-modal-results">
            <!-- 初始推荐热词/分类 -->
            <div class="search-quick-tags" id="search-quick-tags">
              <div class="quick-tags-title">热门标签与专栏检索</div>
              <div class="quick-tags-list">
                <button class="quick-tag-chip" data-query="Vue">#Vue</button>
                <button class="quick-tag-chip" data-query="JavaScript">#JavaScript</button>
                <button class="quick-tag-chip" data-query="Docker">#Docker</button>
                <button class="quick-tag-chip" data-query="Linux">#Linux</button>
                <button class="quick-tag-chip" data-query="Nginx">#Nginx</button>
                <button class="quick-tag-chip" data-query="Claude">#Claude</button>
                <button class="quick-tag-chip" data-query="性能优化">#性能优化</button>
                <button class="quick-tag-chip" data-query="微信小程序">#微信小程序</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  document.addEventListener('DOMContentLoaded', () => {
    createSearchModal();

    const modalContainer = document.getElementById('search-modal-container');
    const searchInput = document.getElementById('global-search-input');
    const closeBtn = document.getElementById('search-modal-close');
    const resultsContainer = document.getElementById('search-modal-results');
    const statusText = document.getElementById('search-status-text');
    const quickTagsContainer = document.getElementById('search-quick-tags');

    let selectedResultIndex = -1;
    let currentResults = [];

    // 检测当前页面相对根目录的路径前缀（若在 posts/ 目录下，链接需要加相对处理）
    const isPostsPage = window.location.pathname.includes('/posts/');
    const pathPrefix = isPostsPage ? '../' : '';

    function openSearchModal(initialQuery = '') {
      modalContainer.style.display = 'flex';
      modalContainer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      searchInput.value = initialQuery;
      searchInput.focus();
      if (initialQuery) {
        performSearch(initialQuery);
      } else {
        renderInitialState();
      }
    }

    // 暴露全局方法方便在各页面无缝唤起全站深度检索
    window.openSearchModal = openSearchModal;

    function closeSearchModal() {
      modalContainer.style.display = 'none';
      modalContainer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      searchInput.value = '';
      selectedResultIndex = -1;
    }

    // 绑定全局快捷键 (Cmd+K / Ctrl+K / '/' 打开搜索)
    document.addEventListener('keydown', (e) => {
      if (e.isComposing || e.keyCode === 229) return;
      // Cmd+K 或 Ctrl+K 仅负责打开，不通过快捷键关闭
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modalContainer.style.display !== 'flex') {
          openSearchModal();
        }
      }

      // 未聚焦在输入框时按 '/' 打开
      if (e.key === '/' && modalContainer.style.display !== 'flex') {
        const activeTagName = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTagName !== 'input' && activeTagName !== 'textarea') {
          e.preventDefault();
          openSearchModal();
        }
      }

      // 搜索列表键盘上下键与回车导航
      if (modalContainer.style.display === 'flex' && currentResults.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          selectedResultIndex = (selectedResultIndex + 1) % currentResults.length;
          updateSelectedResult();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          selectedResultIndex = (selectedResultIndex - 1 + currentResults.length) % currentResults.length;
          updateSelectedResult();
        } else if (e.key === 'Enter' && selectedResultIndex >= 0) {
          e.preventDefault();
          const selectedItem = currentResults[selectedResultIndex];
          if (selectedItem && selectedItem.targetUrl) {
            navigateToResult(selectedItem.targetUrl);
          }
        }
      }
    });

    function formatTargetUrl(rawUrl) {
      if (!rawUrl) return '#';
      if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
        return rawUrl;
      }
      return pathPrefix + rawUrl;
    }

    // 核心统一导航与弹窗关闭调度
    function navigateToResult(rawUrl) {
      if (!rawUrl || rawUrl === '#') return;
      
      // 1. 立即关闭搜索弹窗并恢复页面正常滚动
      closeSearchModal();

      const formattedUrl = formatTargetUrl(rawUrl);

      // 2. 如果是外部完整链接直接跳转
      if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
        window.location.href = rawUrl;
        return;
      }

      // 3. 判断是否为同页面锚点定位
      const currentPath = window.location.pathname.replace(/^\/+/, '').split('#')[0].split('?')[0] || 'index.html';
      const cleanTarget = rawUrl.replace(/^\.\.\//, '').replace(/^\/+/, '');
      const [targetPath, targetHash] = cleanTarget.split('#');

      const isCurrentPage = (
        currentPath === targetPath ||
        (currentPath === '' && targetPath === 'index.html') ||
        (currentPath === 'index.html' && targetPath === 'index.html')
      );

      if (isCurrentPage && targetHash) {
        if (window.location.hash !== `#${targetHash}`) {
          window.location.hash = `#${targetHash}`;
        }
        if (typeof window.handleNavHashHighlight === 'function') {
          window.handleNavHashHighlight(targetHash);
        }
      } else {
        window.location.href = formattedUrl;
      }
    }

    // 仅允许通过关闭按钮关闭搜索弹窗（背景遮罩、Esc 均不误关）
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSearchModal();
      });
    }

    // 搜索结果列表点击事件委托（点击条目立即跳转并关闭弹窗）
    if (resultsContainer) {
      resultsContainer.addEventListener('click', (e) => {
        // 若点击的是直达官网外链按钮，允许在新标签页打开，不拦截
        if (e.target.closest('.search-res-external-btn')) {
          return;
        }

        const resultItem = e.target.closest('.search-result-item');
        if (!resultItem) return;

        const targetIdx = parseInt(resultItem.getAttribute('data-index'), 10);
        const selectedItem = currentResults[targetIdx];
        const targetUrl = (selectedItem && selectedItem.targetUrl) || resultItem.getAttribute('href');

        if (targetUrl) {
          e.preventDefault();
          navigateToResult(targetUrl);
        }
      });
    }

    // 绑定页面中所有搜索触发按钮
    document.querySelectorAll('.open-search-modal, #search-input, .sidebar-search-btn').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openSearchModal(el.value || '');
      });
    });

    // 绑定带预设关键词的全局搜索触发器 (如各页面空状态下的全站深度搜索按钮)
    document.addEventListener('click', (e) => {
      const queryTrigger = e.target.closest('.open-search-modal-with-query');
      if (queryTrigger) {
        e.preventDefault();
        const query = queryTrigger.getAttribute('data-query') || '';
        openSearchModal(query);
      }
    });

    // 热门标签点击直达搜索
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-tag-chip')) {
        const query = e.target.getAttribute('data-query');
        searchInput.value = query;
        performSearch(query);
      }
    });

    function renderInitialState() {
      currentResults = [];
      selectedResultIndex = -1;
      statusText.innerHTML = '输入关键词开始全站深度搜索（支持文章、AI 工具、实用工具、GitHub 项目与资源）';
      resultsContainer.innerHTML = `
        <div class="search-quick-tags">
          <div class="quick-tags-title">热门标签与专栏检索</div>
          <div class="quick-tags-list">
            <button class="quick-tag-chip" data-query="Vue">#Vue</button>
            <button class="quick-tag-chip" data-query="JavaScript">#JavaScript</button>
            <button class="quick-tag-chip" data-query="Docker">#Docker</button>
            <button class="quick-tag-chip" data-query="Linux">#Linux</button>
            <button class="quick-tag-chip" data-query="Nginx">#Nginx</button>
            <button class="quick-tag-chip" data-query="Claude">#Claude</button>
            <button class="quick-tag-chip" data-query="节点生成器">#节点生成器</button>
            <button class="quick-tag-chip" data-query="性能优化">#性能优化</button>
          </div>
        </div>
      `;
    }

    // 核心全文搜索算法
    function performSearch(rawQuery) {
      const query = rawQuery.trim().toLowerCase();
      if (!query) {
        renderInitialState();
        return;
      }

      const keywords = query.split(/\s+/).filter(k => k.length > 0);
      const indexData = window.BLOG_SEARCH_INDEX || window.SEARCH_DATABASE || [];
      const matchedResults = [];

      indexData.forEach(article => {
        let score = 0;
        const matchedSections = [];
        let contextSnippet = '';

        const title = article.title || '';
        const summary = article.summary || '';
        const content = article.fullText || article.content || '';
        const tags = Array.isArray(article.tags) ? article.tags : [];
        const category = article.category || '';

        const titleLower = title.toLowerCase();
        const summaryLower = summary.toLowerCase();
        const contentLower = content.toLowerCase();
        const tagsLower = tags.map(t => (t || '').toLowerCase());
        const categoryLower = category.toLowerCase();

        // 逐个关键词匹配加权打分
        keywords.forEach(kw => {
          // 1. 标题匹配（最高权重）
          if (titleLower.includes(kw)) {
            score += 120;
          }

          // 2. 标签 / 专栏分类匹配
          if (tagsLower.some(t => t.includes(kw)) || categoryLower.includes(kw)) {
            score += 60;
          }

          // 3. 摘要匹配
          if (summaryLower.includes(kw)) {
            score += 40;
          }

          // 4. 正文各章节标题匹配
          if (Array.isArray(article.sections) && article.sections.length > 0) {
            article.sections.forEach(sec => {
              const secTitle = sec.title || '';
              const secTitleLower = secTitle.toLowerCase();
              
              if (secTitleLower.includes(kw)) {
                score += 35;
                if (!matchedSections.find(s => s.anchor === sec.anchor || s.title === sec.title)) {
                  matchedSections.push(sec);
                }
              }
            });
          }

          // 5. 正文全文泛匹配提取上下文摘要
          if (contentLower.includes(kw)) {
            score += 20;
            if (!contextSnippet) {
              contextSnippet = extractSnippet(content, kw);
            }
          }
        });

        if (score > 0) {
          // 默认上下文回退到文章摘要
          if (!contextSnippet) {
            contextSnippet = summary;
          }

          // 如果有匹配的具体小章节，优先生成章节锚点直达链接
          let targetUrl = article.url;
          if (matchedSections.length > 0 && !article.url.includes('#')) {
            const sec = matchedSections[0];
            const anchor = sec.anchor || (sec.id ? `#${sec.id}` : '');
            if (anchor) {
              targetUrl = `${article.url}${anchor.startsWith('#') ? anchor : '#' + anchor}`;
            }
          }

          matchedResults.push({
            article: article,
            score: score,
            matchedSections: matchedSections,
            contextSnippet: contextSnippet,
            targetUrl: targetUrl
          });
        }
      });

      // 按相关度得分从高到低排序
      matchedResults.sort((a, b) => b.score - a.score);
      currentResults = matchedResults;
      selectedResultIndex = matchedResults.length > 0 ? 0 : -1;

      renderResults(matchedResults, keywords);
    }

    // 提取包含关键词的前后完整上下文句子
    function extractSnippet(text, keyword, maxLen = 140) {
      if (!text) return '';
      if (text.length <= maxLen) return text;

      const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
      if (idx === -1) {
        return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
      }

      const start = Math.max(0, idx - 35);
      const end = Math.min(text.length, idx + keyword.length + 85);
      let snippet = text.substring(start, end);
      if (start > 0) snippet = '...' + snippet;
      if (end < text.length) snippet = snippet + '...';
      return snippet;
    }

    // 高亮文本中的关键词 (单次联合正则匹配与安全转义，杜绝 DOM 标签破坏与 XSS)
    function highlightKeywords(text, keywords) {
      if (!text) return '';
      const validKw = (keywords || []).map(k => (k || '').trim()).filter(Boolean);
      if (validKw.length === 0) return escapeHTML(text);

      // 按长度倒序排序，确保长词优先匹配
      const sortedKw = [...new Set(validKw)].sort((a, b) => b.length - a.length);
      const pattern = new RegExp(`(${sortedKw.map(escapeRegExp).join('|')})`, 'gi');

      const parts = text.split(pattern);
      return parts.map(part => {
        if (!part) return '';
        const isMatch = sortedKw.some(kw => kw.toLowerCase() === part.toLowerCase());
        if (isMatch) {
          return `<mark class="search-highlight">${escapeHTML(part)}</mark>`;
        }
        return escapeHTML(part);
      }).join('');
    }

    function escapeHTML(str) {
      return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const TYPE_BADGES = {
      post: { text: '📝 文章', cls: 'type-post' },
      page: { text: '⚡ 独立工具', cls: 'type-page' },
      ai: { text: '🤖 AI 导航', cls: 'type-ai' },
      tool: { text: '🛠️ 实用工具', cls: 'type-tool' },
      github: { text: '🐙 GitHub', cls: 'type-github' },
      file: { text: '📁 附件', cls: 'type-file' }
    };

    // 渲染搜索结果列表
    function renderResults(results, keywords) {
      if (results.length === 0) {
        statusText.innerHTML = `未找到与 “<strong>${escapeHTML(searchInput.value)}</strong>” 相关的全站内容`;
        resultsContainer.innerHTML = `
          <div class="search-no-results">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-subtle); margin-bottom: 0.75rem;">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <p>未匹配到任何结果</p>
            <span style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">建议缩短搜索词、尝试技术专栏名称或工具名称（如 Gemini / VLESS / Docker / Vue）。</span>
          </div>
        `;
        return;
      }

      statusText.innerHTML = `共找到 <strong>${results.length}</strong> 条相关结果（包含文章、AI 工具、开源项目与独立工具）`;

      let html = '<div class="search-results-list">';
      results.forEach((item, index) => {
        const art = item.article;
        const highlightedTitle = highlightKeywords(art.title, keywords);
        const highlightedSnippet = highlightKeywords(item.contextSnippet, keywords);
        const tagsHtml = (art.tags || []).map(t => `<span class="search-res-tag">${highlightKeywords(t, keywords)}</span>`).join('');
        
        const badgeInfo = TYPE_BADGES[art.type] || TYPE_BADGES.post;

        let extBtnHtml = '';
        if (art.externalUrl) {
          const isGitHub = art.type === 'github';
          const btnLabel = isGitHub ? '访问仓库' : '直达官网';
          extBtnHtml = `
            <a href="${art.externalUrl}" target="_blank" rel="noopener noreferrer" class="search-res-external-btn" title="在新标签页直接打开 ${escapeHTML(art.title)}" onclick="event.stopPropagation();">
              <span>${btnLabel}</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          `;
        }

        let sectionBadge = '';
        if (item.matchedSections.length > 0) {
          const sec = item.matchedSections[0];
          sectionBadge = `
            <div class="search-res-section-hint">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              <span>匹配章节：${highlightKeywords(sec.title, keywords)}</span>
            </div>
          `;
        }

        html += `
          <a href="${formatTargetUrl(item.targetUrl)}" class="search-result-item ${index === selectedResultIndex ? 'selected' : ''}" data-index="${index}">
            <div class="search-res-header">
              <div class="search-res-header-left">
                <span class="search-res-type-pill ${badgeInfo.cls}">${badgeInfo.text}</span>
                <span class="search-res-category">${escapeHTML(art.category || '文章')}</span>
              </div>
              <div class="search-res-header-right">
                ${extBtnHtml}
                <span class="search-res-date">${art.date}</span>
              </div>
            </div>
            <h3 class="search-res-title">${highlightedTitle}</h3>
            <p class="search-res-snippet">${highlightedSnippet}</p>
            ${sectionBadge}
            <div class="search-res-tags">${tagsHtml}</div>
          </a>
        `;
      });
      html += '</div>';

      resultsContainer.innerHTML = html;
      updateSelectedResult();
    }

    function updateSelectedResult() {
      const items = resultsContainer.querySelectorAll('.search-result-item');
      items.forEach((el, idx) => {
        if (idx === selectedResultIndex) {
          el.classList.add('selected');
          el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
          el.classList.remove('selected');
        }
      });
    }

    // 轻量级防抖函数
    function debounce(fn, delay = 100) {
      let timer = null;
      return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    }

    // 实时监听输入 (100ms 防抖 + 中文输入法选字防误触)
    if (searchInput) {
      let isInputComposing = false;
      searchInput.addEventListener('compositionstart', () => { isInputComposing = true; });
      searchInput.addEventListener('compositionend', (e) => {
        isInputComposing = false;
        performSearch(e.target.value);
      });

      searchInput.addEventListener('input', debounce((e) => {
        if (isInputComposing) return;
        performSearch(e.target.value);
      }, 100));

      // 按下回车键时立即同步执行搜索并直达首条匹配项（严格忽略中文输入法确认回车）
      searchInput.addEventListener('keydown', (e) => {
        if (e.isComposing || isInputComposing || e.keyCode === 229) return;
        if (e.key === 'Enter') {
          e.preventDefault();
          const query = searchInput.value.trim();
          if (query) {
            performSearch(query);
            if (currentResults.length > 0) {
              const targetIdx = selectedResultIndex >= 0 ? selectedResultIndex : 0;
              const selectedItem = currentResults[targetIdx];
              if (selectedItem && selectedItem.targetUrl) {
                navigateToResult(selectedItem.targetUrl);
              }
            }
          }
        }
      });
    }
  });
})();

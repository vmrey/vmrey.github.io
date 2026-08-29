// ==============================================================================
// 读取公共配置文件 window.BLOG_CONFIG
// ==============================================================================
const CONFIG = window.BLOG_CONFIG || {
  siteName: 'vmrey.github.io',
  tagline: '构建工具，写干净的代码',
  startYear: 2018,
  copyrightNotice: '用代码与文字记录探索',
  pageSize: 8,
  defaultTheme: 'dark',
  githubUrl: 'https://github.com/vmrey/vmrey.github.io'
};

// Theme Controller (初次访问自动匹配系统外观，手动点击支持经典的深色/浅色两态切换)
(function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    // 首次未手动设置时，智能跟随系统
    const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const configDefault = (window.BLOG_CONFIG && window.BLOG_CONFIG.defaultTheme) || 'auto';
    let theme = 'dark';
    if (configDefault === 'auto') {
      theme = isSystemDark ? 'dark' : 'light';
    } else {
      theme = configDefault;
    }
    document.documentElement.setAttribute('data-theme', theme);
  }

  // 监听系统外观实时变化（仅在未手动锁定时自动随系统改变）
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        if (typeof window.updateThemeUI === 'function') {
          window.updateThemeUI(newTheme);
        }
      }
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemChange);
    }
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // 1. 同步站点全局信息 (名称、描述、起步年份区间、页脚)
  const currentYear = new Date().getFullYear();
  const startYear = CONFIG.startYear || 2018;
  const yearText = startYear >= currentYear ? `${currentYear}` : `${startYear}-${currentYear}`;
  
  document.querySelectorAll('.sidebar-name').forEach(el => {
    if (CONFIG.siteName) el.textContent = CONFIG.siteName;
  });
  
  document.querySelectorAll('.sidebar-tagline').forEach(el => {
    if (CONFIG.tagline) el.textContent = CONFIG.tagline;
  });

  document.querySelectorAll('.sidebar-copyright').forEach(el => {
    el.innerHTML = `© ${yearText} ${CONFIG.siteName || 'vmrey.github.io'}<br>${CONFIG.copyrightNotice || '用代码与文字记录探索'}`;
  });

  // 2. PC & Mobile Sidebar Toggle Controller
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const sidebar = document.getElementById('app-sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebarCollapseBtn = document.getElementById('sidebar-collapse-btn');

  // 初始化 PC 侧边栏折叠状态（记忆用户上次设置）
  const savedSidebarCollapsed = localStorage.getItem('sidebar_collapsed');
  if (savedSidebarCollapsed === 'true' && window.innerWidth > 900) {
    document.body.classList.add('sidebar-collapsed');
  }

  if (sidebarCollapseBtn) {
    sidebarCollapseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
      localStorage.setItem('sidebar_collapsed', isCollapsed ? 'true' : 'false');
    });
  }

  function toggleSidebar(open) {
    if (!sidebar) return;
    if (open) {
      sidebar.classList.add('open');
      if (sidebarOverlay) sidebarOverlay.classList.add('open');
    } else {
      sidebar.classList.remove('open');
      if (sidebarOverlay) sidebarOverlay.classList.remove('open');
    }
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('open');
      toggleSidebar(!isOpen);
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => toggleSidebar(false));
  }

  // 3. Theme Toggle Controller (经典两态切换：深色模式 ↔ 浅色模式)
  const themeToggle = document.getElementById('theme-toggle');
  const themeText = document.getElementById('theme-mode-text');

  function updateThemeDisplay(theme) {
    if (!themeToggle) return;
    const isDark = theme === 'dark';

    themeToggle.innerHTML = isDark 
      ? `<svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" title="切换至浅色模式"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" title="切换至深色模式"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    
    if (themeText) {
      themeText.textContent = isDark ? '深色模式' : '浅色模式';
    }
  }

  window.updateThemeUI = updateThemeDisplay;

  // 页面加载初始化显示
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  updateThemeDisplay(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const targetTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('theme', targetTheme);
      updateThemeDisplay(targetTheme);
    });
  }

  // 4. 展开 / 折叠子专栏按钮事件 (手风琴模式：每次只能打开一个，展开当前时关闭其余)
  const subtreeToggleBtns = document.querySelectorAll('.subtree-toggle-btn');
  subtreeToggleBtns.forEach(toggleBtn => {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const tree = toggleBtn.closest('.nav-item-tree');
      if (tree) {
        const willOpen = !tree.classList.contains('open');
        // 手风琴模式：先关闭所有其他专栏
        document.querySelectorAll('.nav-item-tree').forEach(otherTree => {
          if (otherTree !== tree) {
            otherTree.classList.remove('open');
          }
        });
        if (willOpen) {
          tree.classList.add('open');
        } else {
          tree.classList.remove('open');
        }
      }
    });
  });

  // =========================================================================
  // Article Filter & Pagination Controller (读取 CONFIG.pageSize + 翻页 + 精准页码跳转)
  // =========================================================================
  const PAGE_SIZE = Number(CONFIG.pageSize) || 8;
  let currentPage = 1;

  const searchInput = document.getElementById('feed-search-input') || document.getElementById('search-input');
  const allFilterBtns = Array.from(document.querySelectorAll('.category-filter-btn'));
  const postBlocks = Array.from(document.querySelectorAll('.post-block'));
  const noResults = document.getElementById('no-results');
  const feedHeaderTitle = document.getElementById('feed-header-title');
  const paginationContainer = document.getElementById('pagination-container');

  let activeTag = 'all';
  let searchQuery = '';

  function scrollToFeedTop() {
    const feedHeader = document.querySelector('.feed-header');
    if (feedHeader) {
      feedHeader.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function renderPage() {
    const activeBtn = document.querySelector('.category-filter-btn.active');
    let displayTitle = '全部文章';
    if (activeBtn) {
      displayTitle = activeBtn.getAttribute('data-label') || (activeTag === 'all' ? '全部文章' : activeTag);
    }

    const matchedBlocks = postBlocks.filter(block => {
      const title = (block.getAttribute('data-title') || '').toLowerCase();
      const summary = (block.getAttribute('data-summary') || '').toLowerCase();
      const category = (block.getAttribute('data-category') || '').toLowerCase();
      const subcategory = (block.getAttribute('data-subcategory') || '').toLowerCase();
      const tags = (block.getAttribute('data-tags') || '').split(',').map(t => t.trim().toLowerCase());
      
      const matchesSearch = !searchQuery || 
        title.includes(searchQuery) || 
        summary.includes(searchQuery) || 
        category.includes(searchQuery) ||
        subcategory.includes(searchQuery) ||
        tags.some(t => t.includes(searchQuery));

      const cleanActive = activeTag.toLowerCase();
      const matchesTag = activeTag === 'all' || 
        category === cleanActive || 
        (cleanActive.length >= 2 && category.includes(cleanActive)) ||
        subcategory === cleanActive ||
        (cleanActive.length >= 2 && subcategory.includes(cleanActive)) ||
        tags.some(t => {
          const cleanT = t.toLowerCase();
          return cleanT === cleanActive || (cleanActive.length >= 2 && cleanT.includes(cleanActive)) || (cleanT.length >= 2 && cleanActive.includes(cleanT));
        });

      return matchesSearch && matchesTag;
    });

    const totalCount = matchedBlocks.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    if (currentPage < 1) {
      currentPage = 1;
    }

    postBlocks.forEach(b => { b.style.display = 'none'; });

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const currentSlice = matchedBlocks.slice(startIndex, endIndex);

    currentSlice.forEach(b => {
      b.style.display = '';
    });

    if (noResults) {
      if (totalCount === 0) {
        noResults.style.display = 'flex';
        const emptyTitleEl = document.getElementById('empty-state-title');
        const emptyDescEl = document.getElementById('empty-state-desc');
        if (searchQuery) {
          if (emptyTitleEl) emptyTitleEl.textContent = '未检索到相关内容';
          if (emptyDescEl) emptyDescEl.textContent = `未能找到包含 "${searchQuery}" 的文章，请尝试更换关键词或专栏`;
        } else {
          if (emptyTitleEl) emptyTitleEl.textContent = '暂无更多内容';
          if (emptyDescEl) emptyDescEl.textContent = `当前「${displayTitle}」专栏暂无更多发布文章，博主正在持续整理撰写中`;
        }
      } else {
        noResults.style.display = 'none';
      }
    }

    if (feedHeaderTitle) {
      feedHeaderTitle.textContent = displayTitle;

      const statCount = document.getElementById('feed-stat-count');
      if (statCount) {
        statCount.textContent = `共 ${totalCount} 篇内容`;
      }

      const statPageSize = document.getElementById('feed-stat-pagesize');
      if (statPageSize) {
        statPageSize.textContent = `每页 ${PAGE_SIZE} 条`;
      }
    }

    // 渲染翻页控制器
    renderPagination(totalCount, totalPages);
  }

  function renderPagination(totalCount, totalPages) {
    if (!paginationContainer) return;

    if (totalCount === 0) {
      paginationContainer.innerHTML = '';
      return;
    }

    let paginationHTML = `
      <div class="pagination-info">
        共 <strong>${totalCount}</strong> 篇 · 第 <strong>${currentPage}</strong> / <strong>${totalPages}</strong> 页
      </div>
      <div class="pagination-main-wrap">
        <div class="pagination-controls">
          <button class="page-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}" title="上一页">
            ← 上一页
          </button>
    `;

    // 智能数字页码
    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
        paginationHTML += `
          <button class="page-btn num-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">
            ${p}
          </button>
        `;
      } else if (p === currentPage - 2 || p === currentPage + 2) {
        paginationHTML += `<span class="page-ellipsis">...</span>`;
      }
    }

    paginationHTML += `
          <button class="page-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}" title="下一页">
            下一页 →
          </button>
        </div>
    `;

    // 如果总页数大于 1，展示“跳转页码”组件
    if (totalPages > 1) {
      paginationHTML += `
        <div class="page-jump-group">
          <span>跳至</span>
          <input type="number" min="1" max="${totalPages}" class="page-jump-input" id="page-jump-input" placeholder="${currentPage}" aria-label="输入页码">
          <span>/ ${totalPages} 页</span>
          <button class="page-jump-btn" id="page-jump-btn" type="button">确定</button>
        </div>
      `;
    }

    paginationHTML += `</div>`;

    paginationContainer.innerHTML = paginationHTML;

    // 绑定普通翻页按钮事件
    paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled || btn.classList.contains('active')) return;
        const targetPage = parseInt(btn.getAttribute('data-page'), 10);
        if (targetPage >= 1 && targetPage <= totalPages) {
          currentPage = targetPage;
          renderPage();
          scrollToFeedTop();
        }
      });
    });

    // 绑定跳页事件
    const jumpInput = document.getElementById('page-jump-input');
    const jumpBtn = document.getElementById('page-jump-btn');

    function executeJump() {
      if (!jumpInput) return;
      let targetPage = parseInt(jumpInput.value.trim(), 10);
      if (isNaN(targetPage)) {
        jumpInput.focus();
        return;
      }

      // 智能边界处理
      if (targetPage < 1) targetPage = 1;
      if (targetPage > totalPages) targetPage = totalPages;

      if (targetPage !== currentPage) {
        currentPage = targetPage;
        renderPage();
        scrollToFeedTop();
      }
    }

    if (jumpBtn) {
      jumpBtn.addEventListener('click', executeJump);
    }

    if (jumpInput) {
      let isJumpComposing = false;
      jumpInput.addEventListener('compositionstart', () => { isJumpComposing = true; });
      jumpInput.addEventListener('compositionend', () => { isJumpComposing = false; });
      jumpInput.addEventListener('keydown', (e) => {
        if (e.isComposing || isJumpComposing || e.keyCode === 229) return;
        if (e.key === 'Enter') {
          e.preventDefault();
          executeJump();
        }
      });
    }
  }

  // 轻量级通用防抖工具函数
  function debounce(fn, delay = 120) {
    let timer = null;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // 搜索框实时输入监听 (120ms 防抖 + 中文输入法选字防误触)
  if (searchInput) {
    let isSearchComposing = false;
    searchInput.addEventListener('compositionstart', () => { isSearchComposing = true; });
    searchInput.addEventListener('compositionend', (e) => {
      isSearchComposing = false;
      searchQuery = (e.target.value || '').trim().toLowerCase();
      currentPage = 1;
      renderPage();
    });

    searchInput.addEventListener('input', debounce((e) => {
      if (isSearchComposing) return;
      searchQuery = e.target.value.trim().toLowerCase();
      currentPage = 1;
      renderPage();
    }, 120));

    // 按下回车键时立即同步执行过滤（严格忽略中文输入法拼音确认回车）
    searchInput.addEventListener('keydown', (e) => {
      if (e.isComposing || isSearchComposing || e.keyCode === 229) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        searchQuery = e.target.value.trim().toLowerCase();
        currentPage = 1;
        renderPage();
        searchInput.blur();
        scrollToFeedTop();
      }
    });
  }

  // 点击搜索外框任意位置或放大镜图标自动聚焦输入框
  document.querySelectorAll('.search-box-wrap').forEach(wrap => {
    wrap.addEventListener('click', (e) => {
      const input = wrap.querySelector('input');
      if (input && e.target !== input) {
        input.focus();
      }
    });
  });

  // 同步专栏折叠树是否包含激活子项的状态（用于在折叠时精准高亮指示箭头）
  function syncTreeActiveState() {
    document.querySelectorAll('.nav-item-tree').forEach(tree => {
      const hasActiveChild = !!tree.querySelector('.subtree-item.active');
      tree.classList.toggle('has-active-child', hasActiveChild);
    });
  }

  // 空状态快捷按钮：一键重置筛选并返回全部文章
  const emptyResetBtn = document.getElementById('empty-state-reset-btn') || document.getElementById('empty-reset-btn');
  if (emptyResetBtn) {
    emptyResetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      const allBtn = document.querySelector('.category-filter-btn[data-tag="all"]');
      if (allBtn) {
        allBtn.click();
      } else {
        allFilterBtns.forEach(b => b.classList.remove('active'));
        activeTag = 'all';
        currentPage = 1;
        syncTreeActiveState();
        renderPage();
      }
      scrollToFeedTop();
    });
  }

  // 根据 URL 查询参数激活对应分类 (仅在首页文章列表流有效)
  function applyCategoryFromUrl() {
    if (postBlocks.length === 0) return;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryTag = (urlParams.get('tag') || urlParams.get('cat') || '').trim();
      let matchedBtn = null;
      if (queryTag) {
        allFilterBtns.forEach(btn => {
          const btnTag = (btn.getAttribute('data-tag') || '').toLowerCase();
          const btnLabel = (btn.getAttribute('data-label') || '').toLowerCase();
          const target = queryTag.toLowerCase();
          if (btnTag === target || btnLabel === target) {
            matchedBtn = btn;
          }
        });
      }
      if (!matchedBtn) {
        matchedBtn = document.querySelector('.category-filter-btn[data-tag="all"]');
      }

      if (matchedBtn) {
        allFilterBtns.forEach(b => b.classList.remove('active'));
        matchedBtn.classList.add('active');
        activeTag = matchedBtn.getAttribute('data-tag') || 'all';
        const tree = matchedBtn.closest('.nav-item-tree');
        if (tree) tree.classList.add('open');
      }
      syncTreeActiveState();
    } catch (e) {
      console.warn('URLSearchParams parse error:', e);
    }
  }

  // 分类与子分类点击筛选 (仅在有文章列表流的首页 index.html 启用就地无刷新筛选)
  if (postBlocks.length > 0) {
    applyCategoryFromUrl();

    // 监听浏览器前进/后退 (popstate) 保持视图与 URL 同步
    window.addEventListener('popstate', () => {
      applyCategoryFromUrl();
      currentPage = 1;
      renderPage();
    });

    allFilterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // 如果是 a 标签链接（非当前页就地筛选），让其正常跳转
        if (btn.tagName.toLowerCase() === 'a') return;

        const targetTag = btn.getAttribute('data-tag') || 'all';
        const isAlreadyActive = btn.classList.contains('active');
        const tree = btn.closest('.nav-item-tree');

        // 如果点击的是已经选中的父级专栏，再次点击兼具折叠/展开功能
        if (isAlreadyActive && tree && !btn.classList.contains('subtree-item')) {
          const willOpen = !tree.classList.contains('open');
          document.querySelectorAll('.nav-item-tree').forEach(otherTree => {
            if (otherTree !== tree) otherTree.classList.remove('open');
          });
          tree.classList.toggle('open', willOpen);
          return;
        }

        allFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 手风琴模式：展开当前所属专栏，折叠其余专栏
        document.querySelectorAll('.nav-item-tree').forEach(otherTree => {
          if (otherTree !== tree) otherTree.classList.remove('open');
        });
        if (tree) {
          tree.classList.add('open');
        }

        syncTreeActiveState();

        activeTag = targetTag;
        currentPage = 1;
        renderPage();
        toggleSidebar(false);

        // 同步 URL Query 参数，便于用户复制链接或刷新保持筛选状态
        try {
          const newUrl = targetTag === 'all'
            ? window.location.pathname
            : `${window.location.pathname}?tag=${encodeURIComponent(targetTag)}`;
          window.history.replaceState(null, '', newUrl);
        } catch (err) {}
      });
    });
  }

  // 初始化首页渲染
  if (postBlocks.length > 0) {
    renderPage();
  }

  // TOC Scroll Spy for Article Detail Pages (绝对定位高亮与触底智能激活)
  const tocLinks = document.querySelectorAll('.toc-link');
  let highlightCurrentTOC = null;

  if (tocLinks.length > 0) {
    const headings = [];
    tocLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const headingEl = document.getElementById(targetId);
        if (headingEl) {
          headings.push({ el: headingEl, link: link });
        }
      }
    });

    if (headings.length > 0) {
      highlightCurrentTOC = function() {
        const scrollPos = window.scrollY + 120;
        const isBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);

        let currentActive = headings[0].link;
        if (isBottom && headings.length > 0) {
          currentActive = headings[headings.length - 1].link;
        } else {
          for (let i = 0; i < headings.length; i++) {
            const top = headings[i].el.getBoundingClientRect().top + window.scrollY;
            if (top <= scrollPos) {
              currentActive = headings[i].link;
            }
          }
        }

        tocLinks.forEach(l => l.classList.remove('active'));
        if (currentActive) {
          currentActive.classList.add('active');
        }
      };

      highlightCurrentTOC();
    }
  }

  // 5. Back To Top Floating Button Controller
  const backToTopBtn = document.getElementById('back-to-top-btn');
  let toggleBackToTop = null;

  if (backToTopBtn) {
    toggleBackToTop = function() {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    };

    toggleBackToTop();

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 统一高性能 requestAnimationFrame 滚动节流监听
  if (highlightCurrentTOC || toggleBackToTop) {
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          if (highlightCurrentTOC) highlightCurrentTOC();
          if (toggleBackToTop) toggleBackToTop();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });
  }

  // 全局三大导航中心（AI/工具/GitHub）通用高效过滤控制器
  window.initNavFilter = function({ inputId, pillSelector, cardSelector, sectionSelector, emptyId, countId, typeName = '精选项目' }) {
    const filterInput = document.getElementById(inputId);
    if (!filterInput || filterInput.dataset.navFilterInited) return;
    filterInput.dataset.navFilterInited = 'true';

    const pillBtns = document.querySelectorAll(pillSelector);
    const categorySections = Array.from(document.querySelectorAll(sectionSelector));
    const emptyState = document.getElementById(emptyId);
    const emptyResetBtn = emptyState ? (emptyState.querySelector('.empty-action-btn') || emptyState.querySelector('.empty-state-reset-btn') || emptyState.querySelector('button')) : null;
    const countBadge = document.getElementById(countId);

    let activeCat = 'all';
    let searchQuery = '';

    function filterItems() {
      let visibleCount = 0;
      let visibleCats = 0;

      categorySections.forEach(section => {
        const sectionCat = section.getAttribute('data-cat-name');
        const catMatches = activeCat === 'all' || activeCat === sectionCat;
        const sectionCards = section.querySelectorAll(cardSelector);
        let sectionVisibleCount = 0;

        sectionCards.forEach(card => {
          const name = card.getAttribute('data-name') || '';
          const repo = card.getAttribute('data-repo') || '';
          const url = card.getAttribute('data-url') || '';
          const desc = card.getAttribute('data-desc') || '';
          const tags = card.getAttribute('data-tags') || '';

          const matchesSearch = !searchQuery ||
            name.includes(searchQuery) ||
            repo.includes(searchQuery) ||
            url.includes(searchQuery) ||
            desc.includes(searchQuery) ||
            tags.includes(searchQuery);

          if (catMatches && matchesSearch) {
            card.style.display = 'flex';
            sectionVisibleCount++;
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (sectionVisibleCount > 0) {
          section.style.display = 'flex';
          visibleCats++;
        } else {
          section.style.display = 'none';
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
        const globalSearchBtn = emptyState.querySelector('.open-search-modal-with-query');
        if (globalSearchBtn) {
          globalSearchBtn.setAttribute('data-query', searchQuery);
          const querySpan = globalSearchBtn.querySelector('.search-query-text');
          if (querySpan) {
            querySpan.textContent = searchQuery ? `"${searchQuery}"` : '';
          }
        }
      }

      if (countBadge) {
        countBadge.textContent = '共 ' + visibleCats + ' 个分类 · ' + visibleCount + ' 个' + typeName;
      }
    }

    if (filterInput) {
      let isNavComposing = false;
      filterInput.addEventListener('compositionstart', () => { isNavComposing = true; });
      filterInput.addEventListener('compositionend', (e) => {
        isNavComposing = false;
        searchQuery = (e.target.value || '').trim().toLowerCase();
        filterItems();
      });

      filterInput.addEventListener('input', debounce((e) => {
        if (isNavComposing) return;
        searchQuery = e.target.value.trim().toLowerCase();
        filterItems();
      }, 120));

      // 按下回车键时立即同步执行过滤（严格忽略中文输入法拼音确认回车）
      filterInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (e.isComposing || isNavComposing || e.keyCode === 229) return;
          e.preventDefault();
          searchQuery = e.target.value.trim().toLowerCase();
          filterItems();
          filterInput.blur();
        }
      });
    }

    pillBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        pillBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCat = btn.getAttribute('data-filter-cat') || 'all';
        filterItems();
      });
    });

    if (emptyResetBtn) {
      emptyResetBtn.addEventListener('click', () => {
        if (filterInput) filterInput.value = '';
        searchQuery = '';
        activeCat = 'all';
        pillBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter-cat') === 'all'));
        filterItems();
      });
    }
  };

  // 自动侦测并初始化当前导航页面
  if (document.getElementById('ai-filter-input')) {
    window.initNavFilter({
      inputId: 'ai-filter-input',
      pillSelector: '.nav-pill-btn',
      cardSelector: '.nav-repo-card',
      sectionSelector: '.nav-category-section',
      emptyId: 'ai-empty-state',
      countId: 'ai-count-badge',
      typeName: '顶尖 AI 工具'
    });
  } else if (document.getElementById('tools-filter-input')) {
    window.initNavFilter({
      inputId: 'tools-filter-input',
      pillSelector: '.nav-pill-btn',
      cardSelector: '.nav-repo-card',
      sectionSelector: '.nav-category-section',
      emptyId: 'tools-empty-state',
      countId: 'tools-count-badge',
      typeName: '实用工具'
    });
  } else if (document.getElementById('nav-filter-input')) {
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

  // =========================================================================
  // 导航与资源锚点自动定位、展开分类与脉冲高亮联动
  // =========================================================================
  function handleNavHashHighlight() {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    
    let targetId = '';
    try {
      targetId = decodeURIComponent(hash.substring(1));
    } catch (e) {
      targetId = hash.substring(1);
    }
    if (!targetId) return;

    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    // 1. 如果在导航页且卡片所在的分类被隐藏，自动重置分类筛选为“全部”
    const pillBtns = document.querySelectorAll('.nav-pill-btn');
    const categorySections = document.querySelectorAll('.nav-category-section');
    const filterInput = document.getElementById('ai-filter-input') || document.getElementById('tools-filter-input') || document.getElementById('nav-filter-input');
    
    if (pillBtns.length > 0) {
      if (filterInput) filterInput.value = '';
      pillBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter-cat') === 'all'));
      categorySections.forEach(sec => { sec.style.display = 'flex'; });
      const allCards = document.querySelectorAll('.nav-repo-card');
      allCards.forEach(c => { c.style.display = 'flex'; });
    }

    // 2. 如果在文件资源库，若目标文件在折叠文件夹内，自动展开该文件夹
    const parentFolder = targetEl.closest('.explorer-folder-block');
    if (parentFolder && !parentFolder.classList.contains('open')) {
      parentFolder.classList.add('open');
    }

    // 3. 延迟平滑滚动并触发脉冲聚焦动效
    setTimeout(() => {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetEl.classList.remove('nav-card-highlight-pulse');
      void targetEl.offsetWidth; // 触发 reflow 重启动画
      targetEl.classList.add('nav-card-highlight-pulse');
      setTimeout(() => {
        targetEl.classList.remove('nav-card-highlight-pulse');
      }, 3600);
    }, 150);
  }

  // 页面就绪以及 hashchange 时自动检测触发
  handleNavHashHighlight();
  window.addEventListener('hashchange', handleNavHashHighlight, { passive: true });
});

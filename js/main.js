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
      const title = block.getAttribute('data-title')?.toLowerCase() || '';
      const summary = block.getAttribute('data-summary')?.toLowerCase() || '';
      const tags = (block.getAttribute('data-tags') || '').split(',').map(t => t.trim().toLowerCase());
      const blockText = block.textContent.toLowerCase();
      
      const matchesSearch = !searchQuery || 
        title.includes(searchQuery) || 
        summary.includes(searchQuery) || 
        tags.some(t => t.includes(searchQuery)) ||
        blockText.includes(searchQuery);

      const matchesTag = activeTag === 'all' || tags.some(t => {
        const cleanT = t.toLowerCase();
        const cleanActive = activeTag.toLowerCase();
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
      jumpInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeJump();
        }
      });
    }
  }

  // 搜索框实时输入监听
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      currentPage = 1;
      renderPage();
    });
  }

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

  // 分类与子分类点击筛选 (仅在有文章列表流的首页 index.html 启用就地无刷新筛选)
  if (allFilterBtns.length > 0) {
    // 页面加载时检查 URL 查询参数中的 ?tag= 或 ?cat=
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryTag = urlParams.get('tag') || urlParams.get('cat');
      if (queryTag) {
        allFilterBtns.forEach(btn => {
          const btnTag = btn.getAttribute('data-tag');
          if (btnTag && btnTag.toLowerCase() === queryTag.toLowerCase()) {
            allFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTag = btnTag;
            const tree = btn.closest('.nav-item-tree');
            if (tree) tree.classList.add('open');
          }
        });
      }
    } catch (e) {
      console.warn('URLSearchParams parse error:', e);
    }

    syncTreeActiveState();

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
      });
    });
  }

  // 初始化首页渲染
  if (postBlocks.length > 0) {
    renderPage();
  }

  // TOC Scroll Spy for Article Detail Pages
  const tocLinks = document.querySelectorAll('.toc-link');
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
      function highlightCurrentTOC() {
        const scrollPos = window.scrollY + 100;
        let currentActive = headings[0].link;

        for (let i = 0; i < headings.length; i++) {
          if (headings[i].el.offsetTop <= scrollPos) {
            currentActive = headings[i].link;
          }
        }

        tocLinks.forEach(l => l.classList.remove('active'));
        if (currentActive) {
          currentActive.classList.add('active');
        }
      }

      window.addEventListener('scroll', highlightCurrentTOC, { passive: true });
      highlightCurrentTOC();
    }
  }

  // 5. Back To Top Floating Button Controller
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    function toggleBackToTop() {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

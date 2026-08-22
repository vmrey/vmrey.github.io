/**
 * 资源文件库（嵌套树状文件夹管理器）布局模板 (Files Explorer Layout Template)
 */
const { renderBaseLayout } = require('./base');

function renderFilesLayout({
  sidebarHtml,
  resourceFolders,
  resourceFilesCount,
  blogConfig
}) {
  const foldersHtml = resourceFolders.map(folder => {
    const filesRowsHtml = folder.files.map(file => {
      let previewBtnHtml = '';
      if (file.previewable) {
        previewBtnHtml = `        <button type="button" class="file-action-btn primary file-preview-btn" data-preview-file="${file.path}" data-file-name="${file.name}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          <span>在线预览</span>
        </button>`;
      } else {
        previewBtnHtml = `        <button type="button" class="file-action-btn file-preview-btn" data-preview-file="${file.path}" data-file-name="${file.name}" title="二进制压缩包">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          <span>详情</span>
        </button>`;
      }

      return `          <div class="nested-file-row" data-name="${file.name.toLowerCase()}" data-ext="${file.ext.toLowerCase()}" data-desc="${file.desc.toLowerCase()}">
            <div class="file-row-left">
              <div class="file-type-pill" style="color: ${file.badgeColor}; border-color: ${file.badgeColor}40; background: ${file.badgeBg};">
                .${file.ext.toUpperCase()}
              </div>
              <div class="file-name-meta">
                <div class="file-name-line">
                  <span class="file-main-name">${file.name}</span>
                  <span class="file-size-tag">${file.size}</span>
                </div>
                <div class="file-desc-line" title="${file.desc}">${file.desc}</div>
              </div>
            </div>
            <div class="file-row-actions">
      ${previewBtnHtml}
              <a href="${file.path}" download="${file.name}" class="file-action-btn" title="下载该文件到本地">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>直接下载</span>
              </a>
            </div>
          </div>`;
    }).join('\n');

    return `      <!-- 文件夹目录：${folder.folderName} -->
      <div class="explorer-folder-block open" id="${folder.folderId}">
        <div class="folder-header-row" data-folder-target="${folder.folderId}">
          <div class="folder-title-left">
            <svg class="folder-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            <div class="folder-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <span class="folder-name">${folder.folderName}</span>
            <code class="folder-path-pill">${folder.folderPath}</code>
          </div>
          <div class="folder-meta-right">
            <span class="folder-count-badge">${folder.files.length} 个文件</span>
          </div>
        </div>
        <div class="folder-content-body">
          <div class="nested-files-list">
${filesRowsHtml}
          </div>
        </div>
      </div>`;
  }).join('\n\n');

  const mainContentHtml = `      <header class="feed-header">
        <div class="feed-title-wrap">
          <div class="feed-title-row">
            <h1>资源文件库</h1>
            <div class="feed-stats-pills">
              <span class="stat-pill highlight" id="files-count-badge">共 ${resourceFolders.length} 个文件夹 · ${resourceFilesCount} 个附件</span>
              <span class="stat-pill">文件夹嵌套树状浏览</span>
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
            id="file-filter-input" 
            class="search-input" 
            placeholder="输入文件名、扩展名或功能描述即时定位文件..." 
            aria-label="过滤文件资源"
            autocomplete="off"
            enterkeyhint="search"
          >
        </div>
      </header>

      <!-- 资源管理器快捷控制栏 (面包屑与展开/折叠全部) -->
      <div class="explorer-controls-bar">
        <div class="explorer-breadcrumbs">
          <span class="crumb-root">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>根目录</span>
          </span>
          <span>/</span>
          <span>assets</span>
          <span>/</span>
          <span>files</span>
          <span>/</span>
        </div>

        <div class="explorer-tree-actions">
          <button type="button" class="tree-action-btn" id="btn-toggle-all" title="折叠所有文件夹">
            <svg class="icon-collapse" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
            <svg class="icon-expand" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            <span id="btn-toggle-all-text">全部折叠</span>
          </button>
        </div>
      </div>

      <!-- 文件夹嵌套树状视图容器 -->
      <div class="explorer-folders-container" id="explorer-folders-container">
${foldersHtml}
      </div>

      <!-- 空结果提示 -->
      <div id="no-files-results" class="empty-state-card" style="display: none;">
        <div class="empty-state-illustration">
          <div class="empty-state-glow"></div>
          <svg class="empty-state-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="14" y="8" width="36" height="48" rx="6" stroke-dasharray="4 4" opacity="0.6"/>
            <path d="M22 22h20M22 30h14M22 38h8" opacity="0.4"/>
            <circle cx="44" cy="44" r="12" fill="var(--surface)" stroke="var(--primary)" stroke-width="2"/>
            <line x1="52.5" y1="52.5" x2="60" y2="60" stroke="var(--primary)" stroke-width="2.5"/>
          </svg>
        </div>
        <h3 class="empty-state-title">未找到匹配的文件</h3>
        <p class="empty-state-desc">未检索到包含该关键词的文件或脚本，请尝试缩短或更换搜索词</p>
      </div>`;

  const inlineScripts = `    // 文件夹嵌套树状交互逻辑 (展开/折叠/实时过滤)
    document.addEventListener('DOMContentLoaded', () => {
      const folderBlocks = Array.from(document.querySelectorAll('.explorer-folder-block'));
      const filterInput = document.getElementById('file-filter-input');
      const btnToggleAll = document.getElementById('btn-toggle-all');
      const btnToggleAllText = document.getElementById('btn-toggle-all-text');
      const noResults = document.getElementById('no-files-results');
      const countBadge = document.getElementById('files-count-badge');

      // 同步全部展开/全部折叠按钮状态
      function updateToggleAllButton() {
        if (!btnToggleAll || !btnToggleAllText) return;
        const anyOpen = folderBlocks.some(b => b.classList.contains('open'));
        if (anyOpen) {
          btnToggleAllText.textContent = '全部折叠';
          btnToggleAll.setAttribute('title', '折叠所有文件夹');
          btnToggleAll.classList.remove('is-collapsed');
        } else {
          btnToggleAllText.textContent = '全部展开';
          btnToggleAll.setAttribute('title', '展开所有文件夹');
          btnToggleAll.classList.add('is-collapsed');
        }
      }

      // 文件夹点击展开 / 折叠
      document.querySelectorAll('.folder-header-row').forEach(header => {
        header.addEventListener('click', () => {
          const targetId = header.getAttribute('data-folder-target');
          const block = document.getElementById(targetId);
          if (block) {
            block.classList.toggle('open');
            updateToggleAllButton();
          }
        });
      });

      // 全部展开 / 全部折叠 一键切换
      if (btnToggleAll) {
        btnToggleAll.addEventListener('click', () => {
          const anyOpen = folderBlocks.some(b => b.classList.contains('open'));
          if (anyOpen) {
            folderBlocks.forEach(b => b.classList.remove('open'));
          } else {
            folderBlocks.forEach(b => b.classList.add('open'));
          }
          updateToggleAllButton();
        });
      }

      // 实时搜索过滤 (自动高亮并展开有匹配项的文件夹)
      if (filterInput) {
        filterInput.addEventListener('input', (e) => {
          const query = e.target.value.trim().toLowerCase();
          let totalVisibleFiles = 0;
          let visibleFolders = 0;

          folderBlocks.forEach(folder => {
            const rowsInFolder = Array.from(folder.querySelectorAll('.nested-file-row'));
            let visibleInThisFolder = 0;

            rowsInFolder.forEach(row => {
              const name = row.getAttribute('data-name') || '';
              const ext = row.getAttribute('data-ext') || '';
              const desc = row.getAttribute('data-desc') || '';
              const match = !query || name.includes(query) || ext.includes(query) || desc.includes(query);

              if (match) {
                row.style.display = 'flex';
                visibleInThisFolder++;
                totalVisibleFiles++;
              } else {
                row.style.display = 'none';
              }
            });

            if (visibleInThisFolder > 0) {
              folder.style.display = 'block';
              folder.classList.add('open');
              visibleFolders++;
            } else {
              folder.style.display = 'none';
            }
          });

          if (noResults) {
            noResults.style.display = totalVisibleFiles === 0 ? 'flex' : 'none';
          }

          if (countBadge) {
            countBadge.textContent = query 
              ? '搜索结果: ' + totalVisibleFiles + ' 个文件 (' + visibleFolders + ' 个文件夹)'
              : '共 ' + folderBlocks.length + ' 个文件夹 · ' + totalVisibleFiles + ' 个附件';
          }

          updateToggleAllButton();
        });
      }
    });`;

  return renderBaseLayout({
    title: `资源文件库 - ${blogConfig.siteName}`,
    description: '包含 Vue 组件源码、Shell 部署脚本、Windows 批处理以及项目压缩包附件，以文件夹嵌套树状结构呈现，支持全站免跳转在线代码高亮预览与高速直接下载。',
    keywords: '资源文件库,Vue组件源码,Shell脚本,BAT脚本,代码高亮预览,资源下载',
    canonicalPath: 'files.html',
    isSubfolder: false,
    extraCss: ['css/prism.css'],
    sidebarHtml: sidebarHtml,
    mainContentHtml: mainContentHtml,
    inlineScripts: inlineScripts
  });
}

module.exports = { renderFilesLayout };

/**
 * ==============================================================================
 * vmrey.github.io 全站智能文件在线预览与下载系统 (Universal File Previewer)
 * ==============================================================================
 * 支持 .vue, .js, .sh, .bat, .txt, .json, .md, .css, .html 在线代码高亮预览与一键复制；
 * 支持 .zip, .rar 等二进制文件智能卡片预览与高速一键下载。
 */
(function() {
  'use strict';

  // 1. 初始化弹窗 DOM
  let modalEl = null;

  function createPreviewModal() {
    if (document.getElementById('file-preview-modal')) return;

    modalEl = document.createElement('div');
    modalEl.id = 'file-preview-modal';
    modalEl.className = 'file-preview-modal';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('aria-label', '文件在线预览');

    modalEl.innerHTML = `
      <div class="preview-backdrop" id="preview-backdrop"></div>
      <div class="preview-dialog">
        <!-- 弹窗头部 -->
        <div class="preview-header">
          <div class="preview-title-wrap">
            <div class="preview-file-icon" id="preview-file-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
            </div>
            <div class="preview-title-info">
              <span class="preview-file-name" id="preview-file-name">文件名</span>
              <span class="preview-file-meta" id="preview-file-meta">0 KB · 0 行</span>
            </div>
          </div>

          <div class="preview-header-actions">
            <button class="preview-btn copy-btn" id="preview-copy-btn" type="button" title="复制代码内容">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>复制代码</span>
            </button>
            <a class="preview-btn download-btn" id="preview-download-btn" href="#" download title="下载此文件到本地">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>下载文件</span>
            </a>
            <button class="preview-fullscreen-btn" id="preview-fullscreen-btn" type="button" aria-label="全屏显示" title="全屏显示">
              <svg class="icon-maximize" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
              <svg class="icon-minimize" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="10" y1="14" x2="3" y2="21"></line></svg>
            </button>
            <button class="preview-close-btn" id="preview-close-btn" type="button" aria-label="关闭预览" title="关闭预览">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <!-- 弹窗正文容器 -->
        <div class="preview-body" id="preview-body">
          <div class="preview-loading" id="preview-loading">
            <div class="preview-spinner"></div>
            <span>正在加载文件内容...</span>
          </div>
          <pre class="preview-code-block" id="preview-code-block" style="display: none;"><code id="preview-code-content"></code></pre>
          <div class="preview-binary-box" id="preview-binary-box" style="display: none;">
            <div class="binary-icon-wrap">
              <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <div class="binary-title" id="preview-binary-title">压缩包文件</div>
            <p class="binary-desc" id="preview-binary-desc">此文件为二进制压缩资源包，不支持在线代码文本预览，请点击下方按钮直接下载到本地解压使用。</p>
            <a class="empty-action-btn primary binary-download-action" id="preview-binary-download-link" href="#" download>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>立即下载该文件</span>
            </a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);

    // 绑定关闭事件
    const closeBtn = document.getElementById('preview-close-btn');
    const backdrop = document.getElementById('preview-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', closePreviewModal);
    if (backdrop) backdrop.addEventListener('click', closePreviewModal);

    // 绑定全屏切换事件
    const fullscreenBtn = document.getElementById('preview-fullscreen-btn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    // 双击弹窗头部快捷切换全屏
    const headerEl = modalEl.querySelector('.preview-header');
    if (headerEl) {
      headerEl.addEventListener('dblclick', (e) => {
        if (!e.target.closest('button') && !e.target.closest('a')) {
          toggleFullscreen();
        }
      });
    }

    // 绑定 ESC 退出全屏 / 关闭预览
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalEl && modalEl.classList.contains('active')) {
        if (modalEl.classList.contains('is-fullscreen')) {
          toggleFullscreen();
        } else {
          closePreviewModal();
        }
      }
    });

    // 绑定一键复制事件
    const copyBtn = document.getElementById('preview-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const codeContent = document.getElementById('preview-code-content');
        if (codeContent && codeContent.textContent) {
          navigator.clipboard.writeText(codeContent.textContent).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span style="color:#10b981;">已复制!</span>
            `;
            setTimeout(() => {
              copyBtn.innerHTML = originalText;
            }, 2000);
          }).catch(() => {
            alert('复制失败，请手动全选复制');
          });
        }
      });
    }
  }

  function toggleFullscreen() {
    if (!modalEl) return;
    const isFullscreen = modalEl.classList.toggle('is-fullscreen');
    const fullscreenBtn = document.getElementById('preview-fullscreen-btn');
    if (fullscreenBtn) {
      const label = isFullscreen ? '退出全屏' : '全屏显示';
      fullscreenBtn.setAttribute('title', label);
      fullscreenBtn.setAttribute('aria-label', label);
    }
  }

  function closePreviewModal() {
    if (modalEl) {
      modalEl.classList.remove('active');
      modalEl.classList.remove('is-fullscreen');
      const fullscreenBtn = document.getElementById('preview-fullscreen-btn');
      if (fullscreenBtn) {
        fullscreenBtn.setAttribute('title', '全屏显示');
        fullscreenBtn.setAttribute('aria-label', '全屏显示');
      }
      document.body.style.overflow = '';
    }
  }

  /**
   * 打开文件在线预览
   * @param {string} fileUrl 文件相对路径
   * @param {string} fileName 文件名
   * @param {string} fileCategory 文件分类
   */
  window.openFilePreview = function(fileUrl, fileName, fileCategory) {
    createPreviewModal();

    const name = fileName || fileUrl.split('/').pop() || '未命名文件';
    const ext = name.split('.').pop().toLowerCase();

    const nameEl = document.getElementById('preview-file-name');
    const metaEl = document.getElementById('preview-file-meta');
    const downloadBtn = document.getElementById('preview-download-btn');
    const copyBtn = document.getElementById('preview-copy-btn');
    const loadingEl = document.getElementById('preview-loading');
    const codeBlock = document.getElementById('preview-code-block');
    const codeContent = document.getElementById('preview-code-content');
    const binaryBox = document.getElementById('preview-binary-box');
    const binaryTitle = document.getElementById('preview-binary-title');
    const binaryDesc = document.getElementById('preview-binary-desc');
    const binaryDownloadLink = document.getElementById('preview-binary-download-link');

    if (nameEl) nameEl.textContent = name;
    if (downloadBtn) {
      downloadBtn.href = fileUrl;
      downloadBtn.setAttribute('download', name);
    }
    if (binaryDownloadLink) {
      binaryDownloadLink.href = fileUrl;
      binaryDownloadLink.setAttribute('download', name);
    }

    modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';

    // 判断是否为二进制不可预览文件
    const binaryExts = ['zip', 'rar', '7z', 'tar', 'gz', 'dmg', 'exe', 'apk', 'iso'];
    if (binaryExts.includes(ext)) {
      if (copyBtn) copyBtn.style.display = 'none';
      if (loadingEl) loadingEl.style.display = 'none';
      if (codeBlock) codeBlock.style.display = 'none';
      if (binaryBox) binaryBox.style.display = 'flex';
      if (metaEl) metaEl.textContent = `${ext.toUpperCase()} 归档压缩包 · 二进制资源`;
      if (binaryTitle) binaryTitle.textContent = name;
      if (binaryDesc) binaryDesc.textContent = `此文件为 ${ext.toUpperCase()} 归档压缩包，不支持在线代码文本预览，请点击下方按钮直接下载到本地解压使用。`;
      return;
    }

    // 文本/代码文件预览
    if (copyBtn) copyBtn.style.display = 'inline-flex';
    if (binaryBox) binaryBox.style.display = 'none';
    if (loadingEl) loadingEl.style.display = 'flex';
    if (codeBlock) codeBlock.style.display = 'none';
    if (metaEl) metaEl.textContent = '正在获取文件流...';

    // 映射 Prism 语言高亮类
    let prismLang = 'javascript';
    if (['vue', 'html', 'xml'].includes(ext)) prismLang = 'markup';
    else if (['sh', 'bash', 'zsh'].includes(ext)) prismLang = 'bash';
    else if (['bat', 'cmd'].includes(ext)) prismLang = 'batch';
    else if (['json'].includes(ext)) prismLang = 'json';
    else if (['css', 'scss', 'less'].includes(ext)) prismLang = 'css';
    else if (['md', 'markdown'].includes(ext)) prismLang = 'markdown';
    else if (['txt', 'log'].includes(ext)) prismLang = 'text';

    fetch(fileUrl)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.text();
      })
      .then(text => {
        if (loadingEl) loadingEl.style.display = 'none';
        if (codeBlock) codeBlock.style.display = 'block';

        const lines = text.split('\n').length;
        const sizeKb = (new Blob([text]).size / 1024).toFixed(1);
        if (metaEl) metaEl.textContent = `${sizeKb} KB · ${lines} 行 · ${ext.toUpperCase()}`;

        if (codeContent) {
          codeContent.className = `language-${prismLang}`;
          codeContent.textContent = text;
          if (window.Prism && window.Prism.highlightElement) {
            window.Prism.highlightElement(codeContent);
          }
        }
      })
      .catch(err => {
        if (loadingEl) loadingEl.style.display = 'none';
        if (binaryBox) binaryBox.style.display = 'flex';
        if (copyBtn) copyBtn.style.display = 'none';
        if (metaEl) metaEl.textContent = '无法在线读取文本';
        if (binaryTitle) binaryTitle.textContent = name;
        if (binaryDesc) binaryDesc.textContent = `该文件当前无法直接在线加载文本内容（${err.message}），请点击下方按钮直接下载到本地查看。`;
      });
  };

  // 2. 页面加载完成后自动接管文件预览按钮与文章内非直接下载链接
  document.addEventListener('DOMContentLoaded', () => {
    createPreviewModal();

    // 接管显式预览按钮以及文章中未声明 download 属性的附件链接
    document.querySelectorAll('.file-preview-btn, [data-preview-file], a[href*="assets/files/"]:not([download])').forEach(link => {
      link.addEventListener('click', (e) => {
        // 若元素声明了 download 属性，保持浏览器原生直接下载，不拦截预览
        if (link.hasAttribute('download')) return;

        const href = link.getAttribute('data-preview-file') || link.getAttribute('href');
        if (!href) return;

        const fileName = link.getAttribute('data-file-name') || href.split('/').pop().split('?')[0];
        const ext = fileName.split('.').pop().toLowerCase();
        
        // 如果文件属于受支持的预览/资源类型，开启预览弹窗
        const fileExts = ['vue', 'js', 'sh', 'bat', 'txt', 'json', 'md', 'css', 'zip', 'rar', '7z'];
        if (fileExts.includes(ext)) {
          e.preventDefault();
          window.openFilePreview(href, fileName);
        }
      });
    });
  });
})();

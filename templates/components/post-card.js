/**
 * 公共文章卡片组件 (Post Card Item Component)
 * 经典高饱和度专属多色深邃渐变大封面与专属英文技术角标
 */

function getThumbnailSvg(category = '', tags = []) {
  const tagStr = tags.join(',').toLowerCase() + ',' + (category || '').toLowerCase();
  
  if (tagStr.includes('vue')) {
    return {
      grad: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
      badgeColor: '#34d399',
      icon: `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#34d399" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 10 16L22 4"/><path d="m6.5 4 5.5 9 5.5-9"/></svg>`,
      label: 'VUE & COMPONENTS'
    };
  } else if (tagStr.includes('docker') || tagStr.includes('容器') || tagStr.includes('rustdesk') || tagStr.includes('kodbox')) {
    return {
      grad: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)',
      badgeColor: '#38bdf8',
      icon: `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6Z"/><path d="M4 10h4v4H4z"/><path d="M10 10h4v4h-4z"/><path d="M16 10h4v4h-4z"/><path d="M10 6h4v4h-4z"/><path d="M16 6h4v4h-4z"/></svg>`,
      label: 'DOCKER CONTAINER'
    };
  } else if (tagStr.includes('linux') || tagStr.includes('服务端') || tagStr.includes('nginx') || tagStr.includes('ssl') || tagStr.includes('ffmpeg') || tagStr.includes('siege') || tagStr.includes('xray')) {
    return {
      grad: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
      badgeColor: '#a5b4fc',
      icon: `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#a5b4fc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
      label: 'LINUX & SERVER'
    };
  } else if (tagStr.includes('git') || tagStr.includes('svn') || tagStr.includes('版本控制')) {
    return {
      grad: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #b45309 100%)',
      badgeColor: '#fbbf24',
      icon: `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 15V9a6 6 0 0 0-6-6H6"/><line x1="6" y1="9" x2="6" y2="15"/></svg>`,
      label: 'GIT WORKFLOW'
    };
  } else if (tagStr.includes('ai') || tagStr.includes('claude') || tagStr.includes('agent') || tagStr.includes('llm')) {
    return {
      grad: 'linear-gradient(135deg, #2e1065 0%, #581c87 50%, #7e22ce 100%)',
      badgeColor: '#c084fc',
      icon: `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#c084fc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/></svg>`,
      label: 'AI & INTELLIGENCE'
    };
  } else if (tagStr.includes('微信小程序') || tagStr.includes('小程序')) {
    return {
      grad: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
      badgeColor: '#6ee7b7',
      icon: `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#6ee7b7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
      label: 'MINI PROGRAM'
    };
  } else if (tagStr.includes('javascript') || tagStr.includes('js') || tagStr.includes('前端')) {
    return {
      grad: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
      badgeColor: '#38bdf8',
      icon: `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
      label: 'JAVASCRIPT & UTILS'
    };
  } else {
    return {
      grad: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
      badgeColor: '#cbd5e1',
      icon: `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
      label: 'TOOLS & SCRIPTS'
    };
  }
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderPostCard(post) {
  const tagsAttr = (post.tags || []).join(',');
  const thumb = getThumbnailSvg(post.category, post.tags || []);
  const tagSpans = (post.tags || []).slice(0, 2).map(t => `<span class="post-block-tag">${t}</span>`).join('\n              ');

  return `        <!-- 文章卡片: ${post.title} -->
        <a href="${post.url}" class="post-block" data-title="${escapeHtml(post.title)}" data-summary="${escapeHtml(post.summary || '')}" data-tags="${tagsAttr}">
          
          <!-- 16:9 封面缩略图质感层 -->
          <div class="post-thumb-wrap" style="background: ${thumb.grad};">
            <div class="thumb-icon-wrap">${thumb.icon}</div>
            <div class="thumb-topic-label" style="color: ${thumb.badgeColor};">${thumb.label}</div>
            <div class="post-duration-badge">⏱️ ${post.readTime || '5 分钟'}</div>
          </div>

          <!-- 卡片信息区 -->
          <div class="post-card-body">
            <div class="post-block-meta">
              ${tagSpans}
              <span class="meta-dot">·</span>
              <time datetime="${post.date}">${post.date}</time>
            </div>
            
            <h2 class="post-block-title">${post.title}</h2>
            
            <p class="post-block-summary">${post.summary || ''}</p>
            
            <div class="post-block-footer">
              <span class="read-more-text">
                <span>阅读文章</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </span>
              <span class="reading-hint">点击卡片阅读完整内容</span>
            </div>
          </div>

        </a>`;
}

module.exports = { renderPostCard, getThumbnailSvg };

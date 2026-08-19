/**
 * 关于本站页面布局模板 (About Page Layout Template - 与详情页保持 100% 统一风格与大纲体验)
 */
const { renderToc } = require('../components/toc');
const { renderBaseLayout } = require('./base');

function renderAboutLayout({
  sidebarHtml,
  blogConfig
}) {
  const headings = [
    { id: '一-博客创办初衷与核心价值', title: '一、博客创办初衷与核心价值', level: 2 },
    { id: '二-核心技术专栏矩阵', title: '二、核心技术专栏矩阵', level: 2 },
    { id: '三-联系与交流方式', title: '三、联系与交流方式', level: 2 }
  ];

  const mainContentHtml = `      <div class="article-container">
        <!-- 文章标题与元数据头部 -->
        <header class="article-header">
          <a href="index.html" class="back-link" title="返回文章列表">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            <span>返回文章列表</span>
          </a>
          <h1 class="article-title">关于 ${blogConfig.siteName}</h1>
          <div class="article-meta">
            <span class="post-block-tag">关于本站</span>
            <span>·</span>
            <time datetime="${blogConfig.startYear}-01-01">${blogConfig.startYear}-2026</time>
            <span>·</span>
            <span>3 分钟阅读</span>
          </div>
        </header>

        <!-- 正文内容区 -->
        <div class="article-layout">
          <article class="article-content" id="main-content">
            <div class="prose">
              <p>
                嗨，你好！这里是 <strong>${blogConfig.siteName}</strong>。一名专注于软件开发与工程实践的开发者，热衷于构建高效工具、编写干净自解释的代码，并通过极简主义工程实现可靠的系统。
              </p>

              <div class="callout">
                <div class="callout-title">工程座右铭：极简、严谨与效率</div>
                <p>“Talk is cheap. Show me the code.” 专注于解决真实世界的工程问题，追求极致的简洁、稳定与运行效率。拒绝过度设计，做经得起时间检验的软件工程。</p>
              </div>

              <h2 id="一-博客创办初衷与核心价值">一、博客创办初衷与核心价值</h2>
              <p>
                在这个信息过载、框架层出不穷的时代，快速消费型的内容层出不穷，而深入、扎实且兼具工程实战指导意义的系统化总结却往往难以寻觅。
              </p>
              <p>本站坚持以下三大原则：</p>
              <ul>
                <li><strong>坚持一手实战经验</strong>：所有记录的架构方案、踩坑记录与代码实现均源于生产环境真实验证，杜绝浅尝辄止的搬运；</li>
                <li><strong>追求干净自解释的代码</strong>：无论是前端组件封装、后端高并发设计还是运维自动化脚本，均注重可读性、健壮性与类型安全；</li>
                <li><strong>拥抱开放与长期主义</strong>：全站基于纯粹的 Web 标准构建，采用纯静态架构，确保十年后内容依然可以高速、无损地被全世界读者访问。</li>
              </ul>

              <h2 id="二-核心技术专栏矩阵">二、核心技术专栏矩阵</h2>
              <p>博客长期专注于以下三个核心技术领域：</p>
              <ul>
                <li><strong>前端开发</strong>：Vue 3 进阶实战、Element Plus 业务组件深度封装、现代 JavaScript 工具函数库与微信小程序开发实践；</li>
                <li><strong>Linux 与服务端</strong>：Docker 容器化部署、RustDesk/Kodbox 私有化服务自建、Nginx 高性能反向代理、FFmpeg 音视频处理与 HTTP 压力测试；</li>
                <li><strong>效率工具与软件</strong>：Git/SVN 版本控制协同技巧、原生批处理自动化脚本、图片无损压缩与 AI 辅助编程工具链。</li>
              </ul>

              <h2 id="三-联系与交流方式">三、联系与交流方式</h2>
              <p>如果你对本站的文章、代码开源项目有任何建议或探讨，欢迎随时通过以下方式与我交流：</p>
              <ul>
                <li><strong>GitHub 仓库</strong>: <a href="${blogConfig.githubUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--primary);">github.com/vmrey/vmrey.github.io</a></li>
                <li><strong>讨论与反馈</strong>: 欢迎在 GitHub 仓库中提交 Issue 或 Pull Request。</li>
              </ul>
            </div>

            <div class="post-block-footer" style="margin-top: 3.5rem; padding-top: 1.5rem;">
              <a href="index.html" class="read-more-text">
                <span>← 返回文章专栏</span>
              </a>
            </div>
          </article>
        </div>
      </div>

${renderToc(headings)}`;

  return renderBaseLayout({
    title: `关于 ${blogConfig.siteName} - 软件开发与工程实践`,
    description: '关于 vmrey.github.io：专注于软件开发与工程实践，用代码与文字记录探索，构建稳定可靠的工具与系统。',
    isSubfolder: false,
    extraCss: ['css/prism.css'],
    sidebarHtml: sidebarHtml,
    activePage: 'about',
    mainContentHtml: mainContentHtml
  });
}

module.exports = { renderAboutLayout };

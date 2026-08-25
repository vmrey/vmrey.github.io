/**
 * VLESS 节点生成器导航功能页面布局模板 (VLESS Generator Layout Template - 纯本地无依赖极简高安全版)
 */
const { renderToc } = require('../components/toc');
const { renderBaseLayout } = require('./base');

function renderVlessLayout({
  sidebarHtml,
  blogConfig
}) {
  const headings = [
    { id: 'sec-import', title: '0. 单节点一键导入解析', level: 2 },
    { id: 'sec-core', title: '1. 核心与协议设置', level: 2 },
    { id: 'sec-transport', title: '2. 传输层高级参数', level: 2 },
    { id: 'sec-security', title: '3. 安全与加密层', level: 2 },
    { id: 'sec-domains', title: '4. 目标节点与批量生成', level: 2 },
    { id: 'sec-result', title: '5. 生成结果与一键导出', level: 2 }
  ];

  const mainContentHtml = `      <div class="article-container">
        <!-- 详情页标准头部 -->
        <header class="article-header">
          <a href="index.html" class="back-link" title="返回文章专栏">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            <span>返回文章专栏</span>
          </a>
          <h1 class="article-title">VLESS 节点生成器</h1>
          <div class="article-meta">
            <span class="gen-static-tag">实用工具</span>
            <span>·</span>
            <span>VLESS 协议全功能</span>
            <span>·</span>
            <span>纯客户端本地生成</span>
            <span>·</span>
            <span>0 依赖高安全</span>
          </div>
        </header>

        <!-- 正文与生成器交互区 -->
        <div class="article-layout">
          <div class="generator-container">
            <!-- 0. 节点一键导入区 -->
            <div class="gen-card" id="sec-import">
              <div class="gen-card-header">
                <div class="gen-card-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>0. 单节点一键导入 (解析并覆盖参数)</span>
                </div>
                <div id="parseStatus" class="gen-hint">粘贴 vless:// 链接或 Base64 订阅将实时动态解析</div>
              </div>
              <div class="gen-form-group">
                <textarea id="importUrl" rows="3" class="gen-textarea" placeholder="粘贴单个 vless:// 链接或 Base64 订阅包（系统将自动提取第 1 个节点的核心参数与目标地址）..." oninput="handleImportInput(this)"></textarea>
              </div>
              <div class="gen-btn-row right">
                <button type="button" class="gen-btn gen-btn-secondary" onclick="clearImportUrl()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  <span>清空</span>
                </button>
                <button type="button" class="gen-btn gen-btn-primary" onclick="parseUrl(false)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  <span>解析节点</span>
                </button>
              </div>
            </div>

            <!-- 1. 核心与协议设置 (Core) -->
            <div class="gen-card" id="sec-core">
              <div class="gen-card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
                <span>1. 核心与协议设置 (Core)</span>
              </div>
              <div class="gen-grid">
                <div class="gen-form-group full">
                  <div class="gen-label-row">
                    <label>UUID <span class="gen-badge">只读 / 点击生成或导入填充</span></label>
                    <div class="gen-btn-group">
                      <button type="button" class="gen-btn-mini primary" onclick="generateUUID()">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                        <span>随机生成</span>
                      </button>
                      <button type="button" id="copyUuidBtn" class="gen-btn-mini" onclick="copyUUID()">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        <span>复制 UUID</span>
                      </button>
                    </div>
                  </div>
                  <input type="text" id="uuid" class="gen-input readonly" placeholder="点击右上角「随机生成」或通过上方链接自动解析导入..." readonly>
                </div>
                <div class="gen-form-group">
                  <label>端口 (port)</label>
                  <input type="number" id="port" class="gen-input" value="443">
                </div>
                <div class="gen-form-group">
                  <label>加密方式 (encryption)</label>
                  <select id="encryption" class="gen-select">
                    <option value="none">none (推荐)</option>
                  </select>
                </div>
                <div class="gen-form-group">
                  <label>传输协议 (type) <span class="gen-badge">网络层</span></label>
                  <select id="type" class="gen-select">
                    <option value="ws">ws (WebSocket - 最通用)</option>
                    <option value="xhttp" selected>xhttp (新一代流传输)</option>
                    <option value="tcp">tcp</option>
                    <option value="grpc">grpc</option>
                    <option value="splithttp">splithttp</option>
                    <option value="h2">h2</option>
                    <option value="quic">quic</option>
                    <option value="kcp">kcp</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 2. 传输层高级参数 -->
            <div class="gen-card" id="sec-transport">
              <div class="gen-card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                <span>2. 传输层高级参数 (适用于 ws/grpc/xhttp 等)</span>
              </div>
              <div class="gen-grid">
                <div class="gen-form-group">
                  <label>路径 (path) <span class="gen-badge">ws/xhttp</span></label>
                  <input type="text" id="path" class="gen-input" placeholder="例如: /api">
                </div>
                <div class="gen-form-group">
                  <label>伪装Host (host) <span class="gen-badge">ws/xhttp</span></label>
                  <input type="text" id="host" class="gen-input" placeholder="例如: your-domain.com">
                </div>
                <div class="gen-form-group">
                  <label>服务名称 (serviceName) <span class="gen-badge">gRPC专用</span></label>
                  <input type="text" id="serviceName" class="gen-input" placeholder="例如: myGrpcService">
                </div>
                <div class="gen-form-group">
                  <label>模式 (mode) <span class="gen-badge">grpc/xhttp</span></label>
                  <select id="mode" class="gen-select">
                    <option value="">(空/默认)</option>
                    <option value="auto">auto</option>
                    <option value="multi">multi</option>
                    <option value="gun">gun</option>
                  </select>
                </div>
                <div class="gen-form-group">
                  <label>伪装类型 (headerType) <span class="gen-badge">tcp/kcp/quic</span></label>
                  <select id="headerType" class="gen-select">
                    <option value="">none</option>
                    <option value="http">http</option>
                    <option value="wechat-video">wechat-video</option>
                  </select>
                </div>
                <div class="gen-form-group">
                  <label>种子 (seed) <span class="gen-badge">kcp专用</span></label>
                  <input type="text" id="seed" class="gen-input" placeholder="KCP混淆种子">
                </div>
              </div>
            </div>

            <!-- 3. 安全与加密层 (TLS / REALITY / XTLS) -->
            <div class="gen-card" id="sec-security">
              <div class="gen-card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>3. 安全与加密层 (TLS / REALITY / XTLS)</span>
              </div>
              <div class="gen-grid">
                <div class="gen-form-group">
                  <label>安全机制 (security)</label>
                  <select id="security" class="gen-select">
                    <option value="tls" selected>tls</option>
                    <option value="reality">reality (推荐防封)</option>
                    <option value="none">none (明文)</option>
                  </select>
                </div>
                <div class="gen-form-group">
                  <label>服务器名称 (sni)</label>
                  <input type="text" id="sni" class="gen-input" placeholder="例如: your-domain.com">
                </div>
                <div class="gen-form-group">
                  <label>指纹 (fp)</label>
                  <select id="fp" class="gen-select">
                    <option value="">(空/默认)</option>
                    <option value="chrome">chrome</option>
                    <option value="firefox">firefox</option>
                    <option value="safari">safari</option>
                    <option value="edge">edge</option>
                    <option value="random">random</option>
                    <option value="randomized">randomized</option>
                  </select>
                </div>
                <div class="gen-form-group">
                  <label>ALPN <span class="gen-badge">应用层协商</span></label>
                  <select id="alpn" class="gen-select">
                    <option value="">(空/默认)</option>
                    <option value="h2,http/1.1">h2,http/1.1 (推荐)</option>
                    <option value="h2">h2</option>
                    <option value="http/1.1">http/1.1</option>
                    <option value="h3">h3</option>
                    <option value="h3,h2,http/1.1">h3,h2,http/1.1</option>
                  </select>
                </div>
                <div class="gen-form-group">
                  <label>跳过证书验证 (insecure)</label>
                  <select id="insecure" class="gen-select">
                    <option value="0">0 (验证证书, 推荐)</option>
                    <option value="1">1 (跳过验证)</option>
                  </select>
                </div>
                <div class="gen-form-group">
                  <label>流控 (flow) <span class="gen-badge">XTLS专用</span></label>
                  <select id="flow" class="gen-select">
                    <option value="">(空/不使用流控)</option>
                    <option value="xtls-rprx-vision">xtls-rprx-vision</option>
                  </select>
                </div>

                <!-- REALITY 专属参数 -->
                <div id="realitySection" style="display: none; grid-column: 1 / -1;" class="gen-grid">
                  <div class="gen-form-group full">
                    <label style="color: var(--primary); border-top: 1px dashed var(--border); padding-top: 10px; margin-top: 5px;">▼ REALITY 专属参数 (仅当 Security 选 reality 时生效)</label>
                  </div>
                  <div class="gen-form-group">
                    <label>公钥 (pbk)</label>
                    <input type="text" id="pbk" class="gen-input" placeholder="Base64 Public Key">
                  </div>
                  <div class="gen-form-group">
                    <label>短ID (sid)</label>
                    <input type="text" id="sid" class="gen-input" placeholder="Short ID (例如: 8a9b)">
                  </div>
                  <div class="gen-form-group">
                    <label>SpiderX (spx)</label>
                    <input type="text" id="spx" class="gen-input" placeholder="通常为 /">
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. 目标节点与批量生成 -->
            <div class="gen-card" id="sec-domains">
              <div class="gen-card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span>4. 目标节点与批量生成</span>
              </div>

              <!-- 目标节点列表 -->
              <div class="gen-form-group">
                <div class="gen-label-row">
                  <label>目标节点列表 (支持 IPv4 / IPv6 / 域名，支持每行一个或直接粘贴测速结果)</label>
                  <div class="gen-btn-group">
                    <button type="button" class="gen-btn-mini primary" onclick="cleanAndDedupDomains()">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                      <span>智能去重整理</span>
                    </button>
                    <button type="button" class="gen-btn-mini" onclick="clearDomains()">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      <span>清空</span>
                    </button>
                  </div>
                </div>
                <textarea id="domains" rows="8" style="min-height: 180px;" class="gen-textarea" placeholder="支持多种格式混合输入（每行一个）：&#10;1. 纯域名：hk.example.com&#10;2. 带端口域名：us.example.com:8443&#10;3. IPv4 地址：104.16.1.1 或 104.16.1.1:2053&#10;4. IPv6 地址：2606:4700::1 或 [2606:4700::1]:8443&#10;5. 带备注格式：104.16.1.1#香港 或 测速CSV数据"></textarea>
                <div class="gen-hint">系统自动识别 IP/域名/自定义端口/节点备注，纯本地毫秒级严格去重合并并生成最终可用节点。</div>
              </div>
              
              <button id="genBtn" class="gen-btn-generate" onclick="generateNodes()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>
                <span>批量生成节点 (严格去重)</span>
              </button>

              <!-- 5. 生成结果与一键导出 -->
              <div class="gen-form-group" id="sec-result" style="margin-top: 24px;">
                <div class="gen-result-header">
                  <div class="gen-result-title">
                    <label>5. 生成结果与一键导出:</label>
                    <span id="resultCountBadge" class="gen-badge success" style="display: none;">已生成 0 个独立节点</span>
                  </div>
                  <button id="copyBtn" class="gen-btn gen-btn-secondary" onclick="copyResults()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    <span>复制全部节点</span>
                  </button>
                </div>
                <textarea id="result" rows="12" class="gen-textarea result" placeholder="生成的 VLESS 链接会显示在这里（所有节点已严格去重）..." readonly></textarea>
              </div>
            </div>

            <div class="post-block-footer" style="margin-top: 2.5rem; padding-top: 1.5rem;">
              <a href="index.html" class="read-more-text">
                <span>← 返回文章专栏</span>
              </a>
            </div>
          </div>
        </div>
      </div>

${renderToc(headings)}`;

  return renderBaseLayout({
    title: `节点生成器 · ${blogConfig.siteName}`,
    description: `全协议 VLESS 节点批量生成与智能去重配置工具，支持 IPv4/IPv6、REALITY、XHTTP、gRPC 与 UUID 快速生成`,
    keywords: `VLESS生成器, 节点生成, IPv6节点, REALITY, XHTTP, gRPC, 节点配置, ${blogConfig.siteName}`,
    canonicalPath: 'node-vle.html',
    sidebarHtml,
    mainContentHtml,
    extraScripts: ['js/vless.js'],
    isSubfolder: false
  });
}

module.exports = { renderVlessLayout };

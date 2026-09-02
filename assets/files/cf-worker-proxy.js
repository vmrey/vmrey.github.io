/**
 * Cloudflare Worker 静态网站与 GitHub Pages 完美无缝反向代理脚本
 * 
 * 核心特性与盲区修复：
 * 1. OPTIONS 预检请求拦截：直接返回允许跨域头，避免复杂请求跨域拦截
 * 2. 请求头 Host/Origin/Referer 自动伪装：确保源站虚拟主机路由与防盗链正常
 * 3. 301/302/307/308 重定向无缝改写：防止跳转时泄露或回退到源站域名
 * 4. 彻底解决 ERR_CONTENT_DECODING_FAILED：对改写的 Body 自动清除 content-length 和 content-encoding
 * 5. 网页 SRI 子资源完整性校验移除：防止路径或文本替换后浏览器阻断资源加载
 * 6. 支持 XML (Sitemap/RSS Feed) 与纯文本：保全搜索引擎 SEO 与订阅
 * 7. 二进制多媒体流式直传：图片、字体、音视频等资源零损耗高效代理
 */

export default {
  async fetch(request, env, ctx) {
    // 盲区修复 1：直接拦截并处理 OPTIONS 预检请求，防止复杂跨域报错
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
          "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "*",
          "Access-Control-Max-Age": "86400",
        }
      });
    }

    const url = new URL(request.url);
    const originalHost = url.host;

    // =================== 核心配置区 ===================
    // 目标网站域名（如 username.github.io，不带 https://）
    const targetDomain = env.TARGET_DOMAIN || 'username.github.io';
    // 目标站点的二级基础路径（若反代根目录请留空 ''，若反代子仓库请填写 '/repo-name'）
    const targetBasePath = env.TARGET_BASE_PATH || '';
    // ==================================================

    const proxyUrl = new URL(request.url);
    proxyUrl.host = targetDomain;
    if (targetBasePath) {
      proxyUrl.pathname = targetBasePath + proxyUrl.pathname;
    }

    const proxyHeaders = new Headers(request.headers);
    proxyHeaders.set('Host', targetDomain);

    if (proxyHeaders.has('Origin')) {
      proxyHeaders.set('Origin', `https://${targetDomain}`);
    }
    if (proxyHeaders.has('Referer')) {
      proxyHeaders.set('Referer', proxyHeaders.get('Referer').replace(originalHost, targetDomain));
    }

    const modifiedRequest = new Request(proxyUrl.toString(), {
      headers: proxyHeaders,
      method: request.method,
      body: request.body,
      redirect: 'manual' // 手动处理重定向，便于改写 Location 响应头
    });

    try {
      const response = await fetch(modifiedRequest);
      const modifiedResponseHeaders = new Headers(response.headers);

      // 允许跨域并移除安全策略限制
      modifiedResponseHeaders.set('Access-Control-Allow-Origin', '*');
      modifiedResponseHeaders.delete('Content-Security-Policy');
      modifiedResponseHeaders.delete('X-Frame-Options');

      // 处理 301/302/303/307/308 重定向
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = modifiedResponseHeaders.get('Location');
        if (location) {
          const newLocation = location
            .replace(`https://${targetDomain}${targetBasePath}`, `https://${originalHost}`)
            .replace(`http://${targetDomain}${targetBasePath}`, `https://${originalHost}`);
          modifiedResponseHeaders.set('Location', newLocation);
        }
        return new Response(null, { status: response.status, headers: modifiedResponseHeaders });
      }

      const contentType = response.headers.get('content-type') || '';

      // 盲区修复 2：加入 XML (Sitemap/RSS) 和纯文本的支持，保全 SEO
      if (
        contentType.includes('text/html') ||
        contentType.includes('text/css') ||
        contentType.includes('application/javascript') ||
        contentType.includes('application/json') ||
        contentType.includes('application/xml') ||
        contentType.includes('text/xml') ||
        contentType.includes('text/plain')
      ) {
        let bodyText = await response.text();

        // 盲区修复 3：凡是被 Worker 读取并修改了主体的内容，必须删除长度和压缩头
        // 否则浏览器解码会直接崩溃 (ERR_CONTENT_DECODING_FAILED)
        modifiedResponseHeaders.delete('content-length');
        modifiedResponseHeaders.delete('content-encoding');

        // [正则 1] 标准路径替换
        const regexStandard = new RegExp(`(https?:)?//${targetDomain}${targetBasePath}`, 'g');
        bodyText = bodyText.replace(regexStandard, `https://${originalHost}`);

        // [正则 2] 转义路径替换（适用于 JSON / JS 里的转义 URL）
        const escapedTargetDomain = targetDomain.replace(/\./g, '\\.');
        const regexEscaped = new RegExp(`(https?:)?\\\\/\\\\/${escapedTargetDomain}`, 'g');
        bodyText = bodyText.replace(regexEscaped, `https:\\/\\/${originalHost}`);

        // 盲区修复 4：移除 HTML 中的子资源完整性校验 (integrity)，防止文件被修改后触发浏览器安全拦截
        if (contentType.includes('text/html')) {
          bodyText = bodyText.replace(/\s+integrity="[^"]+"/g, '');
        }

        return new Response(bodyText, {
          status: response.status,
          statusText: response.statusText,
          headers: modifiedResponseHeaders
        });
      }

      // 二进制文件（图片、音视频、压缩包等）原生流式透传
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: modifiedResponseHeaders
      });

    } catch (e) {
      return new Response('Proxy Error: ' + e.message, { status: 500 });
    }
  }
};

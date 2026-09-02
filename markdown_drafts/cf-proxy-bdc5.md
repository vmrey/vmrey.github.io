---
title: 基于 Cloudflare Workers 完美反代 GitHub Pages 与静态站点实战指南
date: 2026-09-02
category: Linux与服务端
subcategory: 网络与反代
tags: Cloudflare,Workers,反向代理,GitHub Pages,跨域,SEO
summary: 深入剖析如何使用 Cloudflare Workers 零成本搭建高性能 GitHub Pages 与静态站点反向代理。全面解决 OPTIONS 跨域预检、ERR_CONTENT_DECODING_FAILED 乱码崩溃、SRI 完整性校验拦截、301/302 重定向泄露及 Sitemap/RSS SEO 索引保全等核心痛点。
readTime: 7 分钟阅读
---

# 基于 Cloudflare Workers 完美反代 GitHub Pages 与静态站点实战指南

在搭建个人博客、技术文档或静态项目展示站时，**GitHub Pages** 是极其常用的免费托管平台。然而在实际生产和国内访问场景中，开发者常常面临两大痛点：
1. **网络连通性与加速需求**：GitHub Pages 官方节点在部分地区访问延迟高或偶发阻断，需要借助 Cloudflare 全球边缘 CDN 进行加速；
2. **自定义域名与防暴露需求**：需要使用自己的独立域名，或者在单域名下通过子路径反向代理多个外部静态站点。

许多开发者尝试用几行简单的 Cloudflare Worker 脚本进行 `fetch()` 代理，但很快就会掉进各种隐蔽的“深坑”——**页面乱码崩溃 (ERR_CONTENT_DECODING_FAILED)**、**JavaScript 静态资源报 SRI 完整性校验失败被浏览器拦截**、**复杂跨域 OPTIONS 报错**、**搜索引擎 Sitemap/RSS 抓取失败** 以及 **301 跳转跳回源站域名**。

本文将带来一份经过深度调优的 **Cloudflare Worker 生产级反向代理脚本**，并逐一剖析背后的技术原理与盲区解决方案。

---

## 一、🌟 核心特性与 5 大盲区修复

本反代脚本针对静态站点与 GitHub Pages 做了全方位适配，核心亮点包括：

- **⚡ OPTIONS 预检请求拦截**：直接在边缘返回 CORS 响应头，无需回源，彻底解决复杂跨域调用报错；
- **🛡️ 彻底杜绝解码崩溃**：修改响应主体文本后自动移除 `content-length` 与 `content-encoding` 头，解决浏览器的 `ERR_CONTENT_DECODING_FAILED`；
- **🔒 SRI 完整性校验自动剔除**：自动过滤 HTML 中 `<script>` / `<link>` 的 `integrity` 属性，防止因文本替换破坏 Hash 导致浏览器安全拦截；
- **🔍 SEO 与爬虫友好**：深度支持 `sitemap.xml`、`feed.xml`、`robots.txt` 及 JSON 数据的域名改写（兼容 `https:\/\/` 转义斜杠）；
- **🔄 301/302 重定向无缝重写**：自动捕获并改写 `Location` 响应头，防止跳转时暴露真实源站域名；
- **🚀 二进制零损耗流式透传**：图片、音视频、WebAssembly 及各类压缩包附件采用原生 Stream 直传，兼顾极速与低内存消耗。

---

## 二、📥 脚本下载与免跳转预览

本站已将整理好的最新版 Worker 脚本收录至资源库，可直接下载或在线查看：

<div class="article-resource-card">
  <div class="article-resource-info">
    <div class="article-resource-icon">.JS</div>
    <div class="article-resource-meta">
      <div class="article-resource-title-row">
        <span class="article-resource-name">cf-worker-proxy.js</span>
        <span class="article-resource-badge">Cloudflare Worker</span>
      </div>
      <div class="article-resource-desc">生产级静态网站与 GitHub Pages 完美无缝反代脚本（解决跨域、SEO、SRI 与解码报错）</div>
    </div>
  </div>
  <div class="article-resource-actions">
    <a href="../assets/files/cf-worker-proxy.js" download class="article-resource-btn primary" title="直接下载脚本文件">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      <span>直接下载</span>
    </a>
    <a href="../files.html" class="article-resource-btn" title="前往全站文件中心在线预览与管理">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
      <span>文件中心</span>
    </a>
  </div>
</div>

### 命令行快速获取

```bash
# 使用 curl 直接下载
curl -Lo cf-worker-proxy.js https://vmrey.github.io/assets/files/cf-worker-proxy.js

# 或使用 wget 下载
wget -O cf-worker-proxy.js https://vmrey.github.io/assets/files/cf-worker-proxy.js
```

---

## 三、💻 完整脚本源码

以下为生产级 `cf-worker-proxy.js` 完整实现：

```javascript
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
```

---

## 四、🚀 5 分钟部署实战步骤

### 步骤 1：在 Cloudflare 控制台创建 Worker

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)；
2. 在左侧菜单栏进入 **Workers 和 Pages (Workers & Pages)** -> **Overview**；
3. 点击 **创建 (Create application)** -> 选择 **Workers** -> 点击 **部署 (Deploy)** 生成默认 Worker。

---

### 步骤 2：替换脚本代码并配置目标域名

1. 点击进入刚创建的 Worker 详情页，点击右上角 **编辑代码 (Edit code)**；
2. 清空编辑器原有内容，将上述 `cf-worker-proxy.js` 代码粘贴进去；
3. 修改核心配置区的 `targetDomain`（例如将 `username.github.io` 改为你自己的 GitHub Pages 域名，如 `vmrey.github.io`）；
   - 如果你的 GitHub Pages 是仓库级二级路径（例如 `username.github.io/my-docs`），且你希望反代后在根路径直接访问，只需将 `targetBasePath` 设为 `'/my-docs'`；
   - 也可在 Worker **设置 (Settings)** -> **变量 (Variables)** 中新增 `TARGET_DOMAIN` 和 `TARGET_BASE_PATH` 环境变量，实现配置与代码解耦；
4. 点击右上角 **部署 (Deploy)** 保存生效。

---

### 步骤 3：绑定自定义域名 (Custom Domains)

1. 在 Worker 详情页面，点击顶部 **设置 (Settings)** 选项卡；
2. 选择 **域和路由 (Domains & Routes)**；
3. 点击 **添加 (Add)** -> **自定义域 (Custom Domain)**；
4. 输入你托管在 Cloudflare 上的独立域名（例如 `blog.yourdomain.com`）；
5. Cloudflare 将自动为你配置 DNS 解析记录和免费 SSL/TLS 证书。

---

## 五、🔍 核心原理与常见问题剖析

### 1. 为什么修改 Body 必须删除 `content-length` 和 `content-encoding`？
源站发送给 Cloudflare 的 HTTP 响应很多是经过 Gzip 或 Brotli 压缩的（包含 `content-encoding: gzip` 和固定长度的 `content-length`）。
当 Worker 调用 `await response.text()` 时，Cloudflare 底层会自动将其解压缩为纯字符串。如果我们修改了字符串内容并直接返回，原有的 `content-length`（字节数已发生改变）和 `content-encoding`（内容已变成未压缩纯文本）就会与实际内容产生冲突，导致浏览器解码崩溃报 `ERR_CONTENT_DECODING_FAILED`。
**修复策略**：在返回新 Response 之前执行 `delete('content-length')` 和 `delete('content-encoding')`，由 Cloudflare 边缘节点重新协商最优压缩算法。

### 2. 为什么要剥除 HTML 中的 `integrity` 属性？
很多现代前端打包工具（如 Webpack / Vite）在构建时会为 `<script>` 和 `<link>` 标签添加 SRI (Subresource Integrity) 校验哈希（例如 `integrity="sha384-..."`）。
如果我们在反代过程中替换了 JS 文件内部的 API 路径或源站域名，JS 文件的哈希值就会改变，导致浏览器触发 SRI 校验失败而拒绝执行脚本。
**修复策略**：通过正则 `replace(/\s+integrity="[^"]+"/g, '')` 移除 SRI 属性，确保修改后的资源正常加载。

### 3. 如何支持带有转义斜杠的 JSON / JS 数据？
许多现代博客框架（如 VitePress、Hexo、VuePress）会将全局配置序列化为 JSON 注入页面中，域名中的斜杠常被转义为 `https:\/\/username.github.io`。
单一的标准正则无法匹配这类转义格式，本脚本通过 `[正则 2]` 转义域名匹配，完美覆盖所有序列化场景。

---

## 六、📝 总结

通过 Cloudflare Workers 的边缘无服务器计算能力，配合细致的响应头清理、正则替换与重定向处理，我们无需自行购买并配置 Nginx 服务器，就能在几分钟内搭建起一套高可用、免维护、抗高并发且全球极速的静态网站反向代理体系。

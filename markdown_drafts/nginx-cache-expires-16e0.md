---
title: Nginx 静态资源长效缓存与 Expires 性能优化配置
date: 2021-09-05
category: Linux 与服务端
subcategory: 网络与反代
tags: Nginx,浏览器缓存,Expires,性能优化,前端加速
summary: 通过 Nginx 对 JS、CSS、图片、字体等静态资源配置 Cache-Control 与 Expires 头部，大幅降低服务器带宽与首屏加载耗时。
readTime: 2 分钟阅读
---

# Nginx 静态资源长效缓存与 Expires 性能优化配置

## 一、配置原理

利用 HTTP 1.1 的 `Cache-Control: max-age` 与 HTTP 1.0 的 `Expires` 响应头，通知浏览器在有效期内直接从本地 Disk Cache / Memory Cache 读取静态资源，无需向服务器发起重复请求。

---

## 二、Nginx 核心配置代码

```nginx
# 匹配常见静态资源文件扩展名
location ~* \.(jpg|jpeg|gif|png|webp|svg|ico|css|js|woff|woff2|ttf|eot)$ {
    # 设置静态缓存时间为 30 天
    expires 30d;
    
    # 开启静态资源强缓存策略
    add_header Cache-Control "public, no-transform";
    
    # 关闭静态资源的访问日志与 404 错误日志，减轻磁盘 I/O
    access_log off;
    log_not_found off;
}
```

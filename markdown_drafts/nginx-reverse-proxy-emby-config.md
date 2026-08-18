---
title: Nginx 高性能反向代理 Emby 媒体服务器配置与 WebSocket 支持
date: 2026-06-25
category: Linux与服务端
subcategory: 网络与反代
tags: Linux,Nginx,Emby,媒体服务器
summary: 配置 Nginx 反代 Emby 流媒体服务，开启 WebSocket 实时长连接、大文件分片传输与客户端真实 IP 透传。
readTime: 4 分钟阅读
---

# Nginx 全站反向代理配置说明文档（Cloudflare CDN + 流媒体优化版）

## 📌 配置概述
本配置专为 **Cloudflare CDN + 全站反向代理** 架构设计，通过引入动态域名变量、SNI 强校验、HTTPS 协议识别以及重定向安全锁，实现了对目标源站（如 Emby 等流媒体服务）的高效、稳定全站映射。同时针对大文件传输和长连接做了深度优化。

---

## 📄 完整配置代码

你可以直接点击代码块右上角的 **“复制”** 按钮获取最终优化后的完整配置：

```nginx
    resolver 8.8.8.8 1.1.1.1 valid=300s;
    resolver_timeout 5s;

    location / {
        # 1. 转发目标域名变量（全站代理的目标源站，如需更换在此修改）
        set $target_domain "www.target.com";
        
        proxy_pass https://$target_domain;
        proxy_set_header Host $target_domain;
        proxy_ssl_server_name on;
        proxy_ssl_name $target_domain;
    
        # 2. 协议识别（防止后端误判为 HTTP）
        proxy_set_header X-Forwarded-Proto $scheme;

        # 3. 全站代理安全锁（自动修正源站的绝对路径与重定向，防止用户跳去源站）
        proxy_redirect https://$target_domain/ /;

        # 4. WebSocket 支持（保障全站的实时双向通信）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $http_connection;
    
        # 5. 大文件传输与长连接优化（防断开、支持高清视频流畅拖动进度条）
        proxy_buffering off;
        proxy_cache off;
        chunked_transfer_encoding on;
        proxy_connect_timeout 300;
        proxy_send_timeout 86400;
        proxy_read_timeout 86400;
        proxy_set_header Range $http_range;
        proxy_set_header If-Range $http_if_range;
        proxy_request_buffering off;
    }

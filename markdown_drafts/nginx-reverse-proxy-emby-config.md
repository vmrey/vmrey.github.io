---
title: Nginx 全站反向代理配置说明文档（Cloudflare CDN + 流媒体优化版）
date: 2026-06-25
category: Linux 与服务端
subcategory: 网络与反代
tags: Linux,Nginx,Emby,流媒体,Cloudflare,反向代理
summary: 专为 Cloudflare CDN + 全站反向代理架构设计，支持 Emby 流媒体大文件分片、WebSocket 实时长连接与 SNI 强校验。
readTime: 4 分钟阅读
---

# Nginx 全站反向代理配置说明文档（Cloudflare CDN + 流媒体优化版）

## 📌 一、配置概述

本配置专为 **Cloudflare CDN + 全站反向代理** 架构设计，通过引入动态域名变量、SNI 强校验、HTTPS 协议识别以及重定向安全锁，实现了对目标源站（如 Emby 等流媒体服务）的高效、稳定全站映射。同时针对大文件传输和长连接做了深度优化。

---

## 📄 二、完整配置代码

你可以直接点击代码块右上角复制最终优化后的完整配置：

```nginx
    # 动态解析与 DNS 超时控制
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
```

---

## 🔍 三、核心优化指令详解

| 配置指令 / 机制 | 作用说明 | 解决的痛点问题 |
| :--- | :--- | :--- |
| `resolver ... valid=300s;` | 指定上游 DNS 解析器与缓存周期 | 解决动态源站 IP 变动后 Nginx 无法解析导致 502 的问题 |
| `proxy_ssl_server_name on;` | 开启上游 HTTPS SNI 扩展支持 | 解决反代 Cloudflare 等 CDN 源站时由于缺少 SNI 握手失败报错 |
| `proxy_redirect https://$target_domain/ /;` | 自动改写源站 301/302 重定向头部 | 防止客户端登录或跳转时被重定向暴露原源站域名 |
| `proxy_set_header Upgrade ...` | 开启 HTTP/1.1 WebSocket 双向升级 | 确保 Emby 播放进度同步、即时控制与长轮询不掉线 |
| `proxy_buffering off;` | 关闭响应缓冲区，采用流式直接传输 | 解决视频拖动进度条卡顿、初始加载缓冲时间过长问题 |
| `proxy_read_timeout 86400;` | 延长上游连接读取超时至 24 小时 | 防止播放超长 4K 电影或挂起播放器时被 Nginx 提前切断连接 |

---

## 🛠️ 四、部署与生效检查

```bash
# 1. 检查 Nginx 配置文件语法是否正确
nginx -t

# 2. 平滑重载 Nginx 进程
nginx -s reload
```

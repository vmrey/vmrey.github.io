---
title: WordPress WP Super Cache 插件高并发 Nginx 静态伪静态规则
date: 2021-11-05
category: Linux 与服务端
subcategory: 网络与反代
tags: WordPress,Nginx,WP Super Cache,动静分离,缓存
summary: 配置 Nginx 直接绕过 PHP-FPM 直读 WP Super Cache 生成的静态 HTML 缓存文件，实现高并发极速响应。
readTime: 3 分钟阅读
---

# WordPress WP Super Cache 插件高并发 Nginx 静态伪静态规则

## 一、加速原理

常规 WordPress 请求需要经过 PHP-FPM 解释执行并多次查询 MySQL。WP Super Cache 开启 Expert 静态模式后，Nginx 可以直接在磁盘检查预生成的 `.html` 文件并直接发送给浏览器，吞吐量提升十倍以上。

---

## 二、Nginx 完整配置代码

```nginx
# WP Super Cache 核心 Nginx 匹配规则
set $cache_uri $request_uri;

# 针对 POST 请求、登录用户及带查询参数的请求绕过静态缓存
if ($request_method = POST) {
    set $cache_uri 'null cache';
}
if ($query_string != "") {
    set $cache_uri 'null cache';
}
if ($http_cookie ~* "comment_author|wordpress_[a-f0-9]+|wp-postpass|wordpress_logged_in") {
    set $cache_uri 'null cache';
}

location / {
    try_files /wp-content/cache/supercache/$http_host/$cache_uri/index-https.html 
              /wp-content/cache/supercache/$http_host/$cache_uri/index.html 
              $uri $uri/ /index.php?$args;
}
```

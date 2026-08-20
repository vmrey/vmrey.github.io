---
title: Nginx 媒体与静态资源防盗链配置实战（Valid Referers）
date: 2021-09-15
category: Linux 与服务端
subcategory: 网络与反代
tags: Nginx,防盗链,安全防护,Valid Referers,流量节省
summary: 防止外部恶意网站盗用本站图片、视频与下载附件消耗服务器流量，利用 Nginx valid_referers 指令配置域名防盗链拦截。
readTime: 2 分钟阅读
---

# Nginx 媒体与静态资源防盗链配置实战（Valid Referers）

## 一、防盗链机制

当浏览器加载网页中的图片或资源时，会在 HTTP 请求头附带 `Referer`（来源网址）。通过校验 `Referer` 是否为白名单域名，即可精准拦截非授权网站的非法外链引用。

---

## 二、Nginx 防盗链配置代码

```nginx
location ~* \.(jpg|jpeg|png|gif|webp|mp4|flv|zip|rar|tar|gz)$ {
    expires 30d;
    access_log off;
    
    # 配置白名单域名 (none: 允许空 Referer 直接访问; blocked: 允许被防火墙伪装的请求)
    valid_referers none blocked *.vmrey.com vmrey.github.io;
    
    # 如果是非白名单来源，直接返回 403 拒绝或重定向至提示图
    if ($invalid_referer) {
        return 403;
        # 或者重写展示警告防盗链图片:
        # rewrite ^/ https://vmrey.github.io/assets/images/forbidden.png break;
    }
}
```

---
title: Xray DNS 分流防污染优化与国内外路由分流规则配置
date: 2026-05-08
category: Linux与服务端
subcategory: 性能与压测
tags: Linux,网络协议,DNS,路由优化
summary: 配置 DoH / DoT 加密 DNS 解析，实现基于 GeoIP 与 Geosite 的国内外精准流量智能分流。
readTime: 3 分钟阅读
---

## xray dns防止污染配置

```javascript
  "dns": {
  "servers": [
    {
      "address": "8.8.8.8",
      "port": 53,
      "domains": [
        "geosite:google",
        "geosite:youtube",
        "geosite:netflix",
        "geosite:disney",
        "geosite:hulu",
        "geosite:primevideo",
        "geosite:openai",
        "geosite:anthropic",
        "geosite:github",
        "geosite:telegram",
        "geosite:twitter",
        "geosite:facebook",
        "geosite:instagram",
        "domain:lite.cn2gias.uk"
      ]
    },
    "localhost"
  ],
  "clientIp": "服务器ip"
},
```

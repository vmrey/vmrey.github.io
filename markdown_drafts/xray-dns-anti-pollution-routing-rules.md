---
title: Xray DNS 分流防污染优化与国内外路由分流规则配置
date: 2026-05-08
category: Linux与服务端
subcategory: 网络与反代
tags: Linux,网络协议,DNS,路由优化,Xray
summary: 详解 Xray 核心 DNS 分流配置与防污染机制，基于 Geosite 域名列表实现境外加密 DNS 解析与境内直连智能分流。
readTime: 5 分钟阅读
---

# Xray DNS 分流防污染优化与国内外路由分流规则配置

> 在使用 Xray 时，DNS 污染往往会导致特定域名无法解析或解析到虚假 IP。通过配置内置的 `dns` 模块与 `routing` 路由协同，可以实现境外域名走远程安全 DNS、境内域名走本地 ISP 直连的高性能智能分流方案。

---

## 一、DNS 防污染核心配置段

在 `config.json` 顶级节点中添加或替换 `dns` 配置：

```json
{
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
          "geosite:geolocation-!cn"
        ]
      },
      {
        "address": "223.5.5.5",
        "port": 53,
        "domains": [
          "geosite:cn"
        ],
        "expectIPs": [
          "geoip:cn"
        ]
      },
      "localhost"
    ],
    "clientIp": "1.1.1.1",
    "queryStrategy": "UseIP"
  }
}
```

---

## 二、配置核心参数解析

| 参数项 | 说明 | 作用 |
| :--- | :--- | :--- |
| **`geosite:geolocation-!cn`** | 预置非中国大陆域名列表 | 命中这些域名的查询请求全部强制使用 `8.8.8.8` 安全解析，杜绝 DNS 污染。 |
| **`geosite:cn`** | 预置中国大陆域名列表 | 国内域名直接走阿里 DNS（`223.5.5.5`），确保国内网站毫秒级秒开且 CDN 节点最优。 |
| **`expectIPs`** | 预期返回 IP 范围 | 若国内 DNS 返回了非国内 IP，则丢弃并转由 fallback 处理，防止劫持。 |
| **`queryStrategy`** | DNS 查询偏好策略 | 可选 `UseIP` / `UseIPv4` / `UseIPv6`，避免双栈网络下因 IPv6 不稳定导致的缓慢。 |

---

## 三、配套路由规则（Routing Rules）

配合 DNS 分流，在 `routing.rules` 中添加出站标签绑定：

```json
{
  "routing": {
    "domainStrategy": "IPIfNonMatch",
    "rules": [
      {
        "type": "field",
        "inboundTag": ["dns-in"],
        "outboundTag": "direct"
      },
      {
        "type": "field",
        "outboundTag": "direct",
        "domain": ["geosite:cn"]
      },
      {
        "type": "field",
        "outboundTag": "proxy",
        "domain": ["geosite:geolocation-!cn"]
      }
    ]
  }
}
```

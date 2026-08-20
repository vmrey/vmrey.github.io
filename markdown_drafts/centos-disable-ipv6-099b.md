---
title: CentOS 7 永久禁用 IPv6 网络协议的两种方法
date: 2021-08-10
category: Linux 与服务端
subcategory: 网络与反代
tags: Linux,CentOS,IPv6,网络配置,Sysctl
summary: 在仅需 IPv4 的服务器环境中，通过修改 sysctl 内核参数及网卡配置文件，彻底永久禁用 IPv6 避免网络请求异常超时。
readTime: 2 分钟阅读
---

# CentOS 7 永久禁用 IPv6 网络协议的两种方法

## 一、为什么需要禁用 IPv6？

在某些纯 IPv4 网络或特定的代理/容器环境中，系统默认启用的 IPv6 协议栈可能会导致 DNS 优先解析 AAAA 记录，从而引发 `curl`、`wget` 或上游连接偶发性超时等待。

---

## 二、方法一：修改 sysctl 内核参数（推荐）

通过在系统内核配置中追加禁用规则：

```bash
# 编辑 sysctl 配置文件
cat <<EOF >> /etc/sysctl.conf
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
net.ipv6.conf.lo.disable_ipv6 = 1
EOF

# 立即刷新使配置生效
sysctl -p
```

---

## 三、方法二：修改网卡配置

编辑对应网卡配置文件（例如 `/etc/sysconfig/network-scripts/ifcfg-eth0`）：

```bash
# 将 IPV6INIT 修改为 no
IPV6INIT="no"
```

重启网络服务即可：
```bash
systemctl restart network
```

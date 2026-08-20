---
title: CentOS 7 / RHEL Firewalld 防火墙常用命令与端口放行速查
date: 2021-08-25
category: Linux 与服务端
subcategory: 网络与反代
tags: Linux,Firewalld,防火墙,安全防护,端口管理
summary: 整理 Firewalld 核心操作指令：服务启停、开放/关闭指定 TCP/UDP 端口、查看放行清单及配置永久生效重载。
readTime: 3 分钟阅读
---

# CentOS 7 / RHEL Firewalld 防火墙常用命令与端口放行速查

## 一、Firewalld 基础服务管理

```bash
# 启动防火墙
systemctl start firewalld

# 查看防火墙运行状态
systemctl status firewalld
# 或使用专用指令
firewall-cmd --state

# 设置开机自启
systemctl enable firewalld

# 关闭防火墙
systemctl stop firewalld

# 禁用开机自启
systemctl disable firewalld
```

---

## 二、端口放行与管理指令

> **注意**：必须带有 `--permanent` 参数才能将规则持久化写入配置文件，否则服务器重启后失效。

```bash
# 1. 开放指定端口 (以 80 和 443 为例)
firewall-cmd --zone=public --add-port=80/tcp --permanent
firewall-cmd --zone=public --add-port=443/tcp --permanent

# 2. 开放连续端口范围 (以 8000 到 9000 为例)
firewall-cmd --zone=public --add-port=8000-9000/tcp --permanent

# 3. 移除/关闭已放行的端口
firewall-cmd --zone=public --remove-port=8080/tcp --permanent

# 4. 重新加载配置 (使修改的规则立即生效，必执行！)
firewall-cmd --reload
```

---

## 三、规则与放行状态查询

```bash
# 查询指定端口是否已开放 (返回 yes 或 no)
firewall-cmd --zone=public --query-port=80/tcp

# 查看当前区域开放的所有端口与服务列表
firewall-cmd --zone=public --list-all
```

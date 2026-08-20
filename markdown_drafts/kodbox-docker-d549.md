---
title: Kodbox 可道云私有网盘部署实战指南（Docker 与源码双方案）
date: 2026-07-02
category: Linux与服务端
subcategory: Docker与容器
tags: Linux,Docker,网盘存储,Kodbox,运维实战
summary: 全面整理 Kodbox 可道云私有云存储部署方案：包含 Docker Compose 极简持久化搭建与常规 LNMP 裸机源码快速安装。
readTime: 4 分钟阅读
---

# Kodbox 可道云私有网盘部署实战指南（Docker 与源码双方案）

> **Kodbox（可道云）** 是一款界面类似 Windows 桌面交互、体验极佳的私有云存储与在线协作文档管理系统。本文整理两种最常用的实战部署方案，供不同环境灵活选择。

---

## 方案对比与选型建议

| 部署方案 | 适用场景 | 核心依赖 | 维护成本 |
| :--- | :--- | :--- | :--- |
| **方案一：Docker Compose（推荐）** | 追求快速上线、环境隔离、数据迁移方便 | Docker & Docker Compose | ⭐ 极低（一键拉起，数据集中挂载） |
| **方案二：裸机源码安装** | 已有宝塔面板或 LNMP / LAMP 传统主机环境 | Nginx/Apache + PHP 7.4+ + SQLite/MySQL | ⭐⭐ 中等（需自行配置 Web 服务器与目录权限） |

---

## 方案一：Docker Compose 一键部署（推荐 · SQLite版）

本方案使用 Kodbox 官方镜像，内置 SQLite 轻量数据库，无需额外拉起 MySQL 容器，极省内存与 CPU 资源。

### 第一步：环境准备
确保服务器已安装 Docker 与 Docker Compose：
- 官方指引：[Docker 官方安装教程](https://docs.docker.com/engine/install/)

### 第二步：编写配置文件
在目标目录（如 `/opt/kodbox`）下创建 `docker-compose.yml` 文件：

```yaml
services:
  app:
    image: kodcloud/kodbox:latest
    container_name: kodbox-app
    ports:
      - 443:80        # 左侧 443 为宿主机访问端口，可按需改为 8080 或 80
    volumes:
      # 持久化挂载：Kodbox 的所有系统配置、SQLite数据库(./site/data/kodbox.sqlite)与用户网盘文件均保存在此
      - "./site:/var/www/html"
    restart: always
```

> 💡 **提示**：若宿主机 443 端口已被占用，可将端口映射修改为 `8080:80` 或 `8888:80`，后续通过 `http://服务器IP:8080` 访问。

### 第三步：拉取镜像并后台启动
在 `docker-compose.yml` 同级目录下执行：

```bash
docker compose up -d
```

### 第四步：初始化配置
浏览器访问 `http://服务器IP:映射端口`，按向导设定超级管理员账号与密码即可完成初始化。

---

## 方案二：常规非 Docker 源码部署（LNMP 环境）

适合在传统物理机、云服务器或已有 Web 环境（如宝塔、Nginx、Apache）中直接搭建。

### 第一步：下载可道云官方源码
进入你的 Web 站点根目录（如 `/www/wwwroot/kodbox`），执行下载：

```bash
wget https://github.com/kalcaddle/kodbox/archive/refs/heads/main.zip
```

### 第二步：解压源码包
```bash
unzip main.zip
```

### 第三步：配置目录读写权限
Kodbox 运行需要对根目录及子目录拥有写权限，执行递归赋权：

```bash
chmod -Rf 777 ./*
```

### 第四步：访问向导完成安装
1. 在浏览器中打开绑定的域名或 IP；
2. 按照可道云网页安装向导进行环境自检（确保 PHP 扩展如 `curl`、`mbstring`、`gd`、`sqlite3/mysqli` 就绪）；
3. 选择数据库类型（小型个人使用建议直接勾选 **SQLite**，免去配置 MySQL 用户名密码）；
4. 设置管理员账号与密码，点击「确定」立即进入私有云桌面。

---

## 常见问题排查与运维贴士

1. **端口冲突问题**：若启动失败，使用 `netstat -tlpn | grep 443` 检查端口是否被 Nginx 或 Apache 占用。
2. **数据备份方案**：
   - **Docker 版**：只需定时备份宿主机的 `./site` 文件夹，即可全量备份所有网盘文件与数据库。
   - **源码版**：备份站点目录及数据库即可。

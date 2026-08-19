---
title: 使用 Docker Compose 快速搭建 RustDesk 自建远程桌面中继服务器（hbbs/hbbr）
date: 2026-07-12
category: Linux与服务端
subcategory: Docker与容器
tags: Linux,Docker,RustDesk,远程控制,运维实战
summary: 基于 Docker Compose 完整部署开源远程桌面 RustDesk 的 ID 注册服务器与中继服务，详解 21115-21119 端口映射、防火墙放行与客户端 Key 密钥联调。
readTime: 5 分钟阅读
---

# 使用 Docker Compose 快速搭建 RustDesk 自建远程桌面中继服务器

> **RustDesk** 是一款优秀的开源远程桌面控制软件，支持全平台互通。通过自建 `hbbs`（ID 注册/打洞）与 `hbbr`（数据中继）服务器，可以彻底摆脱官方公共服务器的带宽限制与延迟波动，实现端到端高速低延迟直连。

---

## 一、核心架构与网络端口规划

RustDesk 服务端主要由两个核心组件构成：
1. **hbbs (RustDesk ID/Rendezvous Server)**：负责客户端 ID 分配、心跳注册以及 P2P 穿透打洞；
2. **hbbr (RustDesk Relay Server)**：当双方网络无法实现 P2P 直连时，提供全加密流量转发中继。

### 🌐 必须放行的防火墙端口列表

| 端口号 | 协议 | 对应服务 | 核心用途说明 |
| :--- | :--- | :--- | :--- |
| **`21115`** | TCP | `hbbs` | NAT 类型探测与打洞测试 |
| **`21116`** | **TCP + UDP** | `hbbs` | **核心注册端口**（UDP 用于心跳/注册；TCP 用于打洞与连接） |
| **`21117`** | TCP | `hbbr` | **核心中继端口**（提供流量转发中继服务） |
| **`21118`** | TCP | `hbbs` | Web 网页端客户端支持（选开） |
| **`21119`** | TCP | `hbbr` | Web 网页端中继支持（选开） |

> ⚠️ **注意**：请务必在服务器安全组（如阿里云/腾讯云/华为云）以及系统防火墙（UFW/Firewalld）中放行以上端口，尤其是 **`21116` 必须同时放行 TCP 和 UDP**！

---

## 二、服务端 Docker Compose 部署步骤

### 第一步：安装 Docker 环境
确保云主机已安装 Docker 与 Docker Compose 插件：
- 官方参考：[Docker 官方安装教程](https://docs.docker.com/engine/install/)

### 第二步：创建部署目录与编排配置
在服务器中创建专门的工作目录（如 `/opt/rustdesk`）：

```bash
mkdir -p /opt/rustdesk && cd /opt/rustdesk
```

创建 `docker-compose.yml` 配置文件：

```yaml
services:
  # 1. hbbs: ID注册与穿透打洞服务器
  hbbs:
    container_name: rustdesk-hbbs
    image: rustdesk/rustdesk-server:latest
    command: hbbs
    volumes:
      - ./data:/root   # 持久化挂载：存储生成的公私钥对与系统配置
    ports:
      - "21115:21115/tcp"
      - "21116:21116/tcp"
      - "21116:21116/udp"
      - "21118:21118/tcp"
    depends_on:
      - hbbr
    restart: unless-stopped

  # 2. hbbr: 流量中继服务器
  hbbr:
    container_name: rustdesk-hbbr
    image: rustdesk/rustdesk-server:latest
    command: hbbr
    volumes:
      - ./data:/root   # 与 hbbs 共享相同的密钥数据卷
    ports:
      - "21117:21117/tcp"
      - "21119:21119/tcp"
    restart: unless-stopped
```

### 第三步：拉取镜像并后台启动服务
```bash
docker compose up -d
```

启动完成后，执行 `docker compose ps` 查看容器状态，确保两个容器均为 `Up` 状态。

---

## 三、获取客户端通信加密 Key 密钥

服务首次成功启动后，`hbbs` 会在 `./data` 目录下自动生成一对非对称加密公私钥（用于防止中继服务器被他人未授权蹭用）：

执行以下命令查看你的专属公钥：

```bash
cat ./data/id_ed25519.pub
```

> 📋 输出的字符串即为你的 **Key 密钥**（类似一串 Base64 编码文本），复制并妥善保存。

---

## 四、RustDesk 客户端连接配置指南

在控制端和被控端（Windows / macOS / Linux / Android / iOS）电脑或手机上下载并打开 RustDesk 客户端：

1. 进入客户端 **「设置」 -> 「网络」 -> 「ID/中继服务器」**；
2. 填入自建服务器参数：
   - **ID 服务器**：`你的服务器公网IP` 或 `域名`（无需填端口，客户端默认 21116）
   - **中继服务器**：`你的服务器公网IP` 或 `域名`（无需填端口，客户端默认 21117）
   - **API 服务器**：`（留空即可）`
   - **Key 密钥**：填写上一步从 `id_ed25519.pub` 中复制的内容
3. 点击 **「确定」** 保存。

---

## 五、连接验证与就绪状态

返回 RustDesk 客户端主界面，查看底部状态栏：
- 若显示 🟢 **「就绪 (Ready)」**，说明已成功连接自建服务器；
- 此时双方主机即可直接输入对方的 9 位数字 ID 和密码，享受自建低延迟高速远程桌面体验！

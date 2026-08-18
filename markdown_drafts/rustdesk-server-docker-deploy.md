---
title: 使用 Docker 快速搭建 RustDesk 自建远程桌面中继服务器（hbbs/hbbr）
date: 2026-07-12
category: Linux与服务端
subcategory: Docker与容器
tags: Linux,Docker,RustDesk,远程控制
summary: 基于 Docker Compose 完整部署开源远程桌面 RustDesk 的 ID 注册服务器与中继服务，配置防火墙与 Key 密钥。
readTime: 5 分钟阅读
---

### docker安装 RustDesk 中继服务器
#### 第一步：
安装 docker [docker 官方安装教程](https://docs.docker.com/engine/install/)

#### 第二步：
创建一个 docker-compose.yml 文件把下面的配置内容添加进去、防火墙开放下面用到的端口

```sh
services:
  # hbbs 是 RustDesk ID 注册/中继服务器 (Rendezvous/Relay Server)
  hbbs:
    # 容器名称
    container_name: hbbs
    # 使用最新的 RustDesk 服务器镜像
    image: rustdesk/rustdesk-server:latest
    # 容器启动时运行 hbbs 命令
    command: hbbs
    # 映射数据卷：将宿主机当前目录下的 data 文件夹映射到容器的 /root 目录，用于保存配置和数据。
    volumes:
      - ./data:/root
    # !!! 移除 network_mode: "host" - 不使用 host 网络模式，而是使用 Docker 默认的 bridge 网络模式。
    # ports 映射格式：'宿主机端口:容器端口/协议'
    ports:
      # 21115 (TCP): 用于 NAT 类型测试。
      - "21115:21115/tcp"
      # 21116 (TCP/UDP): 请注意 21116 应该同时为 TCP 和 UDP 启用。 21116/UDP 用于 ID 注册和心跳服务。21116/TCP 用于 TCP 打洞和连接服务。
      - "21116:21116/tcp"
      - "21116:21116/udp"
      # 21118 (TCP): 用于支持网页客户端。
      - "21118:21118/tcp"
    # 依赖于 hbbr 容器，确保 hbbr 先启动。
    depends_on:
      - hbbr
    # 除非手动停止，否则容器会在退出时自动重启。
    restart: unless-stopped

  # hbbr 是 RustDesk 中继服务器 (Relay Server)
  hbbr:
    # 容器名称
    container_name: hbbr
    # 使用最新的 RustDesk 服务器镜像
    image: rustdesk/rustdesk-server:latest
    # 容器启动时运行 hbbr 命令
    command: hbbr
    # 映射数据卷，与 hbbs 共享配置和数据。
    volumes:
      - ./data:/root
    # !!! 移除 network_mode: "host" - 不使用 host 网络模式。
    # ports 映射格式：'宿主机端口:容器端口/协议'
    ports:
      # (TCP): 用于中继服务。
      - "21117:21117/tcp"
      # (TCP): 用于支持网页客户端。
      - "21119:21119/tcp"
    # 除非手动停止，否则容器会在退出时自动重启。
    restart: unless-stopped
```

#### 第三步：
拉取镜像并启动
```sh
docker compose up -d
```
### 客户端配置
1、ID服务器、ip:21116

2、中继服务器、ip:21117

3、key是这个文件里面的内容、id_ed25519.pub

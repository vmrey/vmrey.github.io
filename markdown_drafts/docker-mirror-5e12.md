---
title: Linux 生产环境 Docker 官方一键安装脚本与国内镜像加速配置
date: 2026-07-20
category: Linux与服务端
subcategory: Docker与容器
tags: Linux,Docker,运维,服务器
summary: 整理 Ubuntu/Debian/CentOS 下 Docker CE 与 Docker Compose 官方标准安装流程及最新稳定镜像源配置。
readTime: 8 分钟阅读
---

## 安装 Docker（Linux）官方脚本 ##
```sh
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

```
## Docker 常用命令汇总

让我们开始探索 Docker 的三大核心要素：**镜像（Image）**、**容器（Container）** 和 **数据卷（Volume）**。

## 一、🚀 镜像 (Image) 操作：构建与获取基石

镜像是容器运行的基础，它包含了运行应用程序所需的所有文件、库和配置。

### 1. 获取和管理镜像

| 核心命令 | 用途说明 | 常用示例/选项 |
| :--- | :--- | :--- |
| **`docker pull`** | **下载** 远程镜像（如 Docker Hub） | `docker pull nginx:latest` |
| **`docker images`** | **列出** 本地所有镜像 | `docker images -a` (显示所有镜像，包括中间层) |
| **`docker search`** | **搜索** Docker Hub 上的镜像 | `docker search redis` |
| **`docker rmi`** | **删除** 本地的一个或多个镜像 | `docker rmi myimage:tag` (删除前需停止依赖的容器) |

### 2. 构建和分享镜像

| 核心命令 | 用途说明 | 常用示例/选项 |
| :--- | :--- | :--- |
| **`docker build`** | 使用 `Dockerfile` **构建** 新镜像 | `docker build -t myapp:v1.0 .` (`-t` 命名标签, `.` 为上下文路径) |
| **`docker push`** | **推送** 镜像到远程仓库 | `docker push username/repo:tag` |
| **`docker history`** | **查看** 镜像的构建历史和层信息 | `docker history myapp:v1.0` |

---

## 二、📦 容器 (Container) 操作：运行与交互环境

容器是镜像的运行时实例。它是轻量级、可移植且相互隔离的。

### 1. 容器的生命周期管理

这是日常操作中最频繁使用的一组命令。

| 核心命令 | 用途说明 | 关键选项/示例 |
| :--- | :--- | :--- |
| **`docker run`** | **创建并启动** 容器（最重要） | **`docker run -d --name web -p 8080:80 nginx`** |
| | | `-d`: 后台运行 |
| | | `--name`: 命名容器 |
| | | `-p`: 端口映射 (`宿主机端口:容器端口`) |
| **`docker ps`** | **列出** 运行中的容器 | `docker ps -a` (列出所有容器，包括已停止的) |
| **`docker start / stop / restart`** | **启停/重启** 容器 | `docker stop web` |
| **`docker rm`** | **删除** 一个已停止的容器 | `docker rm web` |
| **`docker kill`** | **强制停止** 容器（立即发送 SIGKILL） | `docker kill web` |

### 2. 容器的交互与调试

| 核心命令 | 用途说明 | 常用示例 |
| :--- | :--- | :--- |
| **`docker logs`** | **查看** 容器的标准输出日志 | `docker logs -f web` (`-f` 持续跟踪日志) |
| **`docker exec`** | 在运行中的容器内 **执行命令** | **`docker exec -it web /bin/bash`** (进入容器的 shell 环境) |
| **`docker attach`** | **连接** 到容器的主进程 | 慎用！退出可能会导致容器停止。 |
| **`docker inspect`** | **查看** 容器的详细配置和状态 | `docker inspect web` |
| **`docker cp`** | **复制** 文件/目录到容器或从容器复制 | `docker cp /host/file.txt web:/app/` |

---

## 三、💾 数据与网络：持久化与互联

在生产环境中，数据卷和网络是确保数据持久性和服务间通信的关键。

### 1. 数据卷 (Volume) 管理

数据卷用于将数据存储在宿主机的文件系统中，独立于容器的生命周期，实现数据持久化。

| 核心命令 | 用途说明 | 常用示例 |
| :--- | :--- | :--- |
| **`docker run -v`** | 运行时 **挂载** 数据卷或目录 | `docker run -v mydata:/app/data ...` (挂载命名卷) |
| **`docker volume create`** | **创建** 命名数据卷 | `docker volume create mydata` |
| **`docker volume ls`** | **列出** 所有数据卷 | |
| **`docker volume rm`** | **删除** 数据卷 | `docker volume rm mydata` |

### 2. 网络 (Network) 管理

Docker 默认提供了 `bridge` 等网络模式，但创建自定义网络能更好地实现容器间的隔离和命名解析。

| 核心命令 | 用途说明 | 常用示例 |
| :--- | :--- | :--- |
| **`docker network create`** | **创建** 自定义网络 | `docker network create my-bridge` |
| **`docker network ls`** | **列出** 所有网络 | |
| **`docker network connect`** | 将容器 **连接** 到指定网络 | `docker network connect my-bridge web` |

---

## 四、🧹 维护与清理：保持环境整洁

Docker 用久了会堆积大量的停止容器、未使用的网络和悬空镜像，占用磁盘空间。

| 核心命令 | 用途说明 | 关键选项/示例 |
| :--- | :--- | :--- |
| **`docker system df`** | **查看** Docker 磁盘空间使用情况 | |
| **`docker system prune`** | **一键清理** 停止的容器、未使用的网络和悬空镜像 | `docker system prune -a` |
| | | `-a` 会删除所有未被任何容器使用的镜像 |

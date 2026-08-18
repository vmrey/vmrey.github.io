---
title: Kodbox 可道云私有网盘 Docker Compose 一键部署指南
date: 2026-07-02
category: Linux与服务端
subcategory: Docker与容器
tags: Linux,Docker,网盘存储,Kodbox
summary: 轻量好用的私有云存储 Kodbox 容器化搭建，持久化挂载数据卷与 MySQL 数据库快速联调。
readTime: 3 分钟阅读
---

### 可道云 docker 安装教程【sqlite数据库版本】
#### 第一步：
安装 docker [docker 官方安装教程](https://docs.docker.com/engine/install/)

#### 第二步：
创建一个 docker-compose.yml 文件把下面的配置内容添加进去、防火墙开放443端口

```sh
services:
  app:
    image: kodcloud/kodbox
    ports:
      - 443:80        # 左边 443 是主机访问端口，可按需修改
    # 移除 links: db 和 links: redis
    volumes:
      # 保持数据持久化是关键！
      # Kodbox 会将 SQLite 数据库文件放在这个映射的目录内，例如：./site/data/kodbox.sqlite
      - "./site:/var/www/html"        # 左边 ./site 代表kodbox持久化目录位置
    restart: always
```

#### 第三步：
拉取镜像并启动
```sh
docker compose up -d
```

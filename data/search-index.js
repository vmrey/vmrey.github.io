/**
 * vmrey.github.io 全局全文检索索引数据库
 * 由 build.js 自动生成构建
 */
window.SEARCH_DATABASE = window.BLOG_SEARCH_INDEX = [
  {
    "id": "claude-code-bypass-permissions-configuration",
    "title": "Claude Code 开启 Bypass 免确认权限配置指南",
    "url": "posts/claude-code-bypass-permissions-configuration.html",
    "category": "效率工具与软件",
    "date": "2026-08-10",
    "tags": [
      "效率工具",
      "AI工具",
      "Claude",
      "终端工具"
    ],
    "summary": "配置 Claude CLI 开发者工具的默认权限模式，跳过危险操作弹窗提示，实现全自动化命令行执行。",
    "content": "Claude开启 bypass权限配置 javascript \"permissions\": { \"defaultMode\": \"bypassPermissions\" }, \"skipDangerousModePermissionPrompt\": true,",
    "fullText": "Claude Code 开启 Bypass 免确认权限配置指南 配置 Claude CLI 开发者工具的默认权限模式，跳过危险操作弹窗提示，实现全自动化命令行执行。 效率工具 AI工具 Claude 终端工具 Claude开启 bypass权限配置 javascript \"permissions\": { \"defaultMode\": \"bypassPermissions\" }, \"skipDangerousModePermissionPrompt\": true,",
    "sections": []
  },
  {
    "id": "git-common-commands-cheatsheet",
    "title": "Git 常用高频命令与分支协同工作流速查清单",
    "url": "posts/git-common-commands-cheatsheet.html",
    "category": "效率工具与软件",
    "date": "2026-08-05",
    "tags": [
      "效率工具",
      "Git",
      "版本控制",
      "工作流"
    ],
    "summary": "整理日常开发中最常用的 Git 核心命令：分支切换、暂存管理、冲突解决、标签管理与远程同步。",
    "content": "添加用户 sh ssh-keygen -t rsa -C 'admin@example.com' 第二步：找到公钥文件 sh .ssh/id_rsa.pub 初始化仓库命令 sh git init git 全局配置 sh git config --global user.name \"admin\" && git config --global user.email \"admin@example.com\"",
    "fullText": "Git 常用高频命令与分支协同工作流速查清单 整理日常开发中最常用的 Git 核心命令：分支切换、暂存管理、冲突解决、标签管理与远程同步。 效率工具 Git 版本控制 工作流 添加用户 sh ssh-keygen -t rsa -C 'admin@example.com' 第二步：找到公钥文件 sh .ssh/id_rsa.pub 初始化仓库命令 sh git init git 全局配置 sh git config --global user.name \"admin\" && git config --global user.email \"admin@example.com\"",
    "sections": [
      {
        "title": "添加用户",
        "anchor": "#添加用户",
        "id": "添加用户"
      },
      {
        "title": "第二步：找到公钥文件",
        "anchor": "#第二步-找到公钥文件",
        "id": "第二步-找到公钥文件"
      },
      {
        "title": "初始化仓库命令",
        "anchor": "#初始化仓库命令",
        "id": "初始化仓库命令"
      },
      {
        "title": "git 全局配置",
        "anchor": "#git-全局配置",
        "id": "git-全局配置"
      }
    ]
  },
  {
    "id": "svn-subversion-commands-cheatsheet",
    "title": "SVN (Subversion) 常用版本控制命令速查与使用指南",
    "url": "posts/svn-subversion-commands-cheatsheet.html",
    "category": "效率工具与软件",
    "date": "2026-07-30",
    "tags": [
      "效率工具",
      "SVN",
      "版本控制"
    ],
    "summary": "整理 SVN 常用操作命令：checkout 检出、commit 提交、update 更新、log 历史与 revert 回退。",
    "content": "macbook 中使用命令 如果你删除了很多文件，并且想删除所有状态为 '!' missing 的文件： sh svn status | grep '^!' | sed 's/^! //' | xargs svn delete 添加新增的文件 sh svn status | grep '^?' | sed 's/^? //' | xargs svn add",
    "fullText": "SVN (Subversion) 常用版本控制命令速查与使用指南 整理 SVN 常用操作命令：checkout 检出、commit 提交、update 更新、log 历史与 revert 回退。 效率工具 SVN 版本控制 macbook 中使用命令 如果你删除了很多文件，并且想删除所有状态为 '!' missing 的文件： sh svn status | grep '^!' | sed 's/^! //' | xargs svn delete 添加新增的文件 sh svn status | grep '^?' | sed 's/^? //' | xargs svn add",
    "sections": [
      {
        "title": "如果你删除了很多文件，并且想删除所有状态为 '!' (missing) 的文件：",
        "anchor": "#如果你删除了很多文件-并且想删除所有状态为-missing-的文件",
        "id": "如果你删除了很多文件-并且想删除所有状态为-missing-的文件"
      },
      {
        "title": "添加新增的文件",
        "anchor": "#添加新增的文件",
        "id": "添加新增的文件"
      }
    ]
  },
  {
    "id": "recommended-awesome-open-source-software",
    "title": "开发者日常必备的良心开源软件与生产力工具清单",
    "url": "posts/recommended-awesome-open-source-software.html",
    "category": "效率工具与软件",
    "date": "2026-07-28",
    "tags": [
      "效率工具",
      "开源软件",
      "生产力",
      "工具推荐"
    ],
    "summary": "精选盘点涵盖截图录屏、终端工具、本地搜索、文件传输与剪贴板管理的顶级开源软件清单。",
    "content": "常用的开源软件 SSH工具 FinalShell - 简介 ：一款功能强大的SSH工具，支持文件传输、命令管理 - 下载地址 ： 下载地址 https://www.hostbuf.com/t/988.html - 官网 ： http://www.hostbuf.com/ http://www.hostbuf.com/ MobaXterm 家庭版 - 简介 ：全能终端软件，支持SSH、RDP、VNC等多种协议 - 下载地址 ： 下载地址 https://mobaxterm.mobatek.net/download-home-edition.html - 官网 ： https://mobaxterm.mobatek.net/ https://mobaxterm.mobatek.net/ 系统工具 Ventoy - 简介 ：多系统启动U盘制作工具，支持ISO文件直接启动 - 下载地址 ： GitHub Releases https://github.com/ventoy/Ventoy/releases - 官网 ： https://www.ventoy.net/ https://www.ventoy.net/ Geek - 简介 ：Windows系统清理工具，支持强力卸载软件、清理注册表、删除顽固文件 - 下载地址 ： GitHub Releases https://github.com/helibao0/Geek/releases - 官网 ： https://geekuninstaller.com/ https://geekuninstaller.com/ 安全工具 Fail2Ban - 简介 ：Linux服务器安全工具，用于防止暴力破解攻击，自动封禁恶意IP - 安装方式 ： sudo apt-get install fail2ban Debian/Ubuntu 或 sudo yum install fail2ban CentOS - 官网 ： https://www.fail2ban.org/ https://www.fail2ban.org/ 编辑工具 MarkdownPad - 简介 ：Windows平台Markdown编辑器，支持实时预览和导出 - 下载地址 ： 下载地址 http://markdownpad.com/download.html - 官网 ： http://markdownpad.com/ http://markdownpad.com/",
    "fullText": "开发者日常必备的良心开源软件与生产力工具清单 精选盘点涵盖截图录屏、终端工具、本地搜索、文件传输与剪贴板管理的顶级开源软件清单。 效率工具 开源软件 生产力 工具推荐 常用的开源软件 SSH工具 FinalShell - 简介 ：一款功能强大的SSH工具，支持文件传输、命令管理 - 下载地址 ： 下载地址 https://www.hostbuf.com/t/988.html - 官网 ： http://www.hostbuf.com/ http://www.hostbuf.com/ MobaXterm 家庭版 - 简介 ：全能终端软件，支持SSH、RDP、VNC等多种协议 - 下载地址 ： 下载地址 https://mobaxterm.mobatek.net/download-home-edition.html - 官网 ： https://mobaxterm.mobatek.net/ https://mobaxterm.mobatek.net/ 系统工具 Ventoy - 简介 ：多系统启动U盘制作工具，支持ISO文件直接启动 - 下载地址 ： GitHub Releases https://github.com/ventoy/Ventoy/releases - 官网 ： https://www.ventoy.net/ https://www.ventoy.net/ Geek - 简介 ：Windows系统清理工具，支持强力卸载软件、清理注册表、删除顽固文件 - 下载地址 ： GitHub Releases https://github.com/helibao0/Geek/releases - 官网 ： https://geekuninstaller.com/ https://geekuninstaller.com/ 安全工具 Fail2Ban - 简介 ：Linux服务器安全工具，用于防止暴力破解攻击，自动封禁恶意IP - 安装方式 ： sudo apt-get install fail2ban Debian/Ubuntu 或 sudo yum install fail2ban CentOS - 官网 ： https://www.fail2ban.org/ https://www.fail2ban.org/ 编辑工具 MarkdownPad - 简介 ：Windows平台Markdown编辑器，支持实时预览和导出 - 下载地址 ： 下载地址 http://markdownpad.com/download.html - 官网 ： http://markdownpad.com/ http://markdownpad.com/",
    "sections": [
      {
        "title": "SSH工具",
        "anchor": "#ssh工具",
        "id": "ssh工具"
      },
      {
        "title": "FinalShell",
        "anchor": "#finalshell",
        "id": "finalshell"
      },
      {
        "title": "MobaXterm 家庭版",
        "anchor": "#mobaxterm-家庭版",
        "id": "mobaxterm-家庭版"
      },
      {
        "title": "系统工具",
        "anchor": "#系统工具",
        "id": "系统工具"
      },
      {
        "title": "Ventoy",
        "anchor": "#ventoy",
        "id": "ventoy"
      },
      {
        "title": "Geek",
        "anchor": "#geek",
        "id": "geek"
      },
      {
        "title": "安全工具",
        "anchor": "#安全工具",
        "id": "安全工具"
      },
      {
        "title": "Fail2Ban",
        "anchor": "#fail2ban",
        "id": "fail2ban"
      },
      {
        "title": "编辑工具",
        "anchor": "#编辑工具",
        "id": "编辑工具"
      },
      {
        "title": "MarkdownPad",
        "anchor": "#markdownpad",
        "id": "markdownpad"
      }
    ]
  },
  {
    "id": "docker-official-install-mirror-guide",
    "title": "Linux 生产环境 Docker 官方一键安装脚本与国内镜像加速配置",
    "url": "posts/docker-official-install-mirror-guide.html",
    "category": "Linux与服务端",
    "date": "2026-07-20",
    "tags": [
      "Linux",
      "Docker",
      "运维",
      "服务器"
    ],
    "summary": "整理 Ubuntu/Debian/CentOS 下 Docker CE 与 Docker Compose 官方标准安装流程及最新稳定镜像源配置。",
    "content": "安装 Docker（Linux）官方脚本 sh curl -fsSL https://get.docker.com -o get-docker.sh sudo sh get-docker.sh Docker 常用命令汇总 让我们开始探索 Docker 的三大核心要素： 镜像（Image） 、 容器（Container） 和 数据卷（Volume） 。 一、🚀 镜像 Image 操作：构建与获取基石 镜像是容器运行的基础，它包含了运行应用程序所需的所有文件、库和配置。 1. 获取和管理镜像 | 核心命令 | 用途说明 | 常用示例/选项 | | :--- | :--- | :--- | | docker pull | 下载 远程镜像（如 Docker Hub） | docker pull nginx:latest | | docker images | 列出 本地所有镜像 | docker images -a 显示所有镜像，包括中间层 | | docker search | 搜索 Docker Hub 上的镜像 | docker search redis | | docker rmi | 删除 本地的一个或多个镜像 | docker rmi myimage:tag 删除前需停止依赖的容器 | 2. 构建和分享镜像 | 核心命令 | 用途说明 | 常用示例/选项 | | :--- | :--- | :--- | | docker build | 使用 Dockerfile 构建 新镜像 | docker build -t myapp:v1.0 . -t 命名标签, . 为上下文路径 | | docker push | 推送 镜像到远程仓库 | docker push username/repo:tag | | docker history | 查看 镜像的构建历史和层信息 | docker history myapp:v1.0 | --- 二、📦 容器 Container 操作：运行与交互环境 容器是镜像的运行时实例。它是轻量级、可移植且相互隔离的。 1. 容器的生命周期管理 这是日常操作中最频繁使用的一组命令。 | 核心命令 | 用途说明 | 关键选项/示例 | | :--- | :--- | :--- | | docker run | 创建并启动 容器（最重要） | docker run -d --name web -p 8080:80 nginx | | | | -d : 后台运行 | | | | --name : 命名容器 | | | | -p : 端口映射 宿主机端口:容器端口 | | docker ps | 列出 运行中的容器 | docker ps -a 列出所有容器，包括已停止的 | | docker start / stop / restart | 启停/重启 容器 | docker stop web | | docker rm | 删除 一个已停止的容器 | docker rm web | | docker kill | 强制停止 容器（立即发送 SIGKILL） | docker kill web | 2. 容器的交互与调试 | 核心命令 | 用途说明 | 常用示例 | | :--- | :--- | :--- | | docker logs | 查看 容器的标准输出日志 | docker logs -f web -f 持续跟踪日志 | | docker exec | 在运行中的容器内 执行命令 | docker exec -it web /bin/bash 进入容器的 shell 环境 | | docker attach | 连接 到容器的主进程 | 慎用！退出可能会导致容器停止。 | | docker inspect | 查看 容器的详细配置和状态 | docker inspect web | | docker cp | 复制 文件/目录到容器或从容器复制 | docker cp /host/file.txt web:/app/ | --- 三、💾 数据与网络：持久化与互联 在生产环境中，数据卷和网络是确保数据持久性和服务间通信的关键。 1. 数据卷 Volume 管理 数据卷用于将数据存储在宿主机的文件系统中，独立于容器的生命周期，实现数据持久化。 | 核心命令 | 用途说明 | 常用示例 | | :--- | :--- | :--- | | docker run -v | 运行时 挂载 数据卷或目录 | docker run -v mydata:/app/data ... 挂载命名卷 | | docker volume create | 创建 命名数据卷 | docker volume create mydata | | docker volume ls | 列出 所有数据卷 | | | docker volume rm | 删除 数据卷 | docker volume rm mydata | 2. 网络 Network 管理 Docker 默认提供了 bridge 等网络模式，但创建自定义网络能更好地实现容器间的隔离和命名解析。 | 核心命令 | 用途说明 | 常用示例 | | :--- | :--- | :--- | | docker network create | 创建 自定义网络 | docker network create my-bridge | | docker network ls | 列出 所有网络 | | | docker network connect | 将容器 连接 到指定网络 | docker network connect my-bridge web | --- 四、🧹 维护与清理：保持环境整洁 Docker 用久了会堆积大量的停止容器、未使用的网络和悬空镜像，占用磁盘空间。 | 核心命令 | 用途说明 | 关键选项/示例 | | :--- | :--- | :--- | | docker system df | 查看 Docker 磁盘空间使用情况 | | | docker system prune | 一键清理 停止的容器、未使用的网络和悬空镜像 | docker system prune -a | | | | -a 会删除所有未被任何容器使用的镜像 |",
    "fullText": "Linux 生产环境 Docker 官方一键安装脚本与国内镜像加速配置 整理 Ubuntu/Debian/CentOS 下 Docker CE 与 Docker Compose 官方标准安装流程及最新稳定镜像源配置。 Linux Docker 运维 服务器 安装 Docker（Linux）官方脚本 sh curl -fsSL https://get.docker.com -o get-docker.sh sudo sh get-docker.sh Docker 常用命令汇总 让我们开始探索 Docker 的三大核心要素： 镜像（Image） 、 容器（Container） 和 数据卷（Volume） 。 一、🚀 镜像 Image 操作：构建与获取基石 镜像是容器运行的基础，它包含了运行应用程序所需的所有文件、库和配置。 1. 获取和管理镜像 | 核心命令 | 用途说明 | 常用示例/选项 | | :--- | :--- | :--- | | docker pull | 下载 远程镜像（如 Docker Hub） | docker pull nginx:latest | | docker images | 列出 本地所有镜像 | docker images -a 显示所有镜像，包括中间层 | | docker search | 搜索 Docker Hub 上的镜像 | docker search redis | | docker rmi | 删除 本地的一个或多个镜像 | docker rmi myimage:tag 删除前需停止依赖的容器 | 2. 构建和分享镜像 | 核心命令 | 用途说明 | 常用示例/选项 | | :--- | :--- | :--- | | docker build | 使用 Dockerfile 构建 新镜像 | docker build -t myapp:v1.0 . -t 命名标签, . 为上下文路径 | | docker push | 推送 镜像到远程仓库 | docker push username/repo:tag | | docker history | 查看 镜像的构建历史和层信息 | docker history myapp:v1.0 | --- 二、📦 容器 Container 操作：运行与交互环境 容器是镜像的运行时实例。它是轻量级、可移植且相互隔离的。 1. 容器的生命周期管理 这是日常操作中最频繁使用的一组命令。 | 核心命令 | 用途说明 | 关键选项/示例 | | :--- | :--- | :--- | | docker run | 创建并启动 容器（最重要） | docker run -d --name web -p 8080:80 nginx | | | | -d : 后台运行 | | | | --name : 命名容器 | | | | -p : 端口映射 宿主机端口:容器端口 | | docker ps | 列出 运行中的容器 | docker ps -a 列出所有容器，包括已停止的 | | docker start / stop / restart | 启停/重启 容器 | docker stop web | | docker rm | 删除 一个已停止的容器 | docker rm web | | docker kill | 强制停止 容器（立即发送 SIGKILL） | docker kill web | 2. 容器的交互与调试 | 核心命令 | 用途说明 | 常用示例 | | :--- | :--- | :--- | | docker logs | 查看 容器的标准输出日志 | docker logs -f web -f 持续跟踪日志 | | docker exec | 在运行中的容器内 执行命令 | docker exec -it web /bin/bash 进入容器的 shell 环境 | | docker attach | 连接 到容器的主进程 | 慎用！退出可能会导致容器停止。 | | docker inspect | 查看 容器的详细配置和状态 | docker inspect web | | docker cp | 复制 文件/目录到容器或从容器复制 | docker cp /host/file.txt web:/app/ | --- 三、💾 数据与网络：持久化与互联 在生产环境中，数据卷和网络是确保数据持久性和服务间通信的关键。 1. 数据卷 Volume 管理 数据卷用于将数据存储在宿主机的文件系统中，独立于容器的生命周期，实现数据持久化。 | 核心命令 | 用途说明 | 常用示例 | | :--- | :--- | :--- | | docker run -v | 运行时 挂载 数据卷或目录 | docker run -v mydata:/app/data ... 挂载命名卷 | | docker volume create | 创建 命名数据卷 | docker volume create mydata | | docker volume ls | 列出 所有数据卷 | | | docker volume rm | 删除 数据卷 | docker volume rm mydata | 2. 网络 Network 管理 Docker 默认提供了 bridge 等网络模式，但创建自定义网络能更好地实现容器间的隔离和命名解析。 | 核心命令 | 用途说明 | 常用示例 | | :--- | :--- | :--- | | docker network create | 创建 自定义网络 | docker network create my-bridge | | docker network ls | 列出 所有网络 | | | docker network connect | 将容器 连接 到指定网络 | docker network connect my-bridge web | --- 四、🧹 维护与清理：保持环境整洁 Docker 用久了会堆积大量的停止容器、未使用的网络和悬空镜像，占用磁盘空间。 | 核心命令 | 用途说明 | 关键选项/示例 | | :--- | :--- | :--- | | docker system df | 查看 Docker 磁盘空间使用情况 | | | docker system prune | 一键清理 停止的容器、未使用的网络和悬空镜像 | docker system prune -a | | | | -a 会删除所有未被任何容器使用的镜像 |",
    "sections": [
      {
        "title": "安装 Docker（Linux）官方脚本 ##",
        "anchor": "#安装-docker-linux-官方脚本",
        "id": "安装-docker-linux-官方脚本"
      },
      {
        "title": "Docker 常用命令汇总",
        "anchor": "#docker-常用命令汇总",
        "id": "docker-常用命令汇总"
      },
      {
        "title": "一、🚀 镜像 (Image) 操作：构建与获取基石",
        "anchor": "#一-镜像-image-操作-构建与获取基石",
        "id": "一-镜像-image-操作-构建与获取基石"
      },
      {
        "title": "1. 获取和管理镜像",
        "anchor": "#1-获取和管理镜像",
        "id": "1-获取和管理镜像"
      },
      {
        "title": "2. 构建和分享镜像",
        "anchor": "#2-构建和分享镜像",
        "id": "2-构建和分享镜像"
      },
      {
        "title": "二、📦 容器 (Container) 操作：运行与交互环境",
        "anchor": "#二-容器-container-操作-运行与交互环境",
        "id": "二-容器-container-操作-运行与交互环境"
      },
      {
        "title": "1. 容器的生命周期管理",
        "anchor": "#1-容器的生命周期管理",
        "id": "1-容器的生命周期管理"
      },
      {
        "title": "2. 容器的交互与调试",
        "anchor": "#2-容器的交互与调试",
        "id": "2-容器的交互与调试"
      },
      {
        "title": "三、💾 数据与网络：持久化与互联",
        "anchor": "#三-数据与网络-持久化与互联",
        "id": "三-数据与网络-持久化与互联"
      },
      {
        "title": "1. 数据卷 (Volume) 管理",
        "anchor": "#1-数据卷-volume-管理",
        "id": "1-数据卷-volume-管理"
      },
      {
        "title": "2. 网络 (Network) 管理",
        "anchor": "#2-网络-network-管理",
        "id": "2-网络-network-管理"
      },
      {
        "title": "四、🧹 维护与清理：保持环境整洁",
        "anchor": "#四-维护与清理-保持环境整洁",
        "id": "四-维护与清理-保持环境整洁"
      }
    ]
  },
  {
    "id": "image-compression-tools-comparison",
    "title": "高质量无损图片压缩工具与批量处理方案横向评测",
    "url": "posts/image-compression-tools-comparison.html",
    "category": "效率工具与软件",
    "date": "2026-07-15",
    "tags": [
      "效率工具",
      "图片压缩",
      "Web优化"
    ],
    "summary": "横向对比 TinyPNG、Caesium、Squoosh 等多款主流压缩工具，如何在保持视觉高保真的同时将体积缩减 70%。",
    "content": "图片压缩工具（在线压缩） 在线压缩工具推荐 1. TinyPNG - 最受欢迎的在线压缩工具 官网 https://tinypng.com 特点： - ✅ 支持 PNG、JPEG、WebP 格式 - ✅ 智能压缩算法，质量损失小 - ✅ 免费版单次可上传 20 张图片，单张最大 5MB - ✅ 支持批量压缩和下载 - ✅ 提供 API 接口供开发者使用 压缩原理： 使用有损压缩算法，通过减少图片中的颜色数量和优化像素数据来减小文件大小。 适用场景： 网页图片、社交媒体图片、电商产品图 --- 2. JPEGmini - 专业级 JPEG 压缩 官网 https://jpegmini.com 特点： - ✅ 专注于 JPEG 格式压缩 - ✅ 保持高质量的同时实现高压缩率 - ✅ 支持 4K/8K 高清图片 - ✅ 提供桌面版和在线版 - ✅ 适合专业摄影师和设计师 压缩原理： 利用人眼视觉特性，在不影响主观质量的前提下去除冗余数据。 适用场景： 摄影作品、高清图片、专业设计 --- 3. Compressor.io - 多种压缩模式 官网 https://compressor.io 特点： - ✅ 支持 PNG、JPEG、GIF、SVG 格式 - ✅ 提供有损和无损两种压缩模式 - ✅ 实时预览压缩前后对比 - ✅ 显示压缩比例和文件大小 - ✅ 支持拖拽上传 压缩原理： 结合多种压缩算法，根据图片类型自动选择最优方案。 适用场景： 需要精确控制压缩质量的场景 --- 4. Kraken.io - 开发者友好 官网 https://kraken.io 特点： - ✅ 支持多种图片格式 - ✅ 提供强大的 API 接口 - ✅ 支持 WebP 和 AVIF 格式转换 - ✅ 批量压缩功能 - ✅ CDN 集成支持 压缩原理： 结合 Google 的 Guetzli 和 Zopfli 算法，实现高质量压缩。 适用场景： 开发者、网站优化、批量处理 --- 5. Squoosh - Google 开源工具 官网 https://squoosh.app 特点： - ✅ Google 开源项目 - ✅ 完全基于浏览器，数据不上传服务器 - ✅ 实时调整压缩参数 - ✅ 支持多种格式转换 - ✅ 显示详细的压缩信息 压缩原理： 使用 WebAssembly 技术在浏览器端进行压缩，保护用户隐私。 适用场景： 注重隐私安全的用户、需要精确调整参数的场景 --- 本地压缩工具 1. ImageOptim（Mac） 官网 https://imageoptim.com 特点： - ✅ 免费开源 - ✅ 支持拖放操作 - ✅ 自动选择最优压缩算法 - ✅ 支持 PNG、JPEG、GIF、WebP - ✅ 保持原始文件结构 2. RIOT（Windows） 官网 https://riot-optimizer.com 特点： - ✅ 免费软件 - ✅ 支持批量处理 - ✅ 实时预览压缩效果 - ✅ 支持 PNG、JPEG、WebP - ✅ 提供多种压缩级别 3. GIMP（跨平台） 官网 https://www.gimp.org 特点： - ✅ 免费开源图像编辑软件 - ✅ 强大的图片处理功能 - ✅ 支持多种格式导出 - ✅ 可自定义压缩参数 - ✅ 适合高级用户 --- 压缩技巧和最佳实践 1. 选择合适的图片格式 | 格式 | 特点 | 适用场景 | |------|------|----------| | JPEG | 有损压缩，支持数百万颜色 | 照片、复杂图像 | | PNG | 无损压缩，支持透明 | 图标、Logo、简单图形 | | WebP | Google 开发，压缩率更高 | 现代浏览器网页 | | AVIF | 新一代格式，压缩率最高 | 追求极致压缩率 | 2. 压缩参数设置建议 - 网页图片 ：质量 60-80%，平衡大小和质量 - 缩略图 ：质量 50-70%，优先减小体积 - 高清展示图 ：质量 80-90%，保证视觉效果 - Logo/图标 ：使用 PNG 或 SVG，保持清晰度 3. 批量压缩流程 1. 收集需要压缩的图片 2. 选择合适的压缩工具 3. 设置压缩参数 4. 预览压缩效果 5. 批量压缩并下载 6. 替换原始图片 7. 测试页面加载效果 4. 自动化压缩脚本 bash 使用 Node.js 批量压缩图片 npm install imagemin imagemin-mozjpeg imagemin-pngquant const imagemin = require 'imagemin' ; const imageminMozjpeg = require 'imagemin-mozjpeg' ; const imageminPngquant = require 'imagemin-pngquant' ; async => { const files = await imagemin 'src/images/ .{jpg,png}' , { destination: 'dist/images', plugins: imageminMozjpeg { quality: 80 } , imageminPngquant { quality: 0.6, 0.8 } } ; console.log '压缩完成:', files ; } ; --- 压缩效果对比 | 工具 | 原始大小 | 压缩后大小 | 压缩率 | |------|---------|-----------|--------| | TinyPNG | 100KB | 35KB | 65% | | Compressor.io | 100KB | 38KB | 62% | | Kraken.io | 100KB | 32KB | 68% | | Squoosh | 100KB | 36KB | 64% | --- 选择建议 | 需求 | 推荐工具 | |------|----------| | 快速压缩 | TinyPNG | | 隐私安全 | Squoosh | | 批量处理 | Kraken.io | | 专业设计 | JPEGmini | | 开发者 | Kraken.io API | | 免费本地 | ImageOptim/RIOT | --- 注意事项 1. 备份原始图片 ：压缩前最好备份原始文件 2. 测试压缩效果 ：不同图片压缩效果不同，需测试 3. 注意版权 ：确保有权利压缩和使用图片 4. 格式兼容性 ：考虑目标平台的格式支持 5. 压缩级别 ：不要过度压缩，影响视觉效果 --- > 选择合适的压缩工具可以显著减小图片体积，提升网页加载速度，改善用户体验！",
    "fullText": "高质量无损图片压缩工具与批量处理方案横向评测 横向对比 TinyPNG、Caesium、Squoosh 等多款主流压缩工具，如何在保持视觉高保真的同时将体积缩减 70%。 效率工具 图片压缩 Web优化 图片压缩工具（在线压缩） 在线压缩工具推荐 1. TinyPNG - 最受欢迎的在线压缩工具 官网 https://tinypng.com 特点： - ✅ 支持 PNG、JPEG、WebP 格式 - ✅ 智能压缩算法，质量损失小 - ✅ 免费版单次可上传 20 张图片，单张最大 5MB - ✅ 支持批量压缩和下载 - ✅ 提供 API 接口供开发者使用 压缩原理： 使用有损压缩算法，通过减少图片中的颜色数量和优化像素数据来减小文件大小。 适用场景： 网页图片、社交媒体图片、电商产品图 --- 2. JPEGmini - 专业级 JPEG 压缩 官网 https://jpegmini.com 特点： - ✅ 专注于 JPEG 格式压缩 - ✅ 保持高质量的同时实现高压缩率 - ✅ 支持 4K/8K 高清图片 - ✅ 提供桌面版和在线版 - ✅ 适合专业摄影师和设计师 压缩原理： 利用人眼视觉特性，在不影响主观质量的前提下去除冗余数据。 适用场景： 摄影作品、高清图片、专业设计 --- 3. Compressor.io - 多种压缩模式 官网 https://compressor.io 特点： - ✅ 支持 PNG、JPEG、GIF、SVG 格式 - ✅ 提供有损和无损两种压缩模式 - ✅ 实时预览压缩前后对比 - ✅ 显示压缩比例和文件大小 - ✅ 支持拖拽上传 压缩原理： 结合多种压缩算法，根据图片类型自动选择最优方案。 适用场景： 需要精确控制压缩质量的场景 --- 4. Kraken.io - 开发者友好 官网 https://kraken.io 特点： - ✅ 支持多种图片格式 - ✅ 提供强大的 API 接口 - ✅ 支持 WebP 和 AVIF 格式转换 - ✅ 批量压缩功能 - ✅ CDN 集成支持 压缩原理： 结合 Google 的 Guetzli 和 Zopfli 算法，实现高质量压缩。 适用场景： 开发者、网站优化、批量处理 --- 5. Squoosh - Google 开源工具 官网 https://squoosh.app 特点： - ✅ Google 开源项目 - ✅ 完全基于浏览器，数据不上传服务器 - ✅ 实时调整压缩参数 - ✅ 支持多种格式转换 - ✅ 显示详细的压缩信息 压缩原理： 使用 WebAssembly 技术在浏览器端进行压缩，保护用户隐私。 适用场景： 注重隐私安全的用户、需要精确调整参数的场景 --- 本地压缩工具 1. ImageOptim（Mac） 官网 https://imageoptim.com 特点： - ✅ 免费开源 - ✅ 支持拖放操作 - ✅ 自动选择最优压缩算法 - ✅ 支持 PNG、JPEG、GIF、WebP - ✅ 保持原始文件结构 2. RIOT（Windows） 官网 https://riot-optimizer.com 特点： - ✅ 免费软件 - ✅ 支持批量处理 - ✅ 实时预览压缩效果 - ✅ 支持 PNG、JPEG、WebP - ✅ 提供多种压缩级别 3. GIMP（跨平台） 官网 https://www.gimp.org 特点： - ✅ 免费开源图像编辑软件 - ✅ 强大的图片处理功能 - ✅ 支持多种格式导出 - ✅ 可自定义压缩参数 - ✅ 适合高级用户 --- 压缩技巧和最佳实践 1. 选择合适的图片格式 | 格式 | 特点 | 适用场景 | |------|------|----------| | JPEG | 有损压缩，支持数百万颜色 | 照片、复杂图像 | | PNG | 无损压缩，支持透明 | 图标、Logo、简单图形 | | WebP | Google 开发，压缩率更高 | 现代浏览器网页 | | AVIF | 新一代格式，压缩率最高 | 追求极致压缩率 | 2. 压缩参数设置建议 - 网页图片 ：质量 60-80%，平衡大小和质量 - 缩略图 ：质量 50-70%，优先减小体积 - 高清展示图 ：质量 80-90%，保证视觉效果 - Logo/图标 ：使用 PNG 或 SVG，保持清晰度 3. 批量压缩流程 1. 收集需要压缩的图片 2. 选择合适的压缩工具 3. 设置压缩参数 4. 预览压缩效果 5. 批量压缩并下载 6. 替换原始图片 7. 测试页面加载效果 4. 自动化压缩脚本 bash 使用 Node.js 批量压缩图片 npm install imagemin imagemin-mozjpeg imagemin-pngquant const imagemin = require 'imagemin' ; const imageminMozjpeg = require 'imagemin-mozjpeg' ; const imageminPngquant = require 'imagemin-pngquant' ; async => { const files = await imagemin 'src/images/ .{jpg,png}' , { destination: 'dist/images', plugins: imageminMozjpeg { quality: 80 } , imageminPngquant { quality: 0.6, 0.8 } } ; console.log '压缩完成:', files ; } ; --- 压缩效果对比 | 工具 | 原始大小 | 压缩后大小 | 压缩率 | |------|---------|-----------|--------| | TinyPNG | 100KB | 35KB | 65% | | Compressor.io | 100KB | 38KB | 62% | | Kraken.io | 100KB | 32KB | 68% | | Squoosh | 100KB | 36KB | 64% | --- 选择建议 | 需求 | 推荐工具 | |------|----------| | 快速压缩 | TinyPNG | | 隐私安全 | Squoosh | | 批量处理 | Kraken.io | | 专业设计 | JPEGmini | | 开发者 | Kraken.io API | | 免费本地 | ImageOptim/RIOT | --- 注意事项 1. 备份原始图片 ：压缩前最好备份原始文件 2. 测试压缩效果 ：不同图片压缩效果不同，需测试 3. 注意版权 ：确保有权利压缩和使用图片 4. 格式兼容性 ：考虑目标平台的格式支持 5. 压缩级别 ：不要过度压缩，影响视觉效果 --- > 选择合适的压缩工具可以显著减小图片体积，提升网页加载速度，改善用户体验！",
    "sections": [
      {
        "title": "在线压缩工具推荐",
        "anchor": "#在线压缩工具推荐",
        "id": "在线压缩工具推荐"
      },
      {
        "title": "1. TinyPNG - 最受欢迎的在线压缩工具",
        "anchor": "#1-tinypng-最受欢迎的在线压缩工具",
        "id": "1-tinypng-最受欢迎的在线压缩工具"
      },
      {
        "title": "2. JPEGmini - 专业级 JPEG 压缩",
        "anchor": "#2-jpegmini-专业级-jpeg-压缩",
        "id": "2-jpegmini-专业级-jpeg-压缩"
      },
      {
        "title": "3. Compressor.io - 多种压缩模式",
        "anchor": "#3-compressor-io-多种压缩模式",
        "id": "3-compressor-io-多种压缩模式"
      },
      {
        "title": "4. Kraken.io - 开发者友好",
        "anchor": "#4-kraken-io-开发者友好",
        "id": "4-kraken-io-开发者友好"
      },
      {
        "title": "5. Squoosh - Google 开源工具",
        "anchor": "#5-squoosh-google-开源工具",
        "id": "5-squoosh-google-开源工具"
      },
      {
        "title": "本地压缩工具",
        "anchor": "#本地压缩工具",
        "id": "本地压缩工具"
      },
      {
        "title": "1. ImageOptim（Mac）",
        "anchor": "#1-imageoptim-mac",
        "id": "1-imageoptim-mac"
      },
      {
        "title": "2. RIOT（Windows）",
        "anchor": "#2-riot-windows",
        "id": "2-riot-windows"
      },
      {
        "title": "3. GIMP（跨平台）",
        "anchor": "#3-gimp-跨平台",
        "id": "3-gimp-跨平台"
      },
      {
        "title": "压缩技巧和最佳实践",
        "anchor": "#压缩技巧和最佳实践",
        "id": "压缩技巧和最佳实践"
      },
      {
        "title": "1. 选择合适的图片格式",
        "anchor": "#1-选择合适的图片格式",
        "id": "1-选择合适的图片格式"
      },
      {
        "title": "2. 压缩参数设置建议",
        "anchor": "#2-压缩参数设置建议",
        "id": "2-压缩参数设置建议"
      },
      {
        "title": "3. 批量压缩流程",
        "anchor": "#3-批量压缩流程",
        "id": "3-批量压缩流程"
      },
      {
        "title": "4. 自动化压缩脚本",
        "anchor": "#4-自动化压缩脚本",
        "id": "4-自动化压缩脚本"
      },
      {
        "title": "压缩效果对比",
        "anchor": "#压缩效果对比",
        "id": "压缩效果对比"
      },
      {
        "title": "选择建议",
        "anchor": "#选择建议",
        "id": "选择建议"
      },
      {
        "title": "注意事项",
        "anchor": "#注意事项",
        "id": "注意事项"
      }
    ]
  },
  {
    "id": "rustdesk-server-docker-deploy",
    "title": "使用 Docker 快速搭建 RustDesk 自建远程桌面中继服务器（hbbs/hbbr）",
    "url": "posts/rustdesk-server-docker-deploy.html",
    "category": "Linux与服务端",
    "date": "2026-07-12",
    "tags": [
      "Linux",
      "Docker",
      "RustDesk",
      "远程控制"
    ],
    "summary": "基于 Docker Compose 完整部署开源远程桌面 RustDesk 的 ID 注册服务器与中继服务，配置防火墙与 Key 密钥。",
    "content": "docker安装 RustDesk 中继服务器 第一步： 安装 docker docker 官方安装教程 https://docs.docker.com/engine/install/ 第二步： 创建一个 docker-compose.yml 文件把下面的配置内容添加进去、防火墙开放下面用到的端口 sh services: hbbs 是 RustDesk ID 注册/中继服务器 Rendezvous/Relay Server hbbs: 容器名称 container_name: hbbs 使用最新的 RustDesk 服务器镜像 image: rustdesk/rustdesk-server:latest 容器启动时运行 hbbs 命令 command: hbbs 映射数据卷：将宿主机当前目录下的 data 文件夹映射到容器的 /root 目录，用于保存配置和数据。 volumes: - ./data:/root !!! 移除 network_mode: \"host\" - 不使用 host 网络模式，而是使用 Docker 默认的 bridge 网络模式。 ports 映射格式：'宿主机端口:容器端口/协议' ports: 21115 TCP : 用于 NAT 类型测试。 - \"21115:21115/tcp\" 21116 TCP/UDP : 请注意 21116 应该同时为 TCP 和 UDP 启用。 21116/UDP 用于 ID 注册和心跳服务。21116/TCP 用于 TCP 打洞和连接服务。 - \"21116:21116/tcp\" - \"21116:21116/udp\" 21118 TCP : 用于支持网页客户端。 - \"21118:21118/tcp\" 依赖于 hbbr 容器，确保 hbbr 先启动。 depends_on: - hbbr 除非手动停止，否则容器会在退出时自动重启。 restart: unless-stopped hbbr 是 RustDesk 中继服务器 Relay Server hbbr: 容器名称 container_name: hbbr 使用最新的 RustDesk 服务器镜像 image: rustdesk/rustdesk-server:latest 容器启动时运行 hbbr 命令 command: hbbr 映射数据卷，与 hbbs 共享配置和数据。 volumes: - ./data:/root !!! 移除 network_mode: \"host\" - 不使用 host 网络模式。 ports 映射格式：'宿主机端口:容器端口/协议' ports: TCP : 用于中继服务。 - \"21117:21117/tcp\" TCP : 用于支持网页客户端。 - \"21119:21119/tcp\" 除非手动停止，否则容器会在退出时自动重启。 restart: unless-stopped 第三步： 拉取镜像并启动 sh docker compose up -d 客户端配置 1、ID服务器、ip:21116 2、中继服务器、ip:21117 3、key是这个文件里面的内容、id_ed25519.pub",
    "fullText": "使用 Docker 快速搭建 RustDesk 自建远程桌面中继服务器（hbbs/hbbr） 基于 Docker Compose 完整部署开源远程桌面 RustDesk 的 ID 注册服务器与中继服务，配置防火墙与 Key 密钥。 Linux Docker RustDesk 远程控制 docker安装 RustDesk 中继服务器 第一步： 安装 docker docker 官方安装教程 https://docs.docker.com/engine/install/ 第二步： 创建一个 docker-compose.yml 文件把下面的配置内容添加进去、防火墙开放下面用到的端口 sh services: hbbs 是 RustDesk ID 注册/中继服务器 Rendezvous/Relay Server hbbs: 容器名称 container_name: hbbs 使用最新的 RustDesk 服务器镜像 image: rustdesk/rustdesk-server:latest 容器启动时运行 hbbs 命令 command: hbbs 映射数据卷：将宿主机当前目录下的 data 文件夹映射到容器的 /root 目录，用于保存配置和数据。 volumes: - ./data:/root !!! 移除 network_mode: \"host\" - 不使用 host 网络模式，而是使用 Docker 默认的 bridge 网络模式。 ports 映射格式：'宿主机端口:容器端口/协议' ports: 21115 TCP : 用于 NAT 类型测试。 - \"21115:21115/tcp\" 21116 TCP/UDP : 请注意 21116 应该同时为 TCP 和 UDP 启用。 21116/UDP 用于 ID 注册和心跳服务。21116/TCP 用于 TCP 打洞和连接服务。 - \"21116:21116/tcp\" - \"21116:21116/udp\" 21118 TCP : 用于支持网页客户端。 - \"21118:21118/tcp\" 依赖于 hbbr 容器，确保 hbbr 先启动。 depends_on: - hbbr 除非手动停止，否则容器会在退出时自动重启。 restart: unless-stopped hbbr 是 RustDesk 中继服务器 Relay Server hbbr: 容器名称 container_name: hbbr 使用最新的 RustDesk 服务器镜像 image: rustdesk/rustdesk-server:latest 容器启动时运行 hbbr 命令 command: hbbr 映射数据卷，与 hbbs 共享配置和数据。 volumes: - ./data:/root !!! 移除 network_mode: \"host\" - 不使用 host 网络模式。 ports 映射格式：'宿主机端口:容器端口/协议' ports: TCP : 用于中继服务。 - \"21117:21117/tcp\" TCP : 用于支持网页客户端。 - \"21119:21119/tcp\" 除非手动停止，否则容器会在退出时自动重启。 restart: unless-stopped 第三步： 拉取镜像并启动 sh docker compose up -d 客户端配置 1、ID服务器、ip:21116 2、中继服务器、ip:21117 3、key是这个文件里面的内容、id_ed25519.pub",
    "sections": [
      {
        "title": "docker安装 RustDesk 中继服务器",
        "anchor": "#docker安装-rustdesk-中继服务器",
        "id": "docker安装-rustdesk-中继服务器"
      },
      {
        "title": "第一步：",
        "anchor": "#第一步",
        "id": "第一步"
      },
      {
        "title": "第二步：",
        "anchor": "#第二步",
        "id": "第二步"
      },
      {
        "title": "第三步：",
        "anchor": "#第三步",
        "id": "第三步"
      },
      {
        "title": "客户端配置",
        "anchor": "#客户端配置",
        "id": "客户端配置"
      }
    ]
  },
  {
    "id": "photoshop-batch-compress-images-jsx-script",
    "title": "Photoshop 批量压缩与图片重命名 ExtendScript (JSX) 脚本源码",
    "url": "posts/photoshop-batch-compress-images-jsx-script.html",
    "category": "效率工具与软件",
    "date": "2026-07-05",
    "tags": [
      "效率工具",
      "Photoshop",
      "JavaScript",
      "自动化"
    ],
    "summary": "使用 Adobe ExtendScript 编写 PS 自动化脚本，一键递归处理整个文件夹中的图片并按质量比导出。",
    "content": "PS 批量压缩图片脚本 此脚本可以批量压缩图片，支持 JPG、PNG、GIF 格式，压缩质量可自定义。 📝 脚本功能 | 功能 | 说明 | |------|------| | 批量处理 | 自动扫描指定文件夹及其子文件夹 | | 格式支持 | JPG、PNG、GIF、JFIF | | 质量控制 | 可自定义压缩质量（1-100） | | 智能输出 | 自动在原文件夹创建压缩后目录 | | 错误处理 | 自动跳过损坏或无法打开的文件 | 🚀 使用方法 方法一：快速使用（推荐） 1. 创建脚本文件 ：在桌面新建 ImgCompress.jsx 文件 2. 复制源码 ：将下方源码复制进去 3. 运行脚本 ： - 打开 Photoshop - 菜单： 文件 → 脚本 → 浏览 → 选择 ImgCompress.jsx 4. 选择文件夹 ：在弹出的对话框中选择要压缩的图片文件夹 5. 设置参数 ：在弹出的对话框中设置压缩质量 方法二：传统方式（需手动配置路径） javascript // 手动配置方式（不推荐，建议使用方法一） var config = { inputFolder: \"E:/images\", // 输入文件夹 outputFolder: \"E:/images_compressed\", // 输出文件夹 quality: 80, // 压缩质量 1-100 overwriteOriginal: false // 是否覆盖原文件 }; --- 📄 完整源码 javascript / Photoshop 批量图片压缩脚本 支持格式：JPG、PNG、GIF、JFIF 作者：优化版 / // ==================== 配置参数 ==================== var CONFIG = { DEFAULT_QUALITY: 80, // 默认压缩质量 1-100 OUTPUT_SUFFIX: \"_compressed\", // 输出文件夹后缀 SUPPORTED_FORMATS: \".jpg\", \".jpeg\", \".jfif\", \".png\", \".gif\" }; // ==================== 主程序 ==================== function main { try { // 1. 选择源文件夹 var sourceFolder = Folder.selectDialog \"请选择要压缩的图片文件夹\" ; if !sourceFolder || !sourceFolder.exists { alert \"未选择有效文件夹，脚本已退出\" ; return; } // 2. 获取压缩质量 var quality = prompt \"请输入压缩质量 1-100，数值越大质量越好 \", CONFIG.DEFAULT_QUALITY ; quality = parseInt quality ; if isNaN quality || quality < 1 || quality > 100 { alert \"无效的质量值，使用默认值: \" + CONFIG.DEFAULT_QUALITY ; quality = CONFIG.DEFAULT_QUALITY; } // 3. 创建输出文件夹 var outputFolder = new Folder sourceFolder.fsName + CONFIG.OUTPUT_SUFFIX ; if !outputFolder.exists { outputFolder.create ; } // 4. 获取所有图片文件 var files = getImageFiles sourceFolder ; if files.length === 0 { alert \"未找到支持的图片文件\" ; return; } // 5. 批量处理 var successCount = 0; var failCount = 0; for var i = 0; i < files.length; i++ { var file = files i ; try { // 显示进度 var progress = Math.round i + 1 / files.length 100 ; $.writeln \"处理中: \" + progress + \"% - \" + file.name ; // 压缩并保存 compressImage file, outputFolder, quality ; successCount++; } catch e { $.writeln \"处理失败: \" + file.name + \" - \" + e.message ; failCount++; } } // 6. 显示结果 var resultMsg = \"批量压缩完成！\\n\\n\" + \"成功: \" + successCount + \" 张\\n\" + \"失败: \" + failCount + \" 张\\n\" + \"输出目录: \" + outputFolder.fsName; alert resultMsg ; $.writeln resultMsg ; } catch error { alert \"脚本执行出错: \" + error.message ; $.writeln \"错误: \" + error.message ; } } // ==================== 工具函数 ==================== / 获取文件夹中所有支持的图片文件（递归） @param {Folder} folder - 文件夹对象 @returns {File } - 图片文件数组 / function getImageFiles folder { var files = ; var allFiles = folder.getFiles ; for var i = 0; i < allFiles.length; i++ { var item = allFiles i ; if item instanceof Folder { // 递归处理子文件夹 files = files.concat getImageFiles item ; } else if item instanceof File { // 检查是否为支持的格式 var ext = item.name.toLowerCase .substring item.name.lastIndexOf \".\" ; if CONFIG.SUPPORTED_FORMATS.indexOf ext !== -1 { files.push item ; } } } return files; } / 压缩单张图片 @param {File} inputFile - 输入文件 @param {Folder} outputFolder - 输出文件夹 @param {number} quality - 压缩质量 1-100 / function compressImage inputFile, outputFolder, quality { // 1. 打开图片 var doc = app.open inputFile ; if !doc { throw new Error \"无法打开文件\" ; } try { // 2. 构建输出路径 var outputPath = outputFolder.fsName + \"/\" + inputFile.name; // 3. 根据格式设置导出选项 var exportOptions = getExportOptions inputFile, quality ; // 4. 导出图片 doc.exportDocument new File outputPath , ExportType.SAVEFORWEB, exportOptions ; } finally { // 5. 关闭文档（不保存原文件） if app.activeDocument { app.activeDocument.close SaveOptions.DONOTSAVECHANGES ; } } } / 获取导出选项 @param {File} file - 文件对象 @param {number} quality - 压缩质量 @returns {ExportOptionsSaveForWeb} / function getExportOptions file, quality { var ext = file.name.toLowerCase ; var options = new ExportOptionsSaveForWeb ; if ext.match /\\.jpg$/ || ext.match /\\.jpeg$/ || ext.match /\\.jfif$/ { // JPG 格式 options.format = SaveDocumentType.JPEG; options.quality = quality; options.optimized = true; options.progressive = false; } else if ext.match /\\.png$/ { // PNG 格式 options.format = SaveDocumentType.PNG; options.PNG8 = false; // 使用 PNG-24 options.transparency = true; options.interlaced = false; } else if ext.match /\\.gif$/ { // GIF 格式 options.format = SaveDocumentType.COMPUSERVEGIF; options.transparency = true; options.includeProfile = false; options.lossy = 0; options.colors = 256; options.colorReduction = ColorReductionType.SELECTIVE; options.ditherAmount = 0; options.dither = Dither.NOISE; options.palette = Palette.LOCALADAPTIVE; } return options; } // ==================== 启动脚本 ==================== main ; --- ⚙️ 参数说明 | 参数 | 说明 | 默认值 | |------|------|--------| | DEFAULT_QUALITY | 默认压缩质量 | 80 | | OUTPUT_SUFFIX | 输出文件夹后缀 | _compressed | | SUPPORTED_FORMATS | 支持的图片格式 | JPG、PNG、GIF、JFIF | 📊 压缩质量参考 | 质量值 | 适用场景 | |--------|----------| | 90-100 | 高清图片、设计稿 | | 70-89 | 网页图片、社交媒体 | | 50-69 | 缩略图、预览图 | | 1-49 | 极低质量占位图 | 🛡️ 注意事项 1. 备份重要文件 - 建议在运行脚本前备份原始图片，以防意外！ 2. Photoshop 版本要求 - 支持 Photoshop CS6 及以上版本 - 需启用 JavaScript 脚本支持 3. 常见问题 | 问题 | 原因 | 解决方案 | |------|------|----------| | 脚本无法运行 | 未启用脚本支持 | 编辑 → 首选项 → 增效工具 → 勾选\"允许脚本连接到网络\" | | 图片无法打开 | 文件损坏或格式不支持 | 检查文件完整性，确保是支持的格式 | | 输出为空 | 没有找到图片文件 | 确认文件夹中有 JPG/PNG/GIF 文件 | | 内存不足 | 一次性处理过多大图片 | 分批处理，或增加 Photoshop 内存分配 | 📁 输出结构 原文件夹/ ├── photo1.jpg ├── photo2.png ├── subfolder/ │ └── photo3.gif └── 原文件夹_compressed/ ← 自动创建 ├── photo1.jpg ├── photo2.png └── subfolder/ └── photo3.gif",
    "fullText": "Photoshop 批量压缩与图片重命名 ExtendScript (JSX) 脚本源码 使用 Adobe ExtendScript 编写 PS 自动化脚本，一键递归处理整个文件夹中的图片并按质量比导出。 效率工具 Photoshop JavaScript 自动化 PS 批量压缩图片脚本 此脚本可以批量压缩图片，支持 JPG、PNG、GIF 格式，压缩质量可自定义。 📝 脚本功能 | 功能 | 说明 | |------|------| | 批量处理 | 自动扫描指定文件夹及其子文件夹 | | 格式支持 | JPG、PNG、GIF、JFIF | | 质量控制 | 可自定义压缩质量（1-100） | | 智能输出 | 自动在原文件夹创建压缩后目录 | | 错误处理 | 自动跳过损坏或无法打开的文件 | 🚀 使用方法 方法一：快速使用（推荐） 1. 创建脚本文件 ：在桌面新建 ImgCompress.jsx 文件 2. 复制源码 ：将下方源码复制进去 3. 运行脚本 ： - 打开 Photoshop - 菜单： 文件 → 脚本 → 浏览 → 选择 ImgCompress.jsx 4. 选择文件夹 ：在弹出的对话框中选择要压缩的图片文件夹 5. 设置参数 ：在弹出的对话框中设置压缩质量 方法二：传统方式（需手动配置路径） javascript // 手动配置方式（不推荐，建议使用方法一） var config = { inputFolder: \"E:/images\", // 输入文件夹 outputFolder: \"E:/images_compressed\", // 输出文件夹 quality: 80, // 压缩质量 1-100 overwriteOriginal: false // 是否覆盖原文件 }; --- 📄 完整源码 javascript / Photoshop 批量图片压缩脚本 支持格式：JPG、PNG、GIF、JFIF 作者：优化版 / // ==================== 配置参数 ==================== var CONFIG = { DEFAULT_QUALITY: 80, // 默认压缩质量 1-100 OUTPUT_SUFFIX: \"_compressed\", // 输出文件夹后缀 SUPPORTED_FORMATS: \".jpg\", \".jpeg\", \".jfif\", \".png\", \".gif\" }; // ==================== 主程序 ==================== function main { try { // 1. 选择源文件夹 var sourceFolder = Folder.selectDialog \"请选择要压缩的图片文件夹\" ; if !sourceFolder || !sourceFolder.exists { alert \"未选择有效文件夹，脚本已退出\" ; return; } // 2. 获取压缩质量 var quality = prompt \"请输入压缩质量 1-100，数值越大质量越好 \", CONFIG.DEFAULT_QUALITY ; quality = parseInt quality ; if isNaN quality || quality < 1 || quality > 100 { alert \"无效的质量值，使用默认值: \" + CONFIG.DEFAULT_QUALITY ; quality = CONFIG.DEFAULT_QUALITY; } // 3. 创建输出文件夹 var outputFolder = new Folder sourceFolder.fsName + CONFIG.OUTPUT_SUFFIX ; if !outputFolder.exists { outputFolder.create ; } // 4. 获取所有图片文件 var files = getImageFiles sourceFolder ; if files.length === 0 { alert \"未找到支持的图片文件\" ; return; } // 5. 批量处理 var successCount = 0; var failCount = 0; for var i = 0; i < files.length; i++ { var file = files i ; try { // 显示进度 var progress = Math.round i + 1 / files.length 100 ; $.writeln \"处理中: \" + progress + \"% - \" + file.name ; // 压缩并保存 compressImage file, outputFolder, quality ; successCount++; } catch e { $.writeln \"处理失败: \" + file.name + \" - \" + e.message ; failCount++; } } // 6. 显示结果 var resultMsg = \"批量压缩完成！\\n\\n\" + \"成功: \" + successCount + \" 张\\n\" + \"失败: \" + failCount + \" 张\\n\" + \"输出目录: \" + outputFolder.fsName; alert resultMsg ; $.writeln resultMsg ; } catch error { alert \"脚本执行出错: \" + error.message ; $.writeln \"错误: \" + error.message ; } } // ==================== 工具函数 ==================== / 获取文件夹中所有支持的图片文件（递归） @param {Folder} folder - 文件夹对象 @returns {File } - 图片文件数组 / function getImageFiles folder { var files = ; var allFiles = folder.getFiles ; for var i = 0; i < allFiles.length; i++ { var item = allFiles i ; if item instanceof Folder { // 递归处理子文件夹 files = files.concat getImageFiles item ; } else if item instanceof File { // 检查是否为支持的格式 var ext = item.name.toLowerCase .substring item.name.lastIndexOf \".\" ; if CONFIG.SUPPORTED_FORMATS.indexOf ext !== -1 { files.push item ; } } } return files; } / 压缩单张图片 @param {File} inputFile - 输入文件 @param {Folder} outputFolder - 输出文件夹 @param {number} quality - 压缩质量 1-100 / function compressImage inputFile, outputFolder, quality { // 1. 打开图片 var doc = app.open inputFile ; if !doc { throw new Error \"无法打开文件\" ; } try { // 2. 构建输出路径 var outputPath = outputFolder.fsName + \"/\" + inputFile.name; // 3. 根据格式设置导出选项 var exportOptions = getExportOptions inputFile, quality ; // 4. 导出图片 doc.exportDocument new File outputPath , ExportType.SAVEFORWEB, exportOptions ; } finally { // 5. 关闭文档（不保存原文件） if app.activeDocument { app.activeDocument.close SaveOptions.DONOTSAVECHANGES ; } } } / 获取导出选项 @param {File} file - 文件对象 @param {number} quality - 压缩质量 @returns {ExportOptionsSaveForWeb} / function getExportOptions file, quality { var ext = file.name.toLowerCase ; var options = new ExportOptionsSaveForWeb ; if ext.match /\\.jpg$/ || ext.match /\\.jpeg$/ || ext.match /\\.jfif$/ { // JPG 格式 options.format = SaveDocumentType.JPEG; options.quality = quality; options.optimized = true; options.progressive = false; } else if ext.match /\\.png$/ { // PNG 格式 options.format = SaveDocumentType.PNG; options.PNG8 = false; // 使用 PNG-24 options.transparency = true; options.interlaced = false; } else if ext.match /\\.gif$/ { // GIF 格式 options.format = SaveDocumentType.COMPUSERVEGIF; options.transparency = true; options.includeProfile = false; options.lossy = 0; options.colors = 256; options.colorReduction = ColorReductionType.SELECTIVE; options.ditherAmount = 0; options.dither = Dither.NOISE; options.palette = Palette.LOCALADAPTIVE; } return options; } // ==================== 启动脚本 ==================== main ; --- ⚙️ 参数说明 | 参数 | 说明 | 默认值 | |------|------|--------| | DEFAULT_QUALITY | 默认压缩质量 | 80 | | OUTPUT_SUFFIX | 输出文件夹后缀 | _compressed | | SUPPORTED_FORMATS | 支持的图片格式 | JPG、PNG、GIF、JFIF | 📊 压缩质量参考 | 质量值 | 适用场景 | |--------|----------| | 90-100 | 高清图片、设计稿 | | 70-89 | 网页图片、社交媒体 | | 50-69 | 缩略图、预览图 | | 1-49 | 极低质量占位图 | 🛡️ 注意事项 1. 备份重要文件 - 建议在运行脚本前备份原始图片，以防意外！ 2. Photoshop 版本要求 - 支持 Photoshop CS6 及以上版本 - 需启用 JavaScript 脚本支持 3. 常见问题 | 问题 | 原因 | 解决方案 | |------|------|----------| | 脚本无法运行 | 未启用脚本支持 | 编辑 → 首选项 → 增效工具 → 勾选\"允许脚本连接到网络\" | | 图片无法打开 | 文件损坏或格式不支持 | 检查文件完整性，确保是支持的格式 | | 输出为空 | 没有找到图片文件 | 确认文件夹中有 JPG/PNG/GIF 文件 | | 内存不足 | 一次性处理过多大图片 | 分批处理，或增加 Photoshop 内存分配 | 📁 输出结构 原文件夹/ ├── photo1.jpg ├── photo2.png ├── subfolder/ │ └── photo3.gif └── 原文件夹_compressed/ ← 自动创建 ├── photo1.jpg ├── photo2.png └── subfolder/ └── photo3.gif",
    "sections": [
      {
        "title": "📝 脚本功能",
        "anchor": "#脚本功能",
        "id": "脚本功能"
      },
      {
        "title": "🚀 使用方法",
        "anchor": "#使用方法",
        "id": "使用方法"
      },
      {
        "title": "方法一：快速使用（推荐）",
        "anchor": "#方法一-快速使用-推荐",
        "id": "方法一-快速使用-推荐"
      },
      {
        "title": "方法二：传统方式（需手动配置路径）",
        "anchor": "#方法二-传统方式-需手动配置路径",
        "id": "方法二-传统方式-需手动配置路径"
      },
      {
        "title": "📄 完整源码",
        "anchor": "#完整源码",
        "id": "完整源码"
      },
      {
        "title": "⚙️ 参数说明",
        "anchor": "#参数说明",
        "id": "参数说明"
      },
      {
        "title": "📊 压缩质量参考",
        "anchor": "#压缩质量参考",
        "id": "压缩质量参考"
      },
      {
        "title": "🛡️ 注意事项",
        "anchor": "#注意事项",
        "id": "注意事项"
      },
      {
        "title": "1. 备份重要文件",
        "anchor": "#1-备份重要文件",
        "id": "1-备份重要文件"
      },
      {
        "title": "2. Photoshop 版本要求",
        "anchor": "#2-photoshop-版本要求",
        "id": "2-photoshop-版本要求"
      },
      {
        "title": "3. 常见问题",
        "anchor": "#3-常见问题",
        "id": "3-常见问题"
      },
      {
        "title": "📁 输出结构",
        "anchor": "#输出结构",
        "id": "输出结构"
      }
    ]
  },
  {
    "id": "kodbox-cloud-disk-docker-install",
    "title": "Kodbox 可道云私有网盘 Docker Compose 一键部署指南",
    "url": "posts/kodbox-cloud-disk-docker-install.html",
    "category": "Linux与服务端",
    "date": "2026-07-02",
    "tags": [
      "Linux",
      "Docker",
      "网盘存储",
      "Kodbox"
    ],
    "summary": "轻量好用的私有云存储 Kodbox 容器化搭建，持久化挂载数据卷与 MySQL 数据库快速联调。",
    "content": "可道云 docker 安装教程【sqlite数据库版本】 第一步： 安装 docker docker 官方安装教程 https://docs.docker.com/engine/install/ 第二步： 创建一个 docker-compose.yml 文件把下面的配置内容添加进去、防火墙开放443端口 sh services: app: image: kodcloud/kodbox ports: - 443:80 左边 443 是主机访问端口，可按需修改 移除 links: db 和 links: redis volumes: 保持数据持久化是关键！ Kodbox 会将 SQLite 数据库文件放在这个映射的目录内，例如：./site/data/kodbox.sqlite - \"./site:/var/www/html\" 左边 ./site 代表kodbox持久化目录位置 restart: always 第三步： 拉取镜像并启动 sh docker compose up -d",
    "fullText": "Kodbox 可道云私有网盘 Docker Compose 一键部署指南 轻量好用的私有云存储 Kodbox 容器化搭建，持久化挂载数据卷与 MySQL 数据库快速联调。 Linux Docker 网盘存储 Kodbox 可道云 docker 安装教程【sqlite数据库版本】 第一步： 安装 docker docker 官方安装教程 https://docs.docker.com/engine/install/ 第二步： 创建一个 docker-compose.yml 文件把下面的配置内容添加进去、防火墙开放443端口 sh services: app: image: kodcloud/kodbox ports: - 443:80 左边 443 是主机访问端口，可按需修改 移除 links: db 和 links: redis volumes: 保持数据持久化是关键！ Kodbox 会将 SQLite 数据库文件放在这个映射的目录内，例如：./site/data/kodbox.sqlite - \"./site:/var/www/html\" 左边 ./site 代表kodbox持久化目录位置 restart: always 第三步： 拉取镜像并启动 sh docker compose up -d",
    "sections": [
      {
        "title": "可道云 docker 安装教程【sqlite数据库版本】",
        "anchor": "#可道云-docker-安装教程-sqlite数据库版本",
        "id": "可道云-docker-安装教程-sqlite数据库版本"
      },
      {
        "title": "第一步：",
        "anchor": "#第一步",
        "id": "第一步"
      },
      {
        "title": "第二步：",
        "anchor": "#第二步",
        "id": "第二步"
      },
      {
        "title": "第三步：",
        "anchor": "#第三步",
        "id": "第三步"
      }
    ]
  },
  {
    "id": "batch-rename-files-bat-script",
    "title": "Windows 批量修改文件名与字符替换批处理 (.bat) 脚本",
    "url": "posts/batch-rename-files-bat-script.html",
    "category": "效率工具与软件",
    "date": "2026-06-28",
    "tags": [
      "效率工具",
      "Windows",
      "批处理",
      "自动化"
    ],
    "summary": "无需安装第三方软件，利用原生 Bat 批处理脚本一键完成指定文件夹下海量文件的前缀添加与文本替换。",
    "content": "批量修改文件名方法 功能说明 这是一个Windows批处理脚本，用于批量修改文件名和文件夹名，主要功能包括： 1. 批量替换文件名 ：替换指定文件名中的字符串 2. 批量删除字符 ：删除文件名中的指定字符（汉字、字母、数字等） 3. 支持文件夹重命名 ：同时处理文件和文件夹 4. 递归处理 ：自动处理子目录中的文件 脚本源码 batch @echo off chcp 65001 >nul setlocal enabledelayedexpansion title 批量修改文件名工具 echo ======================================== echo 批量修改文件名工具 echo ======================================== echo. echo 此批处理可批量替换当前文件夹下所有文件 文件夹 名。 echo. echo 注意事项： echo 1. 建议先备份重要文件 echo 2. 脚本会递归处理子目录 echo 3. 文件名冲突时会跳过 echo. set /p str1= 请输入要替换的文件 文件夹 名字符串（可替换空格）： if \"%str1%\"==\"\" echo 错误：替换字符串不能为空！ pause exit /b set /p str2= 请输入替换后的文件 文件夹 名字符串（去除则直接回车）： echo. echo 正在替换文件名…… set file_count=0 set skip_count=0 for /f \"delims=\" %%a in 'dir /a-d /s /b 2^>nul' do if \"%%~nxa\" neq \"%~nx0\" set \"f=%%~na\" set \"new_name=!f:%str1%=%str2%!\" if \"!new_name!\" neq \"%%~na\" if not exist \"%%~dpa!new_name!%%~xa\" ren \"%%a\" \"!new_name!%%~xa\" 2>nul if !errorlevel! equ 0 echo 已重命名: \"%%~nxa\" -^> \"!new_name!%%~xa\" set /a file_count+=1 else echo 跳过: \"%%~nxa\" 权限不足 set /a skip_count+=1 else echo 跳过: \"%%~nxa\" 文件名已存在 set /a skip_count+=1 echo 文件名替换完成！共处理 !file_count! 个文件，跳过 !skip_count! 个文件 echo. echo 正在替换文件夹名…… set folder_count=0 set folder_skip=0 :folder_loop set n=0 for /f \"delims=\" %%i in 'dir /ad /s /b 2^>nul ^|find \"%str1%\"' do set \"t=%%~ni\" set \"new_folder=!t:%str1%=%str2%!\" if \"!new_folder!\" neq \"%%~ni\" if not exist \"%%~dpi!new_folder!\" ren \"%%i\" \"!new_folder!\" 2>nul if !errorlevel! equ 0 echo 已重命名文件夹: \"%%~ni\" -^> \"!new_folder!\" set /a folder_count+=1 set /a n+=1 else echo 跳过文件夹: \"%%~ni\" 权限不足 set /a folder_skip+=1 else echo 跳过文件夹: \"%%~ni\" 文件夹名已存在 set /a folder_skip+=1 if \"!n!\" neq \"0\" goto folder_loop echo 文件夹名替换完成！共处理 !folder_count! 个文件夹，跳过 !folder_skip! 个文件夹 echo. echo ======================================== echo 处理完成！ echo 文件: !file_count! 个成功，!skip_count! 个跳过 echo 文件夹: !folder_count! 个成功，!folder_skip! 个跳过 echo ======================================== echo. pause 使用方法 第一步：创建脚本文件 1. 新建一个文本文件（文件名可自定义，如 rename_files.bat ） 2. 将上述脚本内容复制到文件中 3. 保存文件 第二步：修改文件后缀名 将文件后缀名从 .txt 改为 .bat Windows 10/11 启用文件扩展名显示： 1. 按 Win + E 打开文件资源管理器 2. 点击顶部菜单栏的\"查看\"选项卡 3. 勾选\"文件扩展名\"复选框 4. 现在可以修改文件后缀名了 第三步：使用脚本 1. 将脚本文件放入需要修改文件名的目录中 2. 双击运行脚本文件 3. 按照提示输入： - 要替换的字符串 ：输入原文件名中需要替换的内容 - 替换后的字符串 ：输入新的内容（直接回车表示删除） 第四步：查看结果 脚本会显示每个文件的修改结果和统计信息。 使用示例 示例1：批量替换文件名中的文字 要替换的字符串: photo 替换后的字符串: picture 效果： - photo_001.jpg → picture_001.jpg - my_photo.png → my_picture.png 示例2：批量删除文件名中的字符 要替换的字符串: copy 替换后的字符串: 直接回车 效果： - copy_document.txt → _document.txt - file_copy_2.doc → file__2.doc 示例3：批量添加前缀 要替换的字符串: 文件名开头 替换后的字符串: 2024_ 效果： - document.txt → 2024_document.txt - image.jpg → 2024_image.jpg 注意事项 ⚠️ 重要提醒 1. 备份重要文件 ：在使用脚本前，建议先备份重要文件 2. 测试环境 ：先在测试文件夹中试用，确认效果后再在正式文件中使用 3. 文件名冲突 ：如果目标文件名已存在，脚本会跳过该文件 4. 权限问题 ：某些系统文件或受保护的文件可能无法修改 5. 编码问题 ：脚本已设置UTF-8编码，支持中文文件名 🔧 常见问题 问题1：脚本运行后没有反应 - 解决：确保脚本文件放在正确的目录中 - 检查是否有足够的权限修改文件 问题2：某些文件没有被修改 - 原因：可能是文件名冲突或权限不足 - 解决：检查文件是否被其他程序占用 问题3：中文显示乱码 - 原因：系统编码设置问题 - 解决：脚本已包含 chcp 65001 命令，如仍有问题请检查系统编码设置 问题4：无法修改系统文件 - 原因：权限不足 - 解决：以管理员身份运行脚本 高级用法 1. 只处理文件，不处理文件夹 修改脚本，注释掉文件夹处理部分： batch REM 注释掉文件夹处理部分 REM :folder_loop REM ... 2. 只处理特定类型的文件 修改文件处理部分，添加文件类型过滤： batch for /f \"delims=\" %%a in 'dir /a-d /s /b .txt .doc .docx 2^>nul' do ... 3. 添加日期时间前缀 batch for /f \"tokens=1-3 delims=/ \" %%a in 'date /t' do set mydate=%%c%%a%%b set /p str1= 请输入要替换的字符串： set /p str2= 请输入替换后的字符串： set \"prefix=%mydate%_\" 替代方案 PowerShell 脚本（推荐） powershell PowerShell 批量重命名脚本 $oldName = Read-Host \"请输入要替换的字符串\" $newName = Read-Host \"请输入替换后的字符串\" Get-ChildItem -Recurse | ForEach-Object { if $_.Name -like \" $oldName \" { $newFileName = $_.Name -replace regex ::Escape $oldName , $newName if $_.Name -ne $newFileName -and -not Test-Path Join-Path $_.DirectoryName $newFileName { Rename-Item -Path $_.FullName -NewName $newFileName Write-Host \"已重命名: $ $_.Name -> $newFileName\" } } } Python 脚本 python import os import sys def batch_rename directory, old_str, new_str : count = 0 for root, dirs, files in os.walk directory : for filename in files: if old_str in filename: new_filename = filename.replace old_str, new_str old_path = os.path.join root, filename new_path = os.path.join root, new_filename if not os.path.exists new_path : os.rename old_path, new_path print f\"已重命名: {filename} -> {new_filename}\" count += 1 print f\"共处理 {count} 个文件\" if __name__ == \"__main__\": directory = input \"请输入目录路径（当前目录请直接回车）: \" or \".\" old_str = input \"请输入要替换的字符串: \" new_str = input \"请输入替换后的字符串（删除请直接回车）: \" batch_rename directory, old_str, new_str 下载脚本 脚本下载地址 ../assets/files/fileNameReplaScrip.bat 总结 这个批量修改文件名工具具有以下特点： - ✅ 操作简单，适合小白用户 - ✅ 支持文件和文件夹批量重命名 - ✅ 递归处理子目录 - ✅ 支持中文字符 - ✅ 提供详细的处理反馈 - ⚠️ 建议先备份重要文件 - ⚠️ 注意文件名冲突处理 使用前请仔细阅读注意事项，确保数据安全！",
    "fullText": "Windows 批量修改文件名与字符替换批处理 (.bat) 脚本 无需安装第三方软件，利用原生 Bat 批处理脚本一键完成指定文件夹下海量文件的前缀添加与文本替换。 效率工具 Windows 批处理 自动化 批量修改文件名方法 功能说明 这是一个Windows批处理脚本，用于批量修改文件名和文件夹名，主要功能包括： 1. 批量替换文件名 ：替换指定文件名中的字符串 2. 批量删除字符 ：删除文件名中的指定字符（汉字、字母、数字等） 3. 支持文件夹重命名 ：同时处理文件和文件夹 4. 递归处理 ：自动处理子目录中的文件 脚本源码 batch @echo off chcp 65001 >nul setlocal enabledelayedexpansion title 批量修改文件名工具 echo ======================================== echo 批量修改文件名工具 echo ======================================== echo. echo 此批处理可批量替换当前文件夹下所有文件 文件夹 名。 echo. echo 注意事项： echo 1. 建议先备份重要文件 echo 2. 脚本会递归处理子目录 echo 3. 文件名冲突时会跳过 echo. set /p str1= 请输入要替换的文件 文件夹 名字符串（可替换空格）： if \"%str1%\"==\"\" echo 错误：替换字符串不能为空！ pause exit /b set /p str2= 请输入替换后的文件 文件夹 名字符串（去除则直接回车）： echo. echo 正在替换文件名…… set file_count=0 set skip_count=0 for /f \"delims=\" %%a in 'dir /a-d /s /b 2^>nul' do if \"%%~nxa\" neq \"%~nx0\" set \"f=%%~na\" set \"new_name=!f:%str1%=%str2%!\" if \"!new_name!\" neq \"%%~na\" if not exist \"%%~dpa!new_name!%%~xa\" ren \"%%a\" \"!new_name!%%~xa\" 2>nul if !errorlevel! equ 0 echo 已重命名: \"%%~nxa\" -^> \"!new_name!%%~xa\" set /a file_count+=1 else echo 跳过: \"%%~nxa\" 权限不足 set /a skip_count+=1 else echo 跳过: \"%%~nxa\" 文件名已存在 set /a skip_count+=1 echo 文件名替换完成！共处理 !file_count! 个文件，跳过 !skip_count! 个文件 echo. echo 正在替换文件夹名…… set folder_count=0 set folder_skip=0 :folder_loop set n=0 for /f \"delims=\" %%i in 'dir /ad /s /b 2^>nul ^|find \"%str1%\"' do set \"t=%%~ni\" set \"new_folder=!t:%str1%=%str2%!\" if \"!new_folder!\" neq \"%%~ni\" if not exist \"%%~dpi!new_folder!\" ren \"%%i\" \"!new_folder!\" 2>nul if !errorlevel! equ 0 echo 已重命名文件夹: \"%%~ni\" -^> \"!new_folder!\" set /a folder_count+=1 set /a n+=1 else echo 跳过文件夹: \"%%~ni\" 权限不足 set /a folder_skip+=1 else echo 跳过文件夹: \"%%~ni\" 文件夹名已存在 set /a folder_skip+=1 if \"!n!\" neq \"0\" goto folder_loop echo 文件夹名替换完成！共处理 !folder_count! 个文件夹，跳过 !folder_skip! 个文件夹 echo. echo ======================================== echo 处理完成！ echo 文件: !file_count! 个成功，!skip_count! 个跳过 echo 文件夹: !folder_count! 个成功，!folder_skip! 个跳过 echo ======================================== echo. pause 使用方法 第一步：创建脚本文件 1. 新建一个文本文件（文件名可自定义，如 rename_files.bat ） 2. 将上述脚本内容复制到文件中 3. 保存文件 第二步：修改文件后缀名 将文件后缀名从 .txt 改为 .bat Windows 10/11 启用文件扩展名显示： 1. 按 Win + E 打开文件资源管理器 2. 点击顶部菜单栏的\"查看\"选项卡 3. 勾选\"文件扩展名\"复选框 4. 现在可以修改文件后缀名了 第三步：使用脚本 1. 将脚本文件放入需要修改文件名的目录中 2. 双击运行脚本文件 3. 按照提示输入： - 要替换的字符串 ：输入原文件名中需要替换的内容 - 替换后的字符串 ：输入新的内容（直接回车表示删除） 第四步：查看结果 脚本会显示每个文件的修改结果和统计信息。 使用示例 示例1：批量替换文件名中的文字 要替换的字符串: photo 替换后的字符串: picture 效果： - photo_001.jpg → picture_001.jpg - my_photo.png → my_picture.png 示例2：批量删除文件名中的字符 要替换的字符串: copy 替换后的字符串: 直接回车 效果： - copy_document.txt → _document.txt - file_copy_2.doc → file__2.doc 示例3：批量添加前缀 要替换的字符串: 文件名开头 替换后的字符串: 2024_ 效果： - document.txt → 2024_document.txt - image.jpg → 2024_image.jpg 注意事项 ⚠️ 重要提醒 1. 备份重要文件 ：在使用脚本前，建议先备份重要文件 2. 测试环境 ：先在测试文件夹中试用，确认效果后再在正式文件中使用 3. 文件名冲突 ：如果目标文件名已存在，脚本会跳过该文件 4. 权限问题 ：某些系统文件或受保护的文件可能无法修改 5. 编码问题 ：脚本已设置UTF-8编码，支持中文文件名 🔧 常见问题 问题1：脚本运行后没有反应 - 解决：确保脚本文件放在正确的目录中 - 检查是否有足够的权限修改文件 问题2：某些文件没有被修改 - 原因：可能是文件名冲突或权限不足 - 解决：检查文件是否被其他程序占用 问题3：中文显示乱码 - 原因：系统编码设置问题 - 解决：脚本已包含 chcp 65001 命令，如仍有问题请检查系统编码设置 问题4：无法修改系统文件 - 原因：权限不足 - 解决：以管理员身份运行脚本 高级用法 1. 只处理文件，不处理文件夹 修改脚本，注释掉文件夹处理部分： batch REM 注释掉文件夹处理部分 REM :folder_loop REM ... 2. 只处理特定类型的文件 修改文件处理部分，添加文件类型过滤： batch for /f \"delims=\" %%a in 'dir /a-d /s /b .txt .doc .docx 2^>nul' do ... 3. 添加日期时间前缀 batch for /f \"tokens=1-3 delims=/ \" %%a in 'date /t' do set mydate=%%c%%a%%b set /p str1= 请输入要替换的字符串： set /p str2= 请输入替换后的字符串： set \"prefix=%mydate%_\" 替代方案 PowerShell 脚本（推荐） powershell PowerShell 批量重命名脚本 $oldName = Read-Host \"请输入要替换的字符串\" $newName = Read-Host \"请输入替换后的字符串\" Get-ChildItem -Recurse | ForEach-Object { if $_.Name -like \" $oldName \" { $newFileName = $_.Name -replace regex ::Escape $oldName , $newName if $_.Name -ne $newFileName -and -not Test-Path Join-Path $_.DirectoryName $newFileName { Rename-Item -Path $_.FullName -NewName $newFileName Write-Host \"已重命名: $ $_.Name -> $newFileName\" } } } Python 脚本 python import os import sys def batch_rename directory, old_str, new_str : count = 0 for root, dirs, files in os.walk directory : for filename in files: if old_str in filename: new_filename = filename.replace old_str, new_str old_path = os.path.join root, filename new_path = os.path.join root, new_filename if not os.path.exists new_path : os.rename old_path, new_path print f\"已重命名: {filename} -> {new_filename}\" count += 1 print f\"共处理 {count} 个文件\" if __name__ == \"__main__\": directory = input \"请输入目录路径（当前目录请直接回车）: \" or \".\" old_str = input \"请输入要替换的字符串: \" new_str = input \"请输入替换后的字符串（删除请直接回车）: \" batch_rename directory, old_str, new_str 下载脚本 脚本下载地址 ../assets/files/fileNameReplaScrip.bat 总结 这个批量修改文件名工具具有以下特点： - ✅ 操作简单，适合小白用户 - ✅ 支持文件和文件夹批量重命名 - ✅ 递归处理子目录 - ✅ 支持中文字符 - ✅ 提供详细的处理反馈 - ⚠️ 建议先备份重要文件 - ⚠️ 注意文件名冲突处理 使用前请仔细阅读注意事项，确保数据安全！",
    "sections": [
      {
        "title": "功能说明",
        "anchor": "#功能说明",
        "id": "功能说明"
      },
      {
        "title": "脚本源码",
        "anchor": "#脚本源码",
        "id": "脚本源码"
      },
      {
        "title": "使用方法",
        "anchor": "#使用方法",
        "id": "使用方法"
      },
      {
        "title": "第一步：创建脚本文件",
        "anchor": "#第一步-创建脚本文件",
        "id": "第一步-创建脚本文件"
      },
      {
        "title": "第二步：修改文件后缀名",
        "anchor": "#第二步-修改文件后缀名",
        "id": "第二步-修改文件后缀名"
      },
      {
        "title": "第三步：使用脚本",
        "anchor": "#第三步-使用脚本",
        "id": "第三步-使用脚本"
      },
      {
        "title": "第四步：查看结果",
        "anchor": "#第四步-查看结果",
        "id": "第四步-查看结果"
      },
      {
        "title": "使用示例",
        "anchor": "#使用示例",
        "id": "使用示例"
      },
      {
        "title": "示例1：批量替换文件名中的文字",
        "anchor": "#示例1-批量替换文件名中的文字",
        "id": "示例1-批量替换文件名中的文字"
      },
      {
        "title": "示例2：批量删除文件名中的字符",
        "anchor": "#示例2-批量删除文件名中的字符",
        "id": "示例2-批量删除文件名中的字符"
      },
      {
        "title": "示例3：批量添加前缀",
        "anchor": "#示例3-批量添加前缀",
        "id": "示例3-批量添加前缀"
      },
      {
        "title": "注意事项",
        "anchor": "#注意事项",
        "id": "注意事项"
      },
      {
        "title": "⚠️ 重要提醒",
        "anchor": "#重要提醒",
        "id": "重要提醒"
      },
      {
        "title": "🔧 常见问题",
        "anchor": "#常见问题",
        "id": "常见问题"
      },
      {
        "title": "高级用法",
        "anchor": "#高级用法",
        "id": "高级用法"
      },
      {
        "title": "1. 只处理文件，不处理文件夹",
        "anchor": "#1-只处理文件-不处理文件夹",
        "id": "1-只处理文件-不处理文件夹"
      },
      {
        "title": "2. 只处理特定类型的文件",
        "anchor": "#2-只处理特定类型的文件",
        "id": "2-只处理特定类型的文件"
      },
      {
        "title": "3. 添加日期时间前缀",
        "anchor": "#3-添加日期时间前缀",
        "id": "3-添加日期时间前缀"
      },
      {
        "title": "替代方案",
        "anchor": "#替代方案",
        "id": "替代方案"
      },
      {
        "title": "PowerShell 脚本（推荐）",
        "anchor": "#powershell-脚本-推荐",
        "id": "powershell-脚本-推荐"
      },
      {
        "title": "Python 脚本",
        "anchor": "#python-脚本",
        "id": "python-脚本"
      },
      {
        "title": "下载脚本",
        "anchor": "#下载脚本",
        "id": "下载脚本"
      },
      {
        "title": "总结",
        "anchor": "#总结",
        "id": "总结"
      }
    ]
  },
  {
    "id": "nginx-reverse-proxy-emby-config",
    "title": "Nginx 高性能反向代理 Emby 媒体服务器配置与 WebSocket 支持",
    "url": "posts/nginx-reverse-proxy-emby-config.html",
    "category": "Linux与服务端",
    "date": "2026-06-25",
    "tags": [
      "Linux",
      "Nginx",
      "Emby",
      "媒体服务器"
    ],
    "summary": "配置 Nginx 反代 Emby 流媒体服务，开启 WebSocket 实时长连接、大文件分片传输与客户端真实 IP 透传。",
    "content": "Nginx 全站反向代理配置说明文档（Cloudflare CDN + 流媒体优化版） 📌 配置概述 本配置专为 Cloudflare CDN + 全站反向代理 架构设计，通过引入动态域名变量、SNI 强校验、HTTPS 协议识别以及重定向安全锁，实现了对目标源站（如 Emby 等流媒体服务）的高效、稳定全站映射。同时针对大文件传输和长连接做了深度优化。 --- 📄 完整配置代码 你可以直接点击代码块右上角的 “复制” 按钮获取最终优化后的完整配置： nginx resolver 8.8.8.8 1.1.1.1 valid=300s; resolver_timeout 5s; location / { 1. 转发目标域名变量（全站代理的目标源站，如需更换在此修改） set $target_domain \"www.target.com\"; proxy_pass https://$target_domain; proxy_set_header Host $target_domain; proxy_ssl_server_name on; proxy_ssl_name $target_domain; 2. 协议识别（防止后端误判为 HTTP） proxy_set_header X-Forwarded-Proto $scheme; 3. 全站代理安全锁（自动修正源站的绝对路径与重定向，防止用户跳去源站） proxy_redirect https://$target_domain/ /; 4. WebSocket 支持（保障全站的实时双向通信） proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection $http_connection; 5. 大文件传输与长连接优化（防断开、支持高清视频流畅拖动进度条） proxy_buffering off; proxy_cache off; chunked_transfer_encoding on; proxy_connect_timeout 300; proxy_send_timeout 86400; proxy_read_timeout 86400; proxy_set_header Range $http_range; proxy_set_header If-Range $http_if_range; proxy_request_buffering off; }",
    "fullText": "Nginx 高性能反向代理 Emby 媒体服务器配置与 WebSocket 支持 配置 Nginx 反代 Emby 流媒体服务，开启 WebSocket 实时长连接、大文件分片传输与客户端真实 IP 透传。 Linux Nginx Emby 媒体服务器 Nginx 全站反向代理配置说明文档（Cloudflare CDN + 流媒体优化版） 📌 配置概述 本配置专为 Cloudflare CDN + 全站反向代理 架构设计，通过引入动态域名变量、SNI 强校验、HTTPS 协议识别以及重定向安全锁，实现了对目标源站（如 Emby 等流媒体服务）的高效、稳定全站映射。同时针对大文件传输和长连接做了深度优化。 --- 📄 完整配置代码 你可以直接点击代码块右上角的 “复制” 按钮获取最终优化后的完整配置： nginx resolver 8.8.8.8 1.1.1.1 valid=300s; resolver_timeout 5s; location / { 1. 转发目标域名变量（全站代理的目标源站，如需更换在此修改） set $target_domain \"www.target.com\"; proxy_pass https://$target_domain; proxy_set_header Host $target_domain; proxy_ssl_server_name on; proxy_ssl_name $target_domain; 2. 协议识别（防止后端误判为 HTTP） proxy_set_header X-Forwarded-Proto $scheme; 3. 全站代理安全锁（自动修正源站的绝对路径与重定向，防止用户跳去源站） proxy_redirect https://$target_domain/ /; 4. WebSocket 支持（保障全站的实时双向通信） proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection $http_connection; 5. 大文件传输与长连接优化（防断开、支持高清视频流畅拖动进度条） proxy_buffering off; proxy_cache off; chunked_transfer_encoding on; proxy_connect_timeout 300; proxy_send_timeout 86400; proxy_read_timeout 86400; proxy_set_header Range $http_range; proxy_set_header If-Range $http_if_range; proxy_request_buffering off; }",
    "sections": [
      {
        "title": "📌 配置概述",
        "anchor": "#配置概述",
        "id": "配置概述"
      },
      {
        "title": "📄 完整配置代码",
        "anchor": "#完整配置代码",
        "id": "完整配置代码"
      }
    ]
  },
  {
    "id": "ffmpeg-live-stream-rtmp-flv-cheatsheet",
    "title": "FFmpeg 常用音视频推流、转码与循环直播命令速查指南",
    "url": "posts/ffmpeg-live-stream-rtmp-flv-cheatsheet.html",
    "category": "Linux与服务端",
    "date": "2026-06-18",
    "tags": [
      "Linux",
      "FFmpeg",
      "音视频",
      "流媒体"
    ],
    "summary": "整理基于 FFmpeg 的 RTMP/FLV 本地视频循环推流命令、硬件加速转码与常用分辨率封装参数。",
    "content": "linux 推流命令 sh ffmpeg -re -i \"视频源地址\" -c:v copy -c:a aac -b:a 192k -strict -2 -f flv \"rtmp://a.rtmp.youtube.com/live2/直播码\"",
    "fullText": "FFmpeg 常用音视频推流、转码与循环直播命令速查指南 整理基于 FFmpeg 的 RTMP/FLV 本地视频循环推流命令、硬件加速转码与常用分辨率封装参数。 Linux FFmpeg 音视频 流媒体 linux 推流命令 sh ffmpeg -re -i \"视频源地址\" -c:v copy -c:a aac -b:a 192k -strict -2 -f flv \"rtmp://a.rtmp.youtube.com/live2/直播码\"",
    "sections": [
      {
        "title": "linux 推流命令",
        "anchor": "#linux-推流命令",
        "id": "linux-推流命令"
      }
    ]
  },
  {
    "id": "vue3-file-upload-component",
    "title": "Vue3 + Element Plus 文件上传组件封装：支持回显、批量与手动控制",
    "url": "posts/vue3-file-upload-component.html",
    "category": "前端开发",
    "date": "2026-06-15",
    "tags": [
      "前端开发",
      "Vue",
      "Element Plus",
      "组件封装"
    ],
    "summary": "在实际业务中深入封装 el-upload，实现文件列表回显、多文件批量上传、类型大小校验与手动提交控制。",
    "content": "🚀 Element Plus 进阶文件上传组件：实现文件回显、批量和手动控制 在实际业务开发中，我们经常需要一个组件来处理文件上传、展示已上传文件（回显/编辑模式）以及手动触发上传。Element Plus 的 el-upload 默认功能往往不够灵活。 本文将详细解析并教你如何使用一个功能增强的自定义文件上传组件。 --- 一、组件源代码 FileUploader.vue FileUploader.vue 代码地址 ../assets/files/FileUpload.vue 父组件调用示范 Vue 3 Composition API 在父组件中使用此组件，实现编辑和新增模式的切换。 javascript <template> <el-card header=\"文件上传示例\"> <el-form :model=\"formData\" label-width=\"120px\"> <el-form-item label=\"附件列表\"> <FileUploader ref=\"uploaderRef\" v-model:attachment-ids=\"formData.attachmentIds\" :initial-files=\"formData.initialFiles\" :limit=\"3\" :max-size_m-b=\"50\" upload-url-path=\"/your/custom/upload/path\" @change=\"handleFileChange\" /> </el-form-item> <el-form-item label=\"操作\"> <el-button type=\"primary\" @click=\"handleSubmit\"> 提交表单 </el-button> <el-button @click=\"handleReset\"> 重置上传 </el-button> <el-button @click=\"toggleEditMode\"> 模拟切换新增模式 </el-button> </el-form-item> </el-form> <el-divider /> <p> 当前附件 ID 列表 用于提交 : <el-tag v-for=\"id in formData.attachmentIds\" :key=\"id\" style=\"margin-right: 5px;\">{{ id }}</el-tag> <span v-if=\"formData.attachmentIds.length === 0\">无</span> </p> </el-card> </template> <script setup> import { reactive, ref } from \"vue\"; import { ElMessage, ElCard, ElForm, ElFormItem, ElButton, ElDivider, ElTag } from \"element-plus\"; import FileUploader from \"./FileUploader.vue\"; // 确保导入路径正确 const uploaderRef = ref null ; // 模拟后端返回的初始文件数据（用于编辑模式回显） const mockInitialFiles = { id: \"f001\", fileName: \"项目需求文档.docx\" }, { id: \"f002\", fileName: \"设计图.pdf\" }, ; const formData = reactive { // 绑定：初始值应包含回显文件的 ID attachmentIds: \"f001\", \"f002\" , // 传入：回显文件列表 initialFiles: mockInitialFiles, title: \"表单标题\", } ; const handleFileChange = fileList => { console.log \"文件列表更新了，当前文件总数:\", fileList.length ; }; const handleSubmit = => { const finalIds = formData.attachmentIds; if finalIds.length === 0 { ElMessage.warning \"请选择并上传文件后再提交！\" ; return; } const payload = { title: formData.title, attachments: finalIds }; console.log \"最终提交的数据:\", payload ; ElMessage.success 表单提交成功，附件ID: ${finalIds.join \", \" } ; }; const handleReset = => { // 1. 调用组件暴露的方法清空内部状态 uploaderRef.value.clearFiles ; // 2. 清空回显数据，确保下次打开是全新状态 formData.initialFiles = ; ElMessage.info \"文件列表已重置。\" ; }; const toggleEditMode = => { // 通过清空 initialFiles，组件内部的 watch 会清空回显文件 formData.initialFiles = ; ElMessage.info \"已清空初始文件列表，现在是新增模式。\" ; }; </script>",
    "fullText": "Vue3 + Element Plus 文件上传组件封装：支持回显、批量与手动控制 在实际业务中深入封装 el-upload，实现文件列表回显、多文件批量上传、类型大小校验与手动提交控制。 前端开发 Vue Element Plus 组件封装 🚀 Element Plus 进阶文件上传组件：实现文件回显、批量和手动控制 在实际业务开发中，我们经常需要一个组件来处理文件上传、展示已上传文件（回显/编辑模式）以及手动触发上传。Element Plus 的 el-upload 默认功能往往不够灵活。 本文将详细解析并教你如何使用一个功能增强的自定义文件上传组件。 --- 一、组件源代码 FileUploader.vue FileUploader.vue 代码地址 ../assets/files/FileUpload.vue 父组件调用示范 Vue 3 Composition API 在父组件中使用此组件，实现编辑和新增模式的切换。 javascript <template> <el-card header=\"文件上传示例\"> <el-form :model=\"formData\" label-width=\"120px\"> <el-form-item label=\"附件列表\"> <FileUploader ref=\"uploaderRef\" v-model:attachment-ids=\"formData.attachmentIds\" :initial-files=\"formData.initialFiles\" :limit=\"3\" :max-size_m-b=\"50\" upload-url-path=\"/your/custom/upload/path\" @change=\"handleFileChange\" /> </el-form-item> <el-form-item label=\"操作\"> <el-button type=\"primary\" @click=\"handleSubmit\"> 提交表单 </el-button> <el-button @click=\"handleReset\"> 重置上传 </el-button> <el-button @click=\"toggleEditMode\"> 模拟切换新增模式 </el-button> </el-form-item> </el-form> <el-divider /> <p> 当前附件 ID 列表 用于提交 : <el-tag v-for=\"id in formData.attachmentIds\" :key=\"id\" style=\"margin-right: 5px;\">{{ id }}</el-tag> <span v-if=\"formData.attachmentIds.length === 0\">无</span> </p> </el-card> </template> <script setup> import { reactive, ref } from \"vue\"; import { ElMessage, ElCard, ElForm, ElFormItem, ElButton, ElDivider, ElTag } from \"element-plus\"; import FileUploader from \"./FileUploader.vue\"; // 确保导入路径正确 const uploaderRef = ref null ; // 模拟后端返回的初始文件数据（用于编辑模式回显） const mockInitialFiles = { id: \"f001\", fileName: \"项目需求文档.docx\" }, { id: \"f002\", fileName: \"设计图.pdf\" }, ; const formData = reactive { // 绑定：初始值应包含回显文件的 ID attachmentIds: \"f001\", \"f002\" , // 传入：回显文件列表 initialFiles: mockInitialFiles, title: \"表单标题\", } ; const handleFileChange = fileList => { console.log \"文件列表更新了，当前文件总数:\", fileList.length ; }; const handleSubmit = => { const finalIds = formData.attachmentIds; if finalIds.length === 0 { ElMessage.warning \"请选择并上传文件后再提交！\" ; return; } const payload = { title: formData.title, attachments: finalIds }; console.log \"最终提交的数据:\", payload ; ElMessage.success 表单提交成功，附件ID: ${finalIds.join \", \" } ; }; const handleReset = => { // 1. 调用组件暴露的方法清空内部状态 uploaderRef.value.clearFiles ; // 2. 清空回显数据，确保下次打开是全新状态 formData.initialFiles = ; ElMessage.info \"文件列表已重置。\" ; }; const toggleEditMode = => { // 通过清空 initialFiles，组件内部的 watch 会清空回显文件 formData.initialFiles = ; ElMessage.info \"已清空初始文件列表，现在是新增模式。\" ; }; </script>",
    "sections": [
      {
        "title": "一、组件源代码 (`FileUploader.vue`)",
        "anchor": "#一-组件源代码-fileuploader-vue",
        "id": "一-组件源代码-fileuploader-vue"
      },
      {
        "title": "父组件调用示范 (Vue 3 Composition API)",
        "anchor": "#父组件调用示范-vue-3-composition-api",
        "id": "父组件调用示范-vue-3-composition-api"
      }
    ]
  },
  {
    "id": "ssl-acme-cert-auto-issue-script",
    "title": "Linux 使用 acme.sh 自动化申请 Let's Encrypt 免费 SSL 证书与续期脚本",
    "url": "posts/ssl-acme-cert-auto-issue-script.html",
    "category": "Linux与服务端",
    "date": "2026-06-10",
    "tags": [
      "Linux",
      "SSL",
      "HTTPS",
      "网络安全"
    ],
    "summary": "基于 acme.sh 脚本一键签发通配符泛域名 SSL 证书，配置 Nginx 自动加载与 crontab 定期续签。",
    "content": "ssl 一键生成证书脚本： 第一步：安装脚本 sh wget -O - https://get.acme.sh | sh -s email=vx91586x@qq.com 第二步：生成证书80端口验证方式（保证80未被占用） sh ~/.acme.sh/acme.sh --issue -d www.baidu.com --standalone 第三步：将证书移动，指定的文件中（nginx中） sh ~/.acme.sh/acme.sh --installcert -d www.baidu.com --key-file /root/ssl/private.key --fullchain-file /root/ssl/cert.crt 第二种生成方式：（http验证）后面的目录要是网站的根目录，同样需要把移动到指定的文件夹目录 sh ~/.acme.sh/acme.sh --issue -d mydomain.com -d www.mydomain.com --webroot /home/wwwroot/mydomain.com/",
    "fullText": "Linux 使用 acme.sh 自动化申请 Let's Encrypt 免费 SSL 证书与续期脚本 基于 acme.sh 脚本一键签发通配符泛域名 SSL 证书，配置 Nginx 自动加载与 crontab 定期续签。 Linux SSL HTTPS 网络安全 ssl 一键生成证书脚本： 第一步：安装脚本 sh wget -O - https://get.acme.sh | sh -s email=vx91586x@qq.com 第二步：生成证书80端口验证方式（保证80未被占用） sh ~/.acme.sh/acme.sh --issue -d www.baidu.com --standalone 第三步：将证书移动，指定的文件中（nginx中） sh ~/.acme.sh/acme.sh --installcert -d www.baidu.com --key-file /root/ssl/private.key --fullchain-file /root/ssl/cert.crt 第二种生成方式：（http验证）后面的目录要是网站的根目录，同样需要把移动到指定的文件夹目录 sh ~/.acme.sh/acme.sh --issue -d mydomain.com -d www.mydomain.com --webroot /home/wwwroot/mydomain.com/",
    "sections": [
      {
        "title": "ssl 一键生成证书脚本：",
        "anchor": "#ssl-一键生成证书脚本",
        "id": "ssl-一键生成证书脚本"
      },
      {
        "title": "第二步：生成证书80端口验证方式（保证80未被占用）",
        "anchor": "#第二步-生成证书80端口验证方式-保证80未被占用",
        "id": "第二步-生成证书80端口验证方式-保证80未被占用"
      },
      {
        "title": "第三步：将证书移动，指定的文件中（nginx中）",
        "anchor": "#第三步-将证书移动-指定的文件中-nginx中",
        "id": "第三步-将证书移动-指定的文件中-nginx中"
      },
      {
        "title": "第二种生成方式：（http验证）后面的目录要是网站的根目录，同样需要把移动到指定的文件夹目录",
        "anchor": "#第二种生成方式-http验证-后面的目录要是网站的根目录-同样需要把移动到指定的文件夹目录",
        "id": "第二种生成方式-http验证-后面的目录要是网站的根目录-同样需要把移动到指定的文件夹目录"
      }
    ]
  },
  {
    "id": "vue3-query-form-component",
    "title": "Vue3 通用查询表单组件封装：JSON Schema 驱动与响应式联动",
    "url": "posts/vue3-query-form-component.html",
    "category": "前端开发",
    "date": "2026-06-08",
    "tags": [
      "前端开发",
      "Vue",
      "组件封装",
      "表单设计"
    ],
    "summary": "基于 Vue 3 Composition API 与 Element Plus 打造轻量配置化查询表单组件，大幅提升后台开发效率。",
    "content": "一、组件源代码 FileUploader.vue QueryForm.vue 代码地址 ../assets/files/QueryForm.vue 父组件调用示范代码 javascript <template> <div class=\"page-container\"> <h2>查询表单示例</h2> <QueryForm v-model=\"queryParams\" :formConfig=\"FORM_CONFIG\" :dicts=\"MOCK_DICTS\" :queryDebounce=\"200\" componentSize=\"default\" @query=\"handleQuery\" @reset=\"handleReset\" > <template customSearch=\"{ prop }\"> <el-input v-model=\"queryParams prop \" placeholder=\"插槽输入\" style=\"width: 200px;\" clearable /> </template> </QueryForm> <div class=\"result-display\"> <h3>当前查询参数 QueryParams </h3> <pre>{{ JSON.stringify queryParams, null, 2 }}</pre> </div> </div> </template> <script setup> import { ref, reactive } from 'vue'; // 假设 QueryForm.vue 已经被正确导入 import QueryForm from './QueryForm.vue'; import { ElMessage } from 'element-plus'; // 仅用于演示消息提示 // --- 1. 定义数据源 --- const MOCK_DICTS = { statusList: { label: '待处理', value: 0 }, { label: '已完成', value: 1 }, { label: '已取消', value: 2 }, , channelList: { label: 'PC 端', value: 'PC' }, { label: '移动端', value: 'Mobile' }, , }; const FORM_CONFIG = { prop: 'keyword', label: '关键字', type: 'input', placeholder: '请输入订单号/用户ID' }, { prop: 'status', label: '订单状态', type: 'select', dictKey: 'statusList' }, { prop: 'channel', label: '渠道', type: 'radio', dictKey: 'channelList' }, { prop: 'createDate', label: '创建时间', type: 'dateRange', dateProps: 'createTimeStart', 'createTimeEnd' , autoCompleteTime: true, }, { prop: 'customSearch', label: '自定义', type: 'slot' }, ; // --- 2. 状态管理 --- const queryParams = ref { // 初始化一些默认值是可选的 keyword: '', status: 1, // 默认选中 '已完成' channel: 'PC', } ; // --- 3. 事件处理 --- / 处理 QueryForm 触发的查询事件 @param {Object} params - 最终的查询参数对象 / const handleQuery = params => { console.log '--- 执行查询请求 ---' ; console.log '最终参数:', params ; ElMessage.success '查询已触发，请查看控制台日志' ; // 实际项目中：调用 API 接口获取数据 // fetchTableData params ; }; / 处理 QueryForm 触发的重置事件 @param {Object} params - 重置后的查询参数对象 通常为空 / const handleReset = params => { console.log '--- 执行重置 ---' ; console.log '重置后的参数:', params ; ElMessage.info '查询表单已重置' ; }; // --- 4. 导出变量 --- // 将这些常量导出，供 template 使用 </script> <style scoped> .page-container { padding: 20px; } .result-display { margin-top: 30px; padding: 15px; background-color: f7f7f7; border-radius: 4px; } </style>",
    "fullText": "Vue3 通用查询表单组件封装：JSON Schema 驱动与响应式联动 基于 Vue 3 Composition API 与 Element Plus 打造轻量配置化查询表单组件，大幅提升后台开发效率。 前端开发 Vue 组件封装 表单设计 一、组件源代码 FileUploader.vue QueryForm.vue 代码地址 ../assets/files/QueryForm.vue 父组件调用示范代码 javascript <template> <div class=\"page-container\"> <h2>查询表单示例</h2> <QueryForm v-model=\"queryParams\" :formConfig=\"FORM_CONFIG\" :dicts=\"MOCK_DICTS\" :queryDebounce=\"200\" componentSize=\"default\" @query=\"handleQuery\" @reset=\"handleReset\" > <template customSearch=\"{ prop }\"> <el-input v-model=\"queryParams prop \" placeholder=\"插槽输入\" style=\"width: 200px;\" clearable /> </template> </QueryForm> <div class=\"result-display\"> <h3>当前查询参数 QueryParams </h3> <pre>{{ JSON.stringify queryParams, null, 2 }}</pre> </div> </div> </template> <script setup> import { ref, reactive } from 'vue'; // 假设 QueryForm.vue 已经被正确导入 import QueryForm from './QueryForm.vue'; import { ElMessage } from 'element-plus'; // 仅用于演示消息提示 // --- 1. 定义数据源 --- const MOCK_DICTS = { statusList: { label: '待处理', value: 0 }, { label: '已完成', value: 1 }, { label: '已取消', value: 2 }, , channelList: { label: 'PC 端', value: 'PC' }, { label: '移动端', value: 'Mobile' }, , }; const FORM_CONFIG = { prop: 'keyword', label: '关键字', type: 'input', placeholder: '请输入订单号/用户ID' }, { prop: 'status', label: '订单状态', type: 'select', dictKey: 'statusList' }, { prop: 'channel', label: '渠道', type: 'radio', dictKey: 'channelList' }, { prop: 'createDate', label: '创建时间', type: 'dateRange', dateProps: 'createTimeStart', 'createTimeEnd' , autoCompleteTime: true, }, { prop: 'customSearch', label: '自定义', type: 'slot' }, ; // --- 2. 状态管理 --- const queryParams = ref { // 初始化一些默认值是可选的 keyword: '', status: 1, // 默认选中 '已完成' channel: 'PC', } ; // --- 3. 事件处理 --- / 处理 QueryForm 触发的查询事件 @param {Object} params - 最终的查询参数对象 / const handleQuery = params => { console.log '--- 执行查询请求 ---' ; console.log '最终参数:', params ; ElMessage.success '查询已触发，请查看控制台日志' ; // 实际项目中：调用 API 接口获取数据 // fetchTableData params ; }; / 处理 QueryForm 触发的重置事件 @param {Object} params - 重置后的查询参数对象 通常为空 / const handleReset = params => { console.log '--- 执行重置 ---' ; console.log '重置后的参数:', params ; ElMessage.info '查询表单已重置' ; }; // --- 4. 导出变量 --- // 将这些常量导出，供 template 使用 </script> <style scoped> .page-container { padding: 20px; } .result-display { margin-top: 30px; padding: 15px; background-color: f7f7f7; border-radius: 4px; } </style>",
    "sections": [
      {
        "title": "一、组件源代码 (`FileUploader.vue`)",
        "anchor": "#一-组件源代码-fileuploader-vue",
        "id": "一-组件源代码-fileuploader-vue"
      },
      {
        "title": "父组件调用示范代码",
        "anchor": "#父组件调用示范代码",
        "id": "父组件调用示范代码"
      }
    ]
  },
  {
    "id": "vue-common-plugins-ecosystem",
    "title": "Vue 常用高频插件与生产级生态工具库清单",
    "url": "posts/vue-common-plugins-ecosystem.html",
    "category": "前端开发",
    "date": "2026-05-28",
    "tags": [
      "前端开发",
      "Vue",
      "开发工具",
      "生态推荐"
    ],
    "summary": "整理 Vue 常用插件：富文本编辑器、拖拽排版、数据可视化、权限控制与工具函数库。",
    "content": "vue 常用插件汇总 开发工具类： 1、unplugin-vue-router 组件路由自动化生成工具 2、pre-dev.js 本地环境运行 node pre-dev.js 文件、本地环境文件配置 3、unplugin-auto-import 自动化导入 js、vue、vue-router、pinia、element-plus 等 性能优化类： 1、vite-plugin-compression 代码开启gzip压缩格式 2、pinia-plugin-persistedstate 对pinia开启持久话存储 3、vue-image-compressor 开启图压缩 4、vue-virtual-scroller 对滚动翻页得页面开启虚拟滚动 安全类： 1、dompurify 防止内容注入 2、xss 防止xss 攻击",
    "fullText": "Vue 常用高频插件与生产级生态工具库清单 整理 Vue 常用插件：富文本编辑器、拖拽排版、数据可视化、权限控制与工具函数库。 前端开发 Vue 开发工具 生态推荐 vue 常用插件汇总 开发工具类： 1、unplugin-vue-router 组件路由自动化生成工具 2、pre-dev.js 本地环境运行 node pre-dev.js 文件、本地环境文件配置 3、unplugin-auto-import 自动化导入 js、vue、vue-router、pinia、element-plus 等 性能优化类： 1、vite-plugin-compression 代码开启gzip压缩格式 2、pinia-plugin-persistedstate 对pinia开启持久话存储 3、vue-image-compressor 开启图压缩 4、vue-virtual-scroller 对滚动翻页得页面开启虚拟滚动 安全类： 1、dompurify 防止内容注入 2、xss 防止xss 攻击",
    "sections": [
      {
        "title": "vue 常用插件汇总",
        "anchor": "#vue-常用插件汇总",
        "id": "vue-常用插件汇总"
      },
      {
        "title": "开发工具类：",
        "anchor": "#开发工具类",
        "id": "开发工具类"
      },
      {
        "title": "性能优化类：",
        "anchor": "#性能优化类",
        "id": "性能优化类"
      },
      {
        "title": "安全类：",
        "anchor": "#安全类",
        "id": "安全类"
      }
    ]
  },
  {
    "id": "siege-http-benchmark-load-testing-guide",
    "title": "开源 HTTP 压力测试工具 Siege 从安装到生产实战指南",
    "url": "posts/siege-http-benchmark-load-testing-guide.html",
    "category": "Linux与服务端",
    "date": "2026-05-25",
    "tags": [
      "Linux",
      "压力测试",
      "性能优化",
      "Siege"
    ],
    "summary": "详解轻量级 HTTP 负载压测工具 Siege：并发连接模拟、吞吐量 QPS 评估、响应延迟分析与测试报告解读。",
    "content": "开源压力测试工具（siege） 当前环境（CentOS 7+） 安装步骤 第一步：更新系统 bash sudo yum -y update 第二步：安装依赖包 bash sudo yum install -y gcc make openssl-devel 第三步：下载 siege 软件包 bash wget http://download.joedog.org/siege/siege-latest.tar.gz 注意 ：如果上述链接失效，可以使用以下备用下载方式： bash 从 GitHub 下载最新版本 wget https://github.com/JoeDog/siege/releases/latest/download/siege-latest.tar.gz 第四步：解压软件包 bash tar zxvf siege-latest.tar.gz 第五步：删除安装包（可选） bash rm -f siege-latest.tar.gz 第六步：进入解压后的目录 bash 进入解压后的目录（注意：版本号可能不同，请根据实际情况调整） cd siege- / 说明 ：使用 siege- / 通配符可以自动匹配版本号，避免硬编码版本号的问题。 第七步：编译安装 bash ./configure && make 第八步：安装到系统 bash sudo make install 第九步：创建配置文件 bash 复制配置文件到用户目录 cp doc/siegerc ~/.siegerc 注意 ：如果 doc/siegerc 不存在，可以手动创建配置文件： bash 创建配置文件 touch ~/.siegerc 第十步：验证安装 bash siege -V 预期输出 ： SIEGE 4.1.3 Copyright C 2025 by Jeffrey Fulmer, et al. ... 使用示例 基本压力测试 bash 10个客户端并发，每个客户端发起10个请求 siege -c 10 -r 10 --log=./siege.log https://www.baidu.com 常用参数说明 | 参数 | 说明 | 示例 | |------|------|------| | -c | 并发用户数 | -c 10 10个并发用户 | | -r | 重复次数 | -r 10 每个用户重复10次 | | -t | 持续时间 | -t 30S 持续30秒 | | -d | 延迟时间 | -d 1 每个请求延迟1秒 | | -i | 互联网模式（随机访问） | -i | | -b | 基准测试模式（无延迟） | -b | | --log | 日志文件路径 | --log=./siege.log | 更多使用示例 bash 持续30秒的压力测试 siege -c 20 -t 30S https://www.example.com 从URL文件读取测试目标 siege -c 10 -r 5 -f urls.txt 基准测试模式（无延迟，最大压力） siege -c 50 -r 100 -b https://www.example.com 常见问题 1. 编译错误 如果出现 openssl 相关错误，请确保已安装 openssl-devel ： bash sudo yum install -y openssl-devel 2. 权限问题 如果安装时遇到权限问题，确保使用 sudo ： bash sudo make install 3. 配置文件不存在 如果 ~/.siegerc 不存在，可以手动创建： bash mkdir -p ~/.siege touch ~/.siegerc 卸载方法 bash 进入源码目录 cd siege- / 执行卸载 sudo make uninstall 删除配置文件 rm -rf ~/.siegerc 参考资源 - 官方网站：https://www.joedog.org/siege-home/ - GitHub 仓库：https://github.com/JoeDog/siege - 官方文档：https://www.joedog.org/siege-manual/",
    "fullText": "开源 HTTP 压力测试工具 Siege 从安装到生产实战指南 详解轻量级 HTTP 负载压测工具 Siege：并发连接模拟、吞吐量 QPS 评估、响应延迟分析与测试报告解读。 Linux 压力测试 性能优化 Siege 开源压力测试工具（siege） 当前环境（CentOS 7+） 安装步骤 第一步：更新系统 bash sudo yum -y update 第二步：安装依赖包 bash sudo yum install -y gcc make openssl-devel 第三步：下载 siege 软件包 bash wget http://download.joedog.org/siege/siege-latest.tar.gz 注意 ：如果上述链接失效，可以使用以下备用下载方式： bash 从 GitHub 下载最新版本 wget https://github.com/JoeDog/siege/releases/latest/download/siege-latest.tar.gz 第四步：解压软件包 bash tar zxvf siege-latest.tar.gz 第五步：删除安装包（可选） bash rm -f siege-latest.tar.gz 第六步：进入解压后的目录 bash 进入解压后的目录（注意：版本号可能不同，请根据实际情况调整） cd siege- / 说明 ：使用 siege- / 通配符可以自动匹配版本号，避免硬编码版本号的问题。 第七步：编译安装 bash ./configure && make 第八步：安装到系统 bash sudo make install 第九步：创建配置文件 bash 复制配置文件到用户目录 cp doc/siegerc ~/.siegerc 注意 ：如果 doc/siegerc 不存在，可以手动创建配置文件： bash 创建配置文件 touch ~/.siegerc 第十步：验证安装 bash siege -V 预期输出 ： SIEGE 4.1.3 Copyright C 2025 by Jeffrey Fulmer, et al. ... 使用示例 基本压力测试 bash 10个客户端并发，每个客户端发起10个请求 siege -c 10 -r 10 --log=./siege.log https://www.baidu.com 常用参数说明 | 参数 | 说明 | 示例 | |------|------|------| | -c | 并发用户数 | -c 10 10个并发用户 | | -r | 重复次数 | -r 10 每个用户重复10次 | | -t | 持续时间 | -t 30S 持续30秒 | | -d | 延迟时间 | -d 1 每个请求延迟1秒 | | -i | 互联网模式（随机访问） | -i | | -b | 基准测试模式（无延迟） | -b | | --log | 日志文件路径 | --log=./siege.log | 更多使用示例 bash 持续30秒的压力测试 siege -c 20 -t 30S https://www.example.com 从URL文件读取测试目标 siege -c 10 -r 5 -f urls.txt 基准测试模式（无延迟，最大压力） siege -c 50 -r 100 -b https://www.example.com 常见问题 1. 编译错误 如果出现 openssl 相关错误，请确保已安装 openssl-devel ： bash sudo yum install -y openssl-devel 2. 权限问题 如果安装时遇到权限问题，确保使用 sudo ： bash sudo make install 3. 配置文件不存在 如果 ~/.siegerc 不存在，可以手动创建： bash mkdir -p ~/.siege touch ~/.siegerc 卸载方法 bash 进入源码目录 cd siege- / 执行卸载 sudo make uninstall 删除配置文件 rm -rf ~/.siegerc 参考资源 - 官方网站：https://www.joedog.org/siege-home/ - GitHub 仓库：https://github.com/JoeDog/siege - 官方文档：https://www.joedog.org/siege-manual/",
    "sections": [
      {
        "title": "安装步骤",
        "anchor": "#安装步骤",
        "id": "安装步骤"
      },
      {
        "title": "第一步：更新系统",
        "anchor": "#第一步-更新系统",
        "id": "第一步-更新系统"
      },
      {
        "title": "第二步：安装依赖包",
        "anchor": "#第二步-安装依赖包",
        "id": "第二步-安装依赖包"
      },
      {
        "title": "第三步：下载 siege 软件包",
        "anchor": "#第三步-下载-siege-软件包",
        "id": "第三步-下载-siege-软件包"
      },
      {
        "title": "第四步：解压软件包",
        "anchor": "#第四步-解压软件包",
        "id": "第四步-解压软件包"
      },
      {
        "title": "第五步：删除安装包（可选）",
        "anchor": "#第五步-删除安装包-可选",
        "id": "第五步-删除安装包-可选"
      },
      {
        "title": "第六步：进入解压后的目录",
        "anchor": "#第六步-进入解压后的目录",
        "id": "第六步-进入解压后的目录"
      },
      {
        "title": "第七步：编译安装",
        "anchor": "#第七步-编译安装",
        "id": "第七步-编译安装"
      },
      {
        "title": "第八步：安装到系统",
        "anchor": "#第八步-安装到系统",
        "id": "第八步-安装到系统"
      },
      {
        "title": "第九步：创建配置文件",
        "anchor": "#第九步-创建配置文件",
        "id": "第九步-创建配置文件"
      },
      {
        "title": "第十步：验证安装",
        "anchor": "#第十步-验证安装",
        "id": "第十步-验证安装"
      },
      {
        "title": "使用示例",
        "anchor": "#使用示例",
        "id": "使用示例"
      },
      {
        "title": "基本压力测试",
        "anchor": "#基本压力测试",
        "id": "基本压力测试"
      },
      {
        "title": "常用参数说明",
        "anchor": "#常用参数说明",
        "id": "常用参数说明"
      },
      {
        "title": "更多使用示例",
        "anchor": "#更多使用示例",
        "id": "更多使用示例"
      },
      {
        "title": "常见问题",
        "anchor": "#常见问题",
        "id": "常见问题"
      },
      {
        "title": "1. 编译错误",
        "anchor": "#1-编译错误",
        "id": "1-编译错误"
      },
      {
        "title": "2. 权限问题",
        "anchor": "#2-权限问题",
        "id": "2-权限问题"
      },
      {
        "title": "3. 配置文件不存在",
        "anchor": "#3-配置文件不存在",
        "id": "3-配置文件不存在"
      },
      {
        "title": "卸载方法",
        "anchor": "#卸载方法",
        "id": "卸载方法"
      },
      {
        "title": "参考资源",
        "anchor": "#参考资源",
        "id": "参考资源"
      }
    ]
  },
  {
    "id": "ruoyi-navigation-error-nextsibling",
    "title": "若依管理系统导航报错 reading 'nextSibling' 根因分析与解决方案",
    "url": "posts/ruoyi-navigation-error-nextsibling.html",
    "category": "前端开发",
    "date": "2026-05-20",
    "tags": [
      "前端开发",
      "Vue",
      "Bug排查",
      "若依"
    ],
    "summary": "剖析 Vue-Router 与 Element-UI 侧边栏菜单在动态路由加载时 nextSibling 为空的偶发报错原因与补丁方案。",
    "content": "若依vue3 报错 reading 'nextSibling' RuoYi点击菜单出现空白页面，无报错 前端使用若依框架 vue3版本 ，在开发过程中有时会出现切换菜单或者tab，页面空白的情况，刷新页面后又恢复正常。出现这种情况一般是在页面停留了几分钟再操作或者短时间多次跳转，偶尔也会莫名奇妙的出现， 修改路径 html src/layout/components/AppMain.vue 原本代码 html <keep-alive :include=\"tagsViewStore.cachedViews\"> <component v-if=\"!route.meta.link\" :is=\"Component\" :key=\"route.path\"/> </keep-alive> 修改后的代码 html <transition name=\"fade-transform\" mode=\"out-in\"> <div :key=\"route.path\"> <keep-alive :include=\"tagsViewStore.cachedViews\"> <component v-if=\"!route.meta.link\" :is=\"Component\" :key=\"route.path\"/> </keep-alive> </div> </transition>",
    "fullText": "若依管理系统导航报错 reading 'nextSibling' 根因分析与解决方案 剖析 Vue-Router 与 Element-UI 侧边栏菜单在动态路由加载时 nextSibling 为空的偶发报错原因与补丁方案。 前端开发 Vue Bug排查 若依 若依vue3 报错 reading 'nextSibling' RuoYi点击菜单出现空白页面，无报错 前端使用若依框架 vue3版本 ，在开发过程中有时会出现切换菜单或者tab，页面空白的情况，刷新页面后又恢复正常。出现这种情况一般是在页面停留了几分钟再操作或者短时间多次跳转，偶尔也会莫名奇妙的出现， 修改路径 html src/layout/components/AppMain.vue 原本代码 html <keep-alive :include=\"tagsViewStore.cachedViews\"> <component v-if=\"!route.meta.link\" :is=\"Component\" :key=\"route.path\"/> </keep-alive> 修改后的代码 html <transition name=\"fade-transform\" mode=\"out-in\"> <div :key=\"route.path\"> <keep-alive :include=\"tagsViewStore.cachedViews\"> <component v-if=\"!route.meta.link\" :is=\"Component\" :key=\"route.path\"/> </keep-alive> </div> </transition>",
    "sections": [
      {
        "title": "若依vue3 报错 reading 'nextSibling'",
        "anchor": "#若依vue3-报错-reading-nextsibling",
        "id": "若依vue3-报错-reading-nextsibling"
      },
      {
        "title": "RuoYi点击菜单出现空白页面，无报错",
        "anchor": "#ruoyi点击菜单出现空白页面-无报错",
        "id": "ruoyi点击菜单出现空白页面-无报错"
      },
      {
        "title": "修改路径",
        "anchor": "#修改路径",
        "id": "修改路径"
      },
      {
        "title": "原本代码",
        "anchor": "#原本代码",
        "id": "原本代码"
      },
      {
        "title": "修改后的代码",
        "anchor": "#修改后的代码",
        "id": "修改后的代码"
      }
    ]
  },
  {
    "id": "xray-core-install-script-configuration",
    "title": "Xray-Core Linux 一键部署与自动化服务管理脚本",
    "url": "posts/xray-core-install-script-configuration.html",
    "category": "Linux与服务端",
    "date": "2026-05-15",
    "tags": [
      "Linux",
      "网络工具",
      "脚本自动化"
    ],
    "summary": "Linux 生产环境一键拉取并安装最新 Xray 核心，配置 Systemd 守护进程与日志轮转。",
    "content": "Xray 一键安装脚本使用说明 本文档提供了运行托管在 GitHub 上的 xray.sh 脚本的通用安装命令，并说明了具体的使用方法及相关注意事项。 1. 安装命令 您可以根据服务器的环境（是否预装了 curl 或 wget ），选择以下任意一种方式进行安装： 方法一：使用 curl （推荐，最快捷） 此命令会直接读取网络文件并执行，不会在服务器本地留下脚本文件。 bash bash < curl -Ls ../assets/files/xray.sh 方法二：使用 wget 如果您的服务器没有安装 curl ，可以使用 wget 达到相同的效果。 bash wget -O- ../assets/files/xray.sh | bash 方法三：分步执行（适合需要先检查代码的用户） 将脚本下载到本地，赋予执行权限后再手动运行。 bash 1. 下载脚本 curl -O ../assets/files/xray.sh 2. 赋予脚本执行权限 chmod +x xray.sh 3. 运行脚本 ./xray.sh --- 2. 怎么用？（使用步骤） 1. 连接服务器 ：使用 SSH 客户端（如 Termius, Xshell, PuTTY 或 macOS/Linux 自带的终端）连接到您的 Linux 服务器（VPS）。 2. 复制命令 ：复制上述“安装命令”中的任意一条。 3. 执行安装 ：在服务器终端内粘贴该命令并按回车键运行。 4. 跟随提示操作 ：脚本运行后，通常会弹出交互式菜单或按步骤提示您输入/确认相关配置（如选择安装的协议、端口号、伪装域名等）。请仔细阅读终端打印的提示，输入对应数字或按回车确认。 5. 保存节点信息 ：安装完成后，脚本一般会在终端底部输出最终的客户端连接信息（如 VLESS/VMess 分享链接、配置 JSON 或二维码），请务必妥善复制并保存这些信息，用于配置您的本地客户端。 ---",
    "fullText": "Xray-Core Linux 一键部署与自动化服务管理脚本 Linux 生产环境一键拉取并安装最新 Xray 核心，配置 Systemd 守护进程与日志轮转。 Linux 网络工具 脚本自动化 Xray 一键安装脚本使用说明 本文档提供了运行托管在 GitHub 上的 xray.sh 脚本的通用安装命令，并说明了具体的使用方法及相关注意事项。 1. 安装命令 您可以根据服务器的环境（是否预装了 curl 或 wget ），选择以下任意一种方式进行安装： 方法一：使用 curl （推荐，最快捷） 此命令会直接读取网络文件并执行，不会在服务器本地留下脚本文件。 bash bash < curl -Ls ../assets/files/xray.sh 方法二：使用 wget 如果您的服务器没有安装 curl ，可以使用 wget 达到相同的效果。 bash wget -O- ../assets/files/xray.sh | bash 方法三：分步执行（适合需要先检查代码的用户） 将脚本下载到本地，赋予执行权限后再手动运行。 bash 1. 下载脚本 curl -O ../assets/files/xray.sh 2. 赋予脚本执行权限 chmod +x xray.sh 3. 运行脚本 ./xray.sh --- 2. 怎么用？（使用步骤） 1. 连接服务器 ：使用 SSH 客户端（如 Termius, Xshell, PuTTY 或 macOS/Linux 自带的终端）连接到您的 Linux 服务器（VPS）。 2. 复制命令 ：复制上述“安装命令”中的任意一条。 3. 执行安装 ：在服务器终端内粘贴该命令并按回车键运行。 4. 跟随提示操作 ：脚本运行后，通常会弹出交互式菜单或按步骤提示您输入/确认相关配置（如选择安装的协议、端口号、伪装域名等）。请仔细阅读终端打印的提示，输入对应数字或按回车确认。 5. 保存节点信息 ：安装完成后，脚本一般会在终端底部输出最终的客户端连接信息（如 VLESS/VMess 分享链接、配置 JSON 或二维码），请务必妥善复制并保存这些信息，用于配置您的本地客户端。 ---",
    "sections": [
      {
        "title": "1. 安装命令",
        "anchor": "#1-安装命令",
        "id": "1-安装命令"
      },
      {
        "title": "方法一：使用 `curl`（推荐，最快捷）",
        "anchor": "#方法一-使用-curl-推荐-最快捷",
        "id": "方法一-使用-curl-推荐-最快捷"
      },
      {
        "title": "方法二：使用 `wget`",
        "anchor": "#方法二-使用-wget",
        "id": "方法二-使用-wget"
      },
      {
        "title": "方法三：分步执行（适合需要先检查代码的用户）",
        "anchor": "#方法三-分步执行-适合需要先检查代码的用户",
        "id": "方法三-分步执行-适合需要先检查代码的用户"
      },
      {
        "title": "2. 怎么用？（使用步骤）",
        "anchor": "#2-怎么用-使用步骤",
        "id": "2-怎么用-使用步骤"
      }
    ]
  },
  {
    "id": "javascript-debounce-throttle",
    "title": "JavaScript 防抖与节流深度剖析：从原理实现到业务场景落地",
    "url": "posts/javascript-debounce-throttle.html",
    "category": "前端开发",
    "date": "2026-05-12",
    "tags": [
      "前端开发",
      "JavaScript",
      "性能优化",
      "工具函数"
    ],
    "summary": "深入剖析 Debounce 与 Throttle 运行机理，手写支持 immediate 首次立即执行与取消功能的完整实现。",
    "content": "前端开发之防抖和节流函数 概念说明 防抖（Debounce） 定义 ：一个需要频繁触发的函数，在规定时间内，只能让最后一次生效，前面的不生效。 原理 ：每次触发时都清除上一次的定时器，重新计时，直到停止触发一段时间后才执行。 适用场景 ： - 搜索框输入联想 - 窗口resize事件 - 表单验证 - 按钮点击防重复提交 节流（Throttle） 定义 ：一个函数执行一次后，只有大于设定的执行周期后才会执行第二次。 原理 ：在指定时间间隔内，无论触发多少次，只执行一次。 适用场景 ： - 滚动事件监听 - 鼠标移动事件 - 按钮连续点击 - 游戏中的按键事件 防抖函数实现 ES5 写法 javascript / 防抖函数 @param {Function} fn - 要被防抖的函数 @param {number} delay - 延迟时间（毫秒） @returns {Function} - 防抖处理后的函数 / function debounce fn, delay { var timer = null; return function { // 清理上一次延时器 clearTimeout timer ; // 保存this和参数 var that = this; var args = arguments; // 重新设置新的延时器 timer = setTimeout function { fn.apply that, args ; }, delay ; }; } ES6 写法（推荐） javascript / 防抖函数 @param {Function} fn - 要被防抖的函数 @param {number} delay - 延迟时间（毫秒） @param {boolean} immediate - 是否立即执行 @returns {Function} - 防抖处理后的函数 / function debounce fn, delay = 300, immediate = false { let timer = null; return function ...args { // 清除上一次定时器 clearTimeout timer ; if immediate { // 立即执行模式 if !timer { fn.apply this, args ; } timer = setTimeout => { timer = null; }, delay ; } else { // 延迟执行模式 timer = setTimeout => { fn.apply this, args ; }, delay ; } }; } 带取消功能的防抖函数 javascript / 可取消的防抖函数 @param {Function} fn - 要被防抖的函数 @param {number} delay - 延迟时间（毫秒） @returns {Object} - 包含debounce函数和cancel方法 / function createDebounce fn, delay = 300 { let timer = null; const debounced = function ...args { clearTimeout timer ; timer = setTimeout => { fn.apply this, args ; }, delay ; }; // 取消防抖 debounced.cancel = function { clearTimeout timer ; timer = null; }; return debounced; } 节流函数实现 ES5 写法 javascript / 节流函数 @param {Function} fn - 要被节流的函数 @param {number} delay - 设定的时间间隔（毫秒） @returns {Function} - 节流处理后的函数 / function throttle fn, delay { var startTime = 0; return function { // 记录当前函数触发时间 var endTime = Date.now ; if endTime - startTime > delay { // 保存this和参数 var that = this; var args = arguments; fn.apply that, args ; // 同步时间 startTime = endTime; } }; } ES6 写法（推荐） javascript / 节流函数 @param {Function} fn - 要被节流的函数 @param {number} delay - 时间间隔（毫秒） @returns {Function} - 节流处理后的函数 / function throttle fn, delay = 300 { let lastTime = 0; return function ...args { const now = Date.now ; if now - lastTime > delay { fn.apply this, args ; lastTime = now; } }; } 定时器版本节流 javascript / 定时器版本节流函数 @param {Function} fn - 要被节流的函数 @param {number} delay - 时间间隔（毫秒） @returns {Function} - 节流处理后的函数 / function throttleTimer fn, delay = 300 { let timer = null; return function ...args { if !timer { timer = setTimeout => { fn.apply this, args ; timer = null; }, delay ; } }; } 带取消功能的节流函数 javascript / 可取消的节流函数 @param {Function} fn - 要被节流的函数 @param {number} delay - 时间间隔（毫秒） @returns {Object} - 包含throttle函数和cancel方法 / function createThrottle fn, delay = 300 { let timer = null; const throttled = function ...args { if !timer { timer = setTimeout => { fn.apply this, args ; timer = null; }, delay ; } }; // 取消节流 throttled.cancel = function { clearTimeout timer ; timer = null; }; return throttled; } 实际应用示例 1. 搜索框输入防抖 javascript // 搜索框输入联想 const searchInput = document.getElementById 'search-input' ; const debouncedSearch = debounce function keyword { console.log '搜索：', keyword ; // 实际项目中这里会调用API }, 500 ; searchInput.addEventListener 'input', function e { debouncedSearch e.target.value ; } ; 2. 按钮点击防抖 javascript // 防止表单重复提交 const submitBtn = document.getElementById 'submit-btn' ; const debouncedSubmit = debounce function { console.log '表单提交' ; // 实际提交逻辑 }, 1000 ; submitBtn.addEventListener 'click', debouncedSubmit ; 3. 窗口resize节流 javascript // 窗口大小改变时重新计算布局 const throttledResize = throttle function { console.log '窗口大小改变' ; // 重新计算布局逻辑 }, 200 ; window.addEventListener 'resize', throttledResize ; 4. 滚动事件节流 javascript // 滚动加载更多 const throttledScroll = throttle function { const scrollTop = window.pageYOffset; const windowHeight = window.innerHeight; const documentHeight = document.documentElement.scrollHeight; if scrollTop + windowHeight >= documentHeight - 100 { console.log '加载更多数据' ; // 加载更多数据的逻辑 } }, 300 ; window.addEventListener 'scroll', throttledScroll ; 5. 鼠标移动节流 javascript // 鼠标位置追踪 const throttledMouseMove = throttle function e { console.log '鼠标位置：', e.clientX, e.clientY ; // 鼠标位置处理逻辑 }, 100 ; document.addEventListener 'mousemove', throttledMouseMove ; 防抖 vs 节流对比 | 特性 | 防抖 | 节流 | |------|------|------| | 执行时机 | 停止触发后执行 | 固定时间间隔执行 | | 触发频率 | 只执行最后一次 | 定期执行 | | 首次触发 | 可配置立即执行 | 立即执行 | | 典型场景 | 搜索框、表单提交 | 滚动、鼠标移动 | | 性能影响 | 减少不必要的执行 | 控制执行频率 | 完整示例页面 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>防抖和节流示例</title> <style> body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; } .section { margin-bottom: 30px; padding: 20px; border: 1px solid ddd; border-radius: 5px; } input { padding: 8px; margin: 10px 0; width: 300px; } button { padding: 10px 20px; margin: 10px 0; cursor: pointer; } .log { background: f5f5f5; padding: 10px; margin-top: 10px; max-height: 200px; overflow-y: auto; font-family: monospace; } </style> </head> <body> <h1>防抖和节流函数示例</h1> <!-- 防抖示例 --> <div class=\"section\"> <h2>防抖示例 - 搜索框</h2> <input type=\"text\" id=\"search-input\" placeholder=\"输入搜索内容...\"> <div class=\"log\" id=\"search-log\"></div> </div> <!-- 节流示例 --> <div class=\"section\"> <h2>节流示例 - 按钮点击</h2> <button id=\"throttle-btn\">点击我（节流）</button> <div class=\"log\" id=\"throttle-log\"></div> </div> <!-- 滚动节流示例 --> <div class=\"section\"> <h2>滚动节流示例</h2> <p>向下滚动查看效果...</p> <div style=\"height: 2000px; background: linear-gradient to bottom, f0f0f0, e0e0e0 ;\"></div> <div class=\"log\" id=\"scroll-log\"></div> </div> <script> // 防抖函数 function debounce fn, delay = 300 { let timer = null; return function ...args { clearTimeout timer ; timer = setTimeout => { fn.apply this, args ; }, delay ; }; } // 节流函数 function throttle fn, delay = 300 { let lastTime = 0; return function ...args { const now = Date.now ; if now - lastTime > delay { fn.apply this, args ; lastTime = now; } }; } // 搜索框防抖 const searchInput = document.getElementById 'search-input' ; const searchLog = document.getElementById 'search-log' ; const debouncedSearch = debounce function keyword { const time = new Date .toLocaleTimeString ; searchLog.innerHTML += <div> ${time} 搜索：${keyword}</div> ; searchLog.scrollTop = searchLog.scrollHeight; }, 500 ; searchInput.addEventListener 'input', function e { debouncedSearch e.target.value ; } ; // 按钮节流 const throttleBtn = document.getElementById 'throttle-btn' ; const throttleLog = document.getElementById 'throttle-log' ; const throttledClick = throttle function { const time = new Date .toLocaleTimeString ; throttleLog.innerHTML += <div> ${time} 按钮被点击</div> ; throttleLog.scrollTop = throttleLog.scrollHeight; }, 1000 ; throttleBtn.addEventListener 'click', throttledClick ; // 滚动节流 const scrollLog = document.getElementById 'scroll-log' ; const throttledScroll = throttle function { const scrollTop = window.pageYOffset; const time = new Date .toLocaleTimeString ; scrollLog.innerHTML += <div> ${time} 滚动位置：${scrollTop}px</div> ; scrollLog.scrollTop = scrollLog.scrollHeight; }, 300 ; window.addEventListener 'scroll', throttledScroll ; </script> </body> </html> 性能优化建议 1. 合理设置延迟时间 ： - 防抖：通常300-500ms - 节流：通常100-300ms 2. 选择合适的函数 ： - 需要最终结果用防抖 - 需要持续反馈用节流 3. 内存管理 ： - 及时取消不需要的防抖/节流 - 在组件销毁时清理定时器 4. 参数传递 ： - 正确处理 this 指向 - 传递完整的参数列表 常见问题 Q1: 防抖和节流有什么区别？ A: 防抖是停止触发后执行，节流是固定时间间隔执行。 Q2: 如何选择使用防抖还是节流？ A: 需要最终结果（如搜索）用防抖，需要持续反馈（如滚动）用节流。 Q3: 如何取消防抖/节流？ A: 使用带取消功能的版本，调用 cancel 方法。 Q4: 防抖/节流会影响性能吗？ A: 不会，反而能提升性能，减少不必要的函数调用。 总结 防抖和节流是前端性能优化的重要手段： - ✅ 防抖 ：适合搜索框、表单提交等场景 - ✅ 节流 ：适合滚动、鼠标移动等场景 - ✅ 性能优化 ：减少不必要的函数调用 - ✅ 用户体验 ：避免卡顿和重复操作 正确使用防抖和节流可以显著提升应用的性能和用户体验！",
    "fullText": "JavaScript 防抖与节流深度剖析：从原理实现到业务场景落地 深入剖析 Debounce 与 Throttle 运行机理，手写支持 immediate 首次立即执行与取消功能的完整实现。 前端开发 JavaScript 性能优化 工具函数 前端开发之防抖和节流函数 概念说明 防抖（Debounce） 定义 ：一个需要频繁触发的函数，在规定时间内，只能让最后一次生效，前面的不生效。 原理 ：每次触发时都清除上一次的定时器，重新计时，直到停止触发一段时间后才执行。 适用场景 ： - 搜索框输入联想 - 窗口resize事件 - 表单验证 - 按钮点击防重复提交 节流（Throttle） 定义 ：一个函数执行一次后，只有大于设定的执行周期后才会执行第二次。 原理 ：在指定时间间隔内，无论触发多少次，只执行一次。 适用场景 ： - 滚动事件监听 - 鼠标移动事件 - 按钮连续点击 - 游戏中的按键事件 防抖函数实现 ES5 写法 javascript / 防抖函数 @param {Function} fn - 要被防抖的函数 @param {number} delay - 延迟时间（毫秒） @returns {Function} - 防抖处理后的函数 / function debounce fn, delay { var timer = null; return function { // 清理上一次延时器 clearTimeout timer ; // 保存this和参数 var that = this; var args = arguments; // 重新设置新的延时器 timer = setTimeout function { fn.apply that, args ; }, delay ; }; } ES6 写法（推荐） javascript / 防抖函数 @param {Function} fn - 要被防抖的函数 @param {number} delay - 延迟时间（毫秒） @param {boolean} immediate - 是否立即执行 @returns {Function} - 防抖处理后的函数 / function debounce fn, delay = 300, immediate = false { let timer = null; return function ...args { // 清除上一次定时器 clearTimeout timer ; if immediate { // 立即执行模式 if !timer { fn.apply this, args ; } timer = setTimeout => { timer = null; }, delay ; } else { // 延迟执行模式 timer = setTimeout => { fn.apply this, args ; }, delay ; } }; } 带取消功能的防抖函数 javascript / 可取消的防抖函数 @param {Function} fn - 要被防抖的函数 @param {number} delay - 延迟时间（毫秒） @returns {Object} - 包含debounce函数和cancel方法 / function createDebounce fn, delay = 300 { let timer = null; const debounced = function ...args { clearTimeout timer ; timer = setTimeout => { fn.apply this, args ; }, delay ; }; // 取消防抖 debounced.cancel = function { clearTimeout timer ; timer = null; }; return debounced; } 节流函数实现 ES5 写法 javascript / 节流函数 @param {Function} fn - 要被节流的函数 @param {number} delay - 设定的时间间隔（毫秒） @returns {Function} - 节流处理后的函数 / function throttle fn, delay { var startTime = 0; return function { // 记录当前函数触发时间 var endTime = Date.now ; if endTime - startTime > delay { // 保存this和参数 var that = this; var args = arguments; fn.apply that, args ; // 同步时间 startTime = endTime; } }; } ES6 写法（推荐） javascript / 节流函数 @param {Function} fn - 要被节流的函数 @param {number} delay - 时间间隔（毫秒） @returns {Function} - 节流处理后的函数 / function throttle fn, delay = 300 { let lastTime = 0; return function ...args { const now = Date.now ; if now - lastTime > delay { fn.apply this, args ; lastTime = now; } }; } 定时器版本节流 javascript / 定时器版本节流函数 @param {Function} fn - 要被节流的函数 @param {number} delay - 时间间隔（毫秒） @returns {Function} - 节流处理后的函数 / function throttleTimer fn, delay = 300 { let timer = null; return function ...args { if !timer { timer = setTimeout => { fn.apply this, args ; timer = null; }, delay ; } }; } 带取消功能的节流函数 javascript / 可取消的节流函数 @param {Function} fn - 要被节流的函数 @param {number} delay - 时间间隔（毫秒） @returns {Object} - 包含throttle函数和cancel方法 / function createThrottle fn, delay = 300 { let timer = null; const throttled = function ...args { if !timer { timer = setTimeout => { fn.apply this, args ; timer = null; }, delay ; } }; // 取消节流 throttled.cancel = function { clearTimeout timer ; timer = null; }; return throttled; } 实际应用示例 1. 搜索框输入防抖 javascript // 搜索框输入联想 const searchInput = document.getElementById 'search-input' ; const debouncedSearch = debounce function keyword { console.log '搜索：', keyword ; // 实际项目中这里会调用API }, 500 ; searchInput.addEventListener 'input', function e { debouncedSearch e.target.value ; } ; 2. 按钮点击防抖 javascript // 防止表单重复提交 const submitBtn = document.getElementById 'submit-btn' ; const debouncedSubmit = debounce function { console.log '表单提交' ; // 实际提交逻辑 }, 1000 ; submitBtn.addEventListener 'click', debouncedSubmit ; 3. 窗口resize节流 javascript // 窗口大小改变时重新计算布局 const throttledResize = throttle function { console.log '窗口大小改变' ; // 重新计算布局逻辑 }, 200 ; window.addEventListener 'resize', throttledResize ; 4. 滚动事件节流 javascript // 滚动加载更多 const throttledScroll = throttle function { const scrollTop = window.pageYOffset; const windowHeight = window.innerHeight; const documentHeight = document.documentElement.scrollHeight; if scrollTop + windowHeight >= documentHeight - 100 { console.log '加载更多数据' ; // 加载更多数据的逻辑 } }, 300 ; window.addEventListener 'scroll', throttledScroll ; 5. 鼠标移动节流 javascript // 鼠标位置追踪 const throttledMouseMove = throttle function e { console.log '鼠标位置：', e.clientX, e.clientY ; // 鼠标位置处理逻辑 }, 100 ; document.addEventListener 'mousemove', throttledMouseMove ; 防抖 vs 节流对比 | 特性 | 防抖 | 节流 | |------|------|------| | 执行时机 | 停止触发后执行 | 固定时间间隔执行 | | 触发频率 | 只执行最后一次 | 定期执行 | | 首次触发 | 可配置立即执行 | 立即执行 | | 典型场景 | 搜索框、表单提交 | 滚动、鼠标移动 | | 性能影响 | 减少不必要的执行 | 控制执行频率 | 完整示例页面 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>防抖和节流示例</title> <style> body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; } .section { margin-bottom: 30px; padding: 20px; border: 1px solid ddd; border-radius: 5px; } input { padding: 8px; margin: 10px 0; width: 300px; } button { padding: 10px 20px; margin: 10px 0; cursor: pointer; } .log { background: f5f5f5; padding: 10px; margin-top: 10px; max-height: 200px; overflow-y: auto; font-family: monospace; } </style> </head> <body> <h1>防抖和节流函数示例</h1> <!-- 防抖示例 --> <div class=\"section\"> <h2>防抖示例 - 搜索框</h2> <input type=\"text\" id=\"search-input\" placeholder=\"输入搜索内容...\"> <div class=\"log\" id=\"search-log\"></div> </div> <!-- 节流示例 --> <div class=\"section\"> <h2>节流示例 - 按钮点击</h2> <button id=\"throttle-btn\">点击我（节流）</button> <div class=\"log\" id=\"throttle-log\"></div> </div> <!-- 滚动节流示例 --> <div class=\"section\"> <h2>滚动节流示例</h2> <p>向下滚动查看效果...</p> <div style=\"height: 2000px; background: linear-gradient to bottom, f0f0f0, e0e0e0 ;\"></div> <div class=\"log\" id=\"scroll-log\"></div> </div> <script> // 防抖函数 function debounce fn, delay = 300 { let timer = null; return function ...args { clearTimeout timer ; timer = setTimeout => { fn.apply this, args ; }, delay ; }; } // 节流函数 function throttle fn, delay = 300 { let lastTime = 0; return function ...args { const now = Date.now ; if now - lastTime > delay { fn.apply this, args ; lastTime = now; } }; } // 搜索框防抖 const searchInput = document.getElementById 'search-input' ; const searchLog = document.getElementById 'search-log' ; const debouncedSearch = debounce function keyword { const time = new Date .toLocaleTimeString ; searchLog.innerHTML += <div> ${time} 搜索：${keyword}</div> ; searchLog.scrollTop = searchLog.scrollHeight; }, 500 ; searchInput.addEventListener 'input', function e { debouncedSearch e.target.value ; } ; // 按钮节流 const throttleBtn = document.getElementById 'throttle-btn' ; const throttleLog = document.getElementById 'throttle-log' ; const throttledClick = throttle function { const time = new Date .toLocaleTimeString ; throttleLog.innerHTML += <div> ${time} 按钮被点击</div> ; throttleLog.scrollTop = throttleLog.scrollHeight; }, 1000 ; throttleBtn.addEventListener 'click', throttledClick ; // 滚动节流 const scrollLog = document.getElementById 'scroll-log' ; const throttledScroll = throttle function { const scrollTop = window.pageYOffset; const time = new Date .toLocaleTimeString ; scrollLog.innerHTML += <div> ${time} 滚动位置：${scrollTop}px</div> ; scrollLog.scrollTop = scrollLog.scrollHeight; }, 300 ; window.addEventListener 'scroll', throttledScroll ; </script> </body> </html> 性能优化建议 1. 合理设置延迟时间 ： - 防抖：通常300-500ms - 节流：通常100-300ms 2. 选择合适的函数 ： - 需要最终结果用防抖 - 需要持续反馈用节流 3. 内存管理 ： - 及时取消不需要的防抖/节流 - 在组件销毁时清理定时器 4. 参数传递 ： - 正确处理 this 指向 - 传递完整的参数列表 常见问题 Q1: 防抖和节流有什么区别？ A: 防抖是停止触发后执行，节流是固定时间间隔执行。 Q2: 如何选择使用防抖还是节流？ A: 需要最终结果（如搜索）用防抖，需要持续反馈（如滚动）用节流。 Q3: 如何取消防抖/节流？ A: 使用带取消功能的版本，调用 cancel 方法。 Q4: 防抖/节流会影响性能吗？ A: 不会，反而能提升性能，减少不必要的函数调用。 总结 防抖和节流是前端性能优化的重要手段： - ✅ 防抖 ：适合搜索框、表单提交等场景 - ✅ 节流 ：适合滚动、鼠标移动等场景 - ✅ 性能优化 ：减少不必要的函数调用 - ✅ 用户体验 ：避免卡顿和重复操作 正确使用防抖和节流可以显著提升应用的性能和用户体验！",
    "sections": [
      {
        "title": "概念说明",
        "anchor": "#概念说明",
        "id": "概念说明"
      },
      {
        "title": "防抖（Debounce）",
        "anchor": "#防抖-debounce",
        "id": "防抖-debounce"
      },
      {
        "title": "节流（Throttle）",
        "anchor": "#节流-throttle",
        "id": "节流-throttle"
      },
      {
        "title": "防抖函数实现",
        "anchor": "#防抖函数实现",
        "id": "防抖函数实现"
      },
      {
        "title": "ES5 写法",
        "anchor": "#es5-写法",
        "id": "es5-写法"
      },
      {
        "title": "ES6 写法（推荐）",
        "anchor": "#es6-写法-推荐",
        "id": "es6-写法-推荐"
      },
      {
        "title": "带取消功能的防抖函数",
        "anchor": "#带取消功能的防抖函数",
        "id": "带取消功能的防抖函数"
      },
      {
        "title": "节流函数实现",
        "anchor": "#节流函数实现",
        "id": "节流函数实现"
      },
      {
        "title": "ES5 写法",
        "anchor": "#es5-写法",
        "id": "es5-写法"
      },
      {
        "title": "ES6 写法（推荐）",
        "anchor": "#es6-写法-推荐",
        "id": "es6-写法-推荐"
      },
      {
        "title": "定时器版本节流",
        "anchor": "#定时器版本节流",
        "id": "定时器版本节流"
      },
      {
        "title": "带取消功能的节流函数",
        "anchor": "#带取消功能的节流函数",
        "id": "带取消功能的节流函数"
      },
      {
        "title": "实际应用示例",
        "anchor": "#实际应用示例",
        "id": "实际应用示例"
      },
      {
        "title": "1. 搜索框输入防抖",
        "anchor": "#1-搜索框输入防抖",
        "id": "1-搜索框输入防抖"
      },
      {
        "title": "2. 按钮点击防抖",
        "anchor": "#2-按钮点击防抖",
        "id": "2-按钮点击防抖"
      },
      {
        "title": "3. 窗口resize节流",
        "anchor": "#3-窗口resize节流",
        "id": "3-窗口resize节流"
      },
      {
        "title": "4. 滚动事件节流",
        "anchor": "#4-滚动事件节流",
        "id": "4-滚动事件节流"
      },
      {
        "title": "5. 鼠标移动节流",
        "anchor": "#5-鼠标移动节流",
        "id": "5-鼠标移动节流"
      },
      {
        "title": "防抖 vs 节流对比",
        "anchor": "#防抖-vs-节流对比",
        "id": "防抖-vs-节流对比"
      },
      {
        "title": "完整示例页面",
        "anchor": "#完整示例页面",
        "id": "完整示例页面"
      },
      {
        "title": "性能优化建议",
        "anchor": "#性能优化建议",
        "id": "性能优化建议"
      },
      {
        "title": "常见问题",
        "anchor": "#常见问题",
        "id": "常见问题"
      },
      {
        "title": "总结",
        "anchor": "#总结",
        "id": "总结"
      }
    ]
  },
  {
    "id": "xray-dns-anti-pollution-routing-rules",
    "title": "Xray DNS 分流防污染优化与国内外路由分流规则配置",
    "url": "posts/xray-dns-anti-pollution-routing-rules.html",
    "category": "Linux与服务端",
    "date": "2026-05-08",
    "tags": [
      "Linux",
      "网络协议",
      "DNS",
      "路由优化"
    ],
    "summary": "配置 DoH / DoT 加密 DNS 解析，实现基于 GeoIP 与 Geosite 的国内外精准流量智能分流。",
    "content": "xray dns防止污染配置 javascript \"dns\": { \"servers\": { \"address\": \"8.8.8.8\", \"port\": 53, \"domains\": \"geosite:google\", \"geosite:youtube\", \"geosite:netflix\", \"geosite:disney\", \"geosite:hulu\", \"geosite:primevideo\", \"geosite:openai\", \"geosite:anthropic\", \"geosite:github\", \"geosite:telegram\", \"geosite:twitter\", \"geosite:facebook\", \"geosite:instagram\", \"domain:lite.cn2gias.uk\" }, \"localhost\" , \"clientIp\": \"服务器ip\" },",
    "fullText": "Xray DNS 分流防污染优化与国内外路由分流规则配置 配置 DoH / DoT 加密 DNS 解析，实现基于 GeoIP 与 Geosite 的国内外精准流量智能分流。 Linux 网络协议 DNS 路由优化 xray dns防止污染配置 javascript \"dns\": { \"servers\": { \"address\": \"8.8.8.8\", \"port\": 53, \"domains\": \"geosite:google\", \"geosite:youtube\", \"geosite:netflix\", \"geosite:disney\", \"geosite:hulu\", \"geosite:primevideo\", \"geosite:openai\", \"geosite:anthropic\", \"geosite:github\", \"geosite:telegram\", \"geosite:twitter\", \"geosite:facebook\", \"geosite:instagram\", \"domain:lite.cn2gias.uk\" }, \"localhost\" , \"clientIp\": \"服务器ip\" },",
    "sections": [
      {
        "title": "xray dns防止污染配置",
        "anchor": "#xray-dns防止污染配置",
        "id": "xray-dns防止污染配置"
      }
    ]
  },
  {
    "id": "javascript-tree-recursion-utils",
    "title": "常用树结构递归工具函数合集：树平铺、节点查找与层级过滤",
    "url": "posts/javascript-tree-recursion-utils.html",
    "category": "前端开发",
    "date": "2026-05-02",
    "tags": [
      "前端开发",
      "JavaScript",
      "数据结构",
      "算法工具"
    ],
    "summary": "实战整理针对级联选择器与目录树的高频递归操作函数：扁平化转换、树深度查找、剪枝过滤与路径追踪。",
    "content": "递归工具函数合集 1. 对象值检索器 - deepSearchValue 功能说明 ：递归遍历对象或数组的所有层级，检查是否存在指定的目标值 参数说明 ： - targetValue 必传 ：需要检索的目标值，支持基本类型（字符串、数字、布尔值等） - source 必传 ：待检索的数据源，可以是对象或数组 - 返回值： boolean - 找到返回 true ，未找到返回 false 技术要点 ： - 使用严格相等 === 进行比较，避免类型转换导致的误判 - 支持无限层级嵌套的对象和数组 - 一旦找到匹配值立即返回，优化性能 javascript / 递归检索对象/数组中是否包含指定值 @param { } targetValue - 要查找的目标值（基本类型） @param {Object|Array} source - 待检索的对象或数组 @returns {boolean} - 是否找到目标值 / function deepSearchValue targetValue, source { // 基本类型直接比较 if source === targetValue { return true; } // 数组处理 if Array.isArray source { for let item of source { if deepSearchValue targetValue, item { return true; } } return false; } // 对象处理（排除 null） if source !== null && typeof source === 'object' { for let key in source { if deepSearchValue targetValue, source key { return true; } } return false; } return false; } // 调用示例 const testData = { user: { name: \"zhanshan\", goods: { clothes: \"T恤\", color: \"red\", Hair: \"blue\" }, id: 5, sex: \"男\", age: 61 } }; console.log deepSearchValue 'T恤', testData ; // true console.log deepSearchValue '裤子', testData ; // false console.log deepSearchValue 5, testData ; // true --- 2. 数组扁平化 - flattenArray 功能说明 ：将多维数组递归展开为一维数组 参数说明 ： - array 必传 ：需要扁平化的多维数组 - 返回值： Array - 扁平化后的一维数组 技术要点 ： - 支持任意深度的嵌套数组 - 保留原始数组中的对象引用 - 使用 Array.isArray 准确判断数组类型 javascript / 递归扁平化多维数组 @param {Array} array - 需要扁平化的数组 @returns {Array} - 扁平化后的一维数组 / function flattenArray array { let result = ; for let item of array { if Array.isArray item { // 递归处理子数组 result = result.concat flattenArray item ; } else { result.push item ; } } return result; } // 调用示例 const nestedArray = 1, 5, 89, 55, { name: \"zhanshan\", id: 5 }, 8, 1, 5, 89, 859 , 85, 6 , 96, 56 ; console.log flattenArray nestedArray ; // 1, 5, 89, 55, { name: \"zhanshan\", id: 5 }, 8, 1, 5, 89, 859, 85, 6, 96, 56 --- 3. 对象扁平化 - flattenObject 功能说明 ：将嵌套对象递归展开为单层对象 参数说明 ： - obj 必传 ：需要扁平化的嵌套对象 - prefix 可选 ：键名前缀，用于保持层级关系 - 返回值： Object - 扁平化后的单层对象 技术要点 ： - 使用点号连接嵌套键名（如 user.name ） - 遇到数组时保持原样，不展开 - 注意 ：相同路径的键会被后续值覆盖 javascript / 递归扁平化嵌套对象 @param {Object} obj - 需要扁平化的对象 @param {string} prefix='' - 键名前缀（内部使用） @returns {Object} - 扁平化后的对象 / function flattenObject obj, prefix = '' { let result = {}; for let key in obj { // 跳过原型链属性 if !obj.hasOwnProperty key continue; const newKey = prefix ? ${prefix}.${key} : key; if typeof obj key === 'object' && obj key !== null && !Array.isArray obj key { // 递归处理嵌套对象 Object.assign result, flattenObject obj key , newKey ; } else { result newKey = obj key ; } } return result; } // 调用示例 const nestedObject = { user: { name: \"zhanshan\", goods: { clothes: \"T恤\", color: \"red\" }, id: 5, tags: \"admin\", \"vip\" } }; console.log flattenObject nestedObject ; // { // \"user.name\": \"zhanshan\", // \"user.goods.clothes\": \"T恤\", // \"user.goods.color\": \"red\", // \"user.id\": 5, // \"user.tags\": \"admin\", \"vip\" // }",
    "fullText": "常用树结构递归工具函数合集：树平铺、节点查找与层级过滤 实战整理针对级联选择器与目录树的高频递归操作函数：扁平化转换、树深度查找、剪枝过滤与路径追踪。 前端开发 JavaScript 数据结构 算法工具 递归工具函数合集 1. 对象值检索器 - deepSearchValue 功能说明 ：递归遍历对象或数组的所有层级，检查是否存在指定的目标值 参数说明 ： - targetValue 必传 ：需要检索的目标值，支持基本类型（字符串、数字、布尔值等） - source 必传 ：待检索的数据源，可以是对象或数组 - 返回值： boolean - 找到返回 true ，未找到返回 false 技术要点 ： - 使用严格相等 === 进行比较，避免类型转换导致的误判 - 支持无限层级嵌套的对象和数组 - 一旦找到匹配值立即返回，优化性能 javascript / 递归检索对象/数组中是否包含指定值 @param { } targetValue - 要查找的目标值（基本类型） @param {Object|Array} source - 待检索的对象或数组 @returns {boolean} - 是否找到目标值 / function deepSearchValue targetValue, source { // 基本类型直接比较 if source === targetValue { return true; } // 数组处理 if Array.isArray source { for let item of source { if deepSearchValue targetValue, item { return true; } } return false; } // 对象处理（排除 null） if source !== null && typeof source === 'object' { for let key in source { if deepSearchValue targetValue, source key { return true; } } return false; } return false; } // 调用示例 const testData = { user: { name: \"zhanshan\", goods: { clothes: \"T恤\", color: \"red\", Hair: \"blue\" }, id: 5, sex: \"男\", age: 61 } }; console.log deepSearchValue 'T恤', testData ; // true console.log deepSearchValue '裤子', testData ; // false console.log deepSearchValue 5, testData ; // true --- 2. 数组扁平化 - flattenArray 功能说明 ：将多维数组递归展开为一维数组 参数说明 ： - array 必传 ：需要扁平化的多维数组 - 返回值： Array - 扁平化后的一维数组 技术要点 ： - 支持任意深度的嵌套数组 - 保留原始数组中的对象引用 - 使用 Array.isArray 准确判断数组类型 javascript / 递归扁平化多维数组 @param {Array} array - 需要扁平化的数组 @returns {Array} - 扁平化后的一维数组 / function flattenArray array { let result = ; for let item of array { if Array.isArray item { // 递归处理子数组 result = result.concat flattenArray item ; } else { result.push item ; } } return result; } // 调用示例 const nestedArray = 1, 5, 89, 55, { name: \"zhanshan\", id: 5 }, 8, 1, 5, 89, 859 , 85, 6 , 96, 56 ; console.log flattenArray nestedArray ; // 1, 5, 89, 55, { name: \"zhanshan\", id: 5 }, 8, 1, 5, 89, 859, 85, 6, 96, 56 --- 3. 对象扁平化 - flattenObject 功能说明 ：将嵌套对象递归展开为单层对象 参数说明 ： - obj 必传 ：需要扁平化的嵌套对象 - prefix 可选 ：键名前缀，用于保持层级关系 - 返回值： Object - 扁平化后的单层对象 技术要点 ： - 使用点号连接嵌套键名（如 user.name ） - 遇到数组时保持原样，不展开 - 注意 ：相同路径的键会被后续值覆盖 javascript / 递归扁平化嵌套对象 @param {Object} obj - 需要扁平化的对象 @param {string} prefix='' - 键名前缀（内部使用） @returns {Object} - 扁平化后的对象 / function flattenObject obj, prefix = '' { let result = {}; for let key in obj { // 跳过原型链属性 if !obj.hasOwnProperty key continue; const newKey = prefix ? ${prefix}.${key} : key; if typeof obj key === 'object' && obj key !== null && !Array.isArray obj key { // 递归处理嵌套对象 Object.assign result, flattenObject obj key , newKey ; } else { result newKey = obj key ; } } return result; } // 调用示例 const nestedObject = { user: { name: \"zhanshan\", goods: { clothes: \"T恤\", color: \"red\" }, id: 5, tags: \"admin\", \"vip\" } }; console.log flattenObject nestedObject ; // { // \"user.name\": \"zhanshan\", // \"user.goods.clothes\": \"T恤\", // \"user.goods.color\": \"red\", // \"user.id\": 5, // \"user.tags\": \"admin\", \"vip\" // }",
    "sections": [
      {
        "title": "1. 对象值检索器 - deepSearchValue",
        "anchor": "#1-对象值检索器-deepsearchvalue",
        "id": "1-对象值检索器-deepsearchvalue"
      },
      {
        "title": "2. 数组扁平化 - flattenArray",
        "anchor": "#2-数组扁平化-flattenarray",
        "id": "2-数组扁平化-flattenarray"
      },
      {
        "title": "3. 对象扁平化 - flattenObject",
        "anchor": "#3-对象扁平化-flattenobject",
        "id": "3-对象扁平化-flattenobject"
      }
    ]
  },
  {
    "id": "mini-javascript-template-engine",
    "title": "实现一个最优雅的微型 JavaScript 模板引擎：30 行代码解析核心原理",
    "url": "posts/mini-javascript-template-engine.html",
    "category": "前端开发",
    "date": "2026-04-22",
    "tags": [
      "前端开发",
      "JavaScript",
      "底层原理",
      "模板引擎"
    ],
    "summary": "通过正则表达式与 new Function / eval 构建轻量高效的字符串模板渲染引擎，解析 Mustache/EJS 核心思想。",
    "content": "前端之最优雅的模板引擎实现 模板引擎实现原理 模板引擎的核心原理是将模板字符串中的占位符替换为实际数据值。一个优雅的模板引擎应该具备以下特性： - 简洁的语法 ：易于书写和理解 - 强大的功能 ：支持变量、循环、条件等 - 安全性 ：防止XSS攻击 - 性能优化 ：编译缓存机制 基础版本：简单变量替换 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>模板引擎基础实现</title> </head> <body> <div id=\"app\"></div> <script> // 模板数据 var tempData = { \"name\": \"张三\", \"age\": 28, \"sex\": \"男\" }; // 模板字符串（修正了原代码中的变量错误） var templateStr = <h1>我是{{name}}，性别：{{sex}}，年龄：{{age}}</h1> ; / 简单模板渲染函数 @param {string} templateStr - 模板字符串 @param {object} data - 数据对象 @returns {string} - 渲染后的HTML / function render templateStr, data { return templateStr.replace /\\{\\{ \\w+ \\}\\}/g, function match, key { // 处理数据不存在的情况 return data key !== undefined ? data key : ''; } ; } // 渲染模板 document.getElementById 'app' .innerHTML = render templateStr, tempData ; </script> </body> </html> 进阶版本：支持循环和条件 javascript / 进阶模板引擎 支持：变量替换、条件判断、循环遍历 / function advancedRender template, data { // 1. 处理条件判断 {{if condition}}...{{/if}} template = template.replace /\\{\\{if\\s+ \\w+ \\}\\} . ? \\{\\{\\/if\\}\\}/g, function match, condition, content { return data condition ? content : ''; } ; // 2. 处理循环 {{for item in list}}...{{/for}} template = template.replace /\\{\\{for\\s+ \\w+ \\s+in\\s+ \\w+ \\}\\} . ? \\{\\{\\/for\\}\\}/g, function match, itemName, listName, content { var list = data listName || ; return list.map function item { return content.replace /\\{\\{\\s \\w+ \\s \\}\\}/g, function m, key { return item key !== undefined ? item key : ''; } ; } .join '' ; } ; // 3. 处理变量替换 {{variable}} template = template.replace /\\{\\{ \\w+ \\}\\}/g, function match, key { return data key !== undefined ? data key : ''; } ; return template; } // 使用示例 var data = { title: '用户列表', users: { name: '张三', age: 28, active: true }, { name: '李四', age: 32, active: false }, { name: '王五', age: 24, active: true } , showTitle: true }; var template = <div> {{if showTitle}} <h1>{{title}}</h1> {{/if}} <ul> {{for user in users}} <li>{{user.name}} - {{user.age}}岁</li> {{/for}} </ul> </div> ; console.log advancedRender template, data ; 完整版本：带缓存和安全过滤 javascript / 完整模板引擎实现 特性：编译缓存、XSS过滤、错误处理 / var TemplateEngine = function { // 编译缓存 var cache = {}; / XSS安全过滤 @param {string} str - 需要过滤的字符串 @returns {string} - 过滤后的字符串 / function escapeHtml str { if typeof str !== 'string' return str; return str .replace /&/g, '&amp;' .replace /</g, '&lt;' .replace />/g, '&gt;' .replace /\"/g, '&quot;' .replace /'/g, '& 039;' ; } / 编译模板 @param {string} template - 模板字符串 @returns {Function} - 编译后的渲染函数 / function compile template { // 检查缓存 if cache template { return cache template ; } // 模板转译为JavaScript代码 var code = var result = ; result.push \"${template .replace /\"/g, '\\\\\"' .replace /\\{\\{= \\w+ \\}\\}/g, '\",escapeHtml data \"$1\" ,\"' // 安全输出 .replace /\\{\\{ \\w+ \\}\\}/g, '\",data \"$1\" ,\"' // 普通输出 .replace /\\{\\{if\\s+ \\w+ \\}\\}/g, '\" ;if data \"$1\" {result.push \"' .replace /\\{\\{\\/if\\}\\}/g, '\" ;}result.push \"' .replace /\\{\\{for\\s+ \\w+ \\s+in\\s+ \\w+ \\}\\}/g, '\" ;for var i=0;i<data \"$2\" .length;i++ {var $1=data \"$2\" i ;result.push \"' .replace /\\{\\{\\/for\\}\\}/g, '\" ;}result.push \"' }\" ; return result.join \"\" ; ; // 创建渲染函数 var render = new Function 'data', 'escapeHtml', code ; // 缓存编译结果 cache template = render; return render; } / 渲染模板 @param {string} template - 模板字符串 @param {object} data - 数据对象 @returns {string} - 渲染后的HTML / function render template, data { try { var compiled = compile template ; return compiled data, escapeHtml ; } catch error { console.error '模板渲染错误:', error ; return '模板渲染失败'; } } / 清除缓存 / function clearCache { cache = {}; } return { render: render, compile: compile, clearCache: clearCache }; } ; // 使用示例 var template = <div class=\"user-card\"> <h2>{{=name}}</h2> <p>年龄：{{age}}</p> {{if active}} <span class=\"status active\">在线</span> {{/if}} <ul> {{for item in hobbies}} <li>{{=item}}</li> {{/for}} </ul> </div> ; var data = { name: '<script>alert \"XSS攻击\" </script>', // 恶意代码 age: 28, active: true, hobbies: '编程', '阅读', '运动' }; // 渲染结果会自动过滤XSS console.log TemplateEngine.render template, data ; 模板引擎语法参考 | 语法 | 说明 | 示例 | |------|------|------| | {{variable}} | 普通变量输出 | {{name}} | | {{=variable}} | 安全输出（XSS过滤） | {{=content}} | | {{if condition}}...{{/if}} | 条件判断 | {{if active}}在线{{/if}} | | {{for item in list}}...{{/for}} | 循环遍历 | {{for user in users}}{{user.name}}{{/for}} | 性能优化策略 1. 编译缓存 javascript // 使用WeakMap缓存编译结果 var compileCache = new WeakMap ; function compileWithCache template { if compileCache.has template { return compileCache.get template ; } var compiled = compile template ; compileCache.set template, compiled ; return compiled; } 2. 批量渲染 javascript // 批量渲染多个模板 function renderBatch templates, data { return templates.map function tpl { return TemplateEngine.render tpl, data ; } ; } 3. 虚拟DOM集成 javascript // 与虚拟DOM结合 function renderToVDOM template, data { var html = TemplateEngine.render template, data ; return createElement 'div', { innerHTML: html } .firstChild; } 实际应用示例 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>模板引擎实战</title> <style> .user-list { list-style: none; padding: 0; } .user-item { padding: 10px; border-bottom: 1px solid eee; } .active { color: green; } .inactive { color: gray; } </style> </head> <body> <div id=\"app\"></div> <script> // 模板字符串 var template = <h1>{{title}}</h1> <p>{{description}}</p> <ul class=\"user-list\"> {{for user in users}} <li class=\"user-item\"> <strong>{{=user.name}}</strong> <span class=\"{{user.active ? 'active' : 'inactive'}}\"> {{user.active ? '在线' : '离线'}} </span> </li> {{/for}} </ul> {{if users.length === 0}} <p>暂无用户数据</p> {{/if}} ; // 数据 var data = { title: '用户管理系统', description: '展示系统中的所有用户', users: { name: '张三', active: true }, { name: '李四', active: false }, { name: '王五', active: true } }; // 渲染 document.getElementById 'app' .innerHTML = TemplateEngine.render template, data ; </script> </body> </html> 与主流模板引擎对比 | 特性 | 本实现 | Handlebars | Mustache | EJS | |------|--------|------------|----------|-----| | 变量替换 | ✅ | ✅ | ✅ | ✅ | | 条件判断 | ✅ | ✅ | ❌ | ✅ | | 循环遍历 | ✅ | ✅ | ✅ | ✅ | | XSS过滤 | ✅ | ✅ | ❌ | ❌ | | 编译缓存 | ✅ | ✅ | ✅ | ✅ | | 自定义helper | ❌ | ✅ | ❌ | ✅ | | 体积大小 | 小 | 中 | 小 | 中 | 总结 一个优雅的模板引擎应该具备以下特点： - ✅ 简洁的API ：易于使用和学习 - ✅ 安全可靠 ：自动XSS过滤 - ✅ 高性能 ：编译缓存机制 - ✅ 功能完善 ：支持变量、循环、条件 - ✅ 错误处理 ：友好的错误提示 本实现提供了一个轻量级但功能完善的模板引擎，适合在不需要引入大型库的场景中使用。",
    "fullText": "实现一个最优雅的微型 JavaScript 模板引擎：30 行代码解析核心原理 通过正则表达式与 new Function / eval 构建轻量高效的字符串模板渲染引擎，解析 Mustache/EJS 核心思想。 前端开发 JavaScript 底层原理 模板引擎 前端之最优雅的模板引擎实现 模板引擎实现原理 模板引擎的核心原理是将模板字符串中的占位符替换为实际数据值。一个优雅的模板引擎应该具备以下特性： - 简洁的语法 ：易于书写和理解 - 强大的功能 ：支持变量、循环、条件等 - 安全性 ：防止XSS攻击 - 性能优化 ：编译缓存机制 基础版本：简单变量替换 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>模板引擎基础实现</title> </head> <body> <div id=\"app\"></div> <script> // 模板数据 var tempData = { \"name\": \"张三\", \"age\": 28, \"sex\": \"男\" }; // 模板字符串（修正了原代码中的变量错误） var templateStr = <h1>我是{{name}}，性别：{{sex}}，年龄：{{age}}</h1> ; / 简单模板渲染函数 @param {string} templateStr - 模板字符串 @param {object} data - 数据对象 @returns {string} - 渲染后的HTML / function render templateStr, data { return templateStr.replace /\\{\\{ \\w+ \\}\\}/g, function match, key { // 处理数据不存在的情况 return data key !== undefined ? data key : ''; } ; } // 渲染模板 document.getElementById 'app' .innerHTML = render templateStr, tempData ; </script> </body> </html> 进阶版本：支持循环和条件 javascript / 进阶模板引擎 支持：变量替换、条件判断、循环遍历 / function advancedRender template, data { // 1. 处理条件判断 {{if condition}}...{{/if}} template = template.replace /\\{\\{if\\s+ \\w+ \\}\\} . ? \\{\\{\\/if\\}\\}/g, function match, condition, content { return data condition ? content : ''; } ; // 2. 处理循环 {{for item in list}}...{{/for}} template = template.replace /\\{\\{for\\s+ \\w+ \\s+in\\s+ \\w+ \\}\\} . ? \\{\\{\\/for\\}\\}/g, function match, itemName, listName, content { var list = data listName || ; return list.map function item { return content.replace /\\{\\{\\s \\w+ \\s \\}\\}/g, function m, key { return item key !== undefined ? item key : ''; } ; } .join '' ; } ; // 3. 处理变量替换 {{variable}} template = template.replace /\\{\\{ \\w+ \\}\\}/g, function match, key { return data key !== undefined ? data key : ''; } ; return template; } // 使用示例 var data = { title: '用户列表', users: { name: '张三', age: 28, active: true }, { name: '李四', age: 32, active: false }, { name: '王五', age: 24, active: true } , showTitle: true }; var template = <div> {{if showTitle}} <h1>{{title}}</h1> {{/if}} <ul> {{for user in users}} <li>{{user.name}} - {{user.age}}岁</li> {{/for}} </ul> </div> ; console.log advancedRender template, data ; 完整版本：带缓存和安全过滤 javascript / 完整模板引擎实现 特性：编译缓存、XSS过滤、错误处理 / var TemplateEngine = function { // 编译缓存 var cache = {}; / XSS安全过滤 @param {string} str - 需要过滤的字符串 @returns {string} - 过滤后的字符串 / function escapeHtml str { if typeof str !== 'string' return str; return str .replace /&/g, '&amp;' .replace /</g, '&lt;' .replace />/g, '&gt;' .replace /\"/g, '&quot;' .replace /'/g, '& 039;' ; } / 编译模板 @param {string} template - 模板字符串 @returns {Function} - 编译后的渲染函数 / function compile template { // 检查缓存 if cache template { return cache template ; } // 模板转译为JavaScript代码 var code = var result = ; result.push \"${template .replace /\"/g, '\\\\\"' .replace /\\{\\{= \\w+ \\}\\}/g, '\",escapeHtml data \"$1\" ,\"' // 安全输出 .replace /\\{\\{ \\w+ \\}\\}/g, '\",data \"$1\" ,\"' // 普通输出 .replace /\\{\\{if\\s+ \\w+ \\}\\}/g, '\" ;if data \"$1\" {result.push \"' .replace /\\{\\{\\/if\\}\\}/g, '\" ;}result.push \"' .replace /\\{\\{for\\s+ \\w+ \\s+in\\s+ \\w+ \\}\\}/g, '\" ;for var i=0;i<data \"$2\" .length;i++ {var $1=data \"$2\" i ;result.push \"' .replace /\\{\\{\\/for\\}\\}/g, '\" ;}result.push \"' }\" ; return result.join \"\" ; ; // 创建渲染函数 var render = new Function 'data', 'escapeHtml', code ; // 缓存编译结果 cache template = render; return render; } / 渲染模板 @param {string} template - 模板字符串 @param {object} data - 数据对象 @returns {string} - 渲染后的HTML / function render template, data { try { var compiled = compile template ; return compiled data, escapeHtml ; } catch error { console.error '模板渲染错误:', error ; return '模板渲染失败'; } } / 清除缓存 / function clearCache { cache = {}; } return { render: render, compile: compile, clearCache: clearCache }; } ; // 使用示例 var template = <div class=\"user-card\"> <h2>{{=name}}</h2> <p>年龄：{{age}}</p> {{if active}} <span class=\"status active\">在线</span> {{/if}} <ul> {{for item in hobbies}} <li>{{=item}}</li> {{/for}} </ul> </div> ; var data = { name: '<script>alert \"XSS攻击\" </script>', // 恶意代码 age: 28, active: true, hobbies: '编程', '阅读', '运动' }; // 渲染结果会自动过滤XSS console.log TemplateEngine.render template, data ; 模板引擎语法参考 | 语法 | 说明 | 示例 | |------|------|------| | {{variable}} | 普通变量输出 | {{name}} | | {{=variable}} | 安全输出（XSS过滤） | {{=content}} | | {{if condition}}...{{/if}} | 条件判断 | {{if active}}在线{{/if}} | | {{for item in list}}...{{/for}} | 循环遍历 | {{for user in users}}{{user.name}}{{/for}} | 性能优化策略 1. 编译缓存 javascript // 使用WeakMap缓存编译结果 var compileCache = new WeakMap ; function compileWithCache template { if compileCache.has template { return compileCache.get template ; } var compiled = compile template ; compileCache.set template, compiled ; return compiled; } 2. 批量渲染 javascript // 批量渲染多个模板 function renderBatch templates, data { return templates.map function tpl { return TemplateEngine.render tpl, data ; } ; } 3. 虚拟DOM集成 javascript // 与虚拟DOM结合 function renderToVDOM template, data { var html = TemplateEngine.render template, data ; return createElement 'div', { innerHTML: html } .firstChild; } 实际应用示例 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>模板引擎实战</title> <style> .user-list { list-style: none; padding: 0; } .user-item { padding: 10px; border-bottom: 1px solid eee; } .active { color: green; } .inactive { color: gray; } </style> </head> <body> <div id=\"app\"></div> <script> // 模板字符串 var template = <h1>{{title}}</h1> <p>{{description}}</p> <ul class=\"user-list\"> {{for user in users}} <li class=\"user-item\"> <strong>{{=user.name}}</strong> <span class=\"{{user.active ? 'active' : 'inactive'}}\"> {{user.active ? '在线' : '离线'}} </span> </li> {{/for}} </ul> {{if users.length === 0}} <p>暂无用户数据</p> {{/if}} ; // 数据 var data = { title: '用户管理系统', description: '展示系统中的所有用户', users: { name: '张三', active: true }, { name: '李四', active: false }, { name: '王五', active: true } }; // 渲染 document.getElementById 'app' .innerHTML = TemplateEngine.render template, data ; </script> </body> </html> 与主流模板引擎对比 | 特性 | 本实现 | Handlebars | Mustache | EJS | |------|--------|------------|----------|-----| | 变量替换 | ✅ | ✅ | ✅ | ✅ | | 条件判断 | ✅ | ✅ | ❌ | ✅ | | 循环遍历 | ✅ | ✅ | ✅ | ✅ | | XSS过滤 | ✅ | ✅ | ❌ | ❌ | | 编译缓存 | ✅ | ✅ | ✅ | ✅ | | 自定义helper | ❌ | ✅ | ❌ | ✅ | | 体积大小 | 小 | 中 | 小 | 中 | 总结 一个优雅的模板引擎应该具备以下特点： - ✅ 简洁的API ：易于使用和学习 - ✅ 安全可靠 ：自动XSS过滤 - ✅ 高性能 ：编译缓存机制 - ✅ 功能完善 ：支持变量、循环、条件 - ✅ 错误处理 ：友好的错误提示 本实现提供了一个轻量级但功能完善的模板引擎，适合在不需要引入大型库的场景中使用。",
    "sections": [
      {
        "title": "模板引擎实现原理",
        "anchor": "#模板引擎实现原理",
        "id": "模板引擎实现原理"
      },
      {
        "title": "基础版本：简单变量替换",
        "anchor": "#基础版本-简单变量替换",
        "id": "基础版本-简单变量替换"
      },
      {
        "title": "进阶版本：支持循环和条件",
        "anchor": "#进阶版本-支持循环和条件",
        "id": "进阶版本-支持循环和条件"
      },
      {
        "title": "完整版本：带缓存和安全过滤",
        "anchor": "#完整版本-带缓存和安全过滤",
        "id": "完整版本-带缓存和安全过滤"
      },
      {
        "title": "模板引擎语法参考",
        "anchor": "#模板引擎语法参考",
        "id": "模板引擎语法参考"
      },
      {
        "title": "性能优化策略",
        "anchor": "#性能优化策略",
        "id": "性能优化策略"
      },
      {
        "title": "1. 编译缓存",
        "anchor": "#1-编译缓存",
        "id": "1-编译缓存"
      },
      {
        "title": "2. 批量渲染",
        "anchor": "#2-批量渲染",
        "id": "2-批量渲染"
      },
      {
        "title": "3. 虚拟DOM集成",
        "anchor": "#3-虚拟dom集成",
        "id": "3-虚拟dom集成"
      },
      {
        "title": "实际应用示例",
        "anchor": "#实际应用示例",
        "id": "实际应用示例"
      },
      {
        "title": "与主流模板引擎对比",
        "anchor": "#与主流模板引擎对比",
        "id": "与主流模板引擎对比"
      },
      {
        "title": "总结",
        "anchor": "#总结",
        "id": "总结"
      }
    ]
  },
  {
    "id": "input-china-mobile-number-validation",
    "title": "前端输入框严格限制只能输入中国手机号码的最佳实践",
    "url": "posts/input-china-mobile-number-validation.html",
    "category": "前端开发",
    "date": "2026-04-15",
    "tags": [
      "前端开发",
      "JavaScript",
      "正则表达式",
      "表单校验"
    ],
    "summary": "结合 input 事件过滤、粘贴拦截与最新 11 位号段正则，打造极致体验的手机号输入框校验。",
    "content": "前端限制用户只能输入手机号码（中国手机号码） 中国手机号码规则 | 规则 | 说明 | |------|------| | 长度 | 11位数字 | | 开头 | 必须以 1 开头 | | 第二位 | 3-9 （不能是0或1） | | 常见号段 | 13x、14x、15x、16x、17x、18x、19x | 纯 JavaScript 实现 方法1：输入实时过滤 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>手机号码输入限制</title> <style> .input-box { width: 300px; padding: 12px; font-size: 16px; border: 1px solid ddd; border-radius: 4px; } </style> </head> <body> <input type=\"tel\" id=\"phone-input\" placeholder=\"请输入手机号码\" class=\"input-box\" maxlength=\"11\" > <script> const phoneInput = document.getElementById 'phone-input' ; phoneInput.addEventListener 'input', function e { let value = this.value; // 1. 只保留数字 value = value.replace / ^\\d /g, '' ; // 2. 确保以1开头 if value.length > 0 && value 0 !== '1' { value = value.replace /^ ^1 /, '' ; } // 3. 第二位必须是3-9 if value.length >= 2 { const secondDigit = value 1 ; if !/ 3-9 /.test secondDigit { value = value 0 + value.substring 2 ; } } // 4. 限制长度为11位 if value.length > 11 { value = value.substring 0, 11 ; } this.value = value; } ; </script> </body> </html> 方法2：正则表达式验证 javascript / 验证中国手机号码 @param {string} phone - 手机号码 @returns {boolean} - 是否为有效手机号码 / function validatePhone phone { // 移除所有空格和横线 phone = phone.replace / \\s- /g, '' ; // 正则表达式：1开头，第二位3-9，后面9位数字 const phoneRegex = /^1 3-9 \\d{9}$/; return phoneRegex.test phone ; } // 验证示例 console.log validatePhone '13812345678' ; // true console.log validatePhone '138 1234 5678' ; // true console.log validatePhone '138-1234-5678' ; // true console.log validatePhone '12812345678' ; // false 第二位不是3-9 console.log validatePhone '1381234567' ; // false 不足11位 console.log validatePhone '138123456789' ; // false 超过11位 Vue 版本 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>Vue 手机号码输入限制</title> <script src=\"https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js\"></script> <style> .input-box { width: 300px; padding: 12px; font-size: 16px; border: 1px solid ddd; border-radius: 4px; outline: none; } .input-box:focus { border-color: 409eff; } .valid { border-color: 67c23a; } .invalid { border-color: f56c6c; } </style> </head> <body> <div id=\"app\"> <input v-model=\"phone\" placeholder=\"请输入手机号码\" class=\"input-box\" :class=\"{ valid: isValid, invalid: phone && !isValid }\" @input=\"handleInput\" > <div v-if=\"phone\" class=\"validation-message\"> <span v-if=\"isValid\" style=\"color: 67c23a;\">✓ 格式正确</span> <span v-else style=\"color: f56c6c;\">✗ 请输入有效的手机号码</span> </div> </div> <script> new Vue { el: ' app', data: { phone: '' }, computed: { isValid { const phoneRegex = /^1 3-9 \\d{9}$/; return phoneRegex.test this.phone ; } }, methods: { handleInput { let value = this.phone; // 只保留数字 value = value.replace / ^\\d /g, '' ; // 确保以1开头 if value && value 0 !== '1' { value = value.replace /^ ^1 /, '' ; } // 第二位必须是3-9 if value.length >= 2 && !/ 3-9 /.test value 1 { value = value 0 + value.substring 2 ; } // 限制长度 this.phone = value.substring 0, 11 ; } } } ; </script> </body> </html> React 版本 jsx import { useState, useEffect } from 'react'; function PhoneInput { const phone, setPhone = useState '' ; const isValid = /^1 3-9 \\d{9}$/.test phone ; const handleInput = e => { let value = e.target.value; // 只保留数字 value = value.replace / ^\\d /g, '' ; // 确保以1开头 if value && value 0 !== '1' { value = value.replace /^ ^1 /, '' ; } // 第二位必须是3-9 if value.length >= 2 && !/ 3-9 /.test value 1 { value = value 0 + value.substring 2 ; } // 限制长度 setPhone value.substring 0, 11 ; }; return <div> <input type=\"tel\" value={phone} onChange={handleInput} placeholder=\"请输入手机号码\" style={{ width: '300px', padding: '12px', fontSize: '16px', border: 1px solid ${isValid ? ' 67c23a' : phone ? ' f56c6c' : ' ddd'} , borderRadius: '4px', outline: 'none' }} /> {phone && <div style={{ marginTop: '8px', color: isValid ? ' 67c23a' : ' f56c6c' }}> {isValid ? '✓ 格式正确' : '✗ 请输入有效的手机号码'} </div> } </div> ; } export default PhoneInput; 常用工具函数 1. 手机号码格式化 javascript / 格式化手机号码（添加空格分隔） @param {string} phone - 手机号码 @returns {string} - 格式化后的号码 / function formatPhone phone { phone = phone.replace / ^\\d /g, '' ; if phone.length <= 3 return phone; if phone.length <= 7 return phone.substring 0, 3 + ' ' + phone.substring 3 ; return phone.substring 0, 3 + ' ' + phone.substring 3, 7 + ' ' + phone.substring 7 ; } console.log formatPhone '13812345678' ; // \"138 1234 5678\" 2. 手机号码脱敏 javascript / 手机号码脱敏（中间4位用 代替） @param {string} phone - 手机号码 @returns {string} - 脱敏后的号码 / function maskPhone phone { phone = phone.replace / ^\\d /g, '' ; if phone.length >= 11 { return phone.substring 0, 3 + ' ' + phone.substring 7 ; } return phone; } console.log maskPhone '13812345678' ; // \"138 5678\" 3. 完整验证工具 javascript / 手机号码验证工具 / const PhoneValidator = { // 验证手机号码 validate phone { const cleanPhone = phone.replace / \\s- /g, '' ; return /^1 3-9 \\d{9}$/.test cleanPhone ; }, // 获取号码类型 getType phone { const cleanPhone = phone.replace / \\s- /g, '' ; if !this.validate cleanPhone return '无效号码'; const prefix = cleanPhone.substring 0, 3 ; const types = { '130': '联通', '131': '联通', '132': '联通', '145': '联通', '146': '联通', '155': '联通', '156': '联通', '166': '联通', '175': '联通', '176': '联通', '185': '联通', '186': '联通', '133': '电信', '149': '电信', '153': '电信', '173': '电信', '177': '电信', '180': '电信', '181': '电信', '189': '电信', '199': '电信', '134': '移动', '135': '移动', '136': '移动', '137': '移动', '138': '移动', '139': '移动', '147': '移动', '150': '移动', '151': '移动', '152': '移动', '157': '移动', '158': '移动', '159': '移动', '178': '移动', '182': '移动', '183': '移动', '184': '移动', '187': '移动', '188': '移动', '198': '移动' }; return types prefix || '未知运营商'; }, // 格式化号码 format phone { const cleanPhone = phone.replace / ^\\d /g, '' ; if cleanPhone.length <= 3 return cleanPhone; if cleanPhone.length <= 7 return cleanPhone.substring 0, 3 + ' ' + cleanPhone.substring 3 ; return cleanPhone.substring 0, 3 + ' ' + cleanPhone.substring 3, 7 + ' ' + cleanPhone.substring 7 ; }, // 脱敏号码 mask phone { const cleanPhone = phone.replace / ^\\d /g, '' ; if cleanPhone.length >= 11 { return cleanPhone.substring 0, 3 + ' ' + cleanPhone.substring 7 ; } return cleanPhone; } }; // 使用示例 console.log PhoneValidator.validate '13812345678' ; // true console.log PhoneValidator.getType '13812345678' ; // \"移动\" console.log PhoneValidator.format '13812345678' ; // \"138 1234 5678\" console.log PhoneValidator.mask '13812345678' ; // \"138 5678\" 常见问题 Q1: 为什么要限制第二位必须是3-9？ A: 根据中国工信部的规定，手机号码的第二位代表号段类型： - 13x ：传统号段 - 14x ：物联网/数据卡 - 15x ：传统号段 - 16x ：新号段 - 17x ：数据卡/虚拟运营商 - 18x ：3G/4G号段 - 19x ：5G号段 10 和 11 开头的号码不是普通手机号码。 Q2: 是否需要考虑国际区号？ A: 如果需要支持国际号码，可以修改正则表达式： javascript // 支持带+86或86前缀的号码 const phoneRegex = /^ ?:\\+?86 ?1 3-9 \\d{9}$/; Q3: 为什么不直接使用 input 的 type=\"tel\"？ A: type=\"tel\" 主要是在移动端唤起数字键盘，本身不包含验证逻辑，仍需要 JavaScript 进行验证。 Q4: 如何防止用户粘贴无效内容？ A: 添加粘贴事件处理： javascript phoneInput.addEventListener 'paste', function e { e.preventDefault ; const text = e.clipboardData || window.clipboardData .getData 'text' ; const cleanText = text.replace / ^\\d /g, '' ; document.execCommand 'insertText', false, cleanText.substring 0, 11 ; } ; 总结 手机号码验证需要注意以下几点： - ✅ 实时过滤 ：只允许输入数字 - ✅ 格式验证 ：确保符合中国手机号规则 - ✅ 用户反馈 ：及时显示验证结果 - ✅ 格式化显示 ：提高可读性 - ✅ 脱敏处理 ：保护用户隐私 合理的手机号码验证可以提升用户体验，减少错误输入！",
    "fullText": "前端输入框严格限制只能输入中国手机号码的最佳实践 结合 input 事件过滤、粘贴拦截与最新 11 位号段正则，打造极致体验的手机号输入框校验。 前端开发 JavaScript 正则表达式 表单校验 前端限制用户只能输入手机号码（中国手机号码） 中国手机号码规则 | 规则 | 说明 | |------|------| | 长度 | 11位数字 | | 开头 | 必须以 1 开头 | | 第二位 | 3-9 （不能是0或1） | | 常见号段 | 13x、14x、15x、16x、17x、18x、19x | 纯 JavaScript 实现 方法1：输入实时过滤 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>手机号码输入限制</title> <style> .input-box { width: 300px; padding: 12px; font-size: 16px; border: 1px solid ddd; border-radius: 4px; } </style> </head> <body> <input type=\"tel\" id=\"phone-input\" placeholder=\"请输入手机号码\" class=\"input-box\" maxlength=\"11\" > <script> const phoneInput = document.getElementById 'phone-input' ; phoneInput.addEventListener 'input', function e { let value = this.value; // 1. 只保留数字 value = value.replace / ^\\d /g, '' ; // 2. 确保以1开头 if value.length > 0 && value 0 !== '1' { value = value.replace /^ ^1 /, '' ; } // 3. 第二位必须是3-9 if value.length >= 2 { const secondDigit = value 1 ; if !/ 3-9 /.test secondDigit { value = value 0 + value.substring 2 ; } } // 4. 限制长度为11位 if value.length > 11 { value = value.substring 0, 11 ; } this.value = value; } ; </script> </body> </html> 方法2：正则表达式验证 javascript / 验证中国手机号码 @param {string} phone - 手机号码 @returns {boolean} - 是否为有效手机号码 / function validatePhone phone { // 移除所有空格和横线 phone = phone.replace / \\s- /g, '' ; // 正则表达式：1开头，第二位3-9，后面9位数字 const phoneRegex = /^1 3-9 \\d{9}$/; return phoneRegex.test phone ; } // 验证示例 console.log validatePhone '13812345678' ; // true console.log validatePhone '138 1234 5678' ; // true console.log validatePhone '138-1234-5678' ; // true console.log validatePhone '12812345678' ; // false 第二位不是3-9 console.log validatePhone '1381234567' ; // false 不足11位 console.log validatePhone '138123456789' ; // false 超过11位 Vue 版本 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>Vue 手机号码输入限制</title> <script src=\"https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js\"></script> <style> .input-box { width: 300px; padding: 12px; font-size: 16px; border: 1px solid ddd; border-radius: 4px; outline: none; } .input-box:focus { border-color: 409eff; } .valid { border-color: 67c23a; } .invalid { border-color: f56c6c; } </style> </head> <body> <div id=\"app\"> <input v-model=\"phone\" placeholder=\"请输入手机号码\" class=\"input-box\" :class=\"{ valid: isValid, invalid: phone && !isValid }\" @input=\"handleInput\" > <div v-if=\"phone\" class=\"validation-message\"> <span v-if=\"isValid\" style=\"color: 67c23a;\">✓ 格式正确</span> <span v-else style=\"color: f56c6c;\">✗ 请输入有效的手机号码</span> </div> </div> <script> new Vue { el: ' app', data: { phone: '' }, computed: { isValid { const phoneRegex = /^1 3-9 \\d{9}$/; return phoneRegex.test this.phone ; } }, methods: { handleInput { let value = this.phone; // 只保留数字 value = value.replace / ^\\d /g, '' ; // 确保以1开头 if value && value 0 !== '1' { value = value.replace /^ ^1 /, '' ; } // 第二位必须是3-9 if value.length >= 2 && !/ 3-9 /.test value 1 { value = value 0 + value.substring 2 ; } // 限制长度 this.phone = value.substring 0, 11 ; } } } ; </script> </body> </html> React 版本 jsx import { useState, useEffect } from 'react'; function PhoneInput { const phone, setPhone = useState '' ; const isValid = /^1 3-9 \\d{9}$/.test phone ; const handleInput = e => { let value = e.target.value; // 只保留数字 value = value.replace / ^\\d /g, '' ; // 确保以1开头 if value && value 0 !== '1' { value = value.replace /^ ^1 /, '' ; } // 第二位必须是3-9 if value.length >= 2 && !/ 3-9 /.test value 1 { value = value 0 + value.substring 2 ; } // 限制长度 setPhone value.substring 0, 11 ; }; return <div> <input type=\"tel\" value={phone} onChange={handleInput} placeholder=\"请输入手机号码\" style={{ width: '300px', padding: '12px', fontSize: '16px', border: 1px solid ${isValid ? ' 67c23a' : phone ? ' f56c6c' : ' ddd'} , borderRadius: '4px', outline: 'none' }} /> {phone && <div style={{ marginTop: '8px', color: isValid ? ' 67c23a' : ' f56c6c' }}> {isValid ? '✓ 格式正确' : '✗ 请输入有效的手机号码'} </div> } </div> ; } export default PhoneInput; 常用工具函数 1. 手机号码格式化 javascript / 格式化手机号码（添加空格分隔） @param {string} phone - 手机号码 @returns {string} - 格式化后的号码 / function formatPhone phone { phone = phone.replace / ^\\d /g, '' ; if phone.length <= 3 return phone; if phone.length <= 7 return phone.substring 0, 3 + ' ' + phone.substring 3 ; return phone.substring 0, 3 + ' ' + phone.substring 3, 7 + ' ' + phone.substring 7 ; } console.log formatPhone '13812345678' ; // \"138 1234 5678\" 2. 手机号码脱敏 javascript / 手机号码脱敏（中间4位用 代替） @param {string} phone - 手机号码 @returns {string} - 脱敏后的号码 / function maskPhone phone { phone = phone.replace / ^\\d /g, '' ; if phone.length >= 11 { return phone.substring 0, 3 + ' ' + phone.substring 7 ; } return phone; } console.log maskPhone '13812345678' ; // \"138 5678\" 3. 完整验证工具 javascript / 手机号码验证工具 / const PhoneValidator = { // 验证手机号码 validate phone { const cleanPhone = phone.replace / \\s- /g, '' ; return /^1 3-9 \\d{9}$/.test cleanPhone ; }, // 获取号码类型 getType phone { const cleanPhone = phone.replace / \\s- /g, '' ; if !this.validate cleanPhone return '无效号码'; const prefix = cleanPhone.substring 0, 3 ; const types = { '130': '联通', '131': '联通', '132': '联通', '145': '联通', '146': '联通', '155': '联通', '156': '联通', '166': '联通', '175': '联通', '176': '联通', '185': '联通', '186': '联通', '133': '电信', '149': '电信', '153': '电信', '173': '电信', '177': '电信', '180': '电信', '181': '电信', '189': '电信', '199': '电信', '134': '移动', '135': '移动', '136': '移动', '137': '移动', '138': '移动', '139': '移动', '147': '移动', '150': '移动', '151': '移动', '152': '移动', '157': '移动', '158': '移动', '159': '移动', '178': '移动', '182': '移动', '183': '移动', '184': '移动', '187': '移动', '188': '移动', '198': '移动' }; return types prefix || '未知运营商'; }, // 格式化号码 format phone { const cleanPhone = phone.replace / ^\\d /g, '' ; if cleanPhone.length <= 3 return cleanPhone; if cleanPhone.length <= 7 return cleanPhone.substring 0, 3 + ' ' + cleanPhone.substring 3 ; return cleanPhone.substring 0, 3 + ' ' + cleanPhone.substring 3, 7 + ' ' + cleanPhone.substring 7 ; }, // 脱敏号码 mask phone { const cleanPhone = phone.replace / ^\\d /g, '' ; if cleanPhone.length >= 11 { return cleanPhone.substring 0, 3 + ' ' + cleanPhone.substring 7 ; } return cleanPhone; } }; // 使用示例 console.log PhoneValidator.validate '13812345678' ; // true console.log PhoneValidator.getType '13812345678' ; // \"移动\" console.log PhoneValidator.format '13812345678' ; // \"138 1234 5678\" console.log PhoneValidator.mask '13812345678' ; // \"138 5678\" 常见问题 Q1: 为什么要限制第二位必须是3-9？ A: 根据中国工信部的规定，手机号码的第二位代表号段类型： - 13x ：传统号段 - 14x ：物联网/数据卡 - 15x ：传统号段 - 16x ：新号段 - 17x ：数据卡/虚拟运营商 - 18x ：3G/4G号段 - 19x ：5G号段 10 和 11 开头的号码不是普通手机号码。 Q2: 是否需要考虑国际区号？ A: 如果需要支持国际号码，可以修改正则表达式： javascript // 支持带+86或86前缀的号码 const phoneRegex = /^ ?:\\+?86 ?1 3-9 \\d{9}$/; Q3: 为什么不直接使用 input 的 type=\"tel\"？ A: type=\"tel\" 主要是在移动端唤起数字键盘，本身不包含验证逻辑，仍需要 JavaScript 进行验证。 Q4: 如何防止用户粘贴无效内容？ A: 添加粘贴事件处理： javascript phoneInput.addEventListener 'paste', function e { e.preventDefault ; const text = e.clipboardData || window.clipboardData .getData 'text' ; const cleanText = text.replace / ^\\d /g, '' ; document.execCommand 'insertText', false, cleanText.substring 0, 11 ; } ; 总结 手机号码验证需要注意以下几点： - ✅ 实时过滤 ：只允许输入数字 - ✅ 格式验证 ：确保符合中国手机号规则 - ✅ 用户反馈 ：及时显示验证结果 - ✅ 格式化显示 ：提高可读性 - ✅ 脱敏处理 ：保护用户隐私 合理的手机号码验证可以提升用户体验，减少错误输入！",
    "sections": [
      {
        "title": "中国手机号码规则",
        "anchor": "#中国手机号码规则",
        "id": "中国手机号码规则"
      },
      {
        "title": "纯 JavaScript 实现",
        "anchor": "#纯-javascript-实现",
        "id": "纯-javascript-实现"
      },
      {
        "title": "方法1：输入实时过滤",
        "anchor": "#方法1-输入实时过滤",
        "id": "方法1-输入实时过滤"
      },
      {
        "title": "方法2：正则表达式验证",
        "anchor": "#方法2-正则表达式验证",
        "id": "方法2-正则表达式验证"
      },
      {
        "title": "Vue 版本",
        "anchor": "#vue-版本",
        "id": "vue-版本"
      },
      {
        "title": "React 版本",
        "anchor": "#react-版本",
        "id": "react-版本"
      },
      {
        "title": "常用工具函数",
        "anchor": "#常用工具函数",
        "id": "常用工具函数"
      },
      {
        "title": "1. 手机号码格式化",
        "anchor": "#1-手机号码格式化",
        "id": "1-手机号码格式化"
      },
      {
        "title": "2. 手机号码脱敏",
        "anchor": "#2-手机号码脱敏",
        "id": "2-手机号码脱敏"
      },
      {
        "title": "3. 完整验证工具",
        "anchor": "#3-完整验证工具",
        "id": "3-完整验证工具"
      },
      {
        "title": "常见问题",
        "anchor": "#常见问题",
        "id": "常见问题"
      },
      {
        "title": "Q1: 为什么要限制第二位必须是3-9？",
        "anchor": "#q1-为什么要限制第二位必须是3-9",
        "id": "q1-为什么要限制第二位必须是3-9"
      },
      {
        "title": "Q2: 是否需要考虑国际区号？",
        "anchor": "#q2-是否需要考虑国际区号",
        "id": "q2-是否需要考虑国际区号"
      },
      {
        "title": "Q3: 为什么不直接使用 input 的 type=\"tel\"？",
        "anchor": "#q3-为什么不直接使用-input-的-type-tel",
        "id": "q3-为什么不直接使用-input-的-type-tel"
      },
      {
        "title": "Q4: 如何防止用户粘贴无效内容？",
        "anchor": "#q4-如何防止用户粘贴无效内容",
        "id": "q4-如何防止用户粘贴无效内容"
      },
      {
        "title": "总结",
        "anchor": "#总结",
        "id": "总结"
      }
    ]
  },
  {
    "id": "textarea-auto-height-contenteditable",
    "title": "使用 contenteditable 与 div 完美模拟 Textarea 高度自适应效果",
    "url": "posts/textarea-auto-height-contenteditable.html",
    "category": "前端开发",
    "date": "2026-04-08",
    "tags": [
      "前端开发",
      "CSS",
      "DOM操作",
      "富文本"
    ],
    "summary": "解决传统 textarea 滚动条闪烁与高度伸缩卡顿问题，通过 contenteditable 与 CSS 构建丝滑自适应输入框。",
    "content": "模拟 textarea 效果高度自适应 核心原理 使用 contenteditable 属性将普通元素设置为可编辑状态，配合 CSS 实现高度自适应效果。 contenteditable 属性说明 html <!-- contenteditable 属性指定元素内容是否可编辑 --> <div contenteditable=\"true\">可编辑的 div</div> <div contenteditable=\"false\">不可编辑的 div</div> <div>继承父元素的编辑状态</div> 注意 ：当元素中没有设置 contenteditable 属性时，元素将从父元素继承编辑状态。 完整实现示例 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>模拟 textarea 高度自适应</title> <style> { margin: 0; padding: 0; box-sizing: border-box; } body { padding: 50px; font-family: Arial, sans-serif; } / 模拟 textarea 的容器样式 / .simulation-textarea { width: 500px; min-height: 20px; max-height: 300px; margin: 20px auto; padding: 10px; border: 1px solid a0b3d6; border-radius: 5px; font-size: 12px; line-height: 24px; outline: none; word-wrap: break-word; overflow-x: hidden; overflow-y: auto; border-color: rgba 82, 168, 236, 0.8 ; transition: border-color 0.3s; } / 聚焦时的边框效果 / .simulation-textarea:focus { border-color: 66afe9; box-shadow: 0 0 8px rgba 102, 175, 233, 0.6 ; } / 空状态提示 / .simulation-textarea:empty:before { content: attr data-placeholder ; color: 999; } / 自定义滚动条样式 / .simulation-textarea::-webkit-scrollbar { width: 5px; height: 5px; } .simulation-textarea::-webkit-scrollbar-track { background: rgb 239, 239, 239 ; border-radius: 2px; } .simulation-textarea::-webkit-scrollbar-thumb { border-radius: 5px; background: bfbfbf; } .simulation-textarea::-webkit-scrollbar-thumb:hover { background: 999; } / Firefox 滚动条样式 / .simulation-textarea { scrollbar-width: thin; scrollbar-color: bfbfbf rgb 239, 239, 239 ; } </style> </head> <body> <h2>模拟 textarea 高度自适应</h2> <!-- 基础版本 --> <div class=\"simulation-textarea\" contenteditable=\"true\" data-placeholder=\"请输入内容...\"></div> <!-- 带焦点事件监听的版本 --> <div class=\"simulation-textarea\" contenteditable=\"true\" data-placeholder=\"请输入内容（带焦点事件）...\" tabindex=\"0\" onfocus=\"handleFocus \" onblur=\"handleBlur \"> </div> <script> // 焦点获取事件 function handleFocus { console.log '元素获得焦点' ; // 可以在这里添加聚焦时的逻辑 } // 焦点失去事件 function handleBlur { console.log '元素失去焦点' ; // 可以在这里添加失焦时的逻辑 } // 获取和设置内容的示例 const editableDiv = document.querySelector '.simulation-textarea' ; // 获取内容 function getContent { return editableDiv.innerHTML; // 获取 HTML 格式内容 // return editableDiv.innerText; // 获取纯文本内容 } // 设置内容 function setContent htmlContent { editableDiv.innerHTML = htmlContent; } // 清空内容 function clearContent { editableDiv.innerHTML = ''; } </script> </body> </html> 高级功能扩展 1. 字符数限制 javascript // 添加字符数限制 const editableDiv = document.querySelector '.simulation-textarea' ; const maxLength = 500; editableDiv.addEventListener 'input', function e { const currentLength = this.innerText.length; if currentLength > maxLength { // 截断超出部分 const text = this.innerText.substring 0, maxLength ; this.innerHTML = text; console.log 已达到最大字符数限制：${maxLength} ; } } ; 2. 内容变化监听 javascript // 监听内容变化 const editableDiv = document.querySelector '.simulation-textarea' ; editableDiv.addEventListener 'input', function e { console.log '内容发生变化：', this.innerText ; // 可以在这里添加自动保存等功能 } ; editableDiv.addEventListener 'paste', function e { // 处理粘贴事件 e.preventDefault ; const text = e.clipboardData || window.clipboardData .getData 'text' ; document.execCommand 'insertText', false, text ; } ; 3. 防止粘贴 HTML 标签 javascript // 只允许粘贴纯文本 editableDiv.addEventListener 'paste', function e { e.preventDefault ; const text = e.clipboardData || window.clipboardData .getData 'text/plain' ; document.execCommand 'insertText', false, text ; } ; 注意事项 1. 安全性考虑 javascript // 防止 XSS 攻击的简单示例 function sanitizeHTML str { const temp = document.createElement 'div' ; temp.textContent = str; return temp.innerHTML; } // 在设置内容时使用 function setContentSafe htmlContent { editableDiv.innerHTML = sanitizeHTML htmlContent ; } 2. 浏览器兼容性 - contenteditable 属性在所有现代浏览器中都支持 - IE9+ 完全支持 - 移动端浏览器支持良好 3. 常见问题 问题1：内容为空时高度塌陷 css / 解决方案：设置最小高度 / .simulation-textarea { min-height: 20px; } 问题2：粘贴内容格式混乱 javascript // 解决方案：只粘贴纯文本 editableDiv.addEventListener 'paste', function e { e.preventDefault ; const text = e.clipboardData || window.clipboardData .getData 'text/plain' ; document.execCommand 'insertText', false, text ; } ; 问题3：无法获取焦点 html <!-- 解决方案：添加 tabindex 属性 --> <div contenteditable=\"true\" tabindex=\"0\"></div> 与原生 textarea 的对比 | 特性 | contenteditable div | 原生 textarea | |------|-------------------|--------------| | 高度自适应 | ✅ 自动适应 | ❌ 需要手动调整 | | 富文本支持 | ✅ 支持 HTML | ❌ 只支持纯文本 | | 自定义样式 | ✅ 完全自定义 | ⚠️ 有限制 | | 表单提交 | ❌ 需要手动处理 | ✅ 自动提交 | | 性能 | ⚠️ 稍差 | ✅ 更好 | | 兼容性 | ✅ 良好 | ✅ 完美 | 实际应用场景 1. 评论输入框 ：需要高度自适应的评论区域 2. 富文本编辑器 ：需要支持 HTML 内容的编辑器 3. 即时通讯 ：聊天输入框 4. 表单备注 ：需要自适应高度的备注输入 总结 使用 contenteditable 属性模拟 textarea 是实现高度自适应的有效方案，具有以下优势： - ✅ 自动适应内容高度 - ✅ 支持富文本内容 - ✅ 完全自定义样式 - ✅ 良好的浏览器兼容性 但需要注意安全性和表单处理等细节问题。",
    "fullText": "使用 contenteditable 与 div 完美模拟 Textarea 高度自适应效果 解决传统 textarea 滚动条闪烁与高度伸缩卡顿问题，通过 contenteditable 与 CSS 构建丝滑自适应输入框。 前端开发 CSS DOM操作 富文本 模拟 textarea 效果高度自适应 核心原理 使用 contenteditable 属性将普通元素设置为可编辑状态，配合 CSS 实现高度自适应效果。 contenteditable 属性说明 html <!-- contenteditable 属性指定元素内容是否可编辑 --> <div contenteditable=\"true\">可编辑的 div</div> <div contenteditable=\"false\">不可编辑的 div</div> <div>继承父元素的编辑状态</div> 注意 ：当元素中没有设置 contenteditable 属性时，元素将从父元素继承编辑状态。 完整实现示例 html <!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> <title>模拟 textarea 高度自适应</title> <style> { margin: 0; padding: 0; box-sizing: border-box; } body { padding: 50px; font-family: Arial, sans-serif; } / 模拟 textarea 的容器样式 / .simulation-textarea { width: 500px; min-height: 20px; max-height: 300px; margin: 20px auto; padding: 10px; border: 1px solid a0b3d6; border-radius: 5px; font-size: 12px; line-height: 24px; outline: none; word-wrap: break-word; overflow-x: hidden; overflow-y: auto; border-color: rgba 82, 168, 236, 0.8 ; transition: border-color 0.3s; } / 聚焦时的边框效果 / .simulation-textarea:focus { border-color: 66afe9; box-shadow: 0 0 8px rgba 102, 175, 233, 0.6 ; } / 空状态提示 / .simulation-textarea:empty:before { content: attr data-placeholder ; color: 999; } / 自定义滚动条样式 / .simulation-textarea::-webkit-scrollbar { width: 5px; height: 5px; } .simulation-textarea::-webkit-scrollbar-track { background: rgb 239, 239, 239 ; border-radius: 2px; } .simulation-textarea::-webkit-scrollbar-thumb { border-radius: 5px; background: bfbfbf; } .simulation-textarea::-webkit-scrollbar-thumb:hover { background: 999; } / Firefox 滚动条样式 / .simulation-textarea { scrollbar-width: thin; scrollbar-color: bfbfbf rgb 239, 239, 239 ; } </style> </head> <body> <h2>模拟 textarea 高度自适应</h2> <!-- 基础版本 --> <div class=\"simulation-textarea\" contenteditable=\"true\" data-placeholder=\"请输入内容...\"></div> <!-- 带焦点事件监听的版本 --> <div class=\"simulation-textarea\" contenteditable=\"true\" data-placeholder=\"请输入内容（带焦点事件）...\" tabindex=\"0\" onfocus=\"handleFocus \" onblur=\"handleBlur \"> </div> <script> // 焦点获取事件 function handleFocus { console.log '元素获得焦点' ; // 可以在这里添加聚焦时的逻辑 } // 焦点失去事件 function handleBlur { console.log '元素失去焦点' ; // 可以在这里添加失焦时的逻辑 } // 获取和设置内容的示例 const editableDiv = document.querySelector '.simulation-textarea' ; // 获取内容 function getContent { return editableDiv.innerHTML; // 获取 HTML 格式内容 // return editableDiv.innerText; // 获取纯文本内容 } // 设置内容 function setContent htmlContent { editableDiv.innerHTML = htmlContent; } // 清空内容 function clearContent { editableDiv.innerHTML = ''; } </script> </body> </html> 高级功能扩展 1. 字符数限制 javascript // 添加字符数限制 const editableDiv = document.querySelector '.simulation-textarea' ; const maxLength = 500; editableDiv.addEventListener 'input', function e { const currentLength = this.innerText.length; if currentLength > maxLength { // 截断超出部分 const text = this.innerText.substring 0, maxLength ; this.innerHTML = text; console.log 已达到最大字符数限制：${maxLength} ; } } ; 2. 内容变化监听 javascript // 监听内容变化 const editableDiv = document.querySelector '.simulation-textarea' ; editableDiv.addEventListener 'input', function e { console.log '内容发生变化：', this.innerText ; // 可以在这里添加自动保存等功能 } ; editableDiv.addEventListener 'paste', function e { // 处理粘贴事件 e.preventDefault ; const text = e.clipboardData || window.clipboardData .getData 'text' ; document.execCommand 'insertText', false, text ; } ; 3. 防止粘贴 HTML 标签 javascript // 只允许粘贴纯文本 editableDiv.addEventListener 'paste', function e { e.preventDefault ; const text = e.clipboardData || window.clipboardData .getData 'text/plain' ; document.execCommand 'insertText', false, text ; } ; 注意事项 1. 安全性考虑 javascript // 防止 XSS 攻击的简单示例 function sanitizeHTML str { const temp = document.createElement 'div' ; temp.textContent = str; return temp.innerHTML; } // 在设置内容时使用 function setContentSafe htmlContent { editableDiv.innerHTML = sanitizeHTML htmlContent ; } 2. 浏览器兼容性 - contenteditable 属性在所有现代浏览器中都支持 - IE9+ 完全支持 - 移动端浏览器支持良好 3. 常见问题 问题1：内容为空时高度塌陷 css / 解决方案：设置最小高度 / .simulation-textarea { min-height: 20px; } 问题2：粘贴内容格式混乱 javascript // 解决方案：只粘贴纯文本 editableDiv.addEventListener 'paste', function e { e.preventDefault ; const text = e.clipboardData || window.clipboardData .getData 'text/plain' ; document.execCommand 'insertText', false, text ; } ; 问题3：无法获取焦点 html <!-- 解决方案：添加 tabindex 属性 --> <div contenteditable=\"true\" tabindex=\"0\"></div> 与原生 textarea 的对比 | 特性 | contenteditable div | 原生 textarea | |------|-------------------|--------------| | 高度自适应 | ✅ 自动适应 | ❌ 需要手动调整 | | 富文本支持 | ✅ 支持 HTML | ❌ 只支持纯文本 | | 自定义样式 | ✅ 完全自定义 | ⚠️ 有限制 | | 表单提交 | ❌ 需要手动处理 | ✅ 自动提交 | | 性能 | ⚠️ 稍差 | ✅ 更好 | | 兼容性 | ✅ 良好 | ✅ 完美 | 实际应用场景 1. 评论输入框 ：需要高度自适应的评论区域 2. 富文本编辑器 ：需要支持 HTML 内容的编辑器 3. 即时通讯 ：聊天输入框 4. 表单备注 ：需要自适应高度的备注输入 总结 使用 contenteditable 属性模拟 textarea 是实现高度自适应的有效方案，具有以下优势： - ✅ 自动适应内容高度 - ✅ 支持富文本内容 - ✅ 完全自定义样式 - ✅ 良好的浏览器兼容性 但需要注意安全性和表单处理等细节问题。",
    "sections": [
      {
        "title": "核心原理",
        "anchor": "#核心原理",
        "id": "核心原理"
      },
      {
        "title": "contenteditable 属性说明",
        "anchor": "#contenteditable-属性说明",
        "id": "contenteditable-属性说明"
      },
      {
        "title": "完整实现示例",
        "anchor": "#完整实现示例",
        "id": "完整实现示例"
      },
      {
        "title": "高级功能扩展",
        "anchor": "#高级功能扩展",
        "id": "高级功能扩展"
      },
      {
        "title": "1. 字符数限制",
        "anchor": "#1-字符数限制",
        "id": "1-字符数限制"
      },
      {
        "title": "2. 内容变化监听",
        "anchor": "#2-内容变化监听",
        "id": "2-内容变化监听"
      },
      {
        "title": "3. 防止粘贴 HTML 标签",
        "anchor": "#3-防止粘贴-html-标签",
        "id": "3-防止粘贴-html-标签"
      },
      {
        "title": "注意事项",
        "anchor": "#注意事项",
        "id": "注意事项"
      },
      {
        "title": "1. 安全性考虑",
        "anchor": "#1-安全性考虑",
        "id": "1-安全性考虑"
      },
      {
        "title": "2. 浏览器兼容性",
        "anchor": "#2-浏览器兼容性",
        "id": "2-浏览器兼容性"
      },
      {
        "title": "3. 常见问题",
        "anchor": "#3-常见问题",
        "id": "3-常见问题"
      },
      {
        "title": "与原生 textarea 的对比",
        "anchor": "#与原生-textarea-的对比",
        "id": "与原生-textarea-的对比"
      },
      {
        "title": "实际应用场景",
        "anchor": "#实际应用场景",
        "id": "实际应用场景"
      },
      {
        "title": "总结",
        "anchor": "#总结",
        "id": "总结"
      }
    ]
  },
  {
    "id": "wechat-miniprogram-async-to-sync-promise",
    "title": "微信小程序将异步 API 封装为 Promise 同步调用（async/await）实战",
    "url": "posts/wechat-miniprogram-async-to-sync-promise.html",
    "category": "前端开发",
    "date": "2026-03-25",
    "tags": [
      "前端开发",
      "微信小程序",
      "JavaScript",
      "Promise"
    ],
    "summary": "利用 Promisify 模式批量将 wx.request、wx.showModal 等回调式 API 转为标准的 async/await 同步写法。",
    "content": "微信小程序将异步 API 改成同步处理方法 在微信小程序开发中，异步 API 是常态，但有时我们需要同步的代码风格来处理业务逻辑。本文介绍几种常用的异步转同步方案。 方案一：Promise 封装 + async/await（推荐） javascript Page { data: { userInfo: null, token: '' }, onLoad { this.initUserInfo ; }, / 统一封装 wx.request 为 Promise @param {Object} options - 请求配置 @returns {Promise} / request options { return new Promise resolve, reject => { wx.request { ...options, success: res => { // 统一处理业务错误 if res.data && res.data.code !== 0 { reject new Error res.data.message || '请求失败' ; } else { resolve res.data ; } }, fail: err => { reject new Error err.errMsg || '网络请求失败' ; } } ; } ; }, / 封装 wx.login 为 Promise @returns {Promise<string>} - 返回 code / login { return new Promise resolve, reject => { wx.login { success: res => { if res.code { resolve res.code ; } else { reject new Error '登录失败' ; } }, fail: err => { reject new Error err.errMsg || '登录失败' ; } } ; } ; }, / 同步风格的用户信息初始化 / async initUserInfo { try { // 1. 获取账号信息 const accountInfo = wx.getAccountInfoSync ; const appId = accountInfo.miniProgram.appId; // 2. 登录获取 code const code = await this.login ; console.log '获取 code 成功:', code ; // 3. 登录请求 const loginResult = await this.request { url: 'https://api.example.com/login', method: 'POST', data: { js_code: code, appid: appId } } ; console.log '登录成功:', loginResult ; // 4. 获取用户信息 const userInfoResult = await this.request { url: 'https://api.example.com/user/info', method: 'POST', data: { openId: loginResult.openId, sessionKey: loginResult.sessionKey } } ; console.log '获取用户信息成功:', userInfoResult ; // 5. 更新页面数据 this.setData { userInfo: userInfoResult, token: loginResult.token } ; } catch error { console.error '初始化用户信息失败:', error.message ; // 可以在这里添加错误处理，如显示错误提示 wx.showToast { title: '登录失败', icon: 'none' } ; } } } ; --- ✨ 进阶方案：统一 API 管理 创建统一的 API 管理文件 javascript // utils/api.js class ApiService { constructor { this.baseUrl = 'https://api.example.com'; this.token = ''; } / 设置 token / setToken token { this.token = token; } / 请求拦截器 / async request options { // 添加公共参数 const headers = { 'Content-Type': 'application/json', ... this.token && { 'Authorization': Bearer ${this.token} } }; return new Promise resolve, reject => { wx.request { url: this.baseUrl + options.url, method: options.method || 'GET', data: options.data || {}, headers, success: res => { if res.statusCode === 200 { if res.data.code === 0 { resolve res.data.data ; } else if res.data.code === 401 { // token 失效，重新登录 reject new Error '登录已过期，请重新登录' ; } else { reject new Error res.data.message || '请求失败' ; } } else { reject new Error HTTP 错误: ${res.statusCode} ; } }, fail: err => { reject new Error err.errMsg || '网络请求失败' ; } } ; } ; } / 登录接口 / async login code, appId { return await this.request { url: '/login', method: 'POST', data: { js_code: code, appid: appId } } ; } / 获取用户信息 / async getUserInfo openId { return await this.request { url: '/user/info', method: 'POST', data: { openId } } ; } / 获取商品列表 / async getGoodsList params { return await this.request { url: '/goods/list', method: 'GET', data: params } ; } } // 导出单例 export default new ApiService ; 在页面中使用 javascript // pages/index/index.js import api from '../../utils/api.js'; Page { data: { goods: }, async onLoad { await this.init ; }, async init { try { // 1. 登录 const code = await this.getLoginCode ; const loginResult = await api.login code, 'your-app-id' ; // 2. 设置 token api.setToken loginResult.token ; // 3. 获取数据 const goods = await api.getGoodsList { page: 1, size: 10 } ; // 4. 更新视图 this.setData { goods } ; } catch error { console.error '初始化失败:', error.message ; wx.showToast { title: '加载失败', icon: 'none' } ; } }, getLoginCode { return new Promise resolve, reject => { wx.login { success: res => resolve res.code , fail: err => reject err } ; } ; } } ; --- 🛠️ 常用异步 API Promise 封装 javascript // utils/promise.js const promisify = fn => { return ...args => { return new Promise resolve, reject => { fn { ...args 0 , success: resolve, fail: reject } ; } ; }; }; // 封装常用 API export const login = promisify wx.login ; export const getUserInfo = promisify wx.getUserInfo ; export const request = promisify wx.request ; export const showToast = promisify wx.showToast ; export const showLoading = promisify wx.showLoading ; export const hideLoading = promisify wx.hideLoading ; export const navigateTo = promisify wx.navigateTo ; export const switchTab = promisify wx.switchTab ; 使用示例 javascript import { login, request, showLoading, hideLoading } from '../../utils/promise.js'; async function fetchData { try { await showLoading { title: '加载中...' } ; const { code } = await login ; const result = await request { url: 'https://api.example.com/data', method: 'POST', data: { code } } ; await hideLoading ; return result; } catch error { await hideLoading ; throw error; } } --- 📊 方案对比 | 方案 | 优点 | 缺点 | 适用场景 | |------|------|------|----------| | 基础 Promise 封装 | 简单直观 | 代码重复 | 小型项目、快速开发 | | 统一 API 管理 | 易于维护、统一处理 | 需要额外配置 | 中大型项目 | | promisify 工具函数 | 通用、简洁 | 缺少个性化处理 | 需要频繁封装多个 API | --- ⚠️ 注意事项 1. 错误处理必须要有 javascript // 错误做法 ❌ async function badExample { const data = await api.request ; // 如果失败会直接抛出异常 console.log data ; } // 正确做法 ✅ async function goodExample { try { const data = await api.request ; console.log data ; } catch error { console.error '请求失败:', error ; // 显示错误提示 wx.showToast { title: '请求失败', icon: 'none' } ; } } 2. await 必须在 async 函数中使用 javascript // 错误 ❌ Page { onLoad { await this.fetchData ; // 错误：onLoad 不是 async 函数 } } ; // 正确 ✅ Page { async onLoad { await this.fetchData ; }, async fetchData { // ... } } ; 3. 不要滥用同步写法 javascript // 不推荐 ❌ - 串行请求，性能差 async function badRequest { const a = await api.get '/a' ; const b = await api.get '/b' ; const c = await api.get '/c' ; } // 推荐 ✅ - 并行请求，性能更好 async function goodRequest { const a, b, c = await Promise.all api.get '/a' , api.get '/b' , api.get '/c' ; } 4. 小程序兼容性 | 特性 | 支持版本 | 说明 | |------|---------|------| | async/await | 基础库 2.10.2+ | 需要在开发者工具中开启 ES6 转 ES5 | | Promise.all | 基础库 1.5.0+ | 支持 | | Promise.race | 基础库 1.5.0+ | 支持 | --- 📝 总结 异步转同步的核心是 Promise + async/await ： 1. 封装 ：将 wx API 封装为 Promise 2. 调用 ：使用 async/await 实现同步风格 3. 处理 ：使用 try-catch 捕获错误 4. 优化 ：合理使用 Promise.all 提升性能 这种方式既保持了异步的性能优势，又拥有同步代码的可读性。",
    "fullText": "微信小程序将异步 API 封装为 Promise 同步调用（async/await）实战 利用 Promisify 模式批量将 wx.request、wx.showModal 等回调式 API 转为标准的 async/await 同步写法。 前端开发 微信小程序 JavaScript Promise 微信小程序将异步 API 改成同步处理方法 在微信小程序开发中，异步 API 是常态，但有时我们需要同步的代码风格来处理业务逻辑。本文介绍几种常用的异步转同步方案。 方案一：Promise 封装 + async/await（推荐） javascript Page { data: { userInfo: null, token: '' }, onLoad { this.initUserInfo ; }, / 统一封装 wx.request 为 Promise @param {Object} options - 请求配置 @returns {Promise} / request options { return new Promise resolve, reject => { wx.request { ...options, success: res => { // 统一处理业务错误 if res.data && res.data.code !== 0 { reject new Error res.data.message || '请求失败' ; } else { resolve res.data ; } }, fail: err => { reject new Error err.errMsg || '网络请求失败' ; } } ; } ; }, / 封装 wx.login 为 Promise @returns {Promise<string>} - 返回 code / login { return new Promise resolve, reject => { wx.login { success: res => { if res.code { resolve res.code ; } else { reject new Error '登录失败' ; } }, fail: err => { reject new Error err.errMsg || '登录失败' ; } } ; } ; }, / 同步风格的用户信息初始化 / async initUserInfo { try { // 1. 获取账号信息 const accountInfo = wx.getAccountInfoSync ; const appId = accountInfo.miniProgram.appId; // 2. 登录获取 code const code = await this.login ; console.log '获取 code 成功:', code ; // 3. 登录请求 const loginResult = await this.request { url: 'https://api.example.com/login', method: 'POST', data: { js_code: code, appid: appId } } ; console.log '登录成功:', loginResult ; // 4. 获取用户信息 const userInfoResult = await this.request { url: 'https://api.example.com/user/info', method: 'POST', data: { openId: loginResult.openId, sessionKey: loginResult.sessionKey } } ; console.log '获取用户信息成功:', userInfoResult ; // 5. 更新页面数据 this.setData { userInfo: userInfoResult, token: loginResult.token } ; } catch error { console.error '初始化用户信息失败:', error.message ; // 可以在这里添加错误处理，如显示错误提示 wx.showToast { title: '登录失败', icon: 'none' } ; } } } ; --- ✨ 进阶方案：统一 API 管理 创建统一的 API 管理文件 javascript // utils/api.js class ApiService { constructor { this.baseUrl = 'https://api.example.com'; this.token = ''; } / 设置 token / setToken token { this.token = token; } / 请求拦截器 / async request options { // 添加公共参数 const headers = { 'Content-Type': 'application/json', ... this.token && { 'Authorization': Bearer ${this.token} } }; return new Promise resolve, reject => { wx.request { url: this.baseUrl + options.url, method: options.method || 'GET', data: options.data || {}, headers, success: res => { if res.statusCode === 200 { if res.data.code === 0 { resolve res.data.data ; } else if res.data.code === 401 { // token 失效，重新登录 reject new Error '登录已过期，请重新登录' ; } else { reject new Error res.data.message || '请求失败' ; } } else { reject new Error HTTP 错误: ${res.statusCode} ; } }, fail: err => { reject new Error err.errMsg || '网络请求失败' ; } } ; } ; } / 登录接口 / async login code, appId { return await this.request { url: '/login', method: 'POST', data: { js_code: code, appid: appId } } ; } / 获取用户信息 / async getUserInfo openId { return await this.request { url: '/user/info', method: 'POST', data: { openId } } ; } / 获取商品列表 / async getGoodsList params { return await this.request { url: '/goods/list', method: 'GET', data: params } ; } } // 导出单例 export default new ApiService ; 在页面中使用 javascript // pages/index/index.js import api from '../../utils/api.js'; Page { data: { goods: }, async onLoad { await this.init ; }, async init { try { // 1. 登录 const code = await this.getLoginCode ; const loginResult = await api.login code, 'your-app-id' ; // 2. 设置 token api.setToken loginResult.token ; // 3. 获取数据 const goods = await api.getGoodsList { page: 1, size: 10 } ; // 4. 更新视图 this.setData { goods } ; } catch error { console.error '初始化失败:', error.message ; wx.showToast { title: '加载失败', icon: 'none' } ; } }, getLoginCode { return new Promise resolve, reject => { wx.login { success: res => resolve res.code , fail: err => reject err } ; } ; } } ; --- 🛠️ 常用异步 API Promise 封装 javascript // utils/promise.js const promisify = fn => { return ...args => { return new Promise resolve, reject => { fn { ...args 0 , success: resolve, fail: reject } ; } ; }; }; // 封装常用 API export const login = promisify wx.login ; export const getUserInfo = promisify wx.getUserInfo ; export const request = promisify wx.request ; export const showToast = promisify wx.showToast ; export const showLoading = promisify wx.showLoading ; export const hideLoading = promisify wx.hideLoading ; export const navigateTo = promisify wx.navigateTo ; export const switchTab = promisify wx.switchTab ; 使用示例 javascript import { login, request, showLoading, hideLoading } from '../../utils/promise.js'; async function fetchData { try { await showLoading { title: '加载中...' } ; const { code } = await login ; const result = await request { url: 'https://api.example.com/data', method: 'POST', data: { code } } ; await hideLoading ; return result; } catch error { await hideLoading ; throw error; } } --- 📊 方案对比 | 方案 | 优点 | 缺点 | 适用场景 | |------|------|------|----------| | 基础 Promise 封装 | 简单直观 | 代码重复 | 小型项目、快速开发 | | 统一 API 管理 | 易于维护、统一处理 | 需要额外配置 | 中大型项目 | | promisify 工具函数 | 通用、简洁 | 缺少个性化处理 | 需要频繁封装多个 API | --- ⚠️ 注意事项 1. 错误处理必须要有 javascript // 错误做法 ❌ async function badExample { const data = await api.request ; // 如果失败会直接抛出异常 console.log data ; } // 正确做法 ✅ async function goodExample { try { const data = await api.request ; console.log data ; } catch error { console.error '请求失败:', error ; // 显示错误提示 wx.showToast { title: '请求失败', icon: 'none' } ; } } 2. await 必须在 async 函数中使用 javascript // 错误 ❌ Page { onLoad { await this.fetchData ; // 错误：onLoad 不是 async 函数 } } ; // 正确 ✅ Page { async onLoad { await this.fetchData ; }, async fetchData { // ... } } ; 3. 不要滥用同步写法 javascript // 不推荐 ❌ - 串行请求，性能差 async function badRequest { const a = await api.get '/a' ; const b = await api.get '/b' ; const c = await api.get '/c' ; } // 推荐 ✅ - 并行请求，性能更好 async function goodRequest { const a, b, c = await Promise.all api.get '/a' , api.get '/b' , api.get '/c' ; } 4. 小程序兼容性 | 特性 | 支持版本 | 说明 | |------|---------|------| | async/await | 基础库 2.10.2+ | 需要在开发者工具中开启 ES6 转 ES5 | | Promise.all | 基础库 1.5.0+ | 支持 | | Promise.race | 基础库 1.5.0+ | 支持 | --- 📝 总结 异步转同步的核心是 Promise + async/await ： 1. 封装 ：将 wx API 封装为 Promise 2. 调用 ：使用 async/await 实现同步风格 3. 处理 ：使用 try-catch 捕获错误 4. 优化 ：合理使用 Promise.all 提升性能 这种方式既保持了异步的性能优势，又拥有同步代码的可读性。",
    "sections": [
      {
        "title": "方案一：Promise 封装 + async/await（推荐）",
        "anchor": "#方案一-promise-封装-async-await-推荐",
        "id": "方案一-promise-封装-async-await-推荐"
      },
      {
        "title": "✨ 进阶方案：统一 API 管理",
        "anchor": "#进阶方案-统一-api-管理",
        "id": "进阶方案-统一-api-管理"
      },
      {
        "title": "创建统一的 API 管理文件",
        "anchor": "#创建统一的-api-管理文件",
        "id": "创建统一的-api-管理文件"
      },
      {
        "title": "在页面中使用",
        "anchor": "#在页面中使用",
        "id": "在页面中使用"
      },
      {
        "title": "🛠️ 常用异步 API Promise 封装",
        "anchor": "#常用异步-api-promise-封装",
        "id": "常用异步-api-promise-封装"
      },
      {
        "title": "使用示例",
        "anchor": "#使用示例",
        "id": "使用示例"
      },
      {
        "title": "📊 方案对比",
        "anchor": "#方案对比",
        "id": "方案对比"
      },
      {
        "title": "⚠️ 注意事项",
        "anchor": "#注意事项",
        "id": "注意事项"
      },
      {
        "title": "1. 错误处理必须要有",
        "anchor": "#1-错误处理必须要有",
        "id": "1-错误处理必须要有"
      },
      {
        "title": "2. await 必须在 async 函数中使用",
        "anchor": "#2-await-必须在-async-函数中使用",
        "id": "2-await-必须在-async-函数中使用"
      },
      {
        "title": "3. 不要滥用同步写法",
        "anchor": "#3-不要滥用同步写法",
        "id": "3-不要滥用同步写法"
      },
      {
        "title": "4. 小程序兼容性",
        "anchor": "#4-小程序兼容性",
        "id": "4-小程序兼容性"
      },
      {
        "title": "📝 总结",
        "anchor": "#总结",
        "id": "总结"
      }
    ]
  },
  {
    "id": "wechat-miniprogram-property-observer-watch",
    "title": "微信小程序自定义组件监听 properties 属性变化的优雅实现",
    "url": "posts/wechat-miniprogram-property-observer-watch.html",
    "category": "前端开发",
    "date": "2026-03-18",
    "tags": [
      "前端开发",
      "微信小程序",
      "组件通信",
      "响应式"
    ],
    "summary": "详解小程序 Component 中的 observer 监听机制，以及在 Page 页面中通过 Object.defineProperty 实现 Watch 监听。",
    "content": "微信小程序监听属性变化方法 在 Vue.js 中可以使用 watch 监听属性变化，在微信小程序中也有多种方式实现类似功能。本文介绍几种常用的监听方案。 方案一：使用 Object.defineProperty（基础版） 原理说明 通过 Object.defineProperty 拦截对象属性的 set 方法，当属性值变化时自动触发回调函数。 实现代码 第一步：在 app.js 中定义监听器 javascript // app.js App { / 监听对象属性变化 @param {Object} obj - 要监听的对象 @param {Object} watchMap - 监听配置 { key: callback } / watch obj, watchMap { for const key in watchMap { this.observe obj, key, obj key , watchMap key ; } }, / 观察单个属性 @param {Object} data - 对象 @param {string} key - 属性名 @param {any} val - 初始值 @param {Function} fn - 回调函数 / observe data, key, val, fn { Object.defineProperty data, key, { configurable: true, enumerable: true, get { return val; }, set newVal { // 深度比较，避免相同值触发回调 if JSON.stringify newVal === JSON.stringify val { return; } const oldVal = val; val = newVal; fn && fn newVal, oldVal ; } } ; } } ; 第二步：在页面中使用 javascript // pages/index/index.js Page { data: { userInfo: { name: '张三', age: 28 }, counter: 0 }, onLoad { // 监听 userInfo.name 属性 getApp .watch this.data.userInfo, { name: newVal, oldVal => { console.log 姓名从 ${oldVal} 变为 ${newVal} ; // 可以在这里执行响应逻辑 } } ; // 监听 counter 属性 getApp .watch this.data, { counter: newVal, oldVal => { console.log 计数器从 ${oldVal} 变为 ${newVal} ; } } ; }, // 修改属性的方法 changeName { // 注意：直接修改属性会触发监听 this.data.userInfo.name = '李四'; // 如果使用 setData，需要注意数据同步 this.setData { 'userInfo.name': '李四' } ; }, increment { this.data.counter++; this.setData { counter: this.data.counter } ; } } ; --- 方案二：使用 setData 包装器（推荐） 原理说明 通过包装 setData 方法，在数据更新前后触发回调函数。这种方式更符合小程序的设计规范。 实现代码 在 app.js 中定义增强方法 javascript // app.js App { / 增强 Page 构造器，添加 watch 能力 @param {Object} options - Page 配置对象 / enhancePage options { const { watch = {}, ...rest } = options; // 保存原始的 setData const originalSetData = rest.setData; rest.setData = function data, callback { // 执行原始 setData originalSetData && originalSetData.call this, data, callback ; // 检查是否有需要监听的属性变化 for const key in watch { // 检查 data 中是否包含监听的属性 if data.hasOwnProperty key { // 获取旧值 const oldVal = this.data key ; const newVal = data key ; // 如果值发生变化，触发回调 if JSON.stringify newVal !== JSON.stringify oldVal { watch key .call this, newVal, oldVal ; } } } }; return Page rest ; } } ; 在页面中使用 javascript // pages/index/index.js getApp .enhancePage { data: { count: 0, message: 'Hello' }, // 监听配置 watch: { count newVal, oldVal { console.log count 变化: ${oldVal} -> ${newVal} ; // 可以在这里执行副作用 this.updateTitle ; }, message newVal, oldVal { console.log message 变化: ${oldVal} -> ${newVal} ; } }, onLoad { // 初始化 this.setData { count: 1 } ; }, updateTitle { wx.setNavigationBarTitle { title: 计数: ${this.data.count} } ; }, handleClick { this.setData { count: this.data.count + 1 } ; } } ; --- 方案三：使用 Behavior 混入（组件化方案） 原理说明 利用小程序的 Behavior 机制，将监听能力封装为可复用的模块。 实现代码 创建 watch Behavior javascript // behaviors/watch.js module.exports = Behavior { lifetimes: { attached { // 获取组件配置的 watch 对象 const watch = this.$watch || {}; // 包装 setData const originalSetData = this.setData.bind this ; this.setData = data, callback => { // 记录旧值 const oldData = {}; for const key in data { if watch key { oldData key = this.data key ; } } // 执行原始 setData originalSetData data, callback ; // 触发监听回调 for const key in watch { if data.hasOwnProperty key { const newVal = data key ; const oldVal = oldData key ; if JSON.stringify newVal !== JSON.stringify oldVal { watch key .call this, newVal, oldVal ; } } } }; } } } ; 在组件中使用 javascript // components/custom-component/custom-component.js const watchBehavior = require '../../behaviors/watch.js' ; Component { behaviors: watchBehavior , data: { value: '', isValid: false }, // 监听配置 $watch: { value newVal, oldVal { console.log value 变化: ${oldVal} -> ${newVal} ; this.validateValue newVal ; } }, methods: { validateValue value { const isValid = value.length >= 6; this.setData { isValid } ; }, handleInput e { this.setData { value: e.detail.value } ; } } } ; --- 方案四：使用 computed 计算属性（简洁版） 原理说明 虽然小程序没有原生 computed，但可以通过 setData 时手动更新计算属性。 实现代码 javascript // pages/index/index.js Page { data: { firstName: '张', lastName: '三', fullName: '张三' // 计算属性 }, onLoad { // 初始化计算属性 this.updateFullName ; }, // 计算属性更新方法 updateFullName { const { firstName, lastName } = this.data; const fullName = ${firstName}${lastName} ; if fullName !== this.data.fullName { this.setData { fullName } ; // 可以在这里添加监听逻辑 this.onFullNameChange fullName ; } }, // 监听回调 onFullNameChange newVal { console.log 全名变为: ${newVal} ; }, // 修改属性时同步更新计算属性 setFirstName name { this.setData { firstName: name } ; this.updateFullName ; }, setLastName name { this.setData { lastName: name } ; this.updateFullName ; } } ; --- 各方案对比 | 方案 | 优点 | 缺点 | 适用场景 | |------|------|------|----------| | Object.defineProperty | 原生API，轻量 | 不支持 setData 自动同步 | 简单数据监听 | | setData 包装器 | 符合小程序规范 | 需要修改 Page 构造 | 页面级监听 | | Behavior 混入 | 可复用，组件化 | 稍复杂 | 组件通用能力 | | computed 模拟 | 简单直观 | 需要手动维护 | 计算属性场景 | --- 使用建议 1. 页面级监听 推荐使用 方案二（setData 包装器） ，符合小程序设计规范，代码清晰。 2. 组件级监听 推荐使用 方案三（Behavior 混入） ，便于复用和维护。 3. 简单场景 使用 方案四（computed 模拟） ，代码最简单直观。 --- 注意事项 1. 性能考虑 - 避免在监听回调中频繁调用 setData ，可能导致循环更新 - 对于复杂对象，考虑使用浅比较代替 JSON.stringify 2. 数据同步 - 使用 Object.defineProperty 时，直接修改属性会触发监听，但不会触发小程序的响应式更新 - 建议始终使用 setData 更新数据 3. 生命周期 - Behavior 的 attached 生命周期在页面/组件挂载后执行 - 确保在 attached 之后使用增强的 setData 4. 深度监听 本文实现的是单层监听，如果需要监听嵌套对象的变化，可以扩展为深度监听： javascript // 深度监听示例 function deepWatch obj, watchMap, parentKey = '' { for const key in obj { const fullKey = parentKey ? ${parentKey}.${key} : key; if typeof obj key === 'object' && obj key !== null { deepWatch obj key , watchMap, fullKey ; } if watchMap fullKey { // 对每个属性设置监听 observe obj, key, obj key , watchMap fullKey ; } } } --- 总结 微信小程序中监听属性变化的核心思路： - ✅ 使用 Object.defineProperty 拦截属性 - ✅ 包装 setData 实现响应式监听 - ✅ 使用 Behavior 实现组件化复用 - ✅ 模拟 computed 实现计算属性 根据项目复杂度选择合适的方案，推荐优先使用 setData 包装器 或 Behavior 混入 方案。",
    "fullText": "微信小程序自定义组件监听 properties 属性变化的优雅实现 详解小程序 Component 中的 observer 监听机制，以及在 Page 页面中通过 Object.defineProperty 实现 Watch 监听。 前端开发 微信小程序 组件通信 响应式 微信小程序监听属性变化方法 在 Vue.js 中可以使用 watch 监听属性变化，在微信小程序中也有多种方式实现类似功能。本文介绍几种常用的监听方案。 方案一：使用 Object.defineProperty（基础版） 原理说明 通过 Object.defineProperty 拦截对象属性的 set 方法，当属性值变化时自动触发回调函数。 实现代码 第一步：在 app.js 中定义监听器 javascript // app.js App { / 监听对象属性变化 @param {Object} obj - 要监听的对象 @param {Object} watchMap - 监听配置 { key: callback } / watch obj, watchMap { for const key in watchMap { this.observe obj, key, obj key , watchMap key ; } }, / 观察单个属性 @param {Object} data - 对象 @param {string} key - 属性名 @param {any} val - 初始值 @param {Function} fn - 回调函数 / observe data, key, val, fn { Object.defineProperty data, key, { configurable: true, enumerable: true, get { return val; }, set newVal { // 深度比较，避免相同值触发回调 if JSON.stringify newVal === JSON.stringify val { return; } const oldVal = val; val = newVal; fn && fn newVal, oldVal ; } } ; } } ; 第二步：在页面中使用 javascript // pages/index/index.js Page { data: { userInfo: { name: '张三', age: 28 }, counter: 0 }, onLoad { // 监听 userInfo.name 属性 getApp .watch this.data.userInfo, { name: newVal, oldVal => { console.log 姓名从 ${oldVal} 变为 ${newVal} ; // 可以在这里执行响应逻辑 } } ; // 监听 counter 属性 getApp .watch this.data, { counter: newVal, oldVal => { console.log 计数器从 ${oldVal} 变为 ${newVal} ; } } ; }, // 修改属性的方法 changeName { // 注意：直接修改属性会触发监听 this.data.userInfo.name = '李四'; // 如果使用 setData，需要注意数据同步 this.setData { 'userInfo.name': '李四' } ; }, increment { this.data.counter++; this.setData { counter: this.data.counter } ; } } ; --- 方案二：使用 setData 包装器（推荐） 原理说明 通过包装 setData 方法，在数据更新前后触发回调函数。这种方式更符合小程序的设计规范。 实现代码 在 app.js 中定义增强方法 javascript // app.js App { / 增强 Page 构造器，添加 watch 能力 @param {Object} options - Page 配置对象 / enhancePage options { const { watch = {}, ...rest } = options; // 保存原始的 setData const originalSetData = rest.setData; rest.setData = function data, callback { // 执行原始 setData originalSetData && originalSetData.call this, data, callback ; // 检查是否有需要监听的属性变化 for const key in watch { // 检查 data 中是否包含监听的属性 if data.hasOwnProperty key { // 获取旧值 const oldVal = this.data key ; const newVal = data key ; // 如果值发生变化，触发回调 if JSON.stringify newVal !== JSON.stringify oldVal { watch key .call this, newVal, oldVal ; } } } }; return Page rest ; } } ; 在页面中使用 javascript // pages/index/index.js getApp .enhancePage { data: { count: 0, message: 'Hello' }, // 监听配置 watch: { count newVal, oldVal { console.log count 变化: ${oldVal} -> ${newVal} ; // 可以在这里执行副作用 this.updateTitle ; }, message newVal, oldVal { console.log message 变化: ${oldVal} -> ${newVal} ; } }, onLoad { // 初始化 this.setData { count: 1 } ; }, updateTitle { wx.setNavigationBarTitle { title: 计数: ${this.data.count} } ; }, handleClick { this.setData { count: this.data.count + 1 } ; } } ; --- 方案三：使用 Behavior 混入（组件化方案） 原理说明 利用小程序的 Behavior 机制，将监听能力封装为可复用的模块。 实现代码 创建 watch Behavior javascript // behaviors/watch.js module.exports = Behavior { lifetimes: { attached { // 获取组件配置的 watch 对象 const watch = this.$watch || {}; // 包装 setData const originalSetData = this.setData.bind this ; this.setData = data, callback => { // 记录旧值 const oldData = {}; for const key in data { if watch key { oldData key = this.data key ; } } // 执行原始 setData originalSetData data, callback ; // 触发监听回调 for const key in watch { if data.hasOwnProperty key { const newVal = data key ; const oldVal = oldData key ; if JSON.stringify newVal !== JSON.stringify oldVal { watch key .call this, newVal, oldVal ; } } } }; } } } ; 在组件中使用 javascript // components/custom-component/custom-component.js const watchBehavior = require '../../behaviors/watch.js' ; Component { behaviors: watchBehavior , data: { value: '', isValid: false }, // 监听配置 $watch: { value newVal, oldVal { console.log value 变化: ${oldVal} -> ${newVal} ; this.validateValue newVal ; } }, methods: { validateValue value { const isValid = value.length >= 6; this.setData { isValid } ; }, handleInput e { this.setData { value: e.detail.value } ; } } } ; --- 方案四：使用 computed 计算属性（简洁版） 原理说明 虽然小程序没有原生 computed，但可以通过 setData 时手动更新计算属性。 实现代码 javascript // pages/index/index.js Page { data: { firstName: '张', lastName: '三', fullName: '张三' // 计算属性 }, onLoad { // 初始化计算属性 this.updateFullName ; }, // 计算属性更新方法 updateFullName { const { firstName, lastName } = this.data; const fullName = ${firstName}${lastName} ; if fullName !== this.data.fullName { this.setData { fullName } ; // 可以在这里添加监听逻辑 this.onFullNameChange fullName ; } }, // 监听回调 onFullNameChange newVal { console.log 全名变为: ${newVal} ; }, // 修改属性时同步更新计算属性 setFirstName name { this.setData { firstName: name } ; this.updateFullName ; }, setLastName name { this.setData { lastName: name } ; this.updateFullName ; } } ; --- 各方案对比 | 方案 | 优点 | 缺点 | 适用场景 | |------|------|------|----------| | Object.defineProperty | 原生API，轻量 | 不支持 setData 自动同步 | 简单数据监听 | | setData 包装器 | 符合小程序规范 | 需要修改 Page 构造 | 页面级监听 | | Behavior 混入 | 可复用，组件化 | 稍复杂 | 组件通用能力 | | computed 模拟 | 简单直观 | 需要手动维护 | 计算属性场景 | --- 使用建议 1. 页面级监听 推荐使用 方案二（setData 包装器） ，符合小程序设计规范，代码清晰。 2. 组件级监听 推荐使用 方案三（Behavior 混入） ，便于复用和维护。 3. 简单场景 使用 方案四（computed 模拟） ，代码最简单直观。 --- 注意事项 1. 性能考虑 - 避免在监听回调中频繁调用 setData ，可能导致循环更新 - 对于复杂对象，考虑使用浅比较代替 JSON.stringify 2. 数据同步 - 使用 Object.defineProperty 时，直接修改属性会触发监听，但不会触发小程序的响应式更新 - 建议始终使用 setData 更新数据 3. 生命周期 - Behavior 的 attached 生命周期在页面/组件挂载后执行 - 确保在 attached 之后使用增强的 setData 4. 深度监听 本文实现的是单层监听，如果需要监听嵌套对象的变化，可以扩展为深度监听： javascript // 深度监听示例 function deepWatch obj, watchMap, parentKey = '' { for const key in obj { const fullKey = parentKey ? ${parentKey}.${key} : key; if typeof obj key === 'object' && obj key !== null { deepWatch obj key , watchMap, fullKey ; } if watchMap fullKey { // 对每个属性设置监听 observe obj, key, obj key , watchMap fullKey ; } } } --- 总结 微信小程序中监听属性变化的核心思路： - ✅ 使用 Object.defineProperty 拦截属性 - ✅ 包装 setData 实现响应式监听 - ✅ 使用 Behavior 实现组件化复用 - ✅ 模拟 computed 实现计算属性 根据项目复杂度选择合适的方案，推荐优先使用 setData 包装器 或 Behavior 混入 方案。",
    "sections": [
      {
        "title": "方案一：使用 Object.defineProperty（基础版）",
        "anchor": "#方案一-使用-object-defineproperty-基础版",
        "id": "方案一-使用-object-defineproperty-基础版"
      },
      {
        "title": "原理说明",
        "anchor": "#原理说明",
        "id": "原理说明"
      },
      {
        "title": "实现代码",
        "anchor": "#实现代码",
        "id": "实现代码"
      },
      {
        "title": "方案二：使用 setData 包装器（推荐）",
        "anchor": "#方案二-使用-setdata-包装器-推荐",
        "id": "方案二-使用-setdata-包装器-推荐"
      },
      {
        "title": "原理说明",
        "anchor": "#原理说明",
        "id": "原理说明"
      },
      {
        "title": "实现代码",
        "anchor": "#实现代码",
        "id": "实现代码"
      },
      {
        "title": "方案三：使用 Behavior 混入（组件化方案）",
        "anchor": "#方案三-使用-behavior-混入-组件化方案",
        "id": "方案三-使用-behavior-混入-组件化方案"
      },
      {
        "title": "原理说明",
        "anchor": "#原理说明",
        "id": "原理说明"
      },
      {
        "title": "实现代码",
        "anchor": "#实现代码",
        "id": "实现代码"
      },
      {
        "title": "方案四：使用 computed 计算属性（简洁版）",
        "anchor": "#方案四-使用-computed-计算属性-简洁版",
        "id": "方案四-使用-computed-计算属性-简洁版"
      },
      {
        "title": "原理说明",
        "anchor": "#原理说明",
        "id": "原理说明"
      },
      {
        "title": "实现代码",
        "anchor": "#实现代码",
        "id": "实现代码"
      },
      {
        "title": "各方案对比",
        "anchor": "#各方案对比",
        "id": "各方案对比"
      },
      {
        "title": "使用建议",
        "anchor": "#使用建议",
        "id": "使用建议"
      },
      {
        "title": "1. 页面级监听",
        "anchor": "#1-页面级监听",
        "id": "1-页面级监听"
      },
      {
        "title": "2. 组件级监听",
        "anchor": "#2-组件级监听",
        "id": "2-组件级监听"
      },
      {
        "title": "3. 简单场景",
        "anchor": "#3-简单场景",
        "id": "3-简单场景"
      },
      {
        "title": "注意事项",
        "anchor": "#注意事项",
        "id": "注意事项"
      },
      {
        "title": "1. 性能考虑",
        "anchor": "#1-性能考虑",
        "id": "1-性能考虑"
      },
      {
        "title": "2. 数据同步",
        "anchor": "#2-数据同步",
        "id": "2-数据同步"
      },
      {
        "title": "3. 生命周期",
        "anchor": "#3-生命周期",
        "id": "3-生命周期"
      },
      {
        "title": "4. 深度监听",
        "anchor": "#4-深度监听",
        "id": "4-深度监听"
      },
      {
        "title": "总结",
        "anchor": "#总结",
        "id": "总结"
      }
    ]
  }
];

---
title: Xray-Core Linux 一键部署与自动化服务管理脚本
date: 2026-05-15
category: Linux与服务端
subcategory: 性能与压测
tags: Linux,网络工具,脚本自动化
summary: Linux 生产环境一键拉取并安装最新 Xray 核心，配置 Systemd 守护进程与日志轮转。
readTime: 3 分钟阅读
---

# Xray 一键安装脚本使用说明

本文档提供了运行托管在 GitHub 上的 `xray.sh` 脚本的通用安装命令，并说明了具体的使用方法及相关注意事项。

## 1. 安装命令

您可以根据服务器的环境（是否预装了 `curl` 或 `wget`），选择以下任意一种方式进行安装：

### 方法一：使用 `curl`（推荐，最快捷）
此命令会直接读取网络文件并执行，不会在服务器本地留下脚本文件。
```bash
bash <(curl -Ls https://vmrey.github.io/assets/files/xray.sh)
```

### 方法二：使用 `wget`
如果您的服务器没有安装 `curl`，可以使用 `wget` 达到相同的效果。
```bash
wget -O- https://vmrey.github.io/assets/files/xray.sh | bash
```

### 方法三：分步执行（适合需要先检查代码的用户）
将脚本下载到本地，赋予执行权限后再手动运行。
```bash
# 1. 下载脚本
curl -O https://vmrey.github.io/assets/files/xray.sh

# 2. 赋予脚本执行权限
chmod +x xray.sh

# 3. 运行脚本
./xray.sh
```

---

## 2. 怎么用？（使用步骤）

1. **连接服务器**：使用 SSH 客户端（如 Termius, Xshell, PuTTY 或 macOS/Linux 自带的终端）连接到您的 Linux 服务器（VPS）。
2. **复制命令**：复制上述“安装命令”中的任意一条。
3. **执行安装**：在服务器终端内粘贴该命令并按回车键运行。
4. **跟随提示操作**：脚本运行后，通常会弹出交互式菜单或按步骤提示您输入/确认相关配置（如选择安装的协议、端口号、伪装域名等）。请仔细阅读终端打印的提示，输入对应数字或按回车确认。
5. **保存节点信息**：安装完成后，脚本一般会在终端底部输出最终的客户端连接信息（如 VLESS/VMess 分享链接、配置 JSON 或二维码），请务必妥善复制并保存这些信息，用于配置您的本地客户端。

---

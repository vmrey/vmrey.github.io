---
title: 轻量级高性能内网穿透：frp 远程桌面 RDP 搭建与系统服务配置
date: 2021-05-18
category: Linux 与服务端
subcategory: 网络与反代
tags: Linux,frp,远程桌面,内网穿透,RDP
summary: 基于 VPS 部署 frps 服务端并配置 systemd 守护进程开机自启，搭配 Windows 客户端通过 STCP 安全加密协议实现 3389 远程桌面穿透。
readTime: 4 分钟阅读
---

# 轻量级高性能内网穿透：frp 远程桌面 RDP 搭建与系统服务配置

## 一、架构原理与优势

利用拥有公网 IP 的 VPS 作为中继服务端（`frps`），在公司/家庭 Windows 电脑运行被控客户端（`frpc`），配合 STCP（Secret TCP）端到端双向安全握手，实现无公网 IP 环境下流畅使用 Windows 原生远程桌面。

---

## 二、VPS 服务端部署步骤 (CentOS / Debian / Ubuntu)

```bash
# 1. 下载解压 frp
wget https://github.com/fatedier/frp/releases/download/v0.37.1/frp_0.37.1_linux_amd64.tar.gz
tar -xzvf frp_0.37.1_linux_amd64.tar.gz
mv frp_0.37.1_linux_amd64 /root/frps

# 2. 配置 frps.ini
cat <<EOF > /root/frps/frps.ini
[common]
bind_port = 7000
token = your_secure_token_here
EOF

# 3. 配置 systemd 系统开机守护服务
cat <<EOF > /etc/systemd/system/frps.service
[Unit]
Description=Frp Server Service
After=network.target

[Service]
Type=simple
ExecStart=/root/frps/frps -c /root/frps/frps.ini
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# 4. 启动并设置开机自启
systemctl daemon-reload
systemctl enable --now frps
systemctl status frps
```

---

## 三、被控端 Windows 客户端配置 (frpc.ini)

```ini
[common]
server_addr = 你的VPS公网IP
server_port = 7000
token = your_secure_token_here

[rdp-target]
type = stcp
sk = your_secret_password
local_ip = 127.0.0.1
local_port = 3389
use_encryption = true
use_compression = true
```

---

## 四、访问端 Windows 配置与一键连接

在访问端电脑的 `frpc.ini` 中配置 visitor 模式：

```ini
[common]
server_addr = 你的VPS公网IP
server_port = 7000
token = your_secure_token_here

[rdp-visitor]
type = stcp
role = visitor
server_name = rdp-target
sk = your_secret_password
bind_addr = 127.0.0.1
bind_port = 33890
use_encryption = true
use_compression = true
```

启动后打开远程桌面连接应用（`mstsc`），输入 `127.0.0.1:33890` 即可极速直连。

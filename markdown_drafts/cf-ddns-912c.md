---
title: Cloudflare DDNS 动态域名解析自动更新脚本与使用指南
date: 2026-09-01
category: Linux与服务端
subcategory: 网络与反代
tags: Linux,Cloudflare,DDNS,Shell,网络与运维
summary: 基于 Cloudflare API v4 实现的轻量级 DDNS 动态域名解析自动更新脚本，支持 IPv4/IPv6 双栈探测、本地智能缓存对比及 Crontab 自动化守护。
readTime: 5 分钟阅读
---

# Cloudflare DDNS 动态域名解析自动更新脚本与使用指南

在家庭宽带、NAS 或无固定公网 IP 的服务器环境中，公网 IP 经常会因宽带重拨或运营商策略而发生变动。通过 Cloudflare 提供的 DNS API，我们可以利用轻量 Shell 脚本实时检测本机外网 IP，并在 IP 发生变化时自动同步更新到 Cloudflare DNS 解析记录中。

本文介绍的 `cf-ddns.sh` 脚本具备**智能本地缓存**、**IPv4/IPv6 双栈支持**与**命令行参数覆盖**等特性，适用于 CentOS、Ubuntu、Debian、macOS 等绝大多数 Unix-like 环境。

---

## 🌟 核心特性

- **双栈支持**：支持 IPv4（A 记录）与 IPv6（AAAA 记录）自动探测与同步；
- **智能缓存**：本地维护 IP 与 Zone/Record ID 缓存，仅在 IP 发生真实变动时调用 Cloudflare API，杜绝无效请求与频率限制；
- **安全认证**：采用 Cloudflare 官方推荐的 `API Token`（Bearer 模式），按最小权限原则配置；
- **灵活调用**：支持修改脚本静态配置，或直接通过命令行标志传参（`-k`, `-z`, `-h`, `-t`, `-f`, `-p`）；
- **全自动创建/更新**：目标 DNS 记录不存在时自动调用 POST 创建，已存在时自动执行 PUT 更新。

---

## 📥 1. 下载与安装脚本

通过本站托管的资源一键下载脚本并赋予可执行权限：

### 方式一：使用 `curl` 下载（推荐）

```bash
curl -Lo cf-ddns.sh https://vmrey.github.io/assets/files/cf-ddns.sh && chmod +x cf-ddns.sh
```

### 方式二：使用 `wget` 下载

```bash
wget -O cf-ddns.sh https://vmrey.github.io/assets/files/cf-ddns.sh && chmod +x cf-ddns.sh
```

> 💾 **文件资源**：也可直接在本站文件中心下载或在线预览：[cf-ddns.sh](../assets/files/cf-ddns.sh)。

---

## ⚙️ 2. 配置说明

### 步骤 A：获取 Cloudflare API Token

1. 登录 Cloudflare 控制台，进入 [API 令牌管理页面](https://dash.cloudflare.com/profile/api-tokens)；
2. 点击 **创建令牌 (Create Token)**；
3. 选择 **编辑区域 DNS (Edit zone DNS)** 模板；
4. 在「区域资源 (Zone Resources)」中选择你的目标域名（如 `example.com`）；
5. 点击提交并复制生成的 Token 密钥字符串。

---

### 步骤 B：修改脚本配置

使用编辑器打开 `cf-ddns.sh`：

```bash
vi cf-ddns.sh
```

修改脚本顶部的基础配置项：

```bash
# ----------------------------------------------------
# 1. 配置项 (Configuration)
# ----------------------------------------------------

# Cloudflare 的 API Token【❗推荐使用，权限更安全】
CF_TOKEN="your_cloudflare_api_token_here"

# Cloudflare 的顶级域名（主域名）
CFZONE_NAME="example.com"

# 需要进行 DDNS 解析的目标域名（可填子域名或根域名）
CFRECORD_NAME="home.example.com"

# 记录类型：A (IPv4) 或 AAAA (IPv6)，默认 A
CFRECORD_TYPE="A"

# Cloudflare TTL (存活时间，单位秒，120 ~ 86400，120 为 2 分钟)
CFTTL=120

# 是否开启 Cloudflare CDN 代理：true (开启橙云) | false (仅 DNS 解析/灰云)
CFPROXIED=false

# 强制更新开关：false (默认) | true (忽略本地 IP 缓存强制推送到 CF)
FORCE=false
```

---

## 🚀 3. 运行与手动测试

### 方式一：直接运行（读取脚本内配置）

```bash
./cf-ddns.sh
```

### 方式二：通过命令行参数传入（无需修改脚本文件）

脚本内置了 `getopts` 参数解析器，非常适合在多域名批量同步场景或容器化任务中调用：

```bash
./cf-ddns.sh -k "your_api_token" -z "example.com" -h "home.example.com" -t A -p false
```

#### 命令行参数对照表

| 参数 | 说明 | 示例值 |
| :--- | :--- | :--- |
| `-k` | Cloudflare API Token 密钥 | `your_token_str` |
| `-z` | 托管在 CF 上的顶级主域名 | `example.com` |
| `-h` | 需要绑定的 DDNS 完整域名 | `home.example.com` |
| `-t` | 解析记录类型 (`A` 或 `AAAA`) | `A` (IPv4) / `AAAA` (IPv6) |
| `-p` | 是否开启 CDN 代理加速 (`true` / `false`) | `false` |
| `-f` | 是否强制刷新 DNS（忽略 IP 缓存比对） | `false` |

---

## ⏰ 4. 设置 Crontab 定时自动守护

配置系统定时任务，让脚本每隔 2 分钟或 5 分钟在后台自动巡检一次 IP：

```bash
crontab -e
```

在打开的定时任务文件中追加以下任一规则：

### 规则 A：静默巡检（无变动不产生多余日志）

```cron
# 每 2 分钟静默检测一次
*/2 * * * * /path/to/cf-ddns.sh >/dev/null 2>&1
```

### 规则 B：记录执行日志（便于故障排查）

```cron
# 每 5 分钟检测一次并追加日志到 /var/log/cf-ddns.log
*/5 * * * * /path/to/cf-ddns.sh >> /var/log/cf-ddns.log 2>&1
```

> **注意**：请将 `/path/to/cf-ddns.sh` 替换为您服务器上的绝对路径（例如 `/root/scripts/cf-ddns.sh`）。

重载/重启 Cron 服务（根据 Linux 发行版选择）：

```bash
# CentOS / RHEL
systemctl reload crond.service

# Ubuntu / Debian
systemctl restart cron
```

---

## 📁 5. 缓存与工作机制剖析

为降低对 Cloudflare API 的请求频次并提升脚本执行速度，脚本在首次运行后会在当前用户的家目录（`$HOME`）下维护两份轻量缓存文件：

1. **`~/.cf-wan_ip_<域名>.txt`**：
   - 记录上一次成功同步的公网 IP；
   - 每次运行时先通过 `https://ipv4.icanhazip.com` 获取当前外网 IP，若与缓存一致且未指定 `-f` 参数，脚本将立即退出，避免不必要的网络开销。
2. **`~/.cf-id_<域名>.txt`**：
   - 缓存对应域名的 `Zone ID` 与 `Record ID`；
   - 避免每次更新时重复调用 API 查询区域 ID 与解析记录列表。

> 💡 **小提示**：如遇到更换域名、重置 DNS 记录或切换 API Token 后解析不生效的情况，只需执行 `rm -f ~/.cf-id_*.txt ~/.cf-wan_ip_*.txt` 清理本地缓存即可。


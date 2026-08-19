---
title: Shell 脚本自动获取 GitHub 开源项目最新 Releases 版本号
date: 2021-12-01
category: Linux 与服务端
subcategory: 脚本与运维
tags: Linux,Shell,GitHub,自动化,版本获取
summary: 编写通用 Bash 脚本，自动通过正则解析 GitHub Releases 或通用开源软件下载页面的最新 Release Tag 版本号。
readTime: 2 分钟阅读
---

# Shell 脚本自动获取 GitHub 开源项目最新 Releases 版本号

## 一、业务场景

在编写 Linux 自动化一键安装脚本（如自动安装最新版 Xray、frp 或 FFmpeg）时，需要动态抓取上游官方发布的最新版本号，避免每次版本更新都需要手动修改脚本硬编码。

---

## 二、Shell 抓取脚本实现代码

```bash
#!/usr/bin/env bash

# 获取 GitHub 仓库或指定软件的最新发布版本号
getLatestVersion() {
    local targetUrl="$1"
    local softwareName="$2"

    if [[ "$targetUrl" =~ "github.com" ]]; then
        # 从 GitHub Releases 页面解析 tag
        wget --timeout=10 -qO- "$targetUrl" | grep -Po '(?<=/tag/)[vV]?([0-9]+\.)+[0-9]+' | head -n 1
    else
        # 从常规静态镜像列表解析
        wget --timeout=10 -qO- "$targetUrl" | grep -Po "(?<=${softwareName}.)[vV]?([0-9]+\.)+[0-9]+" | tail -n 1
    fi
}

# 示例 1：获取 GitHub 仓库最新 tag (以 Xray 为例)
LATEST_XRAY=$(getLatestVersion "https://github.com/XTLS/Xray-core/releases")
echo "Xray 最新版本为: $LATEST_XRAY"

# 示例 2：获取 FFmpeg 官方镜像最新版本
LATEST_FFMPEG=$(getLatestVersion "https://www.ffmpeg.org/releases/" "ffmpeg")
echo "FFmpeg 最新版本为: $LATEST_FFMPEG"
```

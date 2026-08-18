---
title: FFmpeg 常用音视频推流、转码与循环直播命令速查指南
date: 2026-06-18
category: Linux与服务端
subcategory: 网络与反代
tags: Linux,FFmpeg,音视频,流媒体
summary: 整理基于 FFmpeg 的 RTMP/FLV 本地视频循环推流命令、硬件加速转码与常用分辨率封装参数。
readTime: 3 分钟阅读
---

#### linux 推流命令
```sh
ffmpeg -re -i "视频源地址" -c:v copy -c:a aac -b:a 192k -strict -2 -f flv "rtmp://a.rtmp.youtube.com/live2/直播码"
```

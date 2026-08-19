---
title: FFmpeg 常用音视频推流、转码与循环直播命令速查指南
date: 2026-06-18
category: Linux与服务端
subcategory: 网络与反代
tags: Linux,FFmpeg,音视频,流媒体,推流
summary: 整理基于 FFmpeg 的 RTMP/FLV 本地视频循环推流命令、硬件加速转码、多码率推流与后台无人值守推流脚本。
readTime: 4 分钟阅读
---

# FFmpeg 常用音视频推流、转码与循环直播命令速查指南

> **FFmpeg** 是音视频处理领域的事实标准工具。通过 FFmpeg 可以实现将本地 MP4/MKV 视频文件、网络 RTSP 摄像头流或麦克风音频，实时编码封装推送到 RTMP/FLV 直播流媒体服务器（如 YouTube、Bilibili、斗鱼、Nginx-RTMP 等）。

---

## 一、基础 RTMP 视频推流核心命令

将本地视频文件原画质推送到 RTMP 节点：

```bash
ffmpeg -re -i "input.mp4" -c:v copy -c:a aac -b:a 192k -strict -2 -f flv "rtmp://a.rtmp.youtube.com/live2/你的直播码"
```

### ⚙️ 关键参数解析

| 参数 | 含义说明 | 推荐取值 |
| :--- | :--- | :--- |
| **`-re`** | **实时帧率读取**（Read at native frame rate）。必须加在 `-i` 之前，模拟实时采集速度，防止过快发送导致缓冲区溢出。 | 必须开启 |
| **`-i "input.mp4"`** | 指定输入媒体源文件路径或网络 RTSP URL。 | 文件绝对/相对路径 |
| **`-c:v copy`** | 视频流直接复制，不重新编码，极省 CPU。 | 若编码兼容推荐 `copy` |
| **`-c:a aac`** | 将音频流转换为 RTMP 标准 AAC 编码。 | `aac` |
| **`-b:a 192k`** | 设定音频码率为 192 kbps，保障音质。 | `128k` ~ `320k` |
| **`-f flv`** | 封装格式设定为 FLV（RTMP 协议标准封装格式）。 | `flv` |

---

## 二、进阶实战：7x24小时无人值守循环推流

将文件夹内的视频无限循环直播推流（可配合 `screen` 或 `nohup` 后台常驻）：

```bash
nohup ffmpeg -re -stream_loop -1 -i "video.mp4" -c:v libx264 -preset veryfast -b:v 3000k -maxrate 3500k -bufsize 6000k -pix_fmt yuv420p -g 50 -c:a aac -b:a 128k -ar 44100 -f flv "rtmp://live-push.example.com/live/streamkey" > /var/log/ffmpeg_live.log 2>&1 &
```

> 💡 **参数补充**：
> - **`-stream_loop -1`**：开启无限循环播放输入源；
> - **`-preset veryfast`**：H.264 快速编码预设，大幅降低 CPU 负载；
> - **`-g 50`**：设置关键帧间隔（GOP），通常设为帧率的 2 倍（2秒一个关键帧），提升观众秒开率。

---

## 三、常用进阶推流场景速查

### 1. 重新编码并压制为标准 1080P / 30fps
```bash
ffmpeg -re -i "input.mkv" -c:v libx264 -s 1920x1080 -r 30 -c:a aac -f flv "rtmp://your-rtmp-server/live/stream"
```

### 2. 静态图片 + 背景音乐推流为音乐电台直播
```bash
ffmpeg -re -loop 1 -i "cover.jpg" -i "audio.mp3" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest -f flv "rtmp://your-rtmp-server/live/stream"
```

---

## 四、后台运行与进程管理

- **查看当前推流进程**：`ps -ef | grep ffmpeg`
- **实时查看推流日志**：`tail -f /var/log/ffmpeg_live.log`
- **停止推流**：`pkill -f ffmpeg` 或 `kill -9 <PID>`

---
title: Shell 脚本中输出红/绿/黄多色格式化终端文本函数
date: 2021-11-15
category: Linux 与服务端
subcategory: 开源软件与脚本
tags: Linux,Shell,Bash,ANSI转义,运维脚本
summary: 封装基于 ANSI 转义码的通用 Shell 终端彩色文本打印函数，用于高亮显示部署脚本的成功、警告与错误日志。
readTime: 2 分钟阅读
---

# Shell 脚本中输出红/绿/黄多色格式化终端文本函数

## 一、ANSI 终端颜色代码原理

Linux 终端通过 `\033[3Xm` 转义码定义文字前景色：
- `\033[31m`：红色（常用于错误提示）
- `\033[32m`：绿色（常用于成功提示）
- `\033[33m`：黄色（常用于警告提示）
- `\033[0m`：重置所有颜色样式

---

## 二、通用 Shell 彩色输出函数

```bash
#!/usr/bin/env bash

# 终端彩色文字打印函数
echoColor() {
    local text="$1"
    local color="${2:-green}"

    case "$color" in
        red|1)
            echo -e "\033[31m[ERROR] ${text}\033[0m"
            ;;
        green|2)
            echo -e "\033[32m[SUCCESS] ${text}\033[0m"
            ;;
        yellow|3)
            echo -e "\033[33m[WARNING] ${text}\033[0m"
            ;;
        blue|4)
            echo -e "\033[34m[INFO] ${text}\033[0m"
            ;;
        *)
            echo -e "${text}"
            ;;
    esac
}

# 调用示例
echoColor "数据库连接失败！" "red"
echoColor "服务自动化部署已圆满完成！" "green"
echoColor "磁盘可用空间低于 15%，请及时清理" "yellow"
```

---
title: 开源 HTTP 压力测试工具 Siege 从安装到生产实战指南
date: 2026-05-25
category: Linux与服务端
subcategory: 性能与压测
tags: Linux,压力测试,性能优化,Siege
summary: 详解轻量级 HTTP 负载压测工具 Siege：并发连接模拟、吞吐量 QPS 评估、响应延迟分析与测试报告解读。
readTime: 6 分钟阅读
---

# 开源压力测试工具（siege）

**当前环境（CentOS 7+）**

## 安装步骤

### 第一步：更新系统

```bash
sudo yum -y update
```

### 第二步：安装依赖包

```bash
sudo yum install -y gcc make openssl-devel
```

### 第三步：下载 siege 软件包

```bash
wget http://download.joedog.org/siege/siege-latest.tar.gz
```

**注意**：如果上述链接失效，可以使用以下备用下载方式：

```bash
# 从 GitHub 下载最新版本
wget https://github.com/JoeDog/siege/releases/latest/download/siege-latest.tar.gz
```

### 第四步：解压软件包

```bash
tar zxvf siege-latest.tar.gz
```

### 第五步：删除安装包（可选）

```bash
rm -f siege-latest.tar.gz
```

### 第六步：进入解压后的目录

```bash
# 进入解压后的目录（注意：版本号可能不同，请根据实际情况调整）
cd siege-*/
```

**说明**：使用 `siege-*/` 通配符可以自动匹配版本号，避免硬编码版本号的问题。

### 第七步：编译安装

```bash
./configure && make
```

### 第八步：安装到系统

```bash
sudo make install
```

### 第九步：创建配置文件

```bash
# 复制配置文件到用户目录
cp doc/siegerc ~/.siegerc
```

**注意**：如果 `doc/siegerc` 不存在，可以手动创建配置文件：

```bash
# 创建配置文件
touch ~/.siegerc
```

### 第十步：验证安装

```bash
siege -V
```

**预期输出**：
```
SIEGE 4.1.3
Copyright (C) 2025 by Jeffrey Fulmer, et al.
...
```

## 使用示例

### 基本压力测试

```bash
# 10个客户端并发，每个客户端发起10个请求
siege -c 10 -r 10 --log=./siege.log https://www.baidu.com
```

### 常用参数说明

| 参数 | 说明 | 示例 |
|------|------|------|
| `-c` | 并发用户数 | `-c 10` (10个并发用户) |
| `-r` | 重复次数 | `-r 10` (每个用户重复10次) |
| `-t` | 持续时间 | `-t 30S` (持续30秒) |
| `-d` | 延迟时间 | `-d 1` (每个请求延迟1秒) |
| `-i` | 互联网模式（随机访问） | `-i` |
| `-b` | 基准测试模式（无延迟） | `-b` |
| `--log` | 日志文件路径 | `--log=./siege.log` |

### 更多使用示例

```bash
# 持续30秒的压力测试
siege -c 20 -t 30S https://www.example.com

# 从URL文件读取测试目标
siege -c 10 -r 5 -f urls.txt

# 基准测试模式（无延迟，最大压力）
siege -c 50 -r 100 -b https://www.example.com
```

## 常见问题

### 1. 编译错误

如果出现 `openssl` 相关错误，请确保已安装 `openssl-devel`：

```bash
sudo yum install -y openssl-devel
```

### 2. 权限问题

如果安装时遇到权限问题，确保使用 `sudo`：

```bash
sudo make install
```

### 3. 配置文件不存在

如果 `~/.siegerc` 不存在，可以手动创建：

```bash
mkdir -p ~/.siege
touch ~/.siegerc
```

## 卸载方法

```bash
# 进入源码目录
cd siege-*/

# 执行卸载
sudo make uninstall

# 删除配置文件
rm -rf ~/.siegerc
```

## 参考资源

- 官方网站：https://www.joedog.org/siege-home/
- GitHub 仓库：https://github.com/JoeDog/siege
- 官方文档：https://www.joedog.org/siege-manual/

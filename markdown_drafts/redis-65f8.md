---
title: Redis 核心操作：数据清空与内存淘汰策略详解
date: 2026-08-29
category: Linux 与服务端
subcategory: 性能与压测
tags: Redis,缓存,内存淘汰,运维,Linux,性能优化
summary: 深入解析 Redis 核心清空命令 FLUSHDB/FLUSHALL 的同步与异步 ASYNC 机制，以及 8 种内存淘汰策略（LRU、LFU、TTL、noeviction）的工作原理与生产环境选型建议。
readTime: 4 分钟阅读
---

# Redis 核心操作：数据清空与内存淘汰策略详解

在日常使用 Redis 的过程中，我们经常会面临两个问题：一是如何快速、安全地清理脏数据；二是当 Redis 内存满了之后，它会如何处理新写入的数据。本文将详细解答这两个问题。

---

## 一、 Redis 数据库清空命令

Redis 提供了两个核心的清空命令，分别作用于不同的范围：

*   **FLUSHDB**：清空当前选中的数据库（默认是 DB 0）中的所有键值对。
*   **FLUSHALL**：清空 Redis 实例中所有数据库（默认 16 个）中的所有键值对。

### 1. 同步与异步清空 (ASYNC)
在 Redis 4.0 之前，清空操作是同步的。如果数据库中包含了数百万个 Key，执行 `FLUSHALL` 会导致 Redis 主线程长时间阻塞，期间无法响应任何其他客户端请求。

为了解决这个问题，Redis 4.0 引入了 `ASYNC` 异步选项：

```bash
# 异步清空所有数据库数据
redis-cli -h 127.0.0.1 -p 6379 FLUSHALL ASYNC

# 异步清空当前数据库数据
redis-cli -h 127.0.0.1 -p 6379 FLUSHDB ASYNC
```

**原理解析**：加入 `ASYNC` 后，清空操作会被交由后台的新线程执行，Redis 主线程可以继续处理其他命令，极大降低了对业务的影响。

> ⚠️ **生产环境避坑指南**：  
> `FLUSHALL` 和 `FLUSHDB` 属于极其危险的操作。在生产环境中，强烈建议在 `redis.conf` 中通过 `rename-command FLUSHALL ""` 和 `rename-command FLUSHDB ""` 将其禁用，防止误操作导致数据灾难。

---

## 二、 Redis 内存淘汰策略 (maxmemory-policy)

当 Redis 的内存使用量达到了配置的上限（由 `redis.conf` 中的 `maxmemory` 参数决定）时，如果继续向 Redis 中写入数据，Redis 就会触发内存淘汰机制。

Redis 4.0 之后，提供了 **8 种** 不同的淘汰策略。为了方便记忆，我们可以将其分为三大类：

### 1. 不淘汰策略
*   **noeviction**（默认策略）：当内存不足以容纳新写入数据时，新写入操作会报错。Redis 保证绝不主动删除任何数据。适用于将 Redis 作为纯持久化数据库使用的场景。

### 2. 在“所有键”中进行淘汰 (allkeys)
这类策略会在 Redis 的整个键空间中寻找要淘汰的 Key，无论这些 Key 是否设置了过期时间。
*   **allkeys-lru**：尝试回收最长时间未使用的键（LRU，Least Recently Used），使得新添加的数据有空间存放。这是**最常用的策略**，适用于绝大多数缓存场景。
*   **allkeys-lfu**：尝试回收使用频率最少的键（LFU，Least Frequently Used）。(Redis 4.0+)
*   **allkeys-random**：在所有的键中，随机回收部分键。

### 3. 在“设置了过期时间的键”中进行淘汰 (volatile)
这类策略只会针对那些使用了 `EXPIRE` 设定期限的 Key 进行淘汰。如果没有这类 Key 可以淘汰，行为将退化为 `noeviction`。
*   **volatile-lru**：在设置了过期时间的键空间中，回收最长时间未使用的键。
*   **volatile-lfu**：在设置了过期时间的键空间中，回收使用频率最少的键。(Redis 4.0+)
*   **volatile-random**：在设置了过期时间的键空间中，随机回收部分键。
*   **volatile-ttl**：在设置了过期时间的键空间中，优先回收剩余存活时间（TTL）较短的键，即马上要过期的键。

---

## 三、 总结与配置建议

*   **如何查看当前策略**：在命令行输入 `CONFIG GET maxmemory-policy`。
*   **如何修改策略**：可以通过 `CONFIG SET maxmemory-policy allkeys-lru` 动态修改，或直接修改 `redis.conf` 并重启。
*   **选型建议**：
    *   如果你只是将 Redis 用作**纯缓存**，推荐使用 **`allkeys-lru`** 或 **`allkeys-lfu`**；
    *   如果你同时把 Redis 当作**数据库和缓存混合使用**，推荐使用 **`volatile-lru`**，确保未设置过期的核心业务数据不被意外删除。

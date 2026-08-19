---
title: WordPress 忘记管理员密码时的应急重置与修复方法
date: 2021-10-20
category: Linux 与服务端
subcategory: 开源软件与脚本
tags: WordPress,PHP,MySQL,密码重置,运维
summary: 梳理 WordPress 管理员密码丢失后的两种快速重置手段：MySQL 数据库 MD5 哈希直接更新与临时 functions.php 代码注入。
readTime: 2 分钟阅读
---

# WordPress 忘记管理员密码时的应急重置与修复方法

## 一、方法一：MySQL 数据库一键更新（推荐）

通过 phpMyAdmin 或终端进入 MySQL，执行 SQL 语句直接将管理员密码重置（WordPress 密码基于 MD5 加盐算法）：

```sql
-- 将用户名为 admin 的密码强制重置为 123456
UPDATE wp_users 
SET user_pass = MD5('123456') 
WHERE user_login = 'admin';
```

---

## 二、方法二：在主题 functions.php 中注入临时重置代码

如果无法直接连接数据库，可通过 FTP 或 SSH 编辑当前主题的 `functions.php`，在顶部追加以下代码：

```php
<?php
// 临时重置用户 ID 为 1 的管理员密码为 new_password_123
wp_set_password('new_password_123', 1);
?>
```

> **重要提示**：成功登录后台后，请**务必立即将 `functions.php` 中的上述代码删除**，否则每次刷新页面都会重新重置密码。

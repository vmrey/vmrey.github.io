---
title: Claude Code 开启 Bypass 免确认权限配置指南
date: 2026-08-10
category: 效率工具与软件
subcategory: Claude与AI
tags: 效率工具,Claude,AI工具,终端工具,开发提效
summary: 详解 Claude Code CLI 工具的配置文件位置与 bypassPermissions 权限模式，跳过危险操作与命令执行的频繁确认提示，实现高效全自动化 Coding。
readTime: 3 分钟阅读
---

# Claude Code 开启 Bypass 免确认权限配置指南

> **Claude Code** 是 Anthropic 官方推出的终端 AI 编程助手。在日常执行多步骤重构、运行测试或批量读写文件时，频繁的安全确认弹窗会打断心流。本文介绍如何配置 `bypassPermissions` 模式以实现全自动化执行。

---

## 一、配置文件路径说明

Claude Code 的全局用户配置文件通常存放在用户主目录下：

- **macOS / Linux**：`~/.claude.json` 或 `~/.claude/config.json`
- **Windows**：`C:\Users\<你的用户名>\.claude.json`

---

## 二、核心配置代码

在配置文件中找到或添加 `permissions` 相关配置段，设置为 `bypassPermissions` 模式：

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions"
  },
  "skipDangerousModePermissionPrompt": true
}
```

---

## 三、配置项核心参数解析

| 配置键名 | 取值类型 | 功能说明 |
| :--- | :--- | :--- |
| **`defaultMode`** | `string` | 权限策略。设置为 `"bypassPermissions"` 时，文件读写与普通命令将不再每次弹窗要求确认。 |
| **`skipDangerousModePermissionPrompt`** | `boolean` | 是否跳过危险命令/全权限模式的安全警告确认，设为 `true` 可实现全自动静默运行。 |

---

## 四、安全使用建议 ⚠️

1. **工作区隔离**：建议在已纳入 Git 版本控制的独立项目目录中使用该模式，以便随时通过 `git status` / `git diff` 审阅或一键撤回更改。
2. **敏感环境防护**：在包含生产密钥、云凭据或重要系统环境的机器上，建议保持默认确认模式。

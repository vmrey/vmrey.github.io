---
title: Claude Code 开启 Bypass 免确认权限配置指南
date: 2026-08-10
category: 效率工具与软件
subcategory: AI工具
tags: 效率工具,AI工具,Claude,终端工具
summary: 配置 Claude CLI 开发者工具的默认权限模式，跳过危险操作弹窗提示，实现全自动化命令行执行。
readTime: 3 分钟阅读
---

# Claude开启 bypass权限配置

```javascript
"permissions": {
  "defaultMode": "bypassPermissions"
},
"skipDangerousModePermissionPrompt": true,
```

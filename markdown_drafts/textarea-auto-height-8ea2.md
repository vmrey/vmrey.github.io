---
title: 使用 contenteditable 与 div 完美模拟 Textarea 高度自适应效果
date: 2026-04-08
category: 前端开发
subcategory: JS与工具函数
tags: 前端开发,CSS,DOM操作,富文本
summary: 解决传统 textarea 滚动条闪烁与高度伸缩卡顿问题，通过 contenteditable 与 CSS 构建丝滑自适应输入框。
readTime: 16 分钟阅读
---

# 模拟 textarea 效果高度自适应

## 核心原理

使用 `contenteditable` 属性将普通元素设置为可编辑状态，配合 CSS 实现高度自适应效果。

## contenteditable 属性说明

```html
<!-- contenteditable 属性指定元素内容是否可编辑 -->
<div contenteditable="true">可编辑的 div</div>
<div contenteditable="false">不可编辑的 div</div>
<div>继承父元素的编辑状态</div>
```

**注意**：当元素中没有设置 `contenteditable` 属性时，元素将从父元素继承编辑状态。

## 完整实现示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>模拟 textarea 高度自适应</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            padding: 50px;
            font-family: Arial, sans-serif;
        }

        /* 模拟 textarea 的容器样式 */
        .simulation-textarea {
            width: 500px;
            min-height: 20px;
            max-height: 300px;
            margin: 20px auto;
            padding: 10px;
            border: 1px solid #a0b3d6;
            border-radius: 5px;
            font-size: 12px;
            line-height: 24px;
            outline: none;
            word-wrap: break-word;
            overflow-x: hidden;
            overflow-y: auto;
            border-color: rgba(82, 168, 236, 0.8);
            transition: border-color 0.3s;
        }

        /* 聚焦时的边框效果 */
        .simulation-textarea:focus {
            border-color: #66afe9;
            box-shadow: 0 0 8px rgba(102, 175, 233, 0.6);
        }

        /* 空状态提示 */
        .simulation-textarea:empty:before {
            content: attr(data-placeholder);
            color: #999;
        }

        /* 自定义滚动条样式 */
        .simulation-textarea::-webkit-scrollbar {
            width: 5px;
            height: 5px;
        }

        .simulation-textarea::-webkit-scrollbar-track {
            background: rgb(239, 239, 239);
            border-radius: 2px;
        }

        .simulation-textarea::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background: #bfbfbf;
        }

        .simulation-textarea::-webkit-scrollbar-thumb:hover {
            background: #999;
        }

        /* Firefox 滚动条样式 */
        .simulation-textarea {
            scrollbar-width: thin;
            scrollbar-color: #bfbfbf rgb(239, 239, 239);
        }
    </style>
</head>
<body>
    <h2>模拟 textarea 高度自适应</h2>
    
    <!-- 基础版本 -->
    <div class="simulation-textarea" contenteditable="true" data-placeholder="请输入内容..."></div>
    
    <!-- 带焦点事件监听的版本 -->
    <div class="simulation-textarea" 
         contenteditable="true" 
         data-placeholder="请输入内容（带焦点事件）..."
         tabindex="0"
         onfocus="handleFocus()"
         onblur="handleBlur()">
    </div>

    <script>
        // 焦点获取事件
        function handleFocus() {
            console.log('元素获得焦点');
            // 可以在这里添加聚焦时的逻辑
        }

        // 焦点失去事件
        function handleBlur() {
            console.log('元素失去焦点');
            // 可以在这里添加失焦时的逻辑
        }

        // 获取和设置内容的示例
        const editableDiv = document.querySelector('.simulation-textarea');
        
        // 获取内容
        function getContent() {
            return editableDiv.innerHTML;  // 获取 HTML 格式内容
            // return editableDiv.innerText; // 获取纯文本内容
        }

        // 设置内容
        function setContent(htmlContent) {
            editableDiv.innerHTML = htmlContent;
        }

        // 清空内容
        function clearContent() {
            editableDiv.innerHTML = '';
        }
    </script>
</body>
</html>
```

## 高级功能扩展

### 1. 字符数限制

```javascript
// 添加字符数限制
const editableDiv = document.querySelector('.simulation-textarea');
const maxLength = 500;

editableDiv.addEventListener('input', function(e) {
    const currentLength = this.innerText.length;
    if (currentLength > maxLength) {
        // 截断超出部分
        const text = this.innerText.substring(0, maxLength);
        this.innerHTML = text;
        console.log(`已达到最大字符数限制：${maxLength}`);
    }
});
```

### 2. 内容变化监听

```javascript
// 监听内容变化
const editableDiv = document.querySelector('.simulation-textarea');

editableDiv.addEventListener('input', function(e) {
    console.log('内容发生变化：', this.innerText);
    // 可以在这里添加自动保存等功能
});

editableDiv.addEventListener('paste', function(e) {
    // 处理粘贴事件
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    document.execCommand('insertText', false, text);
});
```

### 3. 防止粘贴 HTML 标签

```javascript
// 只允许粘贴纯文本
editableDiv.addEventListener('paste', function(e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
});
```

## 注意事项

### 1. 安全性考虑

```javascript
// 防止 XSS 攻击的简单示例
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// 在设置内容时使用
function setContentSafe(htmlContent) {
    editableDiv.innerHTML = sanitizeHTML(htmlContent);
}
```

### 2. 浏览器兼容性

- `contenteditable` 属性在所有现代浏览器中都支持
- IE9+ 完全支持
- 移动端浏览器支持良好

### 3. 常见问题

**问题1：内容为空时高度塌陷**
```css
/* 解决方案：设置最小高度 */
.simulation-textarea {
    min-height: 20px;
}
```

**问题2：粘贴内容格式混乱**
```javascript
// 解决方案：只粘贴纯文本
editableDiv.addEventListener('paste', function(e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
});
```

**问题3：无法获取焦点**
```html
<!-- 解决方案：添加 tabindex 属性 -->
<div contenteditable="true" tabindex="0"></div>
```

## 与原生 textarea 的对比

| 特性 | contenteditable div | 原生 textarea |
|------|-------------------|--------------|
| 高度自适应 | ✅ 自动适应 | ❌ 需要手动调整 |
| 富文本支持 | ✅ 支持 HTML | ❌ 只支持纯文本 |
| 自定义样式 | ✅ 完全自定义 | ⚠️ 有限制 |
| 表单提交 | ❌ 需要手动处理 | ✅ 自动提交 |
| 性能 | ⚠️ 稍差 | ✅ 更好 |
| 兼容性 | ✅ 良好 | ✅ 完美 |

## 实际应用场景

1. **评论输入框**：需要高度自适应的评论区域
2. **富文本编辑器**：需要支持 HTML 内容的编辑器
3. **即时通讯**：聊天输入框
4. **表单备注**：需要自适应高度的备注输入

## 总结

使用 `contenteditable` 属性模拟 textarea 是实现高度自适应的有效方案，具有以下优势：

- ✅ 自动适应内容高度
- ✅ 支持富文本内容
- ✅ 完全自定义样式
- ✅ 良好的浏览器兼容性

但需要注意安全性和表单处理等细节问题。

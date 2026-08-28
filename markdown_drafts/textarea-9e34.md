---
title: 前端踩坑记录：如何正确获取 textarea 的光标位置？
date: 2026-08-28
category: 前端开发
subcategory: JS 与工具函数
tags: 前端开发,JavaScript,DOM,Textarea,光标定位
summary: 深度复盘与 Code Review：解析 textarea 标签赋值与事件监听误区，分享基于现代标准 API 的光标位置获取最佳实践。
readTime: 4 分钟阅读
---

# 前端踩坑记录：如何正确获取 `<textarea>` 的光标位置？

在前端开发中，我们经常需要处理用户在输入框中的光标位置，比如实现“在光标处插入表情”、“@某人”或者“格式化特定文本”等功能。

最近在做项目时，回顾了一段用于获取 `<textarea>` 焦点位置的 JavaScript 代码。虽然基本功能能跑通，但里面暗藏了不少新手容易踩的坑。今天就来做一次深度的 Code Review，并分享优化后的最佳实践。

## ❌ 那些年我们踩过的坑

在处理 `<textarea>` 时，常犯的几个错误：

1. **`<textarea>` 标签赋值的经典误区**：
   习惯了给 `<input>` 加 `value` 属性，很容易顺手写出 `<textarea value="测试文本"></textarea>`。但实际上，`<textarea>` 是闭合标签，初始文本必须放在开闭标签之间：`<textarea>测试文本</textarea>`。
2. **事件监听不够全面**：
   很多时候我们只记得监听 `onclick`（鼠标点击）和 `oninput`（输入内容），却漏掉了**键盘方向键（↑ ↓ ← →）**移动光标的场景。如果没有 `onkeyup`，用户用键盘移动光标时，位置信息就不会更新。
3. **现代语法与上古 IE 代码的“缝合”**：
   有些网上的代码片段不仅带着 IE8 时代的 `document.selection` API，还混用了 ES6 的 `let`。在现代浏览器环境下，直接使用 `selectionStart` 才是正解，祖传的兼容代码该断舍离就得断舍离。

## ✨ 优化后的最佳实践代码

针对以上痛点，这里给出一份干净、严谨的最佳实践代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>获取光标位置最佳实践</title>
</head>
<body>
    <!-- 修正了默认值的写法，并增加了 onkeyup 监听键盘方向键移动光标 -->
    <textarea name="" id="txt" cols="30" rows="10" 
              onclick="cursorMove()" 
              onkeyup="cursorMove()" 
              oninput="Vchange()">测试文本</textarea>
    
    <script>
        // 统一处理光标移动的事件（点击、键盘导航）
        function cursorMove() {
            console.log('光标移动或点击------------', getPosition('txt'));
        }
        
        // 处理内容输入的事件
        function Vchange() {
            console.log('用户输入------------', getPosition('txt'));
        }

        // 获取 input 或 textarea 焦点位置的核心函数
        function getPosition(id) {
            let oElement = document.getElementById(id);
            let cursorPos = 0;
            
            // 现代浏览器标准写法优先，判断更加严谨
            if (typeof oElement.selectionStart === 'number') {
                cursorPos = oElement.selectionStart;
            } else if (document.selection) { 
                // 兼容旧版 IE (如果项目不需要兼容 IE8，这部分可以完全删除)
                let selectRange = document.selection.createRange();
                selectRange.moveStart('character', -oElement.value.length);
                cursorPos = selectRange.text.length;
            }
            return cursorPos;
        }
    </script>
</body>
</html>
```

## 💡 总结

处理 DOM 元素状态时，细节决定成败：
- 赋值要注意标签的固有属性和结构。
- 交互事件要考虑全面（鼠标 + 键盘）。
- 借用代码时，务必结合当前的业务场景和兼容性要求进行裁剪。

希望这篇简短的记录能帮你避开光标处理的坑！

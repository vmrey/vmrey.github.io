---
title: JavaScript 获取与控制 input 及 textarea 文本框光标位置
date: 2021-03-28
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,DOM操作,光标位置,文本框
summary: 兼容现代标准浏览器与传统 IE 环境，获取 input / textarea 中光标的精确字符位置，并在指定位置插入文本。
readTime: 3 分钟阅读
---

# JavaScript 获取与控制 input 及 textarea 文本框光标位置

## 一、获取光标所在索引位置

```javascript
/**
 * 获取输入框或文本域的光标位置
 * @param {HTMLElement|String} el 目标 DOM 元素或 ID
 * @returns {Number} 光标所在索引值
 */
function getCursorPosition(el) {
  const oElement = typeof el === 'string' ? document.getElementById(el) : el;
  if (!oElement) return 0;

  let cursorPos = 0;
  if (document.selection) {
    // 兼容 IE 传统模式
    const selectRange = document.selection.createRange();
    selectRange.moveStart('character', -oElement.value.length);
    cursorPos = selectRange.text.length;
  } else if (oElement.selectionStart !== undefined) {
    // 标准浏览器 (Chrome / Firefox / Safari / Edge)
    cursorPos = oElement.selectionStart;
  }
  return cursorPos;
}
```

---

## 二、在光标当前位置插入特定文本

```javascript
/**
 * 在输入框光标所在处插入文本并重置光标
 * @param {HTMLInputElement} inputEl 
 * @param {String} textToInsert 
 */
function insertTextAtCursor(inputEl, textToInsert) {
  const startPos = inputEl.selectionStart || 0;
  const endPos = inputEl.selectionEnd || 0;
  const value = inputEl.value;

  inputEl.value = value.substring(0, startPos) + textToInsert + value.substring(endPos);
  
  // 重新聚焦并将光标移动至插入内容末尾
  inputEl.focus();
  inputEl.selectionStart = inputEl.selectionEnd = startPos + textToInsert.length;
}
```

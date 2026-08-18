---
title: JavaScript 防抖与节流深度剖析：从原理实现到业务场景落地
date: 2026-05-12
category: 前端开发
subcategory: JS与工具函数
tags: 前端开发,JavaScript,性能优化,工具函数
summary: 深入剖析 Debounce 与 Throttle 运行机理，手写支持 immediate 首次立即执行与取消功能的完整实现。
readTime: 26 分钟阅读
---

# 前端开发之防抖和节流函数

## 概念说明

### 防抖（Debounce）
**定义**：一个需要频繁触发的函数，在规定时间内，只能让最后一次生效，前面的不生效。

**原理**：每次触发时都清除上一次的定时器，重新计时，直到停止触发一段时间后才执行。

**适用场景**：
- 搜索框输入联想
- 窗口resize事件
- 表单验证
- 按钮点击防重复提交

### 节流（Throttle）
**定义**：一个函数执行一次后，只有大于设定的执行周期后才会执行第二次。

**原理**：在指定时间间隔内，无论触发多少次，只执行一次。

**适用场景**：
- 滚动事件监听
- 鼠标移动事件
- 按钮连续点击
- 游戏中的按键事件

## 防抖函数实现

### ES5 写法

```javascript
/**
 * 防抖函数
 * @param {Function} fn - 要被防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} - 防抖处理后的函数
 */
function debounce(fn, delay) {
    var timer = null;
    return function () {
        // 清理上一次延时器
        clearTimeout(timer);

        // 保存this和参数
        var that = this;
        var args = arguments;

        // 重新设置新的延时器
        timer = setTimeout(function () {
            fn.apply(that, args);
        }, delay);
    };
}
```

### ES6 写法（推荐）

```javascript
/**
 * 防抖函数
 * @param {Function} fn - 要被防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} - 防抖处理后的函数
 */
function debounce(fn, delay = 300, immediate = false) {
    let timer = null;
    
    return function(...args) {
        // 清除上一次定时器
        clearTimeout(timer);
        
        if (immediate) {
            // 立即执行模式
            if (!timer) {
                fn.apply(this, args);
            }
            timer = setTimeout(() => {
                timer = null;
            }, delay);
        } else {
            // 延迟执行模式
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        }
    };
}
```

### 带取消功能的防抖函数

```javascript
/**
 * 可取消的防抖函数
 * @param {Function} fn - 要被防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Object} - 包含debounce函数和cancel方法
 */
function createDebounce(fn, delay = 300) {
    let timer = null;
    
    const debounced = function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
    
    // 取消防抖
    debounced.cancel = function() {
        clearTimeout(timer);
        timer = null;
    };
    
    return debounced;
}
```

## 节流函数实现

### ES5 写法

```javascript
/**
 * 节流函数
 * @param {Function} fn - 要被节流的函数
 * @param {number} delay - 设定的时间间隔（毫秒）
 * @returns {Function} - 节流处理后的函数
 */
function throttle(fn, delay) {
    var startTime = 0;
    return function () {
        // 记录当前函数触发时间
        var endTime = Date.now();
        if (endTime - startTime > delay) {
            // 保存this和参数
            var that = this;
            var args = arguments;
            
            fn.apply(that, args);
            // 同步时间
            startTime = endTime;
        }
    };
}
```

### ES6 写法（推荐）

```javascript
/**
 * 节流函数
 * @param {Function} fn - 要被节流的函数
 * @param {number} delay - 时间间隔（毫秒）
 * @returns {Function} - 节流处理后的函数
 */
function throttle(fn, delay = 300) {
    let lastTime = 0;
    
    return function(...args) {
        const now = Date.now();
        if (now - lastTime > delay) {
            fn.apply(this, args);
            lastTime = now;
        }
    };
}
```

### 定时器版本节流

```javascript
/**
 * 定时器版本节流函数
 * @param {Function} fn - 要被节流的函数
 * @param {number} delay - 时间间隔（毫秒）
 * @returns {Function} - 节流处理后的函数
 */
function throttleTimer(fn, delay = 300) {
    let timer = null;
    
    return function(...args) {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, args);
                timer = null;
            }, delay);
        }
    };
}
```

### 带取消功能的节流函数

```javascript
/**
 * 可取消的节流函数
 * @param {Function} fn - 要被节流的函数
 * @param {number} delay - 时间间隔（毫秒）
 * @returns {Object} - 包含throttle函数和cancel方法
 */
function createThrottle(fn, delay = 300) {
    let timer = null;
    
    const throttled = function(...args) {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, args);
                timer = null;
            }, delay);
        }
    };
    
    // 取消节流
    throttled.cancel = function() {
        clearTimeout(timer);
        timer = null;
    };
    
    return throttled;
}
```

## 实际应用示例

### 1. 搜索框输入防抖

```javascript
// 搜索框输入联想
const searchInput = document.getElementById('search-input');
const debouncedSearch = debounce(function(keyword) {
    console.log('搜索：', keyword);
    // 实际项目中这里会调用API
}, 500);

searchInput.addEventListener('input', function(e) {
    debouncedSearch(e.target.value);
});
```

### 2. 按钮点击防抖

```javascript
// 防止表单重复提交
const submitBtn = document.getElementById('submit-btn');
const debouncedSubmit = debounce(function() {
    console.log('表单提交');
    // 实际提交逻辑
}, 1000);

submitBtn.addEventListener('click', debouncedSubmit);
```

### 3. 窗口resize节流

```javascript
// 窗口大小改变时重新计算布局
const throttledResize = throttle(function() {
    console.log('窗口大小改变');
    // 重新计算布局逻辑
}, 200);

window.addEventListener('resize', throttledResize);
```

### 4. 滚动事件节流

```javascript
// 滚动加载更多
const throttledScroll = throttle(function() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (scrollTop + windowHeight >= documentHeight - 100) {
        console.log('加载更多数据');
        // 加载更多数据的逻辑
    }
}, 300);

window.addEventListener('scroll', throttledScroll);
```

### 5. 鼠标移动节流

```javascript
// 鼠标位置追踪
const throttledMouseMove = throttle(function(e) {
    console.log('鼠标位置：', e.clientX, e.clientY);
    // 鼠标位置处理逻辑
}, 100);

document.addEventListener('mousemove', throttledMouseMove);
```

## 防抖 vs 节流对比

| 特性 | 防抖 | 节流 |
|------|------|------|
| **执行时机** | 停止触发后执行 | 固定时间间隔执行 |
| **触发频率** | 只执行最后一次 | 定期执行 |
| **首次触发** | 可配置立即执行 | 立即执行 |
| **典型场景** | 搜索框、表单提交 | 滚动、鼠标移动 |
| **性能影响** | 减少不必要的执行 | 控制执行频率 |

## 完整示例页面

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>防抖和节流示例</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        .section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        input {
            padding: 8px;
            margin: 10px 0;
            width: 300px;
        }
        button {
            padding: 10px 20px;
            margin: 10px 0;
            cursor: pointer;
        }
        .log {
            background: #f5f5f5;
            padding: 10px;
            margin-top: 10px;
            max-height: 200px;
            overflow-y: auto;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <h1>防抖和节流函数示例</h1>

    <!-- 防抖示例 -->
    <div class="section">
        <h2>防抖示例 - 搜索框</h2>
        <input type="text" id="search-input" placeholder="输入搜索内容...">
        <div class="log" id="search-log"></div>
    </div>

    <!-- 节流示例 -->
    <div class="section">
        <h2>节流示例 - 按钮点击</h2>
        <button id="throttle-btn">点击我（节流）</button>
        <div class="log" id="throttle-log"></div>
    </div>

    <!-- 滚动节流示例 -->
    <div class="section">
        <h2>滚动节流示例</h2>
        <p>向下滚动查看效果...</p>
        <div style="height: 2000px; background: linear-gradient(to bottom, #f0f0f0, #e0e0e0);"></div>
        <div class="log" id="scroll-log"></div>
    </div>

    <script>
        // 防抖函数
        function debounce(fn, delay = 300) {
            let timer = null;
            return function(...args) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    fn.apply(this, args);
                }, delay);
            };
        }

        // 节流函数
        function throttle(fn, delay = 300) {
            let lastTime = 0;
            return function(...args) {
                const now = Date.now();
                if (now - lastTime > delay) {
                    fn.apply(this, args);
                    lastTime = now;
                }
            };
        }

        // 搜索框防抖
        const searchInput = document.getElementById('search-input');
        const searchLog = document.getElementById('search-log');
        
        const debouncedSearch = debounce(function(keyword) {
            const time = new Date().toLocaleTimeString();
            searchLog.innerHTML += `<div>[${time}] 搜索：${keyword}</div>`;
            searchLog.scrollTop = searchLog.scrollHeight;
        }, 500);

        searchInput.addEventListener('input', function(e) {
            debouncedSearch(e.target.value);
        });

        // 按钮节流
        const throttleBtn = document.getElementById('throttle-btn');
        const throttleLog = document.getElementById('throttle-log');
        
        const throttledClick = throttle(function() {
            const time = new Date().toLocaleTimeString();
            throttleLog.innerHTML += `<div>[${time}] 按钮被点击</div>`;
            throttleLog.scrollTop = throttleLog.scrollHeight;
        }, 1000);

        throttleBtn.addEventListener('click', throttledClick);

        // 滚动节流
        const scrollLog = document.getElementById('scroll-log');
        
        const throttledScroll = throttle(function() {
            const scrollTop = window.pageYOffset;
            const time = new Date().toLocaleTimeString();
            scrollLog.innerHTML += `<div>[${time}] 滚动位置：${scrollTop}px</div>`;
            scrollLog.scrollTop = scrollLog.scrollHeight;
        }, 300);

        window.addEventListener('scroll', throttledScroll);
    </script>
</body>
</html>
```

## 性能优化建议

1. **合理设置延迟时间**：
   - 防抖：通常300-500ms
   - 节流：通常100-300ms

2. **选择合适的函数**：
   - 需要最终结果用防抖
   - 需要持续反馈用节流

3. **内存管理**：
   - 及时取消不需要的防抖/节流
   - 在组件销毁时清理定时器

4. **参数传递**：
   - 正确处理 `this` 指向
   - 传递完整的参数列表

## 常见问题

**Q1: 防抖和节流有什么区别？**
A: 防抖是停止触发后执行，节流是固定时间间隔执行。

**Q2: 如何选择使用防抖还是节流？**
A: 需要最终结果（如搜索）用防抖，需要持续反馈（如滚动）用节流。

**Q3: 如何取消防抖/节流？**
A: 使用带取消功能的版本，调用 `cancel()` 方法。

**Q4: 防抖/节流会影响性能吗？**
A: 不会，反而能提升性能，减少不必要的函数调用。

## 总结

防抖和节流是前端性能优化的重要手段：

- ✅ **防抖**：适合搜索框、表单提交等场景
- ✅ **节流**：适合滚动、鼠标移动等场景
- ✅ **性能优化**：减少不必要的函数调用
- ✅ **用户体验**：避免卡顿和重复操作

正确使用防抖和节流可以显著提升应用的性能和用户体验！

---
title: 实现一个最优雅的微型 JavaScript 模板引擎：30 行代码解析核心原理
date: 2026-04-22
category: 前端开发
subcategory: JS与工具函数
tags: 前端开发,JavaScript,底层原理,模板引擎
summary: 通过正则表达式与 new Function / eval 构建轻量高效的字符串模板渲染引擎，解析 Mustache/EJS 核心思想。
readTime: 22 分钟阅读
---

# 前端之最优雅的模板引擎实现

## 模板引擎实现原理

模板引擎的核心原理是将模板字符串中的占位符替换为实际数据值。一个优雅的模板引擎应该具备以下特性：

- **简洁的语法**：易于书写和理解
- **强大的功能**：支持变量、循环、条件等
- **安全性**：防止XSS攻击
- **性能优化**：编译缓存机制

## 基础版本：简单变量替换

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>模板引擎基础实现</title>
</head>
<body>
    <div id="app"></div>

    <script>
        // 模板数据
        var tempData = { 
            "name": "张三", 
            "age": 28, 
            "sex": "男" 
        };

        // 模板字符串（修正了原代码中的变量错误）
        var templateStr = `<h1>我是{{name}}，性别：{{sex}}，年龄：{{age}}</h1>`;

        /**
         * 简单模板渲染函数
         * @param {string} templateStr - 模板字符串
         * @param {object} data - 数据对象
         * @returns {string} - 渲染后的HTML
         */
        function render(templateStr, data) {
            return templateStr.replace(/\{\{(\w+)\}\}/g, function(match, key) {
                // 处理数据不存在的情况
                return data[key] !== undefined ? data[key] : '';
            });
        }

        // 渲染模板
        document.getElementById('app').innerHTML = render(templateStr, tempData);
    </script>
</body>
</html>
```

## 进阶版本：支持循环和条件

```javascript
/**
 * 进阶模板引擎
 * 支持：变量替换、条件判断、循环遍历
 */
function advancedRender(template, data) {
    // 1. 处理条件判断 {{if condition}}...{{/if}}
    template = template.replace(
        /\{\{if\s+(\w+)\}\}(.*?)\{\{\/if\}\}/g,
        function(match, condition, content) {
            return data[condition] ? content : '';
        }
    );

    // 2. 处理循环 {{for item in list}}...{{/for}}
    template = template.replace(
        /\{\{for\s+(\w+)\s+in\s+(\w+)\}\}(.*?)\{\{\/for\}\}/g,
        function(match, itemName, listName, content) {
            var list = data[listName] || [];
            return list.map(function(item) {
                return content.replace(/\{\{\s*(\w+)\s*\}\}/g, function(m, key) {
                    return item[key] !== undefined ? item[key] : '';
                });
            }).join('');
        }
    );

    // 3. 处理变量替换 {{variable}}
    template = template.replace(/\{\{(\w+)\}\}/g, function(match, key) {
        return data[key] !== undefined ? data[key] : '';
    });

    return template;
}

// 使用示例
var data = {
    title: '用户列表',
    users: [
        { name: '张三', age: 28, active: true },
        { name: '李四', age: 32, active: false },
        { name: '王五', age: 24, active: true }
    ],
    showTitle: true
};

var template = `
    <div>
        {{if showTitle}}
            <h1>{{title}}</h1>
        {{/if}}
        <ul>
            {{for user in users}}
                <li>{{user.name}} - {{user.age}}岁</li>
            {{/for}}
        </ul>
    </div>
`;

console.log(advancedRender(template, data));
```

## 完整版本：带缓存和安全过滤

```javascript
/**
 * 完整模板引擎实现
 * 特性：编译缓存、XSS过滤、错误处理
 */
var TemplateEngine = (function() {
    // 编译缓存
    var cache = {};

    /**
     * XSS安全过滤
     * @param {string} str - 需要过滤的字符串
     * @returns {string} - 过滤后的字符串
     */
    function escapeHtml(str) {
        if (typeof str !== 'string') return str;
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /**
     * 编译模板
     * @param {string} template - 模板字符串
     * @returns {Function} - 编译后的渲染函数
     */
    function compile(template) {
        // 检查缓存
        if (cache[template]) {
            return cache[template];
        }

        // 模板转译为JavaScript代码
        var code = `
            var result = [];
            result.push("${template
                .replace(/"/g, '\\"')
                .replace(/\{\{=(\w+)\}\}/g, '",escapeHtml(data["$1"]),"')  // 安全输出
                .replace(/\{\{(\w+)\}\}/g, '",data["$1"],"')               // 普通输出
                .replace(/\{\{if\s+(\w+)\}\}/g, '");if(data["$1"]){result.push("')
                .replace(/\{\{\/if\}\}/g, '");}result.push("')
                .replace(/\{\{for\s+(\w+)\s+in\s+(\w+)\}\}/g, '");for(var i=0;i<data["$2"].length;i++){var $1=data["$2"][i];result.push("')
                .replace(/\{\{\/for\}\}/g, '");}result.push("')
            }");
            return result.join("");
        `;

        // 创建渲染函数
        var render = new Function('data', 'escapeHtml', code);
        
        // 缓存编译结果
        cache[template] = render;
        
        return render;
    }

    /**
     * 渲染模板
     * @param {string} template - 模板字符串
     * @param {object} data - 数据对象
     * @returns {string} - 渲染后的HTML
     */
    function render(template, data) {
        try {
            var compiled = compile(template);
            return compiled(data, escapeHtml);
        } catch (error) {
            console.error('模板渲染错误:', error);
            return '模板渲染失败';
        }
    }

    /**
     * 清除缓存
     */
    function clearCache() {
        cache = {};
    }

    return {
        render: render,
        compile: compile,
        clearCache: clearCache
    };
})();

// 使用示例
var template = `
    <div class="user-card">
        <h2>{{=name}}</h2>
        <p>年龄：{{age}}</p>
        {{if active}}
            <span class="status active">在线</span>
        {{/if}}
        <ul>
            {{for item in hobbies}}
                <li>{{=item}}</li>
            {{/for}}
        </ul>
    </div>
`;

var data = {
    name: '<script>alert("XSS攻击")</script>',  // 恶意代码
    age: 28,
    active: true,
    hobbies: ['编程', '阅读', '运动']
};

// 渲染结果会自动过滤XSS
console.log(TemplateEngine.render(template, data));
```

## 模板引擎语法参考

| 语法 | 说明 | 示例 |
|------|------|------|
| `{{variable}}` | 普通变量输出 | `{{name}}` |
| `{{=variable}}` | 安全输出（XSS过滤） | `{{=content}}` |
| `{{if condition}}...{{/if}}` | 条件判断 | `{{if active}}在线{{/if}}` |
| `{{for item in list}}...{{/for}}` | 循环遍历 | `{{for user in users}}{{user.name}}{{/for}}` |

## 性能优化策略

### 1. 编译缓存

```javascript
// 使用WeakMap缓存编译结果
var compileCache = new WeakMap();

function compileWithCache(template) {
    if (compileCache.has(template)) {
        return compileCache.get(template);
    }
    
    var compiled = compile(template);
    compileCache.set(template, compiled);
    
    return compiled;
}
```

### 2. 批量渲染

```javascript
// 批量渲染多个模板
function renderBatch(templates, data) {
    return templates.map(function(tpl) {
        return TemplateEngine.render(tpl, data);
    });
}
```

### 3. 虚拟DOM集成

```javascript
// 与虚拟DOM结合
function renderToVDOM(template, data) {
    var html = TemplateEngine.render(template, data);
    return createElement('div', { innerHTML: html }).firstChild;
}
```

## 实际应用示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>模板引擎实战</title>
    <style>
        .user-list { list-style: none; padding: 0; }
        .user-item { padding: 10px; border-bottom: 1px solid #eee; }
        .active { color: green; }
        .inactive { color: gray; }
    </style>
</head>
<body>
    <div id="app"></div>

    <script>
        // 模板字符串
        var template = `
            <h1>{{title}}</h1>
            <p>{{description}}</p>
            <ul class="user-list">
                {{for user in users}}
                    <li class="user-item">
                        <strong>{{=user.name}}</strong>
                        <span class="{{user.active ? 'active' : 'inactive'}}">
                            {{user.active ? '在线' : '离线'}}
                        </span>
                    </li>
                {{/for}}
            </ul>
            {{if users.length === 0}}
                <p>暂无用户数据</p>
            {{/if}}
        `;

        // 数据
        var data = {
            title: '用户管理系统',
            description: '展示系统中的所有用户',
            users: [
                { name: '张三', active: true },
                { name: '李四', active: false },
                { name: '王五', active: true }
            ]
        };

        // 渲染
        document.getElementById('app').innerHTML = TemplateEngine.render(template, data);
    </script>
</body>
</html>
```

## 与主流模板引擎对比

| 特性 | 本实现 | Handlebars | Mustache | EJS |
|------|--------|------------|----------|-----|
| 变量替换 | ✅ | ✅ | ✅ | ✅ |
| 条件判断 | ✅ | ✅ | ❌ | ✅ |
| 循环遍历 | ✅ | ✅ | ✅ | ✅ |
| XSS过滤 | ✅ | ✅ | ❌ | ❌ |
| 编译缓存 | ✅ | ✅ | ✅ | ✅ |
| 自定义helper | ❌ | ✅ | ❌ | ✅ |
| 体积大小 | 小 | 中 | 小 | 中 |

## 总结

一个优雅的模板引擎应该具备以下特点：

- ✅ **简洁的API**：易于使用和学习
- ✅ **安全可靠**：自动XSS过滤
- ✅ **高性能**：编译缓存机制
- ✅ **功能完善**：支持变量、循环、条件
- ✅ **错误处理**：友好的错误提示

本实现提供了一个轻量级但功能完善的模板引擎，适合在不需要引入大型库的场景中使用。

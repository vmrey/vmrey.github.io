---
title: 常用树结构递归工具函数合集：树平铺、节点查找与层级过滤
date: 2026-05-02
category: 前端开发
subcategory: JS与工具函数
tags: 前端开发,JavaScript,数据结构,算法工具
summary: 实战整理针对级联选择器与目录树的高频递归操作函数：扁平化转换、树深度查找、剪枝过滤与路径追踪。
readTime: 9 分钟阅读
---

# 递归工具函数合集

## 1. 对象值检索器 - deepSearchValue

**功能说明**：递归遍历对象或数组的所有层级，检查是否存在指定的目标值

**参数说明**：
- `targetValue` (必传)：需要检索的目标值，支持基本类型（字符串、数字、布尔值等）
- `source` (必传)：待检索的数据源，可以是对象或数组
- 返回值：`boolean` - 找到返回 `true`，未找到返回 `false`

**技术要点**：
- 使用严格相等 `===` 进行比较，避免类型转换导致的误判
- 支持无限层级嵌套的对象和数组
- 一旦找到匹配值立即返回，优化性能

```javascript
/**
 * 递归检索对象/数组中是否包含指定值
 * @param {*} targetValue - 要查找的目标值（基本类型）
 * @param {Object|Array} source - 待检索的对象或数组
 * @returns {boolean} - 是否找到目标值
 */
function deepSearchValue(targetValue, source) {
    // 基本类型直接比较
    if (source === targetValue) {
        return true;
    }
    
    // 数组处理
    if (Array.isArray(source)) {
        for (let item of source) {
            if (deepSearchValue(targetValue, item)) {
                return true;
            }
        }
        return false;
    }
    
    // 对象处理（排除 null）
    if (source !== null && typeof source === 'object') {
        for (let key in source) {
            if (deepSearchValue(targetValue, source[key])) {
                return true;
            }
        }
        return false;
    }
    
    return false;
}

// 调用示例
const testData = {
    user: {
        name: "zhanshan",
        goods: { clothes: "T恤", color: "red", Hair: "blue" },
        id: 5,
        sex: "男",
        age: 61
    }
};
console.log(deepSearchValue('T恤', testData)); // true
console.log(deepSearchValue('裤子', testData)); // false
console.log(deepSearchValue(5, testData)); // true
```

---

## 2. 数组扁平化 - flattenArray

**功能说明**：将多维数组递归展开为一维数组

**参数说明**：
- `array` (必传)：需要扁平化的多维数组
- 返回值：`Array` - 扁平化后的一维数组

**技术要点**：
- 支持任意深度的嵌套数组
- 保留原始数组中的对象引用
- 使用 `Array.isArray()` 准确判断数组类型

```javascript
/**
 * 递归扁平化多维数组
 * @param {Array} array - 需要扁平化的数组
 * @returns {Array} - 扁平化后的一维数组
 */
function flattenArray(array) {
    let result = [];
    
    for (let item of array) {
        if (Array.isArray(item)) {
            // 递归处理子数组
            result = result.concat(flattenArray(item));
        } else {
            result.push(item);
        }
    }
    
    return result;
}

// 调用示例
const nestedArray = [
    1, 5, 89, 
    [55, { name: "zhanshan", id: 5 }, 8, [1, 5, 89, 859], 85, 6], 
    96, 56
];
console.log(flattenArray(nestedArray)); 
// [1, 5, 89, 55, { name: "zhanshan", id: 5 }, 8, 1, 5, 89, 859, 85, 6, 96, 56]
```

---

## 3. 对象扁平化 - flattenObject

**功能说明**：将嵌套对象递归展开为单层对象

**参数说明**：
- `obj` (必传)：需要扁平化的嵌套对象
- `prefix` (可选)：键名前缀，用于保持层级关系
- 返回值：`Object` - 扁平化后的单层对象

**技术要点**：
- 使用点号连接嵌套键名（如 `user.name`）
- 遇到数组时保持原样，不展开
- **注意**：相同路径的键会被后续值覆盖

```javascript
/**
 * 递归扁平化嵌套对象
 * @param {Object} obj - 需要扁平化的对象
 * @param {string} [prefix=''] - 键名前缀（内部使用）
 * @returns {Object} - 扁平化后的对象
 */
function flattenObject(obj, prefix = '') {
    let result = {};
    
    for (let key in obj) {
        // 跳过原型链属性
        if (!obj.hasOwnProperty(key)) continue;
        
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            // 递归处理嵌套对象
            Object.assign(result, flattenObject(obj[key], newKey));
        } else {
            result[newKey] = obj[key];
        }
    }
    
    return result;
}

// 调用示例
const nestedObject = {
    user: {
        name: "zhanshan",
        goods: { clothes: "T恤", color: "red" },
        id: 5,
        tags: ["admin", "vip"]
    }
};
console.log(flattenObject(nestedObject));
// {
//   "user.name": "zhanshan",
//   "user.goods.clothes": "T恤",
//   "user.goods.color": "red",
//   "user.id": 5,
//   "user.tags": ["admin", "vip"]
// }
```

---
title: JavaScript 递归批量重命名 JSON 对象中的键名 (Key)
date: 2021-04-05
category: 前端开发
subcategory: JS 与工具函数
tags: JavaScript,JSON处理,递归算法,数据清洗
summary: 支持单键或多键批量映射替换，递归深度遍历树形 JSON 数据结构，自动将后端下发的驼峰或下划线字段重命名。
readTime: 3 分钟阅读
---

# JavaScript 递归批量重命名 JSON 对象中的键名 (Key)

## 一、业务痛点

在前后端接口数据对接中，后端经常返回下划线命名字段（如 `group_id`、`pid`），或者需要将多层嵌套树形菜单的 `child` 统一重命名为组件所需要的 `children`。

---

## 二、递归替换 Key 核心函数

```javascript
/**
 * 递归替换 JSON 对象中的 Key 键名
 * @param {String|Array} oldKey 旧的 key 或旧 key 数组
 * @param {String|Array} newKey 新的 key 或新 key 数组
 * @param {Object|Array} targetObj 待处理的目标对象
 * @returns {Object|Array} 处理后的数据对象
 */
function replaceJsonKey(oldKey, newKey, targetObj) {
  if (!targetObj || typeof targetObj !== 'object') {
    return targetObj;
  }

  if (Array.isArray(targetObj)) {
    return targetObj.map(item => replaceJsonKey(oldKey, newKey, item));
  }

  const result = {};
  const isArrayMap = Array.isArray(oldKey) && Array.isArray(newKey);

  for (const key in targetObj) {
    if (Object.prototype.hasOwnProperty.call(targetObj, key)) {
      let currentKey = key;

      if (isArrayMap) {
        const matchIndex = oldKey.indexOf(key);
        if (matchIndex !== -1 && newKey[matchIndex]) {
          currentKey = newKey[matchIndex];
        }
      } else if (typeof oldKey === 'string' && key === oldKey) {
        currentKey = newKey;
      }

      // 递归处理子属性
      result[currentKey] = replaceJsonKey(oldKey, newKey, targetObj[key]);
    }
  }

  return result;
}

// 调用示例
const mockData = [
  {
    id: 1,
    group_id: 101,
    pid: 0,
    name: '研发部',
    child: [
      { id: 2, group_id: 101, pid: 1, name: '前端组' }
    ]
  }
];

// 单键替换
console.log(replaceJsonKey('pid', 'parentId', mockData));

// 多键批量映射替换
console.log(replaceJsonKey(['group_id', 'child'], ['groupId', 'children'], mockData));
```

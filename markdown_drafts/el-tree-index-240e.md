---
title: Element UI 中 el-tree 树形结构生成唯一索引与父级回溯
date: 2021-04-10
category: 前端开发
subcategory: Vue 与组件
tags: Vue,ElementUI,el-tree,递归算法
summary: 通过递归遍历为 Element UI 的 el-tree 节点动态生成带层级深度的唯一全局索引，并支持通过子索引快速回溯父级链条。
readTime: 4 分钟阅读
---

# Element UI 中 el-tree 树形结构生成唯一索引与父级回溯

## 一、业务场景与需求

在开发 Element UI 复杂的 `el-tree` 树形菜单或权限配置时，常常需要：
1. 依据节点层级深度动态生成全局唯一的索引路径（如 `0-1-2`）；
2. 用户选中某一子节点时，能够快速逆向回溯提取其所有上级父节点链条。

---

## 二、递归生成唯一索引算法

```javascript
/**
 * 递归为树形数据生成带有层级路径的唯一索引 (如 0, 0-0, 0-1-0)
 * @param {Array} treeData 树形节点数组
 * @param {String} parentIndex 父级索引前缀
 */
function generateTreeUniqueIndex(treeData, parentIndex = '') {
  return treeData.map((node, index) => {
    const currentIndex = parentIndex === '' ? `${index}` : `${parentIndex}-${index}`;
    const newNode = {
      ...node,
      uniqueIndex: currentIndex
    };

    if (node.children && Array.isArray(node.children) && node.children.length > 0) {
      newNode.children = generateTreeUniqueIndex(node.children, currentIndex);
    }
    return newNode;
  });
}
```

---

## 三、根据索引值回溯父级节点链

```javascript
/**
 * 通过子节点的 uniqueIndex 回溯其所属的所有上层索引列表
 * @param {String} uniqueIndex 节点索引（如 '0-1-2'）
 * @returns {Array} 父级索引数组（如 ['0', '0-1', '0-1-2']）
 */
function backtrackParentIndexes(uniqueIndex) {
  const parts = uniqueIndex.split('-');
  const parentIndexes = [];
  let current = '';

  for (let i = 0; i < parts.length; i++) {
    current = i === 0 ? parts[i] : `${current}-${parts[i]}`;
    parentIndexes.push(current);
  }

  return parentIndexes;
}

// 调用示例
console.log(backtrackParentIndexes('0-1-2')); 
// 输出: ['0', '0-1', '0-1-2']
```

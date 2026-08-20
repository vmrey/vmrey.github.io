---
title: 若依管理系统导航报错 reading 'nextSibling' 根因分析与解决方案
date: 2026-05-20
category: 前端开发
subcategory: Vue与组件
tags: 前端开发,Vue,Bug排查,若依
summary: 剖析 Vue-Router 与 Element-UI 侧边栏菜单在动态路由加载时 nextSibling 为空的偶发报错原因与补丁方案。
readTime: 3 分钟阅读
---

### 若依vue3 报错 reading 'nextSibling'
### RuoYi点击菜单出现空白页面，无报错

前端使用若依框架(vue3版本)，在开发过程中有时会出现切换菜单或者tab，页面空白的情况，刷新页面后又恢复正常。出现这种情况一般是在页面停留了几分钟再操作或者短时间多次跳转，偶尔也会莫名奇妙的出现，

### 修改路径 
```html
src/layout/components/AppMain.vue
```

#### 原本代码
```html
<keep-alive :include="tagsViewStore.cachedViews">
  <component v-if="!route.meta.link" :is="Component" :key="route.path"/>
</keep-alive>
```

#### 修改后的代码
```html
<transition name="fade-transform" mode="out-in">
  <div :key="route.path">
    <keep-alive :include="tagsViewStore.cachedViews">
      <component v-if="!route.meta.link" :is="Component" :key="route.path"/>
    </keep-alive>
  </div>
</transition>
```

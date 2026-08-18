---
title: 微信小程序将异步 API 封装为 Promise 同步调用（async/await）实战
date: 2026-03-25
category: 前端开发
subcategory: 微信小程序
tags: 前端开发,微信小程序,JavaScript,Promise
summary: 利用 Promisify 模式批量将 wx.request、wx.showModal 等回调式 API 转为标准的 async/await 同步写法。
readTime: 20 分钟阅读
---

# 微信小程序将异步 API 改成同步处理方法

在微信小程序开发中，异步 API 是常态，但有时我们需要同步的代码风格来处理业务逻辑。本文介绍几种常用的异步转同步方案。

### 方案一：Promise 封装 + async/await（推荐）

```javascript
Page({
  data: {
    userInfo: null,
    token: ''
  },

  onLoad() {
    this.initUserInfo();
  },

  /**
   * 统一封装 wx.request 为 Promise
   * @param {Object} options - 请求配置
   * @returns {Promise}
   */
  request(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        success: (res) => {
          // 统一处理业务错误
          if (res.data && res.data.code !== 0) {
            reject(new Error(res.data.message || '请求失败'));
          } else {
            resolve(res.data);
          }
        },
        fail: (err) => {
          reject(new Error(err.errMsg || '网络请求失败'));
        }
      });
    });
  },

  /**
   * 封装 wx.login 为 Promise
   * @returns {Promise<string>} - 返回 code
   */
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            resolve(res.code);
          } else {
            reject(new Error('登录失败'));
          }
        },
        fail: (err) => {
          reject(new Error(err.errMsg || '登录失败'));
        }
      });
    });
  },

  /**
   * 同步风格的用户信息初始化
   */
  async initUserInfo() {
    try {
      // 1. 获取账号信息
      const accountInfo = wx.getAccountInfoSync();
      const appId = accountInfo.miniProgram.appId;
      
      // 2. 登录获取 code
      const code = await this.login();
      console.log('获取 code 成功:', code);
      
      // 3. 登录请求
      const loginResult = await this.request({
        url: 'https://api.example.com/login',
        method: 'POST',
        data: {
          js_code: code,
          appid: appId
        }
      });
      console.log('登录成功:', loginResult);
      
      // 4. 获取用户信息
      const userInfoResult = await this.request({
        url: 'https://api.example.com/user/info',
        method: 'POST',
        data: {
          openId: loginResult.openId,
          sessionKey: loginResult.sessionKey
        }
      });
      console.log('获取用户信息成功:', userInfoResult);
      
      // 5. 更新页面数据
      this.setData({
        userInfo: userInfoResult,
        token: loginResult.token
      });
      
    } catch (error) {
      console.error('初始化用户信息失败:', error.message);
      // 可以在这里添加错误处理，如显示错误提示
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      });
    }
  }
});
```

---

## ✨ 进阶方案：统一 API 管理

### 创建统一的 API 管理文件

```javascript
// utils/api.js
class ApiService {
  constructor() {
    this.baseUrl = 'https://api.example.com';
    this.token = '';
  }

  /**
   * 设置 token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * 请求拦截器
   */
  async request(options) {
    // 添加公共参数
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };

    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseUrl + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        headers,
        success: (res) => {
          if (res.statusCode === 200) {
            if (res.data.code === 0) {
              resolve(res.data.data);
            } else if (res.data.code === 401) {
              // token 失效，重新登录
              reject(new Error('登录已过期，请重新登录'));
            } else {
              reject(new Error(res.data.message || '请求失败'));
            }
          } else {
            reject(new Error(`HTTP 错误: ${res.statusCode}`));
          }
        },
        fail: (err) => {
          reject(new Error(err.errMsg || '网络请求失败'));
        }
      });
    });
  }

  /**
   * 登录接口
   */
  async login(code, appId) {
    return await this.request({
      url: '/login',
      method: 'POST',
      data: { js_code: code, appid: appId }
    });
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(openId) {
    return await this.request({
      url: '/user/info',
      method: 'POST',
      data: { openId }
    });
  }

  /**
   * 获取商品列表
   */
  async getGoodsList(params) {
    return await this.request({
      url: '/goods/list',
      method: 'GET',
      data: params
    });
  }
}

// 导出单例
export default new ApiService();
```

### 在页面中使用

```javascript
// pages/index/index.js
import api from '../../utils/api.js';

Page({
  data: {
    goods: []
  },

  async onLoad() {
    await this.init();
  },

  async init() {
    try {
      // 1. 登录
      const code = await this.getLoginCode();
      const loginResult = await api.login(code, 'your-app-id');
      
      // 2. 设置 token
      api.setToken(loginResult.token);
      
      // 3. 获取数据
      const goods = await api.getGoodsList({ page: 1, size: 10 });
      
      // 4. 更新视图
      this.setData({ goods });
      
    } catch (error) {
      console.error('初始化失败:', error.message);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  getLoginCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => resolve(res.code),
        fail: (err) => reject(err)
      });
    });
  }
});
```

---

## 🛠️ 常用异步 API Promise 封装

```javascript
// utils/promise.js
const promisify = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn({
        ...args[0],
        success: resolve,
        fail: reject
      });
    });
  };
};

// 封装常用 API
export const login = promisify(wx.login);
export const getUserInfo = promisify(wx.getUserInfo);
export const request = promisify(wx.request);
export const showToast = promisify(wx.showToast);
export const showLoading = promisify(wx.showLoading);
export const hideLoading = promisify(wx.hideLoading);
export const navigateTo = promisify(wx.navigateTo);
export const switchTab = promisify(wx.switchTab);
```

### 使用示例

```javascript
import { login, request, showLoading, hideLoading } from '../../utils/promise.js';

async function fetchData() {
  try {
    await showLoading({ title: '加载中...' });
    
    const { code } = await login();
    const result = await request({
      url: 'https://api.example.com/data',
      method: 'POST',
      data: { code }
    });
    
    await hideLoading();
    return result;
    
  } catch (error) {
    await hideLoading();
    throw error;
  }
}
```

---

## 📊 方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **基础 Promise 封装** | 简单直观 | 代码重复 | 小型项目、快速开发 |
| **统一 API 管理** | 易于维护、统一处理 | 需要额外配置 | 中大型项目 |
| **promisify 工具函数** | 通用、简洁 | 缺少个性化处理 | 需要频繁封装多个 API |

---

## ⚠️ 注意事项

### 1. 错误处理必须要有

```javascript
// 错误做法 ❌
async function badExample() {
  const data = await api.request(); // 如果失败会直接抛出异常
  console.log(data);
}

// 正确做法 ✅
async function goodExample() {
  try {
    const data = await api.request();
    console.log(data);
  } catch (error) {
    console.error('请求失败:', error);
    // 显示错误提示
    wx.showToast({ title: '请求失败', icon: 'none' });
  }
}
```

### 2. await 必须在 async 函数中使用

```javascript
// 错误 ❌
Page({
  onLoad() {
    await this.fetchData(); // 错误：onLoad 不是 async 函数
  }
});

// 正确 ✅
Page({
  async onLoad() {
    await this.fetchData();
  },
  
  async fetchData() {
    // ...
  }
});
```

### 3. 不要滥用同步写法

```javascript
// 不推荐 ❌ - 串行请求，性能差
async function badRequest() {
  const a = await api.get('/a');
  const b = await api.get('/b');
  const c = await api.get('/c');
}

// 推荐 ✅ - 并行请求，性能更好
async function goodRequest() {
  const [a, b, c] = await Promise.all([
    api.get('/a'),
    api.get('/b'),
    api.get('/c')
  ]);
}
```

### 4. 小程序兼容性

| 特性 | 支持版本 | 说明 |
|------|---------|------|
| async/await | 基础库 2.10.2+ | 需要在开发者工具中开启 ES6 转 ES5 |
| Promise.all | 基础库 1.5.0+ | 支持 |
| Promise.race | 基础库 1.5.0+ | 支持 |

---

## 📝 总结

异步转同步的核心是 **Promise + async/await**：

1. **封装**：将 wx API 封装为 Promise
2. **调用**：使用 async/await 实现同步风格
3. **处理**：使用 try-catch 捕获错误
4. **优化**：合理使用 Promise.all 提升性能

这种方式既保持了异步的性能优势，又拥有同步代码的可读性。

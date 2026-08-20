---
title: 微信小程序新手专属优惠券领取弹框组件封装实战
date: 2021-01-15
category: 前端开发
subcategory: 微信小程序
tags: 微信小程序,组件封装,优惠券弹框,UI组件
summary: 封装高转化率的微信小程序优惠券弹框组件，支持防页面滚动穿透、动态金额展示与一键领取交互。
readTime: 4 分钟阅读
---

# 微信小程序新手专属优惠券领取弹框组件封装实战

## 一、组件设计特性

1. **防滚动穿透**：通过 `catchtouchmove="preventTouch"` 防止弹框唤起时底层页面意外滑动；
2. **响应式自适应**：使用 `rpx` 单位适配不同尺寸移动设备屏幕；
3. **动画进入**：遮罩层淡入与弹框缩放弹性进入。

---

## 二、WXML 模板代码

```html
<view class="coupon-mask" wx:if="{{visible}}" catchtouchmove="preventTouch">
  <view class="coupon-dialog">
    <image class="coupon-bg" src="../../assets/images/couponbg.png" mode="widthFix"></image>
    <view class="coupon-body">
      <view class="coupon-title">新人专属红包</view>
      <view class="coupon-amount">
        <text class="symbol">¥</text>
        <text class="num">{{couponData.amount || 50}}</text>
      </view>
      <button class="coupon-btn" bindtap="handleReceive">立即领取</button>
    </view>
    <view class="close-icon" bindtap="handleClose">✕</view>
  </view>
</view>
```

---

## 三、WXSS 样式核心

```css
.coupon-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coupon-dialog {
  width: 580rpx;
  position: relative;
  text-align: center;
}

.coupon-btn {
  background: linear-gradient(135deg, #ff5722, #ff9800);
  color: #fff;
  border-radius: 40rpx;
  font-weight: bold;
}
```

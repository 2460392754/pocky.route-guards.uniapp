# route-guards

<p align="center">
    <img alt="logo" src="https://github.com/2460392754/pocky.route-guards.uniapp/raw/master/static/logo.png" width="120" height="120" style="margin-bottom: 10px;">
</p>
<h3 align="center" style="margin: 30px 0 30px; font-weight: bold; font-size:40px; ">路由守卫</h3>
<h3 align="center">一个简单而又不失优雅的uniapp路由守卫</h3>

## 介绍

在 `uniapp` 中模拟并实现对应 `vue-router` 的部分 Api 的功能

## 平台差异说明

| App     | H5  | 微信小程序 | 支付宝小程序 | 百度小程序 | 头条小程序 | QQ 小程序 | 360 小程序 |
| ------- | --- | ---------- | ------------ | ---------- | ---------- | --------- | ---------- |
| Android | √   | √          | √            | √          | √          | √         | √          |

## 如何安装

您可以使用 Yarn 或 npm 安装该软件包（选择一个）

### yarn

```bash
yarn add uniapp-route-guards
```

### npm

```bash
npm install uniapp-route-guards --save
```

## 插件注册

```js
// main.js

import Vue from 'vue';
import UniRouteGuards from 'uniapp-route-guards';

Vue.use(UniRouteGuards);
```

## 全局前置守卫

```js
// main.js

const guard = new UniRouteGuards();

// 自定义路由拦截白名单
const WHILE_LIST = ['/src/pages/home', '/src/pages/log'];

// 跳过路由白名单拦截
guard.beforeEach((to, from, next) => {
    if (WHILE_LIST.includes(from.url)) {
        return next(to.url);
    }

    next();
});

// 拦截 调用 uni.switchTab 页面C并跳转到 页面D
guard.beforeEach((to, from, next) => {
    console.log('\n');
    console.log('=================');
    console.log('guard.beforeEach');
    console.log('to: ', to);
    console.log('from: ', from);
    console.log('=================');
    console.log('\n');

    if (to.action === 'switchTab' && to.url === '/src/pages/c') {
        return next({
            url: '/src/pages/d',
            action: 'navigateTo'
        });
    }

    next();
});
```

## 全局后置后卫

```js
guard.afterEach((to, from) => {
    console.log('\n');
    console.log('=================');
    console.log('guard.afterEach');
    console.log('to: ', to);
    console.log('from: ', from);
    console.log('=================');
    console.log('\n');
});
```

## 路由运行出时调用的守卫

```js
// 注册 路由守卫出现异常回调的钩子
guard.onError((errMsg) => {
    console.error('route-guards error: ' + errMsg);
});
```

## 如何跳转路由并触发注册的守卫

路由跳转的使用方法和 [ `uniapp` ](https://uniapp.dcloud.net.cn/api/router?id=navigateto) 路由跳转一样的

```js
// 例如
uni.navigateTo({
    url: '/pages/a'
});
uni.redirectTo({
    url: '/pages/a'
});
uni.reLaunch({
    url: '/pages/a'
});
uni.switchTab({
    url: '/pages/a'
});
uni.navigateBack();
```

## 取消对某个路由方法进行拦截

例如调用某个路由方法时并取消路由拦截

```js
uni.navigateTo(
    {
        url: '/pages/a',
        success() {
            console.log('is success');
        },
        fail() {
            console.error('is fail');
        }
    },
    false
);

// 或
uni.navigateBack(null, false);
```

## 解析运行流程

-   调用全局的 `beforeEach` 守卫
-   路由跳转
-   调用全局的 `afterEach` 守卫

## 暂时不支持的操作

1.在拦截器中访问 `vm`

```js
// 例如:
guard.beforeEach((to, from, next) => {
    next((vm) => {
        // 通过 `vm` 访问组件实例
    });
});
```

2.拦截原生的 `tabbar`

3.拦截原生的 `navBar` 的 `back`

## Api

### Event

| 参数名称   | 类型     | 默认值 | 是否必填 | 说明                                               |
| ---------- | -------- | ------ | -------- | -------------------------------------------------- |
| beforeEach | Function | -      | false    | 注册一个回调，在路由跳转之前运行                   |
| afterEach  | Function | -      | false    | 注册一个回调，在路由跳转之后运行                   |
| onError    | Function | -      | false    | 注册一个回调，该回调会在路由导航过程中出错时被调用 |

## 预览

<img src="https://github.com/2460392754/pocky.route-guards.uniapp/raw/master/static/qrcode.png" width="150">

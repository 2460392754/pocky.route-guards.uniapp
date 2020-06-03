# route-guards 路由守卫

## 介绍

在 `uniapp` 中模拟并实现对应`vue-router`的部分 Api 的功能

## 全局前置守卫

```js
// main.js

import UniGuard from './lib';

const guard = new UniGuard();

guard.beforeEach((to, from, next) => {
    console.log('========================');
    console.log('guard.beforeEach');
    console.log('to: ', to);
    console.log('from: ', from);

    if (to.url.includes('id=1')) {
        next({ url: '/pages/C' });

        // 或者也可以使用一下方法
        // next({
        //     url: '/pages/D',
        //     action: 'navigateTo'
        // });
        // next(false);
        // next(new Error("can`t redirect "));
    } else {
        next();
    }
});
```

## 全局后置后卫

```js
guard.afterEach((to, from) => {
    console.log('========================');
    console.log('guard.afterEach');
    console.log('to: ', to);
    console.log('from: ', from);
});
```

## 路由运行出时调用的守卫

```js
guard.onError((errMsg) => {
    console.log('my route-guards error: ' + errMsg);
});
```

## 如何跳转路由并触发注册的守卫

路由跳转的使用方法和 [`uniapp`](https://uniapp.dcloud.net.cn/api/router?id=navigateto) 路由跳转一样的

```js
// 例如
uni.navigateTo({ url: '/pages/a' });
uni.redirectTo({ url: '/pages/a' });
uni.reLaunch({ url: '/pages/a' });
uni.switchTab({ url: '/pages/a' });
uni.navigateBack();
```

## 解析运行流程

-   调用全局的`beforeEach`守卫
-   路由跳转
-   调用全局的`afterEach`守卫

## 注意

暂不支持如下操作：

```js
guard.beforeEach((to, from, next) => {
    next((vm) => {
        // 通过 `vm` 访问组件实例
    });
});
```

## Api

### Event

| 参数名称   | 类型     | 默认值 | 是否必填 | 说明                                               |
| ---------- | -------- | ------ | -------- | -------------------------------------------------- |
| beforeEach | Function | -      | false    | 注册一个回调，在路由跳转之前运行                   |
| afterEach  | Function | -      | false    | 注册一个回调，在路由跳转之后运行                   |
| onError    | Function | -      | false    | 注册一个回调，该回调会在路由导航过程中出错时被调用 |

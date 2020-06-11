import Vue from 'vue';
import UniRouteGuard from '@/src/lib';

Vue.use(UniRouteGuard);

const guard = new UniRouteGuard();

// 自定义路由拦截白名单
const WHILE_LIST = ['/src/pages/home', '/src/pages/log'];

// URL最近的query参数
let URL_QUERY = [];

// ==============================
// 前置钩子
// ==============================

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
        return handleNext(next, {
            url: '/src/pages/d',
            action: 'navigateTo'
        });
    }

    next();
});

// "最后的拦截"
// 拦截 调用 uni.navigateTo 方法跳转页面
guard.beforeEach((to, from, next) => {
    return handleNext(next, to);
});

// ==============================
// 后置钩子
// ==============================

// 重置数据
guard.afterEach((to, from) => {
    console.log('\n');
    console.log('=================');
    console.log('guard.afterEach');
    console.log('to: ', to);
    console.log('from: ', from);
    console.log('=================');
    console.log('\n');

    URL_QUERY = [];
});

// ==============================
// 异常钩子
// ==============================

// 注册 路由守卫出现异常回调的钩子
guard.onError((errMsg) => {
    console.error('route-guards error: ' + errMsg);
});

/**
 * 统一处理路由跳转
 * @param {Function} next 管道函数
 * @param {Object} opts
 * @param {string} opts.url 路由路径
 * @param {string} opts.action 路由方法
 */
function handleNext(next, opts) {
    if (opts.action === 'navigateTo') {
        URL_QUERY.push('back=1');
    }

    // 跳过 navigateTo 方法，并且判断url是否已添加了query
    if (typeof opts.url !== 'undefined' && opts.url.slice(-1) !== '?' && URL_QUERY.length !== 0) {
        opts.url += '?';
    }

    opts.url += URL_QUERY.join('&');

    next(opts);
}

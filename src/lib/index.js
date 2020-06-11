import { version } from '../../package.json';
import { install } from './install';
import { hackUniRoute } from './hackRoute';
import { handleGlobalHooksQueue } from './handleHooks';
import { print, registerHook } from './utils';

export default class uniRouteGuards {
    constructor() {
        // 打印当前插件版本号
        print('version: ' + version);

        // 初始化数据
        this.beforeHooks = [];
        this.afterHooks = [];
        this.errorCbs = [];
        hackUniRoute.call(this, handleGlobalHooksQueue);
    }

    /**
     * 注册 全局前置守卫
     * @param {Function} callback 回调函数
     */
    beforeEach(callback) {
        return registerHook(this.beforeHooks, callback);
    }

    /**
     * 注册 全局后置守卫
     * @param {Function} callback 回调函数
     */
    afterEach(callback) {
        return registerHook(this.afterHooks, callback);
    }

    /**
     * 注册 错误回调
     * @param {Function} errCb 错误回调函数
     */
    onError(errCb) {
        return registerHook(this.errorCbs, errCb);
    }
}

// 添加 Vue.use 功能
uniRouteGuards.install = install;

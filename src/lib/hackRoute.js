/**
 * hack uniapp的路由函数b
 * @param {Function} callback
 * @return {never}
 */
export const hackUniRoute = function (callback) {
    // 路由跳转的函数key值
    const UNI_ROUTE_ACTIONS = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab', 'navigateBack'];

    // 函数缓存容器
    const cacheFunc = {};

    // 保存原函数引用
    UNI_ROUTE_ACTIONS.forEach((key) => {
        cacheFunc[key] = uni[key];
    });

    // 重写方法
    UNI_ROUTE_ACTIONS.forEach((key) => {
        uni[key] = (opts, routeGuardsOpts) => {
            // 取消拦截并直接运行
            if (routeGuardsOpts === false) {
                cacheFunc[key](opts);
            } else {
                // 处理所有钩子
                const defaultOpts = { action: key };
                const newOpts = Object.assign(defaultOpts, opts);
                const actionFunc = function (customOpts) {
                    const lastOpts = Object.assign(newOpts, customOpts);

                    cacheFunc[lastOpts.action](lastOpts);
                };

                callback.call(this, newOpts, actionFunc);
            }
        };
    });
};

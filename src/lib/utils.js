/**
 * 控制台打印内容
 * @param {string} msg 内容
 * @param {string} action ['log'] 打印类型
 * @param {never}
 */
export const print = function (msg, action = 'log') {
    console[action]('[route-guards] ' + msg);
};

/**
 * 判断错误对象是否是由`Error`对象实例化出来的
 * @param {Error|Object} errObj
 * @return {boolean}
 */
export const isError = function (errObj) {
    return Object.prototype.toString.call(errObj).includes('Error');
};

/**
 * 获取并封装当前路由栈的信息
 * @return {Object}
 */
export const getCurStack = function () {
    const stackAll = getCurrentPages();
    const stackLen = stackAll.length;

    // 跳过路由栈为空的情况(App端)
    if (stackLen === 0) {
        return false;
    }

    const curStack = stackAll[stackLen - 1];
    const from = { url: '/' + curStack.route };

    return from;
};

/**
 * 注册 钩子
 * @param {Function[]} list 钩子列表
 * @param {Function} callback 回调函数
 * @returns {Function} 用于注销当前注册钩子的闭包函数
 */
export const registerHook = function (list, callback) {
    list.push(callback);

    return () => {
        const index = list.indexOf(callback);

        if (index !== -1) list.splice(index, 1);
    };
};

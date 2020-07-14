import { isError, getCurStack, print } from './utils';

/**
 * 处理 全局钩子队列
 * @param {Object} to
 * @param {Function} uniRunRoute 被hack的uniapp路由方法
 */
export const handleGlobalHooksQueue = function (to, uniRunRoute) {
    // 跳过 h5环境中, 调用系统的tabbar功能('tabbar')或系统的navbar上的返回功能('backbutton'), 会触发uni的路由方法
    if (['tabBar', 'backbutton'].includes(to.from)) return uniRunRoute();

    // 获取当前路由栈信息
    const from = getCurStack();

    // 跳过 app端 首次进入页面会调用uni路由方法, 导致获取当前路由栈(from)为空，所有直接运行，不进行拦截
    if (from === false) return uniRunRoute();

    iteratorHook(
        this.beforeHooks,
        handleNextPipe.bind(this),
        () => {
            uniRunRoute();
            handleAfterHook.call(this, to, from);
        },
        {
            to,
            from,
            uniRunRoute
        }
    );
};

/**
 * 处理 全局后置钩子
 * @param {Object} to
 * @param {Object} from
 */
const handleAfterHook = function (to, from) {
    this.afterHooks.forEach((hook) => {
        hook(to, from);
    });
};

/**
 * 处理 错误信息
 * @param {Object|string} err 错误信息、错误栈
 */
const handleAbort = function (err) {
    if (this.errorCbs.length > 0) {
        this.errorCbs.forEach((cb) => {
            cb(err);
        });
    } else {
        print('error:' + err, 'error');
    }
};

/**
 * 遍历并运行 钩子
 * @param {Function[]} hookQueue 钩子队列
 * @param {Function} everyCb 每次遍历都会运行的回调函数
 * @param {Function} endCb 队列运行结束后运行的回调函数
 * @param {Object} hookOpts 钩子运行需要的参数
 */
const iteratorHook = function (hookQueue, everyCb, endCb, hookOpts) {
    const step = (i) => {
        // 队列运行结束，运行回调函数
        if (i >= hookQueue.length) {
            endCb.call(this);
        } else {
            // 遍历运行钩子
            everyCb.call(this, hookQueue[i], hookOpts, (val) => {
                // 结束钩子遍历
                if (val === false) return;

                step(++i);
            });
        }
    };

    step(0);
};

/**
 * 处理 有next参数的钩子(前置钩子)
 * @param {Function} hookCb 钩子函数
 * @param {Object} hookOpts 钩子运行需要的参数
 * @param {Function} iteratorNextHook 运行下一个钩子
 */
const handleNextPipe = function (hookCb, hookOpts, iteratorNextHook) {
    hookCb(hookOpts.to, hookOpts.from, (nextVal) => {
        try {
            // next(false) or next(new Error('xxx')) 中断当前的路径跳转，或中断且注册错误回调
            if (nextVal === false || isError(nextVal)) {
                handleAbort.call(this, nextVal);
            }

            // next('/pages/a') or next({ url: '/pages/a' }) 修改 路由
            else if (
                typeof nextVal === 'string' ||
                (typeof nextVal === 'object' && typeof nextVal.url === 'string')
            ) {
                // 处理字符串路径
                typeof nextVal === 'string' && (nextVal = { url: nextVal });

                hookOpts.uniRunRoute(nextVal);
                handleAfterHook.call(this, hookOpts.to, hookOpts.from);

                // 更新引用，替换原来的`url`字段数据
                hookOpts.to = Object.assign(hookOpts.to, nextVal);

                // 结束钩子遍历
                iteratorNextHook(false);
            }

            // next() 运行下一个管道(next)
            else {
                iteratorNextHook();
            }
        } catch (err) {
            handleAbort.call(this, err);
        }
    });
};

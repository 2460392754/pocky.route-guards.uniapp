export default class uniGrouds {
	constructor() {
		this.beforeHooks = [];
		this.afterHooks = [];
		this.errorCbs = [];
		this.$_hackUniRoute();
	}

	/**
	 * 注册 全局前置守卫
	 * @param {Function} callback 回调函数
	 */
	beforeEach(callback) {
		return this.$_registerHook(this.beforeHooks, callback);
	}

	/**
	 * 注册 全局后置守卫
	 * @param {Function} callback 回调函数
	 */
	afterEach(callback) {
		return this.$_registerHook(this.afterHooks, callback);
	}

	/**
	 * 注册 错误回调
	 * @param {Function} errCb 错误回调函数
	 */
	onError(errCb) {
		return this.$_registerHook(this.errorCbs, errCb);
	}

	/**
	 * 注册 钩子
	 * @param {Function[]} list 钩子列表
	 * @param {Function} callback 回调函数
	 * @returns {Function} 用于注销当前注册钩子的闭包函数
	 */
	$_registerHook(list, callback) {
		list.push(callback);

		return () => {
			const index = list.indexOf(callback);

			if (index !== -1) list.splice(index, 1);
		};
	}

	/**
	 * 获取当前路由栈的信息
	 * @return {Object}
	 */
	$_getCurStack() {
		const stackAll = getCurrentPages();
		const stackLen = stackAll.length;

		if (stackLen === 0) {
			return false;
		}

		const curStack = stackAll[stackLen - 1];
		const from = { url: "/" + curStack.route };

		return from;
	}

	/**
	 * hack uniapp的路由函数
	 */
	$_hackUniRoute() {
		const UNI_ROUTE_ACTIONS = [
			"navigateTo",
			"redirectTo",
			"reLaunch",
			"switchTab",
			"navigateBack",
		];

		UNI_ROUTE_ACTIONS.forEach((key) => {
			const tempFunc = uni[key];

			// 重写方法
			uni[key] = (options) => {
				this.$_handleHook(options, (newOptions) => {
					tempFunc(newOptions || options);
				});
			};
		});
	}

	/**
	 * 处理 钩子
	 * @param {Object} to
	 * @param {Function} uniRunRoute
	 */
	$_handleHook(to, uniRunRoute) {
		// 跳过 h5环境中, 调用系统的tabbar功能或系统的navbar上的返回功能,会触发uni的路由方法
		if (["tabBar", "backbutton"].includes(to.from)) return uniRunRoute();

		const from = this.$_getCurStack();

		// 跳过 app端 首次进入页面会调用uni路由方法, 导致获取当前路由栈(from)为空
		if (from === false) return uniRunRoute();

		this.$_iteratorHook(
			this.beforeHooks,
			this.$_handleHookEveryRun,
			() => {
				uniRunRoute();
				this.afterHooks.forEach((hook) => {
					hook(to, from);
				});
			},
			{
				to,
				from,
				uniRunRoute,
			}
		);
	}

	/**
	 * 遍历并运行 钩子
	 * @param {Function[]} queueHook 钩子队列
	 * @param {Function} everyCb 每次遍历都会运行的回调函数
	 * @param {Function} endCb 队列运行结束后运行的回调函数
	 * @param {Object} hookOptions 钩子运行需要的参数
	 */
	$_iteratorHook(queueHook, everyCb, endCb, hookOptions) {
		const step = (i = 0) => {
			// 队列运行结束，运行回调函数
			if (i >= queueHook.length) {
				endCb.call(this);
			} else {
				// 跳过队列内容为假值的，例如：undefined
				if (queueHook[i]) {
					everyCb.call(this, queueHook[i], hookOptions, () => {
						step(i + 1);
					});
				} else {
					step(i + 1);
				}
			}
		};

		step();
	}

	/**
	 * 运行钩子并处理 next的返回值
	 * @param {Function} hook 钩子函数
	 * @param {Object} hookOptions 钩子运行需要的参数
	 * @param {Function} iteratorNext 运行下一个钩子
	 */
	$_handleHookEveryRun(hook, hookOptions, iteratorNext) {
		hook(hookOptions.to, hookOptions.from, (nextVal) => {
			try {
				// next(false) or next(new Error('xxx')) 中断当前的路径跳转，或中断且注册错误回调
				if (nextVal === false || this.$_isError(nextVal)) {
					this.$_handleAbort(nextVal);
				} else if (
					// next('/pages/a') or next({ url: '/pages/a' }) 添加或修改 路由
					typeof nextVal === "string" ||
					(typeof nextVal === "object" && typeof nextVal.url === "string")
				) {
					hookOptions.uniRunRoute(nextVal);
				} else {
					// next()
					iteratorNext();
				}
			} catch (err) {
				this.$_handleAbort(err);
			}
		});
	}

	/**
	 * 处理 错误信息
	 * @param {Object|string} err 错误信息、错误栈
	 */
	$_handleAbort(err) {
		if (this.errorCbs.length > 0) {
			this.errorCbs.forEach((cb) => {
				cb(err);
			});
		} else {
			this.$_print("error", err);
		}
	}

	/**
	 * 控制台打印内容
	 * @param {string} type 打印的类型
	 * @param {string} value 内容
	 */
	$_print(type, value) {
		console[type]("[route-guards] " + value);
	}

	/**
	 * 判断错误对象是否是由 Error对象实例化出来的
	 * @param {Object} err 错误对象
	 */
	$_isError(err) {
		return Object.prototype.toString.call(err).includes("Error");
	}
}

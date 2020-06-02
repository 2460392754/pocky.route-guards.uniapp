export default class uniGrouds {
	constructor() {
		this.beforeHooks = [];
		this.afterHooks = [];
		this.errorCbs = [];
		this.$_hackUniRoute();
		this.status = true;
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
	 * @param {Function} errCb
	 */
	onError(errCb) {
		return this.$_registerHook(this.errorCbs, errCb);
	}

	/**
	 * 注册 钩子
	 * @param {Function[]} list 钩子列表
	 * @param {Function} callback 回调函数
	 * @returns {Function}
	 */
	$_registerHook(list, callback) {
		list.push(callback);

		// 注销 钩子
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
		const curStack = stackAll[stackAll.length - 1];
		const from = { url: curStack.__page__.path };

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

			uni[key] = (options) => {
				this.$_handleHook(options, (newOptions) => {
					console.log(newOptions || options);
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
		const from = this.$_getCurStack();

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
	 * @param {Function} everyCb 每次遍历运行的回调函数
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
	 * 处理 next的返回值
	 * @param {Function} hook 钩子
	 * @param {Object} hookOptions 钩子运行需要的参数
	 * @param {Function} iteratorNext 运行下一个钩子
	 */
	$_handleHookEveryRun(hook, hookOptions, iteratorNext) {
		hook(hookOptions.to, hookOptions.from, (nextVal) => {
			// 中断当前的路径跳转，或中断且注册错误回调
			// next(false) -> abort navigation, ensure current URL
			try {
				if (nextVal === false || this.$_isError(nextVal)) {
					this.$_handleAbort(nextVal);
				} else if (
					// 添加或修改 路由
					// next('/') or next({ url: '/' }) -> redirect
					typeof nextVal === "string" ||
					(typeof nextVal === "object" && typeof nextVal.url === "string")
				) {
					hookOptions.uniRunRoute(nextVal);
				} else {
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

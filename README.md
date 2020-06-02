# uniapp route-guards

## 如何使用

```js
// main.js

import UniGuard from "./lib";

const guard = new UniGuard();

// 全局前置钩子
guard.beforeEach((to, from, next) => {
	console.log("========================");
	console.log("guard.beforeEach");
	console.log("to: ", to);
	console.log("from: ", from);

	if (to.url.includes("id=1")) {
		next({ url: "/pages/C" });
		// next(false);
		// next(new Error("can`t redirect "));
	} else {
		next();
	}
});

// 全局后置钩子
guard.afterEach((to, from) => {
	console.log("========================");
	console.log("guard.afterEach");
	console.log("to: ", to);
	console.log("from: ", from);
});

// 错误钩子
guard.onError((errMsg) => {
	console.log("my route-guards error: " + errMsg);
});
```

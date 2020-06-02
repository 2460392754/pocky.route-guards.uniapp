import Vue from "vue";
import App from "./App";
import UniGuard from "./lib";

Vue.config.productionTip = false;
App.mpType = "app";

const app = new Vue({
	...App,
});
app.$mount();

const guard = new UniGuard();

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

guard.afterEach((to, from) => {
	console.log("========================");
	console.log("guard.afterEach");
	console.log("to: ", to);
	console.log("from: ", from);
});

guard.onError((errMsg) => {
	console.log("my route-guards error: " + errMsg);
});

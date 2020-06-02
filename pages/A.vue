<template>
	<view>
		<button @click="onClickRedirect">to B page</button>
		<button @click="onclicKRouteGuardRedirect">route guard to C page</button>
	</view>
</template>

<script>
export default {
	methods: {
		onClickRedirect() {
			console.log("redirect");

			uni.switchTab({
				url: "/pages/B",
			});
		},

		onclicKRouteGuardRedirect() {
			console.log("route guard redirect");

			uni.switchTab({
				url: "/pages/B?id=1",
			});
		},
	},
};
</script>

<style></style>

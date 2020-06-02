<template>
	<view>
		<button @click="onClickRedirect('switchTab', 'A')">
			to A page - switchTab
		</button>
		<button @click="onClickRedirect('navigateBack', 'A')">
			to A page - navigateBack
		</button>
	</view>
</template>

<script>
export default {
	methods: {
		onClickRedirect(action, path) {
			console.log("redirect");

			uni[action]({
				url: "/pages/" + path,
			});
		},
	},
};
</script>

<style></style>

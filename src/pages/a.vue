<template>
    <view class="page-a">
        <u-navbar :is-back="false" title="页面 A" />

        <view class="btn-items">
            <u-button @click="onClickRedirect('switchTab', 'b')"
                >uni.switchTab 跳转到页面B</u-button
            >
            <u-button @click="onClickRedirect('navigateTo', 'd')"
                >uni.navigateTo 跳转到页面D</u-button
            >
            <u-button @click="onClickRedirect('redirectTo', 'd')"
                >uni.redirectTo 跳转到页面D</u-button
            >
            <u-button @click="onClickRedirect('reLaunch', 'd')">uni.reLaunch 跳转到页面D</u-button>
            <u-button @click="onClickRedirect('switchTab', 'c')"
                >uni.switchTab 拦截页面C并跳转到页面D</u-button
            >
            <u-button @click="onClickRedirect('switchTab', 'c', false)"
                >uni.switchTab 取消拦截直接跳转到页面C</u-button
            >
        </view>

        <view class="desc-console">请查看开发者控制台中的console</view>
    </view>
</template>

<script>
export default {
    methods: {
        /**
         * @param {string} action 路面方法名称
         * @param {string} relativePath 相对路径
         * @param {boolean} needIntercept 是否拦截
         */
        onClickRedirect(action, relativePath, needIntercept) {
            uni[action](
                {
                    url: '/src/pages/' + relativePath,
                    success() {
                        console.log('从页面A路由跳转成功');
                    }
                },
                needIntercept
            );
        }
    }
};
</script>

<style lang="scss">
.page-a {
}
</style>

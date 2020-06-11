<template>
    <view class="page-c">
        <u-navbar :is-back="false" title="页面 C"></u-navbar>

        <view class="btn-items">
            <u-button @click="onClickRedirect">uni.switchTab 跳转到页面A</u-button>
        </view>

        <view class="desc-console">请查看开发者控制台中的console</view>
    </view>
</template>

<script>
export default {
    methods: {
        onClickRedirect() {
            uni.switchTab({
                url: '/src/pages/a'
            });
        }
    }
};
</script>

<style lang="scss">
.page-c {
}
</style>

<template>
    <view class="page-d">
        <u-navbar
            :is-back="back"
            back-icon-color="#fff"
            :back-text-style="{ color: '#fff' }"
            back-text="返回"
            title="页面 D"
        ></u-navbar>

        <view class="btn-items">
            <u-button @click="onClickRedirect('switchTab', 'a')"
                >uni.switchTab 跳转到页面A</u-button
            >
        </view>

        <view class="desc-console">请查看开发者控制台中的console</view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            back: false
        };
    },

    methods: {
        onClickRedirect(action, path) {
            uni[action]({
                url: '/src/pages/' + path
            });
        }
    },

    onLoad(opts) {
        opts.back === '1' && (this.back = true);
    }
};
</script>

<style lang="scss">
.page-d {
}
</style>

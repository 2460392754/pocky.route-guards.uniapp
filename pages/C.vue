<template>
    <view>
        <button @click="onClickRedirect">to A page - switchTab</button>
    </view>
</template>

<script>
export default {
    methods: {
        onClickRedirect() {
            console.log('redirect');

            uni.switchTab({
                url: '/pages/A'
            });
        }
    }
};
</script>

<style></style>

<template>
    <view>
        <button @click="onClickRedirect('switchTab', 'B')">
            to B page - switchTab
        </button>

        <button @click="onclicKRouteGuardRedirect">
            route guard to C page - switchTab
        </button>

        <button @click="onClickRedirect('navigateTo', 'D')">
            to D page - navigateTo
        </button>
        <button @click="onClickRedirect('redirectTo', 'D')">
            to D page - redirectTo
        </button>
        <button @click="onClickRedirect('reLaunch', 'D')">
            to D page - reLaunch
        </button>
    </view>
</template>

<script>
export default {
    methods: {
        onClickRedirect(action, path) {
            console.log('redirect');

            uni[action]({
                url: '/pages/' + path
            });
        },

        onclicKRouteGuardRedirect() {
            console.log('route guard redirect');

            uni.switchTab({
                url: '/pages/B?id=1'
            });
        }
    }
};
</script>

<style></style>

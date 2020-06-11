import Vue from 'vue';
import App from './App';
import '@/src/plugins/uview';
import '@/src/plugins/routeGuards';

Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue({
    ...App
});
app.$mount();

/**
 * Created by lingchenxuan on 2017/3/20.
 */
import Vue from 'vue';
import 'bootstrap';
import App from './App';
import { router } from './routes';
import Router from 'vue-router';
import init from '../common/init';
import auth from '../common/auth';

init({
    leftMenu: false,
    id: auth.VIP_ID
});
Vue.use(Router);
const app = new Vue({
    router,
    ...App
});
document.addEventListener('DOMContentLoaded', () => {
    app.$mount('#app');
});

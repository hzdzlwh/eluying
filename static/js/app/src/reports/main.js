/**
 * Created by lingchenxuan on 2017/1/6.
 */
import Vue from 'vue';
import 'bootstrap';
import header from 'header';
import App from './App';
import { router } from './routes';
import Router from 'vue-router';
import store from './store';

Vue.use(Router);
const app = new Vue({
    store,
    router,
    ...App
});

document.addEventListener('DOMContentLoaded', () => {
    header.showHeader();
    app.$mount('#app');
});
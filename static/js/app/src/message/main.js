/*
* @Author: Tplant
* @Date:   2017-08-19 12:45:05
* @Last Modified by:   Tplant
* @Last Modified time: 2017-08-19 16:56:20
*/

import Vue from 'vue';
import 'bootstrap';
import App from './App';
import { router } from './routes';
import Router from 'vue-router';
import init from '../common/init';
import auth from '../common/auth';
import { OrderSystem } from '../common/orderSystem';
init({
    leftMenu: false,
    id: auth.VIP_ID
});
Vue.use(Router);
const app = new Vue({
    ...App,
    components: {
        OrderSystem
    }
});
document.addEventListener('DOMContentLoaded', () => {
    app.$mount('#app');
});

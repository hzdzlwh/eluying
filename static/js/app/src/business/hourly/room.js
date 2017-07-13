/**
 * Created by ddll on 17-6-29.
 */
import init from '../../common/init';
import auth from '../../common/auth';
import Vue from 'vue';
import { DdSelect, DdOption } from 'dd-vue-component';
import http from 'http';
import modal from 'modal';
import index from './index.vue';

init({
    id: auth.BUSINESS_ID,
    topMenu: true
});

const app = new Vue({
    ...index
});

document.addEventListener('DOMContentLoaded', () => {
    app.$mount('#app');
});

import Vue from 'vue';
import App from './App.vue';
import 'bootstrap';
import Router from 'vue-router';
import init from '../../common/init';
var auth = require('../../common/auth');
var topMenu = require("../../common/topMenu");
auth.checkAuth(auth.BUSINESS_ID);

const app = new Vue({
    ...App
});
document.addEventListener('DOMContentLoaded', () => {
    app.$mount('#app');
});

init({
    id: auth.BUSINESS_ID,
    topMenu: true,
    clearModal: true
});

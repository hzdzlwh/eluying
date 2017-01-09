/**
 * Created by lingchenxuan on 2017/1/6.
 */
import Vue from 'vue';
import 'bootstrap';
import header from 'header';
import App from './App';

const app = new Vue({
    ...App
});

document.addEventListener('DOMContentLoaded', () => {
    header.showHeader();
    app.$mount('#app');
});
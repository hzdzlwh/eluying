var Vue = require('vue');
var util = require("util");
import App from './App.vue';
var modal = require("modal");
import http from 'http';
var restaurantMenu = require('../restaurantMenu');
var showInfo = require("../../category/food/showInfo");
require("bootstrap");
require("validation");
require("jqueryui");
require("fileupload");

var auth = require('../../../common/auth');
import init from '../../../common/init';
init({
    id: auth.BUSINESS_ID,
    clearModal: true
});
Vue.prototype.$isNull = function(text) {
    var result = typeof (text) === 'undefined' || text === '';
    return result;
};

$(function() {
    restaurantMenu.render();
});
const app = new Vue({
    ...App
});
document.addEventListener('DOMContentLoaded', () => {
    app.$mount('#app');
});

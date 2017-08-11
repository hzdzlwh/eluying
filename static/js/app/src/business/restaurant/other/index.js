var Vue = require('vue1');
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
    const restId = Number(location.search.split('=')[1]);
    const main = new Vue({
        el: '.restaurant-container',
        data: {
            restName: undefined,
            restId: restId
        },
        created: function() {
            this.getRestaurants();
        },
        methods: {
            getRestaurants: function() {
                http.get('/catering/getRestaurantList', {})
                    .then(result => {
                        this.restName = result.data.list.filter(function(el) {
                            return el.restId === restId;
                        })[0].restName;
                    });
            }
        }

    });
    const app = new Vue({
        ...App
    });
    document.addEventListener('DOMContentLoaded', () => {
        app.$mount('#app');
    });
});

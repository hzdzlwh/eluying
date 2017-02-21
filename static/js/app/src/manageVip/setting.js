/**
 * Created by lingchenxuan on 2017/2/17.
 */
import header from 'header';
import Vue from 'vue';
import http from '../common/AJAXService';
import init from '../common/init';
import auth from '../common/auth';

init({
    id: auth.VIP_ID,
    noAuthUrl: auth.NO_AUTH_FOR_VIP_URL,
    leftMenu: false
});
$(function() {

    const main = new Vue({
        el: '.vip-container',
        created: function() {

        }
    })
});
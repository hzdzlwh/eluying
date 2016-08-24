/**
 * Created by zhaoyongsheng on 16/7/7.
 */
var Vue = require('vue');
var header = require('header');
var leftMenu = require('leftMenu');
var util = require('util');
var modal = require('modal');
var AJAXService= require('AJAXService');
var auth = require('../../common/auth');
auth.checkAuth(auth.BUSINESS_ID);

require("bootstrap");
require("validation");

$(function(){
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();
    modal.modalInit();
    var events = {

        "resize window": util.mainContainer

    };

    util.bindDomAction(events);
    var linesite = new Vue({
        el: '.mainContainer',
        data: {
            linesiteQrCode: '',
            linesiteUrl: ''
        },
        ready: function(){
            AJAXService.ajaxWithToken('GET', '/entertainment/getEnterQueueSetting', {}, function(result){
                this.linesiteQrCode = result.data.enterQueueQrCode;
                this.linesiteUrl = result.data.enterQueueUrl;
            }.bind(this));
        },
        methods: {
            copyText: function(){
                var ele = document.querySelector('#campUrl');
                util.copyText(ele);
                $(".copy-success").css('display', 'inline-block');
                setTimeout(function () {
                    $(".copy-success").css('display', 'none');
                }, 3000);
            }
        }
    });
});
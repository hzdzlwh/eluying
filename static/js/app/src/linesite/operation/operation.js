/**
 * Created by zhaoyongsheng on 16/7/7.
 */
var Vue = require('vue1');
var util = require('util');
var modal = require('modal');
var AJAXService= require('AJAXService');
var auth = require('../../common/auth');
import init from '../../common/init';
init({
    id: auth.BUSINESS_ID,
});

require("bootstrap");
require("validation");

$(function(){

    var linesite = new Vue({
        el: '.mainContainer',
        data: {
            linesiteQrCode: '',
            linesiteUrl: ''
        },
        created: function(){
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
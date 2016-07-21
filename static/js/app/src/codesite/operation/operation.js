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

        "resize window": util.mainContainer,
        "mouseenter .cbtn-grey": function(){
            $(".tips").show();
            $(".tips-arrow").show();
        },
        "mouseleave .cbtn-grey": function(){
            $(".tips").hide();
            $(".tips-arrow").hide();
        }

    };

    util.bindDomAction(events);
    var codesite = new Vue({
        el: '.mainContainer',
        data: {},
        methods: {
            copyText: function(){
                var ele = document.querySelector('#campUrl');
                util.copyText(ele);
            }
        }
    });
});
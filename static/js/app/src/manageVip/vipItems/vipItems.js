/**
 * Created by zhaoyongsheng on 16/6/2.
 */
var AJAXService = require("AJAXService");
var header = require("header");
var util = require("util");
var modal = require("modal");
require("angular");

require("jqueryui");
require("datepicker-zh");
require("bootstrap");
require("validation");

var itemsCtrl = require('./controller/items');
var createVipCtrl = require('./controller/createVipCtrl');

$(function() {
    //初始化界面
    header.showHeader();
    //高亮"会员管理"
    $(".settingsEntry").removeClass("selected");
    $(".accomodationEntry").removeClass("selected");
    $(".manageVipEntry").addClass("selected");
    modal.modalInit();

    events = {
        /*"click .outPut-excel": function(ev){
            ev.stopPropagation();
            AJAXService.ajaxWithToken('GET', '/vipUser/vipUserListToExcel', {});
        }*/
        "click body .btn-cancel": function(){$(this).parents(".modal").modal("hide");},
        "click body .dialog-close": function(){
            $(this).parents(".modal").modal("hide");
        },
        "click body .select1>span": function(ev){
            $(".select1_options").hide();
            $(this).siblings(".select1_options").show();
            ev.stopPropagation();
        }
    };
    util.bindDomAction(events);


    var app = angular.module('vipApp', []);
    itemsCtrl(app);
    createVipCtrl(app);
    

});
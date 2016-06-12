/**
 * Created by zhaoyongsheng on 16/6/2.
 */
var AJAXService = require("AJAXService");
var header = require("header");
var util = require("util");
var modal = require("modal");
require("angular");
util.checkAuth(11);
require("jqueryui");
require("datepicker-zh");
require("bootstrap");
require("validation");
require('../../common/ngDatePicker');
require('../../common/ngPagination');
var itemsCtrl = require('./controller/mainAppCtrl');
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
        "click body .toselect-last": function(){
            $(".selectBox .toselect-container").hide();
        },
        "click body .toselect-container>.toselect": function(){
            $(this).siblings(".toselect").removeClass("selected-area");
            $(this).addClass("selected-area");
        },
        "click .item.selected": function(ev){
            ev.stopPropagation();
            $(".selectBox .toselect-container").show();
            // $(this).siblings(".toselect-container").show();
        },
        "click body .select1>span": function(ev){
            $(".select1_options").hide();
            $(this).siblings(".select1_options").show();
            ev.stopPropagation();
        }
    };
    util.bindDomAction(events);


    var app = angular.module('vipApp', ['ng-pagination', 'ng-datepicker']);
    itemsCtrl(app);
    createVipCtrl(app);
    

});
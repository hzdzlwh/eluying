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
require('../../common/ngDatePicker');
require('../../common/ngPagination');
var itemsCtrl = require('./controller/mainAppCtrl');
var createVipCtrl = require('./controller/createVipCtrl');
var auth = require('../../common/auth');
auth.checkAuth(auth.VIP_ID, auth.NO_AUTH_FOR_VIP_URL);

$(function() {
    //初始化界面
    header.showHeader();
    //高亮"会员管理"
    $(".ordersManageEntry").removeClass("selected");
    $(".settingsEntry").removeClass("selected");
    $(".accomodationEntry").removeClass("selected");
    $(".manageVipEntry").addClass("selected");
    modal.modalInit();
    modal.centerModals();
    var events = {
        /*"click .outPut-excel": function(ev){
            ev.stopPropagation();
            AJAXService.ajaxWithToken('GET', '/vipUser/vipUserListToExcel', {});
        }*/
        "click body": function(){
            $(".selectBox .toselect-container").hide();
            $(".select1_options").hide();
        },
        "click body .btn-cancel": function(){$(this).parents(".modal").modal("hide");},
        "click body .dialog-close": function(){
            $(this).parents(".modal").modal("hide");
        },
        "click .scontent .toselect-container>.toselect": function(ev){
            ev.stopPropagation();
            $(this).siblings(".toselect").removeClass("selected-area");
            $(this).addClass("selected-area");
        },
        "mouseover body .remark": function(ev){
            ev.stopPropagation();
            var remark_full = $(this).children("div");
            if (remark_full.length > 0){
                var height_td = $(this).css("height");
                var height_p = $(this).children("p").css("height");
                var height_dis = Math.ceil((parseInt(height_td)-parseInt(height_p)) / 2);
                var height = parseInt(remark_full.css("height")) - height_dis + 6;
                remark_full.css("top",'-' + height + 'px').show();
            }
        },
        "mouseout body .remark": function(ev){
            ev.stopPropagation();
            $(this).children("div").hide();
        },
        "mouseover body .remark-first": function(ev){
            ev.stopPropagation();
            var remark_full = $(this).children("div");
            if (remark_full.length > 0){
                var height_td = $(this).css("height");
                var height_p = $(this).children("p").css("height");
                var height_dis = Math.ceil((parseInt(height_td)-parseInt(height_p)) / 2);
                var height = parseInt(height_td) - height_dis + 6;
                remark_full.css("top", height + 'px').show();
            }
        },
        "mouseout body .remark-first": function(ev){
            ev.stopPropagation();
            $(this).children("div").hide();
        },
        "click .scontent": function(ev){
            ev.stopPropagation();
            $(".selectBox .toselect-container").show();
            $(".toselect").removeClass("selected-area");
            // $(this).siblings(".toselect-container").show();
        },
        "click body .select1>span": function(ev){
            $(".select1_options").hide();
            $(this).siblings(".select1_options").show();
            ev.stopPropagation();
        }
    };
    util.bindDomAction(events);
    document.querySelector('.toselect-last').addEventListener('click', function(e){
        e.stopPropagation();
        $(".selectBox .toselect-container").hide();
    });

    var app = angular.module('vipApp', ['ng-pagination', 'ng-datepicker']);
    itemsCtrl(app);
    createVipCtrl(app);
    

});
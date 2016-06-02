/**
 * Created by huwanqi on 16/5/1.
 */
var AJAXService = require("AJAXService");
var header = require("header");
var leftMenu = require("leftMenu");
var topMenu = require("../../common/topMenu");
var util = require("util");
var modal = require("modal");
require("angular");

require("jqueryui");
require("datepicker-zh");
require("bootstrap");
require("validation");

var accommodationCtrl = require('./controller/accommodation');
var pRoomFilterCtrl = require('./controller/pRoomFilter');
var dateSelectorCtrl = require('./controller/dateSelector');
var orderNewCtrl = require('./controller/orderNew');
var orderEditCtrl = require('./controller/orderEdit');
var orderDetailCtrl = require('./controller/orderDetail');
var orderSearchCtrl = require('./controller/orderSearch');
var getMoneyCtrl = require('./controller/getMoney');
var orderCancelCtrl = require('./controller/orderCancel');
var checkoutCtrl = require('./controller/checkout');
var checkoutAdCtrl = require('./controller/checkoutAd');
var checkinCtrl = require('./controller/checkin');
var getMoneyWithGunCtrl = require('./controller/getMoneyWithGun');

$(function(){
    //初始化界面
    header.showHeader();
    //高亮"前台录入"
    $(".settingsEntry").removeClass("selected");
    $(".accomodationEntry").addClass("selected");
    topMenu.showTopMenu();
    modal.modalInit();

    $(".entryList")[0].oncontextmenu = function(){
        return false;
    };
    $(".entryList")[0].onselectstart  = function(){
        return false;
    };

    var timer;
    events = {
        "show.bs.modal .modal": modal.centerModals,
        "scroll .calendor-container": function(){
            var selection = $(this);
            var scrollHeight = selection[0].scrollHeight;
            var height = selection.height();
            var top = selection.scrollTop();
            clearTimeout(timer);
            timer = setTimeout(function () {
                var height = $(window).height() - $(".calendor-container").offset().top;
                var top = $(".calendor-container").scrollTop();
                var body = angular.element(document.body);
                var rootScope = body.scope().$root;
                rootScope.entryRowsMin = parseInt(top / 48)-20;
                rootScope.entryRowsMax = parseInt((top + height) / 48)+20;
                rootScope.$apply();
            }, 100);

            var scrollLeft = selection.scrollLeft();
            var scrollTop = selection.scrollTop();
            $(".accommodation-mainContainer .content .sheader").css("margin-left", -scrollLeft);
            $(".accommodation-mainContainer .content .leftHeader").css("margin-top", -scrollTop);
            util.leftHeaderAdjustLineHeight();
        },
        "click body .btn-cancel": function(){$(this).parents(".modal").modal("hide");},
        "mouseover body .entryItem": function(){
            var date = $(this).attr("date");
            var room = $(this).attr("room");
            $(".room-item[room='" + room + "']").addClass("selected");
            $(".date-item[date='" + date + "']").addClass("selected");
        },
        "mouseleave body .entryItem": function(){
            $(".room-item").removeClass("selected");
            $(".date-item").removeClass("selected");
        },
        "mousedown body .entryItem": function(ev){
            if(ev.which == 3){
                $(".entryOp").hide();
                $(this).find(".entryOp").show();
                return false;
            }
        },
        "mousedown body .entryItem>.closeTips": function(ev){
            if(ev.which == 3){
                $(".entryOp").hide();
                $(this).siblings(".entryOp").show();
                return false;
            }
        },
        "mousedown body .entryOp": function(ev){
            ev.stopPropagation();
        },
        "click body": function(ev){
            $(".entryOp").hide();
            $(".search .results").hide();
            $(".search .search-switch").show();
            $(".search .wrapper").hide();
            $(".date-selector").removeClass("open");
            $(".category-filter").removeClass("open");
            $(".modal .date-table").hide();
            $(".modal .select1_options").hide();
        },
        "click body .results": function(ev){
            ev.stopPropagation();
        },
        "click body .date-selector-switch": function(ev){
            ev.stopPropagation();
            if(!$(".date-selector").hasClass("open")){
                $(".date-selector").addClass("open");
            }else{
                $(".date-selector").removeClass("open");
            }
        },
        "mouseover body .glyph": function(ev){
            var clientY = ev.clientY;
            var infos = $(this).find(".infos");
            var height = infos.height();
            if(height + 180 > clientY){
                infos.removeClass("up");
                infos.addClass("down");
            }else{
                infos.removeClass("down");
                infos.addClass("up");
            }
            infos.show();
        },
        "mouseleave body .glyph": function(ev){
            $(this).find(".infos").hide();
        },
        "click body .consume-switch": function (ev) {
            ev.stopPropagation();
            if($(this).hasClass("open")){
                $(this).removeClass("open");
                $(this).parents(".consume-info").animate({
                    height: '24'
                });
            }else{
                $(this).addClass("open");
                $(this).parents(".consume-info").css({
                    height: 'auto'
                });
            }
        },
        "click body input.keyword": function(ev){
            ev.stopPropagation();
        },
        // "focus body input.keyword": function(ev){
        //     $(".search .results").show();
        // },
        "click body .select1>span": function(ev){
            $(".select1_options").hide();
            $(this).siblings(".select1_options").show();
            ev.stopPropagation();
        },
        "click body input.datePicker": function(ev){
            $(".date-table").hide();
            $($(this).next(".date-table")[0]).show();
            ev.stopPropagation();
        },
        "click body .modal-close": function(ev){
            $(this).parents(".modal").modal("hide");
        },
        "click body .header>img.logo": function(){
            window.location.reload();
        },
        "click body .category-filter": function(ev){
            ev.stopPropagation();
        },
        "click body .search-switch": function(ev){
            $(".search .search-switch").hide();
            $(".search .wrapper").show();
            ev.stopPropagation();
        },
        "click body .search": function(ev){
            ev.stopPropagation();
        },
        "shown.bs.modal #payWithAlipayModal": function(ev){
            $("#payWithAlipayModal input").focus();
            $("#payWithAlipayModal input").focusout(function(){
                $("#payWithAlipayModal input").focus();
            });
        },
        "hidden.bs.modal #payWithAlipayModal": function(ev){
            $("#payWithAlipayModal input").focusout(function(){});
            $("#payWithAlipayModal input").focusout();
        },
        // $("#payWitJ2001hAlipayModal input").focus();
        // $("#payWithAlipayModal input").focusout(function(){
        //     $("#payWithAlipayModal input").focus();
        // });
    };

    util.bindDomAction(events);
    var app = angular.module('calenderApp', []);
    dateSelectorCtrl(app);
    pRoomFilterCtrl(app);
    accommodationCtrl(app);
    orderNewCtrl(app);
    orderEditCtrl(app);
    orderDetailCtrl(app);
    orderSearchCtrl(app);
    getMoneyCtrl(app);
    orderCancelCtrl(app);
    checkoutCtrl(app);
    checkoutAdCtrl(app);
    checkinCtrl(app);
    getMoneyWithGunCtrl(app);
});

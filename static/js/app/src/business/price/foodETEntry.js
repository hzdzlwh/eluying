var header = require("header");
var leftMenu = require("leftMenu");
var topMenu = require("../../common/topMenu");
var util = require("util");
require("bootstrap");
var modal = require("modal");
var foodETPriceList = require("foodETPriceList");
require("validate");
require("validation");


$(function(){
    //初始化界面
    header.showHeader();
    leftMenu.showLeftMenu();
    topMenu.showTopMenu();
    util.mainContainer();
    modal.modalInit();
    $(".campName").html(localStorage.getItem("campName"));


//拉今天的价格去
    foodETPriceList.getFoodETPriceList(window.location.pathname.split("/")[3].split(".")[0]);


    events = {
        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);}
    };
    util.bindDomAction(events);
});

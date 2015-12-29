var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
require("bootstrap");
var modal = require("modal");
var foodETPriceList = require("foodETPriceList");


//初始化界面
header.showHeader();
leftMenu.showLeftMenu();
util.mainContainer();
modal.modalInit();
$(".campName").html(localStorage.getItem("campName"));


//拉今天的价格去
foodETPriceList.getFoodETPriceList(window.location.pathname.split("/")[4].split(".")[0]);


events = {
    "resize window": util.mainContainer,
    "show.bs.modal .modal": modal.centerModals,
    "click .btn-cancel": function(){var that = this; modal.clearModal(that);}
};
util.bindDomAction(events);



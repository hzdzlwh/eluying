var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
var roomCategoryList = require("roomCategoryList");
require("bootstrap");

//初始化界面
header.showHeader();
leftMenu.showLeftMenu();
util.mainContainer();
modal.modalInit();
$(".campName").html(localStorage.getItem("campName"));


roomCategoryList.loadRoomCategoryList();

util.bindDomAction(roomCategoryList.events);

events = {

    "resize window": util.mainContainer,
    "show.bs.modal .modal": modal.centerModals,
    "click .btn-cancel": function(){var that = this; modal.clearModal(that);}


};

util.bindDomAction(events);
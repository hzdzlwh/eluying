var header = require("header");
var leftMenu = require("leftMenu");
var topMenu = require("../../../common/topMenu");
var util = require("util");
var modal = require("modal");
var roomCategoryList = require("roomCategoryList");
var addRoom = require("./addRoom");
var editRoomBasic = require("./editRoomBasic");
var showInfo = require("./showInfo");
var subclassManage = require("./subclassManage");
var subRoom = require("./subRoom");
require("bootstrap");
require("validation");


$(function(){
    //检测IE
    util.checkExplorer();
    //初始化界面
    header.showHeader();
    leftMenu.showLeftMenu();
    topMenu.showTopMenu();
    util.mainContainer();
    modal.modalInit();
    $(".campName").html(localStorage.getItem("campName"));


    roomCategoryList.loadRoomCategoryList();


    events = {

        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);}


    };

    util.bindDomAction(events);

    util.bindDomAction(roomCategoryList.events);

    util.bindDomAction(addRoom.events);

    util.bindDomAction(editRoomBasic.events);

    util.bindDomAction(showInfo.events);

    util.bindDomAction(subclassManage.events);

    util.bindDomAction(subRoom.events);
});

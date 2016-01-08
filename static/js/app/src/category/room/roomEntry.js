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


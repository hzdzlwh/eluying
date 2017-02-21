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
var auth = require('../../../common/auth');
auth.checkAuth(auth.BUSINESS_ID);
require("bootstrap");
require("validation");
import init from '../../../common/init';

init({
    id: auth.BUSINESS_ID,
    topMenu: true
});

$(function(){

    $(".campName").html(localStorage.getItem("campName"));


    roomCategoryList.loadRoomCategoryList();

    util.bindDomAction(roomCategoryList.events);

    util.bindDomAction(addRoom.events);

    util.bindDomAction(editRoomBasic.events);

    util.bindDomAction(showInfo.events);

    util.bindDomAction(subclassManage.events);

    util.bindDomAction(subRoom.events);
});

/**
 * Created by Administrator on 2016/1/8.
 */
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
var ETCategoryList = require("./ETCategoryList");
var addET = require("./addET");
var editETBasic = require("./editETBasic");
var showInfo = require("./showInfo");

require("bootstrap");
require("validation");

//初始化界面
header.showHeader();
leftMenu.showLeftMenu();
util.mainContainer();
modal.modalInit();
$(".campName").html(localStorage.getItem("campName"));


ETCategoryList.loadETCategoryList();


events = {

    "resize window": util.mainContainer,
    "show.bs.modal .modal": modal.centerModals,
    "click .btn-cancel": function(){var that = this; modal.clearModal(that);}


};

util.bindDomAction(events);

util.bindDomAction(ETCategoryList.events);

util.bindDomAction(addET.events);

util.bindDomAction(editETBasic.events);

util.bindDomAction(showInfo.events);
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
var foodCategoryList = require("./foodCategoryList");
var addFood = require("./addFood");
var editFoodBasic = require("./editFoodBasic");
var showInfo = require("./showInfo");

require("bootstrap");
require("validation");

//初始化界面
header.showHeader();
leftMenu.showLeftMenu();
util.mainContainer();
modal.modalInit();
$(".campName").html(localStorage.getItem("campName"));


foodCategoryList.loadFoodCategoryList();


events = {

    "resize window": util.mainContainer,
    "show.bs.modal .modal": modal.centerModals,
    "click .btn-cancel": function(){var that = this; modal.clearModal(that);}


};

util.bindDomAction(events);

util.bindDomAction(foodCategoryList.events);

util.bindDomAction(addFood.events);

util.bindDomAction(editFoodBasic.events);

util.bindDomAction(showInfo.events);



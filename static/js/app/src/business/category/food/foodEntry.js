var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var topMenu = require("../../../common/topMenu");
var modal = require("modal");
var foodCategoryList = require("./foodCategoryList");
var addFood = require("./addfood");
var editFoodBasic = require("./editFoodBasic");
var showInfo = require("./showInfo");
var auth = require('../../../common/auth');
auth.checkAuth(auth.BUSINESS_ID);

require("bootstrap");
require("validation");

$(function(){
    //初始化界面
    header.showHeader();
    leftMenu.showLeftMenu();
    topMenu.showTopMenu();
    util.mainContainer();
    modal.modalInit();
    $(".campName").html(localStorage.getItem("campName"));


    foodCategoryList.loadFoodCategoryList();


    var events = {

        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);}


    };

    util.bindDomAction(events);

    util.bindDomAction(foodCategoryList.events);

    util.bindDomAction(addFood.events);

    util.bindDomAction(editFoodBasic.events);

    util.bindDomAction(showInfo.events);



});
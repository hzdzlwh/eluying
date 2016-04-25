var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
require("bootstrap");
require("validation");
var shopList = require('./shopList');
var shopCategory = require('./shopCategory');
var createShop = require('./createShop');
var editShop = require('./editShop');


$(function() {
    //初始化界面
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();
    modal.modalInit();
    modal.centerModals();
    $(".campName").html(localStorage.getItem("campName"));

    shopList.loadShopList();
    shopList.loadShopCategory();

    events = {

        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);}


    };

    util.bindDomAction(events);

    util.bindDomAction(shopList.events);

    util.bindDomAction(shopCategory.events);

    util.bindDomAction(createShop.events);

    util.bindDomAction(editShop.events);


});
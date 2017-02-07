var header = require("header");
var leftMenu = require("leftMenu");
var topMenu = require("../../common/topMenu");
var util = require("util");
require("bootstrap");
var modal = require("modal");
var foodETPriceList = require("foodETPriceList");
require("validate");
require("validation");
var auth = require('../../common/auth');
var restaurantMenu = require('../restaurant/restaurantMenu');
auth.checkAuth(auth.BUSINESS_ID);
var AJAXService = require('../../common/AJAXService');

$(function(){
    //初始化界面
    header.showHeader();
    leftMenu.showLeftMenu();
    var location = window.location.pathname.split("/")[5].split(".")[0];
    var restId = window.location.search.split('=')[1];
    if (location === 'food') {
        restaurantMenu.render({ menuActive: 'dishes' });
        topMenu.showTopMenu({showInventory: false});
        AJAXService.ajaxWithToken('GET', '/catering/getRestaurantList', {}, function(result) {
            var restName = result.data.list.filter(function(el) {
                return el.restId == restId;
            })[0].restName;
            $(".campName").html(restName);
        }.bind(this));
    } else {
        // topMenu.showTopMenu();
        // $(".campName").html(localStorage.getItem("campName"));
    }
    util.mainContainer();
    modal.modalInit();
    // $(".campName").html(localStorage.getItem("campName"));



//拉今天的价格去
    foodETPriceList.getFoodETPriceList(location);


    var events = {
        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);}
    };
    util.bindDomAction(events);
});

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
import init from '../../common/init';
init({
    id: auth.BUSINESS_ID,
    clearModal: true
});

$(function(){

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




//拉今天的价格去
    foodETPriceList.getFoodETPriceList(location);
});

var util = require("util");
require("bootstrap");
var modal = require("modal");
var foodETPriceList = require("foodETPriceList");
require("validate");
require("validation");
var auth = require('../../common/auth');
var restaurantMenu = require('../restaurant/restaurantMenu');
auth.checkAuth(auth.BUSINESS_ID);
var http = require('../../common/http');
import init from '../../common/init';

var location = window.location.pathname.split("/")[5].split(".")[0];

init({
    id: auth.BUSINESS_ID,
    clearModal: true,
    topMenu: location === 'food' ? {showInventory: false} : false
});

$(function(){
    var restId = window.location.search.split('=')[1];
    if (location === 'food') {
        restaurantMenu.render({ menuActive: 'dishes' });
        http.get('/catering/getRestaurantList', {})
            .then(result => {
                var restName = result.data.list.filter(function(el) {
                    return el.restId == restId;
                })[0].restName;
                $(".campName").html(restName);
            });
    } else {
        // topMenu.showTopMenu();
        // $(".campName").html(localStorage.getItem("campName"));
    }




//拉今天的价格去
    foodETPriceList.getFoodETPriceList(location);
});

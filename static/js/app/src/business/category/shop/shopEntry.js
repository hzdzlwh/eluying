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

var auth = require('../../../common/auth');
import init from '../../../common/init';
init({
    id: auth.BUSINESS_ID,
});

$(function() {
    $(".campName").html(localStorage.getItem("campName"));

    shopList.loadShopList();
    shopList.loadShopCategory();

    util.bindDomAction(shopList.events);

    util.bindDomAction(shopCategory.events);

    util.bindDomAction(createShop.events);

    util.bindDomAction(editShop.events);


});
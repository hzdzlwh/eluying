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
require("bootstrap");
require("validation");
import init from '../../../common/init';
init({
    id: auth.BUSINESS_ID,
});
$(function(){

    $(".campName").html(localStorage.getItem("campName"));


    foodCategoryList.loadFoodCategoryList();

    util.bindDomAction(events);

    util.bindDomAction(foodCategoryList.events);

    util.bindDomAction(addFood.events);

    util.bindDomAction(editFoodBasic.events);

    util.bindDomAction(showInfo.events);



});
/**
 * Created by lingchenxuan on 16/6/14.
 */
var header = require("header");
var util = require("util");

require("bootstrap");

$(function(){
    util.checkExplorer();
    header.showHeader();
    util.checkAuth();
    $(".settingsEntry").removeClass("selected");
    $(".manageVipEntry").addClass("selected");
    $(".accomodationEntry").removeClass("selected");
});

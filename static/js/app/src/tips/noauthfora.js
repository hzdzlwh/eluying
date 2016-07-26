var header = require("header");
var util = require("util");

require("bootstrap");

$(function(){
    util.checkExplorer();
    header.showHeader();
    $(".settingsEntry").removeClass("selected");
    $(".manageVipEntry").removeClass("selected");
    $(".accomodationEntry").addClass("selected");
});

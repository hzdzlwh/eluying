require("laydate");
$(function(){
    var header = require("header");
    header.showHeader();
    var leftMenu = require("leftMenu");
    leftMenu.showLeftMenu();
    var util = require("util");
    util.mainContainer();
    $(".campName").html(localStorage.getItem("campName"));
    var accommodationPriceList = require("accommodationPriceList");
    accommodationPriceList.getAccommodationPriceList();
    laydate({
        elem: '#dateInput'
    });
    laydate.skin('danlan');
});

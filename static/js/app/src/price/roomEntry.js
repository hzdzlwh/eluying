require("laydate");
var header = require("header");
var leftMenu = require("leftMenu");
var accommodationPriceList = require("accommodationPriceList");
var util = require("util");


header.showHeader();
leftMenu.showLeftMenu();
util.mainContainer();
$(".campName").html(localStorage.getItem("campName"));
accommodationPriceList.getAccommodationPriceList(new Date());
laydate({
    elem: '#dateInput'
});
laydate.skin('danlan');
events = {
    "resize window": util.mainContainer
};
util.bindDomAction(events);
alert("hello");


var header = require("header");
var leftMenu = require("leftMenu");
var accommodationPriceList = require("accommodationPriceList");
var util = require("util");
var seasonManage = require("seasonManage");
var monthManage = require("monthManage");
require("jqueryui");
require("datepicker-zh");
require("bootstrap");
var modal = require("modal");



//初始化界面
header.showHeader();
leftMenu.showLeftMenu();
util.mainContainer();
modal.modalInit();
$(".campName").html(localStorage.getItem("campName"));

//初始化日历
$.datepicker.setDefaults( $.datepicker.regional[ "zh-CN" ] );
$(".dateContainer").datepicker({
    dateFormat: "yy-mm-dd",
    changeMonth: true,
    changeYear: true
}).datepicker( "setDate", new Date());
$("#datePicker").datepicker( "setDate", new Date());

//拉今天的价格去
accommodationPriceList.getAccommodationPriceList(new Date());


events = {
    "click .prevWeek": util.prevWeek,
    "click .nextWeek": util.nextWeek,
    //按钮js改变日期
    "dateChange #datePicker": function(){accommodationPriceList.getAccommodationPriceList($(this).datepicker("getDate"))},
    //用户选择改变日期
    "change #datePicker": function(){accommodationPriceList.getAccommodationPriceList($(this).datepicker("getDate"))},
    "resize window": util.mainContainer,
    "show.bs.modal .modal": modal.centerModals,
    "click .btn-cancel": function(){var that = this; modal.clearModal(that);},


};
util.bindDomAction(events);

util.bindDomAction(seasonManage.events);

util.bindDomAction(monthManage.events);



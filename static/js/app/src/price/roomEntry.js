var header = require("header");
var leftMenu = require("leftMenu");
var accommodationPriceList = require("accommodationPriceList");
var util = require("util");
var seasonManage = require("seasonManage");
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
    "click .lastWeek": util.lastWeek,
    "click .nextWeek": util.nextWeek,
    //按钮js改变日期
    "dateChange #datePicker": function(){accommodationPriceList.getAccommodationPriceList($(this).datepicker("getDate"))},
    //用户选择改变日期
    "change #datePicker": function(){accommodationPriceList.getAccommodationPriceList($(this).datepicker("getDate"))},
    "resize window": util.mainContainer,
    "show.bs.modal .modal": modal.centerModals,
    "click .btn-cancel": function(){var that = this; modal.clearModal(that);},
    "click #editSeasonButton": seasonManage.getSeasons,
    "click #editSeason .salePrice": function(){
        $(".salePrice").removeClass("selected");
        $(".netPrice").removeClass("selected");
        $(this).addClass("selected");
        $("#editSeasonNetPriceButton").parent().addClass("hide");
        $("#editSeasonSalePriceButton").parent().removeClass("hide");
    },
    "click #editSeason .netPrice": function(){
        $(".netPrice").removeClass("selected");
        $(".salePrice").removeClass("selected");
        $(this).addClass("selected");
        $("#editSeasonSalePriceButton").parent().addClass("hide");
        $("#editSeasonNetPriceButton").parent().removeClass("hide");
    },
    "click #editSeasonSalePriceButton": function(){
        $("#seasonRetailPrice").val($(".salePrice.selected").find("p").html());
    },
    "click #editSeasonNetPriceButton": function(){
        $("#seasonCommissionPrice").val($(".netPrice.selected").find("p:eq(0)").html());
        $("#seasonNetPrice").val($(".netPrice.selected").find("p:eq(1)").html());
    },
    "click #editSeasonSalePriceOk": function(){
        var that = this;
        seasonManage.editSalePrice(that);
    },
    "click #editSeasonNetPriceOk": function(){
        var that = this;
        seasonManage.editNetPrice(that);
    },
    "click #editSeasonOk": function(){
        var that = this;
        seasonManage.modifyCampSeason(that);
    }
};
util.bindDomAction(events);


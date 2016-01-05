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
    },
    "click #editMonthButton": function(){
        var startDate = util.getFirstDay(new Date());
        monthManage.getAccommodationMonthPriceList(startDate);
    },
    "click #prevMonth": function(){
        var current = util.stringToDate($("#editMonth .month").attr("start-date"));
        var prevMonth = new Date(current.setMonth(current.getMonth() - 1));
        monthManage.getAccommodationMonthPriceList(prevMonth);
        if (prevMonth.getMonth() === new Date().getMonth()) {
            $("#prevMonth").addClass("hide");
        }
        $("#nextMonth").removeClass("hide");
        $("#editMonth .operateItem").addClass("hide");
    },
    "click #nextMonth": function(){
        var current = util.stringToDate($("#editMonth .month").attr("start-date"));
        var nextMonth = new Date(current.setMonth(current.getMonth() + 1));
        monthManage.getAccommodationMonthPriceList(nextMonth);
        if (nextMonth.getMonth() === 11 - new Date().getMonth()) {
            $("#nextMonth").addClass("hide");
        }
        $("#prevMonth").removeClass("hide");
        $("#editMonth .operateItem").addClass("hide");
    },
    "click #editMonth .salePrice": function(){
        $(this).toggleClass("selected");
        if ($("#editMonth .selected").length === 0) {
            $("#editMonthSalePriceButton").parent().addClass("hide");
        } else {
            $("#editMonthSalePriceButton").parent().removeClass("hide");
        }
    },
    "click #editMonth .netPrice": function(){
        $(this).toggleClass("selected");
        if ($("#editMonth .selected").length === 0) {
            $("#editMonthNetPriceButton").parent().addClass("hide");
        } else {
            $("#editMonthNetPriceButton").parent().removeClass("hide");
        }
    },
    "shown.bs.tab #editMonth a[data-toggle='tab']": function(){
        $("#editMonth .selected").removeClass("selected");
        $("#editMonth .operateItem").addClass("hide");
    },
    "click #editMonthSalePriceButton": function(){
        if ($("#editMonth .selected").length === 1) {
            $("#monthRetailPrice").val($("#editMonth .selected").find("p").html());
        } else {
            $("#monthRetailPrice").attr("placeholder", "批量修改");
        }
    },
    "click #editMonthNetPriceButton": function(){
        if ($("#editMonth .selected").length === 1) {
            $("#monthCommissionPrice").val($("#editMonth .selected").find("p:eq(0)").html());
            $("#monthNetPrice").val($("#editMonth .selected").find("p:eq(1)").html());
        } else {
            $("#monthCommissionPrice").attr("placeholder", "批量修改");
            $("#monthNetPrice").attr("placeholder", "批量修改");
        }
    },
    "click #editMonthSalePriceOk": function(){
        $("#editMonth .selected").find("p").html($("#monthRetailPrice").val());
        $("#editMonth .selected").addClass("changed");
    },
    "click #editMonthNetPriceOk": function(){
        $("#editMonth .selected").find("p:eq(0)").html($("#monthCommissionPrice").val());
        $("#editMonth .selected").find("p:eq(1)").html($("#monthNetPrice").val());
        $("#editMonth .selected").addClass("changed");
    },
    "click #editMonthOk": function(){
        $(".changed").each(function(element){
            if (element.hasClass("salePrice")) {

            }
        })
    }
};
util.bindDomAction(events);


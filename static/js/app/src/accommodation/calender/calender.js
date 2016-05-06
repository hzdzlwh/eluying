/**
 * Created by huwanqi on 16/5/1.
 */
var header = require("header");
var leftMenu = require("leftMenu");
var topMenu = require("../../common/topMenu");
var util = require("util");
var modal = require("modal");

require("jqueryui");
require("datepicker-zh");
require("bootstrap");
require("validation");


$(function(){
    //初始化界面
    header.showHeader();
    //高亮"前台录入"
    $(".settingsEntry").removeClass("selected");
    $(".accomodationEntry").addClass("selected");
    topMenu.showTopMenu();
    modal.modalInit();

    //初始化日历
    // $.datepicker.setDefaults( $.datepicker.regional[ "zh-CN" ] );
    // $("#datePicker").datepicker({
    //     dateFormat: "yy-mm-dd",
    //     changeMonth: true,
    //     changeYear: true
    // });
    // $("#datePicker").datepicker( "setDate", new Date());

    events = {

        "show.bs.modal .modal": modal.centerModals,
        "scroll .calendor-container": function(){
            var scrollLeft = $(this).scrollLeft();
            var scrollTop = $(this).scrollTop();
            $(".accommodation-mainContainer .content .sheader").css("margin-left", -scrollLeft);
            $(".accommodation-mainContainer .content .leftHeader").css("margin-top", -scrollTop);
        },
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);}

    };

    util.bindDomAction(events);

});

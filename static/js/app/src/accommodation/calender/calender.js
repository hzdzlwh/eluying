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
    leftMenu.showLeftMenu();
    topMenu.showTopMenu();
    util.mainContainer();
    modal.modalInit();

    //初始化日历
    $.datepicker.setDefaults( $.datepicker.regional[ "zh-CN" ] );
    $("#datePicker").datepicker({
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        changeYear: true
    });
    $("#datePicker").datepicker( "setDate", new Date());

    events = {

        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);}

    };

    util.bindDomAction(events);

});

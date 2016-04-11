var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");

require("bootstrap");
require("validation");


$(function(){
    //检测IE
    util.checkExplorer();
    //初始化界面
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();
    modal.modalInit();


    events = {

        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);},
    };

    util.bindDomAction(events);

});

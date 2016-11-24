/**
 * Created by Administrator on 2016/11/21.
 */
var AJAXService = require("AJAXService");
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
require("fileupload");
var dsy = require("dsy");
var auth = require('../../common/auth');
auth.checkAuth(auth.BUSINESS_ID);


require("bootstrap");
require("validation");

$(function() {
    //检测IE
    util.checkExplorer();
    //初始化界面
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();
    modal.modalInit();

    var events = {

        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
    };

    util.bindDomAction(events);


});

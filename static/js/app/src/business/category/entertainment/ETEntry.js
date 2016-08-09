/**
 * Created by Administrator on 2016/1/8.
 */
var header = require("header");
var leftMenu = require("leftMenu");
var topMenu = require("../../../common/topMenu");
var util = require("util");
var modal = require("modal");
var ETCategoryList = require("./ETCategoryList");
var addET = require("./addET");
var editETBasic = require("./editETBasic");
var showInfo = require("./showInfo");
var auth = require('../../../common/auth');
auth.checkAuth(auth.BUSINESS_ID);
require("bootstrap");
require("validation");


$(function(){
    //初始化界面
    header.showHeader();
    leftMenu.showLeftMenu();
    topMenu.showTopMenu();
    util.mainContainer();
    modal.modalInit();
    $(".campName").html(localStorage.getItem("campName"));


    // ETCategoryList.loadETCategoryList();


    var events = {

        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);}


    };

    util.bindDomAction(events);

    util.bindDomAction(ETCategoryList.events);

    util.bindDomAction(addET.events);

    util.bindDomAction(editETBasic.events);

    util.bindDomAction(showInfo.events);
});

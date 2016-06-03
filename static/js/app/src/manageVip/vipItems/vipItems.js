/**
 * Created by zhaoyongsheng on 16/6/2.
 */
var AJAXService = require("AJAXService");
var header = require("header");
var util = require("util");
var modal = require("modal");
require("angular");

require("jqueryui");
require("datepicker-zh");
require("bootstrap");
require("validation");

$(function() {
    //初始化界面
    header.showHeader();
    //高亮"会员管理"
    $(".settingsEntry").removeClass("selected");
    $(".accomodationEntry").removeClass("selected");
    $(".manageVipEntry").addClass("selected");
    modal.modalInit();

    var app = angular.module('vipApp', []);

});
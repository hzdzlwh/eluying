/**
 * Created by huwanqi on 15/12/26.
 */
var util = require("util");
var leftMenu = require("leftMenu");
var header = require("header");
require("laydate");
var trToggle = require("trToggle");

$(document).ready(function(){
    /*
    initialize public modules
     */
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();

    /*
    initialize datepicker
     */
    laydate({
        elem: '#dateInput'
    });
    laydate.skin('danlan');

    trToggle();

});
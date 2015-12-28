/**
 * Created by huwanqi on 2015/12/28.
 */
var util = require("util");
var leftMenu = require("leftMenu");
var header = require("header");
require("laydate");

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

});
var header = require("header");
var util = require("util");

require("bootstrap");

$(function(){
    //检测IE
    util.checkExplorer();
    //初始化界面
    header.showHeader();

});

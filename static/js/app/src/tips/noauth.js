var header = require("header");
var util = require("util");

require("bootstrap");

$(function(){
    //���IE
    util.checkExplorer();
    //��ʼ������
    header.showHeader();

});

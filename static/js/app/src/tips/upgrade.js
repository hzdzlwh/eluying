var header = require("header");
var util = require("util");

require("bootstrap");

$(function(){
    util.checkExplorer();
    header.showHeader();
});
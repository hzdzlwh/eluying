var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var constService = function(app){
    app.service("constService", function(){
        this.statusStr = [
            {},
            {},
            {short: '预', long: '已预订', classStr: 'book', 'title': '预订'},
            {short: '住', long: '已入住', classStr: 'ing', 'title': '入住'},
            {},
            {short: '完', long: '已完成', classStr: 'finish', 'title': '补录'}
        ];
        this.statusStr2 = [
            {short: '预', long: '已预订', classStr: 'book', 'title': '预订'},
            {short: '住', long: '已入住', classStr: 'ing', 'title': '入住'},
            {short: '完', long: '已完成', classStr: 'finish', 'title': '补录'}
        ];
    });
};

module.exports = constService;
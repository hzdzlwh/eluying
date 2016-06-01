var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var constService = function(app){
    app.service("constService", ["$window", function(window){
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
        //0-待处理，1--已拒绝，2-已预订，3-进行中，4-已取消，5-已完成
        this.orderStatusStr = [
            {short: '待', long: '待处理', classStr: 'wait'},
            {short: '拒', long: '已拒绝', classStr: 'refuse'},
            {short: '预', long: '已预订', classStr: 'book'},
            {short: '住', long: '进行中', classStr: 'ing'},
            {short: '取', long: '已取消', classStr: 'cancel'},
            {short: '完', long: '已完成', classStr: 'finish'}
        ];
        this.days = parseInt(window.outerWidth / 100);
        if(this.days < 30){
            this.days = 30;
        }
        this.entryRowsMin = 0;
        this.entryRowsMax = parseInt(window.outerHeight / 48);
        $(".entryList, .accommodation-mainContainer > .content > .sheader").width(this.days * 100);
    }]);
};

module.exports = constService;
/*
 �����������༭��ȡ���ȹ��������õ�������ͨ�õķ���
 */
var util = require("util");
require("angular");

var validateService = function(app){
    app.service("validateService", function(){
        this.checkPhone = function(phoneStr){
            var reg = /^1[3|4|5|7|8]\d{9}$/;
            return reg.test(phoneStr);
        };
    });
};

module.exports = validateService;
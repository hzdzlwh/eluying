var util = require("util");
require("angular");

var validateService = function(app){
    app.service("validateService", function(){
        this.checkName = function(name){
            var regex = /^[0-9A-Za-z\u4E00-\u9FA5\s]{1,30}$/;
            return regex.test(name);
        };
        this.checkPhone = function(phoneStr){
            // var reg = /^1[3|4|5|7|8]\d{9}$/;
            var reg = /^[0-9]{11}$/;
            return reg.test(phoneStr);
        };
        this.checkRemark = function(remark){
            return remark.length <= 140;
        };
        this.checkId = function(idVal){
            var regex = /^[0-9xX]{18}$/;
            return regex.test(idVal);
        };
        this.checkRooms = function(order){
            return order.rooms.length > 0;
        }
    });
};

module.exports = validateService;
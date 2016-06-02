var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var getMoneyWithGunService = function(app){
    app.service("getMoneyWithGunService", function(){
        this.resetGetMoneyWithGun = function(fee, collectionOnlineType, paymentType, getMoney){
            // , getMoney.orderId, onlineType, paymentType, getMoney.orderNum
            var getMoneyWithGun = {};
            getMoneyWithGun.userCode = '';
            getMoneyWithGun.fee = fee;
            getMoneyWithGun.orderId = getMoney.orderId;
            getMoneyWithGun.operator = localStorage.getItem("userName");
            getMoneyWithGun.collectionOnlineType = collectionOnlineType;
            getMoneyWithGun.paymentType = paymentType;
            getMoneyWithGun.serialNum = getMoney.orderNum;
            return getMoneyWithGun
        };
    });
};

module.exports = getMoneyWithGunService;
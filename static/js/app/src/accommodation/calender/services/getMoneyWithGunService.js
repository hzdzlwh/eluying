var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var getMoneyWithGunService = function(app){
    app.service("getMoneyWithGunService", function(){
        this.resetGetMoneyWithGun = function(fee, collectionOnlineType, paymentType, getMoney, payChannelType, payments_new){
            // , getMoney.orderId, onlineType, paymentType, getMoney.orderNum
            var getMoneyWithGun = {};
            getMoneyWithGun.userCode = '';
            getMoneyWithGun.payments_new = payments_new;
            getMoneyWithGun.fee = fee;
            // getMoneyWithGun.fee = 100000000;
            getMoneyWithGun.orderId = getMoney.orderId;
            getMoneyWithGun.operator = localStorage.getItem("userName");
            getMoneyWithGun.collectionOnlineType = collectionOnlineType;
            getMoneyWithGun.paymentType = paymentType;
            getMoneyWithGun.payChannelType = payChannelType;
            getMoneyWithGun.serialNum = getMoney.orderNum;
            return getMoneyWithGun
        };
    });
};

module.exports = getMoneyWithGunService;
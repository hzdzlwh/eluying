var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var getMoneyWithGunService = function(app){
    app.service("getMoneyWithGunService", function(){
        this.resetGetMoneyWithGun = function(fee, orderId, collectionOnlineType, paymentType, serialNum){
            var getMoneyWithGun = {};
            getMoneyWithGun.userCode = '';
            getMoneyWithGun.fee = fee;
            getMoneyWithGun.orderId = orderId;
            getMoneyWithGun.operator = localStorage.getItem("userName");
            getMoneyWithGun.collectionOnlineType = collectionOnlineType;
            getMoneyWithGun.paymentType = paymentType;
            getMoneyWithGun.serialNum = serialNum;
            return getMoneyWithGun
        };
    });
};

module.exports = getMoneyWithGunService;
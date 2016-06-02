var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var getMoneyWithGunCtrl = function(app){
    app.controller("getMoneyWithGunCtrl", ['$rootScope', '$scope',
        function(rootScope, scope){
            scope.submitPayWithAlipay = function(){
                var getMoneyWithGun = rootScope.getMoneyWithGun;
                var authCode = getMoneyWithGun.userCode;
                //var amount = getMoneyWithGun.fee;
                var amount = 0.01;
                var collectionOnlineType = getMoneyWithGun.collectionOnlineType;
                var orderId = getMoneyWithGun.orderId;
                var paymentType = getMoneyWithGun.paymentType;
                AJAXService.ajaxWithToken('GET', 'barcodePayUrl', {
                    amount: amount,
                    authCode: authCode,
                    collectionOnlineType: collectionOnlineType,
                    orderId: orderId,
                    paymentType: paymentType,
                }, function(result){
                    console.log(111);
                });
            };
        }]);
};

module.exports = getMoneyWithGunCtrl;
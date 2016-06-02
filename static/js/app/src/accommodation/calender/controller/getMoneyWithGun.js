var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var getDataService = require('../services/getDataService');
var getMoneyService = require('../services/getMoneyService');

var getMoneyWithGunCtrl = function(app){
    getDataService(app);
    getMoneyService(app);
    app.controller("getMoneyWithGunCtrl", ['$rootScope', '$scope', 'getDataService', 'getMoneyService',
        function(rootScope, scope, getDataService, getMoneyService){
            scope.submitPayWithAlipay = function(){
                var getMoneyWithGun = rootScope.getMoneyWithGun;
                var authCode = getMoneyWithGun.userCode;
                var amount = getMoneyWithGun.fee;
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
                    if(result.code === 1){
                        $("#payWithAlipayModal").modal("hide");
                        getMoneyService.submitGetMoney(rootScope.getMoney, rootScope);
                    }else{
                        $("#payWithAlipayModal .input").val('');
                        modal.somethingAlert(result.msg);
                    }
                });
            };
            // scope.inputOnChange = function(){
            //     var getMoneyWithGun = rootScope.getMoneyWithGun;
            //     if(getMoneyWithGun.userCode.length === 18){
            //         scope.submitPayWithAlipay();
            //     }
            // }
            scope.inputOnKeyUp = function(ev){
                if(ev.which === 13){
                    scope.submitPayWithAlipay();
                }
            };
        }]);
};

module.exports = getMoneyWithGunCtrl;
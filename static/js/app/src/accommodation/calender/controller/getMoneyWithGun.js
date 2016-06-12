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
                        // $("#payWithAlipayModal").modal("hide");
                        // getMoneyService.submitGetMoney(rootScope.getMoney, rootScope);
                        var status = result.data.status;
                        var tradeNum = result.data.tradeNum;
                        if(status === 0){
                            $("#payWithAlipayModal").modal("hide");
                            getMoneyService.submitGetMoney(rootScope.getMoney, rootScope);
                        }else if(status === 1){
                            modal.somethingAlert("收款失败");
                            setTimeout(function(){
                                $("#payWithAlipayModal").modal("hide");
                                $("#getMoneyModal").modal("show");
                            }, 2500);
                        }else if(status === 2){
                            var inter = setInterval(function(){
                                AJAXService.ajaxWithToken('GET', 'getPayStatus4BarcodeUrl', {
                                    tradeNum: tradeNum
                                }, function(result1){
                                    if(result1.code === 1){
                                        var status1 = result1.data.status;
                                        if(status1 === 0){
                                            clearInterval(inter);
                                            $("#payWithAlipayModal").modal("hide");
                                            getMoneyService.submitGetMoney(rootScope.getMoney, rootScope);
                                        }else if(status1 === 1){
                                            modal.somethingAlert("收款失败");
                                            setTimeout(function(){
                                                $("#payWithAlipayModal").modal("hide");
                                                $("#getMoneyModal").modal("show");
                                            }, 2500);
                                            clearInterval(inter);
                                        }
                                    }
                                });
                            }, 5000);
                        }
                    }else{
                        $("#payWithAlipayModal .input").val('');
                        modal.somethingAlert(result.msg);
                    }
                });
            };
            scope.inputOnKeyUp = function(ev){
                if(ev.which === 13){
                    scope.submitPayWithAlipay();
                }
            };
            scope.returnToGetMoney = function(){
                $("#payWithAlipayModal").modal("hide");
                $("#getMoneyModal").modal("show");
            };
        }]);
};

module.exports = getMoneyWithGunCtrl;
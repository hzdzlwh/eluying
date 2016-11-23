var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var getDataService = require('../services/getDataService');
var getMoneyService = require('../services/getMoneyService');
var accommodationService = require('../services/accommodationService');

var getMoneyWithGunCtrl = function(app){
    getDataService(app);
    getMoneyService(app);
    app.controller("getMoneyWithGunCtrl", ['$rootScope', '$scope', 'getDataService', 'getMoneyService', 'accommodationService',
        function(rootScope, scope, getDataService, getMoneyService, accommodationService){
            scope.submitPayWithAlipay = function(){
                var getMoney = rootScope.getMoney;
                var getMoneyWithGun = rootScope.getMoneyWithGun;
                var authCode = getMoneyWithGun.userCode;
                var orderId = getMoneyWithGun.orderId;
                AJAXService.ajaxWithToken('GET', 'finishPaymentUrl', {
                    authCode: authCode,
                    remark: getMoney.remark,
                    dateTime: (new Date()).valueOf(),
                    orderId: orderId,
                    orderType: -1,
                    payments: JSON.stringify(getMoneyWithGun.payments_new),
                }, function(result){
                    if(result.code === 1){
                        // $("#payWithAlipayModal").modal("hide");
                        // getMoneyService.submitGetMoney(rootScope.getMoney, rootScope);
                        var status = result.data.status;
                        var tradeNum = result.data.tradeNum;
                        if(status === 0){
                            $("#payWithAlipayModal").modal("hide");
                            //getMoneyService.submitGetMoney(rootScope.getMoney, rootScope);
                            modal.somethingAlert("收银成功");
                            $("#getMoneyModal").modal("hide");
                            getDataService.getRoomsAndStatus(scope);
                            accommodationService.emptySelectedEntries(scope);
                            setTimeout(function(){
                                getDataService.getOrderDetail(getMoney.orderId, scope);
                            }, 2500);
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
                                            modal.somethingAlert("收银成功");
                                            $("#getMoneyModal").modal("hide");
                                            getDataService.getRoomsAndStatus(scope);
                                            accommodationService.emptySelectedEntries(scope);
                                            setTimeout(function(){
                                                getDataService.getOrderDetail(getMoney.orderId, scope);
                                            }, 2500);
                                            // getMoneyService.submitGetMoney(rootScope.getMoney, rootScope);
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
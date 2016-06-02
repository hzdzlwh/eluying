var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var orderService = require("../services/orderService");
var getMoneyService = require("../services/getMoneyService");
var getDataService = require("../services/getDataService");
var accommodationService = require("../services/accommodationService");
var getMoneyWithGunService = require("../services/getMoneyWithGunService");

var getMoneyCtrl = function(app){
    orderService(app);
    getMoneyService(app);
    getDataService(app);
    accommodationService(app);
    getMoneyWithGunService(app);
    app.controller("getMoneyCtrl", ['$rootScope', '$scope', 'orderService', 'getMoneyService',
        'getMoneyWithGunService', 'getDataService', 'accommodationService',
        function(rootScope, scope, orderService, getMoneyService, getMoneyWithGunService, getDataService, accommodationService){
            scope.calPrice = function(getMoney){
                var price = orderService.calPrice(getMoney);
                if(getMoney.penaltyAd){
                    price += parseFloat(getMoney.penaltyAd);
                }
                if(getMoney.roomsRefund){
                    price -= parseFloat(getMoney.roomsRefund);
                }
                return price;
            };
            scope.calLeft = getMoneyService.calLeft;
            scope.totalPrice = orderService.totalPrice;
            scope.calDeposit = orderService.calDeposit;
            scope.itemPrice = orderService.itemPrice;
            scope.addPayment = getMoneyService.addPayment;
            scope.changePayChannel = getMoneyService.changePayChannel;
            scope.finishPay = function(){
                var getMoney = rootScope.getMoney;
                var payments_new = [];
                var alipayMoneyTotal = 0;
                var onlineType = null;
                var paymentType = null;
                getMoney.payments.forEach(function(d){
                    if(d.isNew && d.fee > 0){
                        payments_new.push(d);
                        if(d.payChannelId === -6 || d.payChannelId === -8){
                            alipayMoneyTotal += parseFloat(d.fee);
                            onlineType = d.payChannelId;
                            paymentType = d.type;
                        }
                    }
                });

                if(alipayMoneyTotal > 0){
                    //要去扫码付钱
                    onlineType = onlineType === -6 ? 2 : 1;
                    rootScope.getMoneyWithGun =
                        getMoneyWithGunService.resetGetMoneyWithGun(alipayMoneyTotal, getMoney.orderId, onlineType, paymentType, getMoney.orderNum);
                    $("#payWithAlipayModal").modal("show");
                }else{
                    if(!getMoney.async){
                        //直接提交
                        AJAXService.ajaxWithToken('GET', 'finishPaymentUrl', {
                            payments: JSON.stringify(payments_new),
                            remark: getMoney.remark,
                            orderId: getMoney.orderId
                        }, function(result){
                            if(result.code === 1){
                                modal.somethingAlert("收银成功");
                                $("#getMoneyModal").modal("hide");
                                getDataService.getRoomsAndStatus(rootScope);
                                accommodationService.emptySelectedEntries(rootScope);
                            }else{
                                modal.somethingAlert(result.msg);
                            }
                        });
                    }else{
                        AJAXService.ajaxWithToken('GET', 'checkInOrCheckoutUrl', {
                            payments: JSON.stringify(payments_new),
                            orderId: getMoney.orderId,
                            rooms: JSON.stringify(getMoney.checkoutRooms),
                            type: getMoney.checkoutType,
                        }, function(result){
                            if(result.code === 1){
                                modal.somethingAlert("操作成功!");
                                $("#getMoneyModal").modal("hide");
                                getDataService.getRoomsAndStatus(rootScope);
                                accommodationService.emptySelectedEntries(rootScope);
                            }else{
                                modal.somethingAlert(result.msg);
                            }
                        });
                    }
                }
            };
        }]);
};

module.exports = getMoneyCtrl;
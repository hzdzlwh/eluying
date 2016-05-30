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
            scope.calPrice = orderService.calPrice;
            scope.calLeft = orderService.calLeft;
            scope.totalPrice = orderService.totalPrice;
            scope.calDeposit = orderService.calDeposit;
            scope.itemPrice = orderService.itemPrice;
            scope.addPayment = getMoneyService.addPayment;
            scope.changePayChannel = getMoneyService.changePayChannel;
            scope.finishPay = function(){
                var getMoney = rootScope.getMoney;
                var payments_new = [];
                var alipayMoneyTotal = 0;
                getMoney.payments.forEach(function(d){
                    if(d.isNew && d.fee > 0){
                        payments_new.push(d);
                        if(d.payChannelId === -6 || d.payChannelId === -8){
                            alipayMoneyTotal += parseFloat(d.fee);
                        }
                    }
                });

                if(payments_new.length === 0){
                    modal.somethingAlert('请选择一种付款方式!');
                }

                if(alipayMoneyTotal > 0){
                    //要去扫码付钱
                    rootScope.getMoneyWithGun =
                        getMoneyWithGunService.resetGetMoneyWithGun(alipayMoneyTotal, getMoney.orderId);
                    $("#payWithAlipayModal").modal("show");
                }else{
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
                }
                // var rooms = [];
                // getMoney.rooms.forEach(function(d){
                //     if(d.selected){
                //         rooms.push({
                //             startDate: d.startDate,
                //             endDate: d.endDate,
                //             roomId: d.roomId,
                //         });
                //     }
                // });
                // AJAXService.ajaxWithToken('GET', 'checkInOrCheckoutUrl', {
                //     payments: JSON.stringify(payments_new),
                //     orderId: getMoney.orderId,
                //     type: 0,
                //     rooms: JSON.stringify(rooms)
                // }, function(result){
                //     if(result.code === 1){
                //         //TODO 提示入住/退房成功
                //         $("#getMoneyModal").modal("hide");
                //         getDataService.getRoomsAndStatus(rootScope);
                //     }else{
                //         modal.somethingAlert(result.msg);
                //     }
                // });

                // AJAXService.ajaxWithToken('GET', 'finishPaymentUrl', {
                //     payments: JSON.stringify(payments_new),
                //     remark: getMoney.remark,
                //     orderId: getMoney.orderId
                // }, function(result){
                //     if(result.code === 1){
                //         //TODO 提示收银成功
                //         $("#getMoneyModal").modal("hide");
                //         getDataService.getRoomsAndStatus(rootScope);
                //         accommodationService.emptySelectedEntries(rootScope);
                //     }
                // });
            };
        }]);
};

module.exports = getMoneyCtrl;
var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var orderService = require("../services/orderService");
var orderCancelService = require("../services/orderCancelService");
var getDataService = require("../services/getDataService");

var orderCancelCtrl = function(app){
    orderCancelService(app);
    orderService(app);
    getDataService(app);
    app.controller("orderCancelCtrl", ['$rootScope', '$scope', 'orderCancelService', 'getDataService', 'orderService',
        function(rootScope, scope, orderCancelService, getDataService, orderService){
            scope.itemPrice = orderService.itemPrice;
            scope.calPrice = orderService.calPrice;
            scope.calRefund = orderCancelService.calRefund;
            scope.calDeposit = orderCancelService.calDeposit;
            scope.addNewPayments = orderCancelService.addNewPayments;
            scope.changePayChannel = orderCancelService.changePayChannel;
            scope.submitOrderCancel = function(){
                var orderCancel = rootScope.orderCancel;
                if(orderCancelService.calRefundLeft(orderCancel) !== 0){
                    //提示未完成退款
                    modal.somethingAlert("还有款项未退完");
                    return false;
                }
                if(orderCancelService.calDepositLeft(orderCancel) !== 0){
                    //提示未完成押金退款
                    modal.somethingAlert("还有押金未退完");
                    return false;
                }
                AJAXService.ajaxWithToken('GET', 'orderCancelUrl', {
                    orderId: orderCancel.orderId,
                    payments: JSON.stringify(orderCancel.newPayments)
                }, function(result){
                    if(result.code === 1){
                        //提示退款成功
                        $("#orderCancelModal").modal("hide");
                        getDataService.getRoomsAndStatus(rootScope);
                    }else{
                        modal.somethingAlert(result.msg);
                    }
                });
            };
            scope.moneyChange = function(payment){
                var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
                if(!reg.test(parseFloat(payment.fee))){
                    payment.fee = payment.fee.toString();
                    payment.fee = payment.fee.substr(0, payment.fee.length - 1);
                }
            }
        }]);
};

module.exports = orderCancelCtrl;
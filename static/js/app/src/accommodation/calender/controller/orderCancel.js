var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var orderCancelService = require("../services/orderCancelService");
var getDataService = require("../services/getDataService");

var orderCancelCtrl = function(app){
    orderCancelService(app);
    app.controller("orderCancelCtrl", ['$rootScope', '$scope', 'orderCancelService', 'getDataService',
        function(rootScope, scope, orderCancelService, getDataService){
            scope.calRefund = orderCancelService.calRefund;
            scope.calDeposit = orderCancelService.calDeposit;
            scope.addNewPayments = orderCancelService.addNewPayments;
            scope.changePayChannel = orderCancelService.changePayChannel;
            scope.submitOrderCancel = function(){
                var orderCancel = rootScope.orderCancel;
                if(orderCancelService.calRefundLeft(orderCancel) !== 0){
                    //提示未完成退款
                    return false;
                }
                if(orderCancelService.calDepositLeft(orderCancel) !== 0){
                    //提示未完成押金退款
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
                    }
                });
            };
        }]);
};

module.exports = orderCancelCtrl;
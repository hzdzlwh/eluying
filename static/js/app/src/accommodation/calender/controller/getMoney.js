var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var orderService = require("../services/orderService");
var getMoneyService = require("../services/getMoneyService");
var getDataService = require("../services/getDataService");

var getMoneyCtrl = function(app){
    orderService(app);
    getMoneyService(app);
    app.controller("getMoneyCtrl", ['$rootScope', '$scope', 'orderService', 'getMoneyService',
        'getDataService',
        function(rootScope, scope, orderService, getMoneyService, getDataService){
            scope.calPrice = orderService.calPrice;
            scope.totalPrice = orderService.totalPrice;
            scope.addPayment = getMoneyService.addPayment;
            scope.changePayChannel = getMoneyService.changePayChannel;
            scope.finishPay = function(){
                var getMoney = rootScope.getMoney;
                var payments_new = [];
                getMoney.payments.forEach(function(d){
                    if(d.isNew){
                        payments_new.push(d);
                    }
                });
                AJAXService.ajaxWithToken('GET', 'finishPaymentUrl', {
                    payments: JSON.stringify(payments_new),
                    remark: getMoney.remark,
                    orderId: getMoney.orderId
                }, function(result){
                    if(result.code === 1){
                        //TODO 提示收银成功
                        $("#getMoneyModal").modal("hide");
                        getDataService.getRoomsAndStatus(rootScope);
                    }
                });
            };
        }]);
};

module.exports = getMoneyCtrl;
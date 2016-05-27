var util = require("util");
require("angular");

var orderEditService = require("../services/orderEditService");
var orderCancelService = require("../services/orderCancelService");
var checkoutService = require("../services/checkinService");
var checkoutAdService = require("../services/checkinService");
var checkinService = require("../services/checkinService");
var getMoneyService = require("../services/getMoneyService");

var orderDetailCtrl = function(app){
    orderEditService(app);
    orderCancelService(app);
    checkoutService(app);
    checkoutAdService(app);
    checkinService(app);
    getMoneyService(app);
    app.controller("orderDetailCtrl", ['$rootScope', '$scope', 'orderEditService', 'orderCancelService',
        'checkoutService', 'checkinService', 'getMoneyService', 'checkoutAdService',
        function(rootScope, scope, orderEditService, orderCancelService, checkoutService, checkinService,
                 getMoneyService, checkoutAdService){
            scope.showOrderEdit = function(){
                rootScope.orderEdit = orderEditService.resetOrderEdit(rootScope);
                $("#orderDetailModal").modal("hide");
                $("#orderEditModel").modal("show");
            };
            scope.showOrderCancel = function(){
                rootScope.orderCancel = orderCancelService.resetOrderCancel(rootScope);
                $("#orderDetailModal").modal("hide");
                $("#orderCancelModal").modal("show");
            };
            scope.showCheckin = function(){
                rootScope.checkin = checkinService.resetCheckin(rootScope);
                $("#orderDetailModal").modal("hide");
                $("#checkinModal").modal("show");
            };
            scope.showCheckout = function(){
                rootScope.checkout = checkoutService.resetCheckout(rootScope);
                $("#orderDetailModal").modal("hide");
                $("#checkoutModal").modal("show");
            };
            scope.showCheckoutAd = function(){
                rootScope.checkoutAd = checkoutAdService.resetCheckoutAd(rootScope);
                $("#orderDetailModal").modal("hide");
                $("#checkoutAdModal").modal("show");
            };
            scope.showGetMoney = function(){
                var orderDetail = rootScope.orderDetail;
                rootScope.getMoney = getMoneyService.resetGetMoney(orderDetail, orderDetail.orderId, 1);
                $("#orderDetailModal").modal("hide");
                $("#getMoneyModal").modal("show");
            };
    }]);
};

module.exports = orderDetailCtrl;
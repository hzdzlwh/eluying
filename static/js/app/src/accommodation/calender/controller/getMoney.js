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
            scope.deletePayment = getMoneyService.deletePayment;
            scope.changePayChannel = getMoneyService.changePayChannel;
            scope.finishPay = function(){
                var getMoney = rootScope.getMoney;
                var left = getMoneyService.calLeft(getMoney);
                var deposit = orderService.calDepositLeft(getMoney);
                //如果是最后一项了而且还没有付清所有款项
                if(getMoney.isLast && (left === 0 || deposit === 0)){
                    $("#arrearsModal").modal('show');
                    rootScope.arrearLeft = left;
                    rootScope.arrearDeposit = deposit;
                    return false;
                }
                getMoneyService.pay(rootScope);
            };
        }]);
};

module.exports = getMoneyCtrl;
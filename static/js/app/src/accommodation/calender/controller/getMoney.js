var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var orderService = require("../services/orderService");
var getMoneyService = require("../services/getMoneyService");
var getDataService = require("../services/getDataService");
var accommodationService = require("../services/accommodationService");
var getMoneyWithGunService = require("../services/getMoneyWithGunService");
var validateService = require("../services/validateService");

var getMoneyCtrl = function(app){
    orderService(app);
    getMoneyService(app);
    getDataService(app);
    accommodationService(app);
    getMoneyWithGunService(app);
    validateService(app);
    app.controller("getMoneyCtrl", ['$rootScope', '$scope', 'orderService', 'getMoneyService',
        'getMoneyWithGunService', 'getDataService', 'accommodationService', 'validateService',
        function(rootScope, scope, orderService, getMoneyService, getMoneyWithGunService,
                 getDataService, accommodationService, validateService){
            scope.calPrice = function(getMoney){
                var price = orderService.calPrice(getMoney);
                if(getMoney.roomsRefund){
                    price -= parseFloat(getMoney.roomsRefund);
                }
                if(price < 0){
                    price = 0;
                }
                if(getMoney.penaltyAd){
                    price += parseFloat(getMoney.penaltyAd);
                }
                return price.toFixed(2);
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
                //直接提交
                if(!validateService.checkRemark(getMoney.remark)){
                    return false;
                }
                var left = parseFloat(getMoneyService.calLeft(getMoney));
                var deposit = parseFloat(orderService.calDepositLeft(getMoney));
                //如果是最后一项了而且还没有付清所有款项
                rootScope.arrearLeft = null;
                rootScope.arrearDeposit = null;
                if(getMoney.isLast && (left != 0 || deposit != 0)){
                    $("#arrearsModal").modal('show');
                    rootScope.arrearLeft = left;
                    rootScope.arrearDeposit = deposit;
                    return false;
                }
                getMoneyService.pay(rootScope);
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

module.exports = getMoneyCtrl;
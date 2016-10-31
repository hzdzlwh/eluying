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
    app.filter('payChannelFilter', function() {
        return function(channel, currentChannel) {
            if (currentChannel.some(function(el) {
                return el.payChannelId === -6 || el.payChannelId === -11
            })) {
                return channel.filter(function(el) {
                    return el.channelId !== -7 || el.channelId !== -12
                })
            }

            if (currentChannel.some(function(el) {
                    return el.payChannelId === -7 || el.payChannelId === -12
                })) {
                return channel.filter(function(el) {
                    return el.channelId !== -6 || el.channelId !== -11
                })
            }

            return channel;
        }
    });
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
            scope.$on('openGetMoneyFromOrderDetail', function() {
                scope.isOrderDetail = true;
            })
            scope.finishPay = function(){
                var getMoney = rootScope.getMoney;
                //直接提交
                if(!validateService.checkRemark(getMoney.remark)){
                    return false;
                }
                var left = parseFloat(getMoneyService.calLeft(getMoney));
                if (left > 0) {
                    modal.somethingAlert('订单未结清，不能完成收银');
                    return
                }
                var deposit = parseFloat(orderService.calDepositLeft(getMoney));
                //如果是最后一项了而且还没有付清所有款项
                rootScope.arrearLeft = null;
                rootScope.arrearDeposit = null;
                if(getMoney.isLast && (left != 0)){
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
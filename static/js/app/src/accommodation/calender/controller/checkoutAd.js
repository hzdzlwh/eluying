var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var orderService = require("../services/orderService");
var checkoutAdService = require("../services/checkoutAdService");
var getMoneyService = require("../services/getMoneyService");

var checkoutAdCtrl = function(app){
    orderService(app);
    checkoutAdService(app);
    app.controller("checkoutAdCtrl", ['$rootScope', '$scope', 'checkoutAdService', 'orderService', 'getMoneyService',
        function(rootScope, scope, checkoutAdService, orderService, getMoneyService){
            scope.addItem = function(){};
            scope.deleteItem = orderService.deleteItem;
            scope.selectCheckoutAdRoom = checkoutAdService.selectCheckoutAdRoom;
            scope.addItem = orderService.addItem;
            scope.changeItem = orderService.changeItem;
            scope.changeItemTime = orderService.changeItemTime;
            scope.changeItemMonth = orderService.changeItemMonth;
            scope.changeItemNum = orderService.changeItemNum;
            scope.calRoomRefund = checkoutAdService.calRoomRefund;
            scope.calLeft = orderService.calLeft;
            scope.calDeposit = orderService.calDeposit;
            scope.submitCheckoutAd = function(){
                var checkoutAd = rootScope.checkoutAd;
                if(checkoutAd.consumedRooms.length === 0){
                    modal.somethingAlert("请选择提前退房房间!");
                    return false;
                }
                //如果正在退最后一间房
                var flag = false;
                var flag2 = false;
                var rooms = checkoutAd.rooms;
                rooms.forEach(function(d){
                    if(!d.selected && d.state !== 2){
                        flag = true;
                    }
                });
                //如果有项目没用完
                if(!flag){
                    var items = checkoutAd.foodItems.concat(checkoutAd.playItems);
                    items.forEach(function(d){
                        if(d.amount !== d.usedAmount){
                            flag2 = true;
                        }
                    })
                }
                if(!flag && flag2){
                    $("#keepOrNotModal").modal("show");
                    return false;
                }
                
                rootScope.checkoutAfterConfirm(4);
            };
            scope.totalPrice = function(checkoutAd){
                var left = orderService.itemPrice(checkoutAd);
                left -= parseFloat(checkoutAd.roomsRefund || 0);
                left = left - checkoutAd.discounts;
                left = left < 0 ? 0 : left.toFixed(2)*100/100;
                left += parseFloat(checkoutAd.penaltyAd || 0);
                var payments = checkoutAd.payments;
                if(payments){
                    for(var i = 0; i < payments.length; i++){
                        if(payments[i].type === 0){
                            left -= parseFloat(payments[i].fee);
                        }else if(payments[i].type === 2){
                            left += parseFloat(payments[i].fee);
                        }
                    }
                }
                return left;
            }
        }]);
};

module.exports = checkoutAdCtrl;
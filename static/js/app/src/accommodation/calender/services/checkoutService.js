var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var checkoutService = function(app){
    app.service("checkoutService",function(){
        this.resetCheckout = function(order){
            var orderDetail = scope.orderDetail;
            var checkout = {};
            for(var key in orderDetail){
                checkout[key] = orderDetail[key];
            }
            checkout.penaltyAd = 0;
            checkout.payments.forEach(function(d){
                if(d.type === 5){
                    checkout.discounts = d.fee;
                }
            });
            //准备好餐饮数据
            checkout.foodItems.forEach(function(d){
                AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                    date: d.date,
                    id: d.categoryId
                }, function(result){
                    d.dateStr = d.date;
                    d.dateStr2 = d.date.substr(5, 5);
                    d.date = new Date(d.date);
                    d.inventory = result.data.inventory;
                    scope.$apply();
                });
            });
            //准备好娱乐数据
            checkout.playItems.forEach(function(d){
                AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                    date: d.date,
                    id: d.categoryId
                }, function(result){
                    d.dateStr = d.date;
                    d.dateStr2 = d.date.substr(5, 5);
                    d.date = new Date(d.date);
                    d.inventory = result.data.inventory;
                    scope.$apply();
                });
            });
            return checkout;
        };
        this.selectCheckoutRoom = function(room){
            room.selected = true;
        }
    });
};

module.exports = checkoutService;
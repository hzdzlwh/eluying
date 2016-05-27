var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var checkoutAdService = function(app){
    app.service("checkoutAdService",function(){
        this.resetCheckoutAd = function(scope){
            var orderDetail = scope.orderDetail;
            var checkoutAd = {};
            for(var key in orderDetail){
                checkoutAd[key] = orderDetail[key];
            }
            checkoutAd.penaltyAd = 0;
            checkoutAd.payments.forEach(function(d){
                if(d.type === 5){
                    checkoutAd.discounts = d.fee;
                }
            });
            checkoutAd.foodItems.forEach(function(d){
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
            checkoutAd.playItems.forEach(function(d){
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
            return checkoutAd;
        };
        this.selectCheckoutAdRoom = function(room){
            room.selected = !room.selected;
        }
    });
};

module.exports = checkoutAdService;
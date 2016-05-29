var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var checkoutService = function(app){
    app.service("checkoutService",function(){
        this.resetCheckout = function(scope){
            var orderDetail = scope.orderDetail;
            var checkout = {};
            for(var key in orderDetail){
                checkout[key] = orderDetail[key];
            }
            //checkout.penaltyAd = 0;
            checkout.payments.forEach(function(d){
                if(d.type === 5){
                    checkout.discounts = d.fee;
                }
            });
            var today = new Date();
            checkout.rooms.forEach(function(r){
                var endDate = new Date(r.endDate);
                if(r.state === 1 && (endDate < today) || util.isSameDay(endDate, today)){
                    r.selectable = true;
                }else{
                    r.selectable = false;
                }
            });
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
            room.selected = !room.selected;
        };
    });
};

module.exports = checkoutService;
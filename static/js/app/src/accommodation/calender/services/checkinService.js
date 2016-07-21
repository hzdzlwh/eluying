var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var checkinService = function(app){
    app.service("checkinService",function(){
        this.resetCheckin = function(scope){
            var orderDetail = scope.orderDetail;
            var checkin = {};
            for(var key in orderDetail){
                checkin[key] = orderDetail[key];
            }
            // checkin.penaltyAd = 0;
            checkin.payments.forEach(function(d){
                if(d.type === 5){
                    checkin.discounts = d.fee;
                }
            });
            //checkin.foodItems.forEach(function(d){
            //    AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
            //        date: d.date,
            //        id: d.categoryId
            //    }, function(result){
            //        d.dateStr = d.date;
            //        d.dateStr2 = d.date.substr(5, 5);
            //        d.date = new Date(d.date);
            //        d.inventory = result.data.inventory;
            //        if(checkin.foodsAmount && checkin.foodsAmount[d.dateStr]){
            //            d.inventory += checkin.foodsAmount[d.dateStr];
            //        }
            //        scope.$apply();
            //    });
            //});
            checkin.playItems.forEach(function(d){
                AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                    date: d.date,
                    id: d.categoryId
                }, function(result){
                    d.dateStr = d.date;
                    d.dateStr2 = d.date.substr(5, 5);
                    d.date = new Date(d.date);
                    d.inventory = result.data.inventory;
                    if(checkin.foodsAmount && checkin.foodsAmount[d.dateStr]){
                        d.inventory += checkin.foodsAmount[d.dateStr];
                    }
                    scope.$apply();
                });
            });
            return checkin;
        };
        this.selectCheckinRoom = function(room){
            room.selected = !room.selected;
        };
    });
};

module.exports = checkinService;
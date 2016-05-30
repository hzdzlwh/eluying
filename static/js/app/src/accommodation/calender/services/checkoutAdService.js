var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var checkoutAdService = function(app){
    app.service("checkoutAdService", ['$rootScope', function(rootScope){
        this.resetCheckoutAd = function(scope){
            var orderDetail = scope.orderDetail;
            var checkoutAd = {};
            for(var key in orderDetail){
                checkoutAd[key] = orderDetail[key];
            }
            checkoutAd.roomsRefund = 0;
            checkoutAd.penaltyAd = 0;
            checkoutAd.consumedRooms = [];
            var today = new Date();
            checkoutAd.rooms.forEach(function(r){
                var endDate = new Date(r.endDate);
                if(r.state === 1 && endDate > today){
                    r.selectable = true;
                }else{
                    r.selectable = false;
                }
            });
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
        var calRoomRefund = function(checkoutAd){
            var rooms = checkoutAd.rooms;
            var consumedRooms = checkoutAd.consumedRooms;
            var fee = 0;
            consumedRooms.forEach(function(d){
                rooms.forEach(function(dd){
                    if(dd.roomId === d.roomId){
                        fee += (dd.fee - d.fee);
                    }
                });
            });
            checkoutAd.roomsRefund = fee;
        };
        this.selectCheckoutAdRoom = function(room, checkoutAd){
            room.selected = !room.selected;
            //获取入住部分房价
            var rooms = checkoutAd.rooms;
            var selectedRoom = [];
            rooms.forEach(function(d){
                if(d.selected){
                    selectedRoom.push({
                        startDate: d.startDate,
                        endDate: d.endDate,
                        roomId: d.roomId,
                    });
                }
            });
            var getRoomFee = {
                orderId: checkoutAd.orderId,
                rooms: JSON.stringify(selectedRoom)
            };
            AJAXService.ajaxWithToken('GET', 'getRoomFeeUrl', getRoomFee, function(result){
                checkoutAd.consumedRooms = result.data.list;
                calRoomRefund(checkoutAd);
                rootScope.$apply();
            });
        };
        this.calRoomRefund = calRoomRefund;
    }]);
};

module.exports = checkoutAdService;
var util = require("util");
require("angular");

var orderDetailService = function(app){
    app.service("orderDetailService", ['$rootScope', function(rootScope){
        this.resetOrderDetail = function(order){
            var orderDetail = {};
            for(var key in order){
                orderDetail[key] = order[key];
            }
            if(orderDetail['customerIdCardArr'] && orderDetail['customerIdCardArr'][0]){
                orderDetail.selectedId = orderDetail['customerIdCardArr'][0].idCardType;
                rootScope.idList.forEach(function(d){
                    if(d.key == orderDetail.selectedId) {
                        orderDetail.selectedIdLabel = d.label;
                    }
                });
                orderDetail.idVal = orderDetail['customerIdCardArr'][0].idCardNum;
            }
            orderDetail.discounts = 0;
            orderDetail.penaltyAd = 0;
            orderDetail.payments.forEach(function(d){
                if(d.type === 5){
                    orderDetail.discounts = d.fee;
                }
                if(d.type === 4){
                    orderDetail.penaltyAd += d.fee;
                }
                if(d.type === 0 || d.type === 2){
                    orderDetail.isPaid = true;
                }else if(d.type === 1 || d.type === 3){
                    orderDetail.isDepositPaid = true;
                }
            });
            orderDetail.editable = false;
            orderDetail.cancelable = true;
            orderDetail.checkoutAdable = false;
            orderDetail.checkoutable = false;
            orderDetail.checkinable = false;
            orderDetail.getMoneyable = false;
            var rooms = orderDetail.rooms;
            var itemStartDate;
            rooms.forEach(function(d){
                if(!itemStartDate || new Date(d.startDate) < itemStartDate){
                    itemStartDate = new Date(d.startDate);
                }
                if(d.state === 0){
                    orderDetail.editable = true;
                    orderDetail.getMoneyable = true;
                    orderDetail.checkinable = true;
                }else if(d.state === 1){
                    orderDetail.cancelable = false;
                    orderDetail.editable = true;
                    orderDetail.getMoneyable = true;
                    var today = new Date();
                    var endDate = new Date(d.endDate);
                    if(endDate > today && !util.isSameDay(endDate, today)){
                        orderDetail.checkoutAdable = true;
                    }else{
                        orderDetail.checkoutable = true;
                    }
                }else if(d.state === 2){
                    orderDetail.cancelable = false;
                }
            });
            orderDetail.itemStartDate = itemStartDate;
            if(orderDetail.orderState !== 2){
                orderDetail.cancelable = false;
            }else{
                orderDetail.editable = true;
            }
            //var foods = orderDetail.foodItems;
            //var foodsAmounts = {};
            //foods.forEach(function(d){
            //    if(!foodsAmounts[d.date]){
            //        foodsAmounts[d.date] = parseFloat(d.amount);
            //    }
            //    else{
            //        foodsAmounts[d.date] += parseFloat(d.amount);
            //    }
            //});
            //orderDetail.foodsAmount = foodsAmounts;
            var plays = orderDetail.playItems;
            var playsAmounts = {};
            plays.forEach(function(d){
                if(!playsAmounts[d.date]){
                    playsAmounts[d.date] = parseFloat(d.amount);
                }
                else{
                    playsAmounts[d.date] += parseFloat(d.amount);
                }
            });
            orderDetail.playsAmount = playsAmounts;
            return orderDetail;
        };
    }]);
};

module.exports = orderDetailService;
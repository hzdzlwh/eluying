var util = require("util");
require("angular");

var orderDetailService = function(app){
    app.service("orderDetailService",function(){
        this.resetOrderDetail = function(order){
            var orderDetail = {};
            for(var key in order){
                orderDetail[key] = order[key];
            }
            orderDetail.discounts = 0;
            orderDetail.payments.forEach(function(d){
                if(d.type === 5){
                    orderDetail.discounts = d.fee;
                }
            });
            orderDetail.editable = false;
            orderDetail.cancelable = true;
            orderDetail.checkoutAdable = false;
            orderDetail.checkoutable = false;
            orderDetail.checkinable = false;
            orderDetail.getMoneyable = false;
            var rooms = orderDetail.rooms;
            rooms.forEach(function(d){
                if(d.state === 0){
                    orderDetail.editable = true;
                    orderDetail.checkinable = true;
                    orderDetail.getMoneyable = true;
                }else if(d.state === 1){
                    orderDetail.cancelable = false;
                    orderDetail.editable = true;
                    orderDetail.getMoneyable = true;
                    var today = new Date();
                    var endDate = new Date(d.endDate);
                    if(endDate > today || util.isSameDay(endDate, today)){
                        orderDetail.checkoutAdable = true;
                    }else{
                        orderDetail.checkoutable = true;
                    }
                }else if(d.state === 2){
                    orderDetail.cancelable = false;
                }
            });
            if(orderDetail.orderState !== 2){
                orderDetail.cancelable = false;
            }
            console.log(orderDetail)
            return orderDetail;
        };
    });
};

module.exports = orderDetailService;
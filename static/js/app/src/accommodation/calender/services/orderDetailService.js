var util = require("util");
require("angular");

var orderDetailService = function(app){
    app.service("orderDetailService",function(){
        this.resetOrderDetail = function(order){
            var orderDetail = {};
            for(var key in order){
                orderDetail[key] = order[key];
            }
            orderDetail.payments.forEach(function(d){
                if(d.type === 5){
                    orderDetail.discounts = d.fee;
                }
            });
            return orderDetail;
        };
    });
};

module.exports = orderDetailService;
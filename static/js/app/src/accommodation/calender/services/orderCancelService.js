var util = require("util");
require("angular");

var orderCancelService = function(app){
    app.service("orderCancelService",function(){
        this.resetOrderCancel = function(scope){
            var orderDetail = scope.orderDetail;
            var orderCancel = {};
            for(var key in orderDetail){
                orderCancel[key] = orderDetail[key];
            }
            return orderCancel;
        };
        this.calRefund = function(orderCancel){
            var payments = orderCancel.payments;
            var refund = 0;
            payments.forEach(function(d){
                if(d.type === 0){
                    refund += d.fee;
                }
            });
            return refund;
        };
    });
};

module.exports = orderCancelService;
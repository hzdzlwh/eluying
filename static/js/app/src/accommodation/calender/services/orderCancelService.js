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
            console.log(orderCancel);
            return orderCancel;
        };
    });
};

module.exports = orderCancelService;
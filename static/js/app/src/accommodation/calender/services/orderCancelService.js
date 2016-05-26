var util = require("util");
require("angular");

var orderCancelService = function(app){
    app.service("orderCancelService",function(){
        this.resetOrderCancel = function(order){
            var orderCancel = {};
            return orderCancel;
        };
    });
};

module.exports = orderCancelService;
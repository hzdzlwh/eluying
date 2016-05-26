var util = require("util");
require("angular");

var checkoutService = function(app){
    app.service("checkoutService",function(){
        this.resetCheckout = function(order){
            var checkout = {};
            return checkout;
        };
    });
};

module.exports = checkoutService;
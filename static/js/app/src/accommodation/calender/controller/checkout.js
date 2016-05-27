var util = require("util");
require("angular");

var orderService = require("../services/orderService");
var checkoutService = require("../services/checkoutService");

var checkoutCtrl = function(app){
    checkoutService(app);
    orderService(app);
    app.controller("checkoutCtrl", ['$rootScope', '$scope', 'checkoutService', 'orderService',
        function(rootScope, scope, checkoutService, orderService){
            scope.addItem = function(){};
            scope.deleteItem = orderService.deleteItem;
            scope.selectCheckoutRoom = checkoutService.selectCheckoutRoom;
            scope.addItem = orderService.addItem;
            scope.changeItemNum = orderService.changeItemNum;
            scope.submitCheckout = function(){
                console.log(rootScope.checkout);
            }
        }]);
};

module.exports = checkoutCtrl;
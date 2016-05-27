var util = require("util");
require("angular");

var orderService = require("../services/orderService");
var checkoutAdService = require("../services/checkoutAdService");

var checkoutAdCtrl = function(app){
    orderService(app);
    checkoutAdService(app);
    app.controller("checkoutAdCtrl", ['$rootScope', '$scope', 'checkoutAdService', 'orderService',
        function(rootScope, scope, checkoutAdService, orderService){
            scope.addItem = function(){};
            scope.deleteItem = orderService.deleteItem;
            scope.selectCheckoutAdRoom = checkoutAdService.selectCheckoutAdRoom;
            scope.addItem = orderService.addItem;
            scope.changeItemNum = orderService.changeItemNum;
            scope.submitCheckoutAd = function(){
                console.log(rootScope.checkoutAd);
            }
        }]);
};

module.exports = checkoutAdCtrl;
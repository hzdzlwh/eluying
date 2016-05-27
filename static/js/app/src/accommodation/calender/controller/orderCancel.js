var util = require("util");
require("angular");

var orderCancelService = require("../services/orderCancelService");

var orderCancelCtrl = function(app){
    orderCancelService(app);
    app.controller("orderCancelCtrl", ['$rootScope', '$scope', 'orderCancelService',
        function(rootScope, scope, orderCancelService){
            this.calRefund = orderCancelService.calRefund;
        }]);
};

module.exports = orderCancelCtrl;
var util = require("util");
require("angular");

var orderEditService = require("../services/orderEditService");
var orderCancelService = require("../services/orderCancelService");

var orderDetailCtrl = function(app){
    orderEditService(app);
    app.controller("orderDetailCtrl", ['$rootScope', '$scope', 'orderEditService', 'orderCancelService',
        function(rootScope, scope, orderEditService, orderCancelService){
            scope.showOrderEdit = function(){
                rootScope.orderEdit = orderEditService.resetOrderEdit(rootScope);
                $("#orderDetailModal").modal("hide");
                $("#orderEditModel").modal("show");
            };
            scope.showOrderCancel = function(){
                rootScope.orderCancel = orderCancelService.resetOrderCancel(rootScope);
                $("#orderDetailModal").modal("hide");
                $("#orderCancelModal").modal("show");
            };
    }]);
};

module.exports = orderDetailCtrl;
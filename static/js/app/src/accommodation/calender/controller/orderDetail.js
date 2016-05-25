var util = require("util");
require("angular");

var orderEditService = require("../services/orderEditService");

var orderDetailCtrl = function(app){
    orderEditService(app);
    app.controller("orderDetailCtrl", ['$rootScope', '$scope', 'orderEditService',
        function(rootScope, scope, orderEditService){
        scope.showOrderEdit = function(){
            rootScope.orderEdit = orderEditService.resetOrderEdit(rootScope);
            $("#orderDetailModal").modal("hide");
            $("#orderEditModel").modal("show");
        };
        scope.showOrderCancel = function(){
            $("#orderDetailModal").modal("hide");
            $("#orderCancelModal").modal("show");
        };
    }]);
};

module.exports = orderDetailCtrl;
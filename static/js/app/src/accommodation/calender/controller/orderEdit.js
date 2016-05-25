var util = require("util");
require("angular");

var orderService = require("../services/orderService");
var validateService = require("../services/validateService");

var orderEditCtrl = function(app){
    app.controller("orderEditCtrl", ['$rootScope', '$scope', 'orderService', 'validateService',
        function(rootScope, scope, orderService, validateService){
            scope.checkPhone = validateService.checkPhone;
            scope.changeIds = orderService.changeIds;
            scope.changeChannel = orderService.changeChannel;
            scope.changeRoomStartDateMonth = orderService.changeRoomStartDateMonth;
            scope.changeRoomEndDateMonth = orderService.changeRoomEndDateMonth;
            scope.changeRoomStartDate = orderService.changeRoomStartDate;
            scope.changeRoomEndDate = orderService.changeRoomEndDate;
            scope.deleteRoom = orderService.deleteRoom;
            scope.addItem = orderService.addItem;
            scope.deleteItem = orderService.deleteItem;
            scope.changeItem = orderService.changeItem;
            scope.changeItemNum = orderService.changeItemNum;
            scope.changeItemTime = orderService.changeItemTime;
            scope.changeItemMonth = orderService.changeItemMonth;
            scope.calPrice = orderService.calPrice;
            scope.submitOrder = function(){
                console.log(rootScope.orderEdit);
            };
    }]);
};

module.exports = orderEditCtrl;
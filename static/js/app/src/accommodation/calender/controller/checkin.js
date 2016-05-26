var util = require("util");
require("angular");

var orderService = require("../services/orderService");
var checkinService = require("../services/checkinService");

var checkinCtrl = function(app){
    checkinService(app);
    orderService(app);
    app.controller("checkinCtrl", ['$rootScope', '$scope', 'checkinService', 'orderService',
        function(rootScope, scope, checkinService, orderService){
            scope.addItem = function(){};
            scope.deleteItem = orderService.deleteItem;
            scope.selectCheckinRoom = checkinService.selectCheckinRoom;
            scope.addItem = orderService.addItem;
            scope.changeItemNum = orderService.changeItemNum;
            scope.submitCheckin = function(){
                
            }
        }]);
};

module.exports = checkinCtrl;
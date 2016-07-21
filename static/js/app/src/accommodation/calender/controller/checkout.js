var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var orderService = require("../services/orderService");
var checkoutService = require("../services/checkoutService");

var checkoutCtrl = function(app){
    checkoutService(app);
    orderService(app);
    app.controller("checkoutCtrl", ['$rootScope', '$scope', 'checkoutService', 'orderService',
        function(rootScope, scope, checkoutService, orderService){
            scope.changeIds = orderService.changeIds;
            scope.addItem = function(){};
            scope.deleteItem = orderService.deleteItem;
            scope.selectCheckoutRoom = checkoutService.selectCheckoutRoom;
            scope.addItem = orderService.addItem;
            scope.changeItem = orderService.changeItem;
            scope.changeItemTime = orderService.changeItemTime;
            scope.changeItemMonth = orderService.changeItemMonth;
            scope.changeItemNum = orderService.changeItemNum;
            scope.calLeft = orderService.calLeft;
            scope.calDeposit = orderService.calDeposit;
            scope.errorTips = {
                name: false,
                phone: false,
                id: false
            };
            scope.submitCheckout = function(){
                var checkout = rootScope.checkout;
                var rooms = checkout.rooms;
                var selectedRooms = [];
                rooms.forEach(function(d){
                    if(d.selected){
                        selectedRooms.push({
                            startDate: d.startDate,
                            endDate: d.endDate,
                            roomId: d.roomId,
                        });
                    }
                });
                if(selectedRooms.length === 0){
                    modal.somethingAlert("请选择退房房间!");
                    return false;
                }

                //如果正在退最后一间房
                var flag = false;
                var flag2 = false;
                rooms.forEach(function(d){
                    if(!d.selected && d.state !== 2){
                        flag = true;
                    }
                });
                //如果有项目没用完
                if(!flag){
                    var items = checkout.playItems;
                    items.forEach(function(d){
                        if(d.amount !== d.useAmount){
                            flag2 = true;
                        }
                    })
                }
                if(!flag){
                    rootScope.isLast = true;
                }
                if(!flag && flag2){
                    rootScope.selectedCheckoutType = 2;
                    $("#keepOrNotModal").modal("show");
                    return false;
                }

                rootScope.checkoutAfterConfirm(2);
            }
        }]);
};

module.exports = checkoutCtrl;
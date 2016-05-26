var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var orderService = require("../services/orderService");
var orderNewService = require("../services/orderNewService");
var validateService = require("../services/validateService");
var getMoneyService = require("../services/getMoneyService");

var orderNewCtrl = function(app){
    orderService(app);
    orderNewService(app);
    validateService(app);
    getMoneyService(app);
    app.controller("orderNewCtrl", ['$rootScope', '$scope', 'orderNewService',
        'orderService', 'validateService', 'getMoneyService',
        function(rootScope, scope, orderNewService, orderService, validateService, getMoneyService){
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
            var orderNew = rootScope.orderNew;
            var inventory = {};
            var itemList = orderNew.foodItems.concat(orderNew.playItems);
            for(var i = 0; i < itemList.length; i++){
                var item = itemList[i];
                var inv = inventory[item.categoryId + item.dateStr];
                if(!inv){
                    inventory[item.categoryId + item.dateStr] = {
                        amount: item.amount,
                        inventory: item.inventory
                    }
                }else{
                    inv.amount += item.amount;
                    if(inv.amount > inv.inventory){
                        modal.somethingAlert(util.dateFormatWithoutYearCn(item.dateStr2)
                            + '的' + item.name + "购买数量超过库存量!");
                        return false;
                    }
                }
            }
            var rooms = [];
            orderNew.rooms.forEach(function(d){
                var room = {
                    startDate: d.startDate,
                    endDate: d.endDate,
                    roomId: parseInt(d.roomId),
                    id: d.id,
                    fee: d.fee,
                    sub: true,
                };
                rooms.push(room);
            });
            var items = [];
            itemList.forEach(function(d, i){
                items.push({
                    amount: d.amount,
                    date: d.dateStr,
                    id: d.categoryId,
                    name: d.name,
                    price: d.price,
                    priceId: 0,
                    type: d.type
                });
            });
            var type = 0;
            if(orderNew.type === 'book'){
                type = 2;
            }else if(orderNew.type === 'finish'){
                type = 1
            }
            var orderItem = {
                name: orderNew.customerName,
                phone: orderNew.customerPhone,
                origin: orderNew.origin,
                originId: orderNew.originId,
                remark: orderNew.remark,
                type: type,
                items: JSON.stringify(items),
                payments: JSON.stringify([{
                    fee: orderNew.discounts,
                    type: 5
                }]),
                rooms: JSON.stringify(rooms)
            };
            AJAXService.ajaxWithToken('GET', 'confirmOrderUrl', orderItem, function(result3){
                if(result3.code === 1){
                    rootScope.getMoney = getMoneyService.resetGetMoney(rootScope.orderNew, result3.data.orderId, 0);
                    console.log(rootScope.getMoney);
                    rootScope.$apply();
                    $("#newOrderModal").modal("hide");
                    $("#getMoneyModal").modal("show");
                    //AJAXService.ajaxWithToken('GET', 'getOrderDetailUrl', {
                    //    orderId: result3.data.orderId
                    //}, function(result){
                    //    if(result.code === 1){
                    //        console.log(result.data);
                    //        //rootScope.getMoneyItem = getMoneyService.resetGetMoney(orderNew);
                    //        //$(".msgModal").modal("hide");
                    //        //$("#newOrderModal").modal("show");
                    //
                    //
                    //        // initGetMoneyItem();
                    //        // rootScope.getMoneyItem.newOrder(result.data);
                    //        // $("#newOrderModal").modal("hide");
                    //        // $("#getMoneyModal").modal("show");
                    //        // rootScope.initialize();
                    //        // rootScope.updateData();
                    //        // rootScope.$apply();
                    //    }
                    //});
                }
            });
        };
    }]);
};

module.exports = orderNewCtrl;
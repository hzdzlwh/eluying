var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var orderService = require("../services/orderService");
var validateService = require("../services/validateService");
var getDataService = require("../services/validateService");

var orderEditCtrl = function(app){
    orderService(app);
    validateService(app);
    getDataService(app);
    app.controller("orderEditCtrl", ['$rootScope', '$scope', 'orderService', 'validateService', 'getDataService',
        function(rootScope, scope, orderService, validateService, getDataService){
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
            scope.calLeft = orderService.calLeft;
            scope.submitOrder = function(){
                console.log(rootScope.orderEdit);
                var orderEdit = rootScope.orderEdit;
                var rooms = [];
                orderEdit.rooms.forEach(function(d){
                    var room = {
                        endDate: d.endDate,
                        fee: d.fee,
                        id: d.typeId,
                        roomId: d.roomId,
                        startDate: d.startDate,
                        sub: d.sub,
                    };
                    rooms.push(room);
                });
                var items = [];
                var oldItems = orderEdit.foodItems.concat(orderEdit.playItems).concat(orderEdit.goodsItems);
                oldItems.forEach(function(d){
                    console.log(d);
                    var item = {
                        amount: d.amount,
                        date: d.dateStr,
                        id: d.isNew ? d.categoryId : 0,
                        name: d.name,
                        price: d.price,
                        priceId: d.priceId,
                        serviceId: d.isNew ? 0 : d.serviceId,
                        type: d.type,
                    };
                    if(d.type === 3){
                        // delete item.price;
                        delete item.priceId;
                        delete item.date;
                    }
                    items.push(item);
                });
                var order = {
                    name: orderEdit.customerName,
                    phone: orderEdit.customerPhone,
                    remark: orderEdit.remark,
                    orderId: orderEdit.orderId,
                    origin: orderEdit.origin,
                    originId: orderEdit.originId,
                    payments: JSON.stringify([
                        { fee: orderEdit.discounts, payChannel: "优惠", payChannelId: -1, type: 5 }
                    ]),
                    rooms: JSON.stringify(rooms),
                    items: JSON.stringify(items)
                };
                AJAXService.ajaxWithToken('GET', 'orderModifyUrl', order, function(result3){
                    if(result3.code === 1){
                        //提示编辑订单成功
                        $("#orderEditModel").modal("hide");
                        getDataService.getOrderDetail(orderEdit.orderId, rootScope);
                    }else{
                        modal.somethingAlert(result3.msg);
                    }
                });
            };
    }]);
};

module.exports = orderEditCtrl;
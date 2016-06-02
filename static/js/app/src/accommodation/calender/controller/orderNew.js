var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
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
        scope.discountsChange = function(){
            var orderNew = rootScope.orderNew;
            var itemPrice = orderService.itemPrice(orderNew);
            if(orderNew.discounts > itemPrice){
                orderNew.discounts = itemPrice;
            }
        };
        scope.submitOrder = function(){
            var orderNew = rootScope.orderNew;
            orderNew.customerName = orderNew.customerName.trim();
            if(!validateService.checkName(orderNew.customerName)){
                modal.somethingAlert("请输入2~16位用户名!");
                return false;
            }
            if(!validateService.checkPhone(orderNew.customerPhone)){
                modal.somethingAlert("请输入正确的11位手机号!");
                return false;
            }
            if(!validateService.checkRemark(orderNew.remark)){
                modal.somethingAlert("备注最多输入140个字!");
                return false;
            }
            if(orderNew.idVal && !validateService.checkRemark(orderNew.idVal)){
                modal.somethingAlert("请填入16位身份证号!");
                return false;
            }
            var inventory = {};
            var itemList = orderNew.foodItems.concat(orderNew.playItems).concat(orderNew.goodsItems);
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
            if(orderNew.idVal){
                orderItem.customerIdCardArr = JSON.stringify([
                    {
                        idCardNum: orderNew.idVal,
                        idCardType: orderNew.selectedId,
                    }
                ])
            }
            AJAXService.ajaxWithToken('GET', 'confirmOrderUrl', orderItem, function(result3){
                if(result3.code === 1){
                    rootScope.getMoney = getMoneyService.resetGetMoney(rootScope.orderNew, result3.data.orderId, 0);
                    rootScope.$apply();
                    $("#newOrderModal").modal("hide");
                    $("#getMoneyModal").modal("show");
                }else{
                    modal.somethingAlert(result3.msg);
                }
            });
        };
    }]);
};

module.exports = orderNewCtrl;
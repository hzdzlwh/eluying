var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var orderService = require("../services/orderService");
var orderNewService = require("../services/orderNewService");
var validateService = require("../services/validateService");
var getMoneyService = require("../services/getMoneyService");
var getDataService = require("../services/getDataService");
var accommodationService = require("../services/accommodationService");
var idcObj = require("../ieidc");

var orderNewCtrl = function(app){
    orderService(app);
    orderNewService(app);
    validateService(app);
    getMoneyService(app);
    getDataService(app);
    accommodationService(app);
    app.controller("orderNewCtrl", ['$rootScope', '$scope', 'orderNewService',
        'orderService', 'validateService', 'getMoneyService', 'getDataService', 'accommodationService',
        function(rootScope, scope, orderNewService, orderService, validateService, getMoneyService, getDataService, accommodationService){
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
        // scope.errorTips = {
        //     nameEmpty: false,
        //     name: false,
        //     phoneEmpty: false,
        //     phone: false,
        //     id: false
        // };
        scope.discountsChange = function(){
            var orderNew = rootScope.orderNew;
            var itemPrice = orderService.itemPrice(orderNew);
            if(orderNew.discounts > itemPrice){
                orderNew.discounts = itemPrice;
            }
        };

        scope.decreaseTimeAmount = orderService.decreaseTimeAmount;

        scope.increaseTimeAmount = orderService.increaseTimeAmount;

        scope.submitOrder = function(orderNewForm){
            orderNewForm.orderNewCustomerPhone.$setDirty();
            orderNewForm.orderNewCustomerName.$setDirty();
            orderNewForm.$setSubmitted();
            var orderNew = rootScope.orderNew;
            orderNew.customerName = orderNew.customerName && orderNew.customerName.trim();
            var flag = false;
            var orderNewCustomerName = orderNewForm.orderNewCustomerName;
            var orderNewCustomerPhone = orderNewForm.orderNewCustomerPhone;
            var orderNewId = orderNewForm.orderNewId;
            if(orderNewCustomerName.$invalid){
                flag = true;
            }
            if(orderNewCustomerPhone.$invalid){
                flag = true;
            }
            // if(orderNewId.$invalid){
            //     flag = true;
            // }
            if(!validateService.checkRemark(orderNew.remark)){
                flag = true;
            }
            if(flag){
                modal.somethingAlert("信息填写有误!");
                return false;
            }
            var inventory = {};
            var itemList = orderNew.playItems.concat(orderNew.goodsItems);
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
            var entertainmentItems = [];
            orderNew.goodsItems.forEach(function(d, i){
                if(d.amount === 0){
                    return false;
                }
                
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

            orderNew.playItems.forEach(el => {
                if(el.amount === 0){
                    return false;
                }
                entertainmentItems.push({
                    amount: el.amount,
                    categoryId: el.categoryId,
                    categoryName: el.name,
                    date: el.dateStr,
                    price: el.price,
                    timeAmount: el.timeAmount,
                });
            })
            

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
                    fee: orderNew.discounts || 0,
                    type: 5,
                    payChannel: '优惠',
                    payChannelId: -4,
                }]),
                rooms: JSON.stringify(rooms),
                entertainmentItems: JSON.stringify(entertainmentItems),
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
                    orderNewForm.$setPristine();
                    getDataService.getRoomsAndStatus(rootScope);
                    accommodationService.emptySelectedEntries(rootScope);
                    rootScope.$apply();
                    $("#newOrderModal").modal("hide");
                    getDataService.getOrderDetail(result3.data.orderId, rootScope);
                }else{
                    modal.somethingAlert(result3.msg);
                }
            });
        };
        scope.hideModal = function(orderNewForm){
            orderNewForm.$setPristine();
            $("#newOrdermodal").modal("hide");
        };
        scope.$watch("orderNew.discounts", function(){
            if(!rootScope.orderNew || !rootScope.orderNew.discounts){
                return false;
            }
            var itemPrice = orderService.itemPrice(rootScope.orderNew);
            if(rootScope.orderNew.discounts > itemPrice){
                rootScope.orderNew.discounts = itemPrice;
            }
            var reg = /^\d+(\.(\d{0,2}))?$/;
            // var reg = /^(?!0+(?:\.0+)?$)(?:[0-9]\d*|0)(?:\.\d{1,2})?$/;
            if(!reg.test((rootScope.orderNew.discounts))){
                rootScope.orderNew.discounts =
                    rootScope.orderNew.discounts.substr(0, rootScope.orderNew.discounts.length - 1);
            }
        })
    }]);
};

module.exports = orderNewCtrl;
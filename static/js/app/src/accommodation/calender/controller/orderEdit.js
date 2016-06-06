var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var orderService = require("../services/orderService");
var validateService = require("../services/validateService");
var getDataService = require("../services/validateService");
var idcObj = require("../ieidc");

var orderEditCtrl = function(app){
    orderService(app);
    validateService(app);
    getDataService(app);
    app.controller("orderEditCtrl", ['$rootScope', '$scope', 'orderService', 'validateService', 'getDataService',
        function(rootScope, scope, orderService, validateService, getDataService){
            // scope.checkPhone = validateService.checkPhone;
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
            scope.calDeposit = orderService.calDeposit;
            scope.discountsChange = function(){
                var orderEdit = rootScope.orderEdit;
                var itemPrice = orderService.itemPrice(orderEdit);
                if(orderEdit.discounts > itemPrice){
                    orderEdit.discounts = itemPrice;
                }
            };
            scope.errorTips = {
                name: false,
                nameEmpty: false,
                phone: false,
                phoneEmpty: false,
                id: false
            };
            scope.beginReadId = function(){
                idcObj.init();
                idcObj.read(5, 1, rootScope);
            };
            scope.submitOrder = function(){
                var orderEdit = rootScope.orderEdit;
                var flag = false;
                if(orderEdit.customerName.length === 0){
                    scope.errorTips.nameEmpty = true;
                    scope.errorTips.name = false;
                    flag = true;
                } else if(!validateService.checkName(orderEdit.customerName)){
                    //modal.somethingAlert("请输入2~16位用户名!");
                    scope.errorTips.nameEmpty = false;
                    scope.errorTips.name = true;
                    flag = true;
                }
                if(orderEdit.customerPhone.length === 0){
                    scope.errorTips.phone = false;
                    scope.errorTips.phoneEmpty = true;
                    flag = true;
                } else if(!validateService.checkPhone(orderEdit.customerPhone)){
                    //modal.somethingAlert("请输入正确的11位手机号!");
                    scope.errorTips.phoneEmpty = false;
                    scope.errorTips.phone = true;
                    flag = true;
                }
                if(!validateService.checkRemark(orderEdit.remark)){
                    //modal.somethingAlert("备注最多输入140个字!");
                    flag = true;
                }
                if(orderEdit.idVal && !validateService.checkRemark(orderEdit.idVal)){
                    //modal.somethingAlert("请填入16位身份证号!");
                    scope.errorTips.id = true;
                    flag = true;
                }
                if(flag){
                    modal.somethingAlert("信息填写有误!");
                    return false;
                }
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
                    if(d.amount === 0){
                        return false;
                    }
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
                if(orderEdit.idVal){
                    order.customerIdCardArr = JSON.stringify([
                        {
                            idCardNum: orderEdit.idVal,
                            idCardType: orderEdit.selectedId,
                        }
                    ])
                }
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
            scope.$watch("orderEdit.discounts", function(){
                if(!rootScope.orderEdit || !rootScope.orderEdit.discounts){
                    return false;
                }
                var itemPrice = orderService.itemPrice(rootScope.orderEdit);
                if(rootScope.orderEdit.discounts > itemPrice){
                    rootScope.orderEdit.discounts = itemPrice;
                }
                var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
                if(!reg.test(parseFloat(rootScope.orderEdit.discounts))){
                    rootScope.orderEdit.discounts =
                        rootScope.orderEdit.discounts.substr(0, rootScope.orderEdit.discounts.length - 1);
                }
            })
    }]);
};

module.exports = orderEditCtrl;
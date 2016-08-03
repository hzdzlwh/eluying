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
                var mode = $("#orderEditModel .readBtn").html();
                if(mode === '开始读卡'){
                    $("#orderEditModel .readBtn").html('正在读卡...');
                    $("#orderEditModel .readBtn").addClass('ing');
                    setTimeout(function(){
                        idcObj.init();
                        idcObj.read(3, 0, rootScope);
                    }, 500)
                }else{
                    // $("#newOrderModal .readBtn").html('开始读卡');
                    // idcObj.init();
                    // idcObj.idc && idcObj.idc.ReadClose();
                }
            };
            scope.submitOrder = function(orderEditForm){
                var orderEdit = rootScope.orderEdit;
                if(scope.foodToDelete.length > 0){
                    //TODO
                    scope.foodToDelete.forEach(function(d){
                        orderService.deleteFood(orderEdit, d);
                    });
                }
                var flag = false;
                var orderEditCustomerName = orderEditForm.orderEditCustomerName;
                var orderEditCustomerPhone = orderEditForm.orderEditCustomerPhone;
                var orderEditId = orderEditForm.orderEditId;
                if(orderEditCustomerName.$invalid){
                    flag = true;
                }
                if(orderEditCustomerPhone.$invalid){
                    flag = true;
                }
                if(orderEditId.$invalid){
                    flag = true;
                }
                if(!validateService.checkRemark(orderEdit.remark)){
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
                var oldItems = orderEdit.playItems.concat(orderEdit.goodsItems);
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
            scope.hideModal = function(orderEditForm){
                orderEditForm.$setPristine();
                scope.foodToDelete = [];
                $("#orderEditModal").modal("hide");
            };
            scope.$watch("orderEdit.discounts", function(){
                if(!rootScope.orderEdit || !rootScope.orderEdit.discounts){
                    return false;
                }
                var itemPrice = orderService.itemPrice(rootScope.orderEdit);
                if(rootScope.orderEdit.discounts > itemPrice){
                    rootScope.orderEdit.discounts = itemPrice;
                }
                var reg = /^\d+(\.(\d{0,2}))?$/;
                // var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
                if(!reg.test((rootScope.orderEdit.discounts))){
                    rootScope.orderEdit.discounts =
                        rootScope.orderEdit.discounts.substr(0, rootScope.orderEdit.discounts.length - 1);
                }
            });
            scope.foodToDelete = [];
            scope.deleteFood = function(food){
                scope.foodToDelete.push(food);
            };
    }]);
};

module.exports = orderEditCtrl;
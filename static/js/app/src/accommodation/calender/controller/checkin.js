var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var orderService = require("../services/orderService");
var checkinService = require("../services/checkinService");
var getMoneyService = require("../services/getMoneyService");

var checkinCtrl = function(app){
    checkinService(app);
    orderService(app);
    getMoneyService(app);
    app.controller("checkinCtrl", ['$rootScope', '$scope', 'checkinService', 'orderService', 'getMoneyService',
        function(rootScope, scope, checkinService, orderService, getMoneyService){
            scope.addItem = function(){};
            scope.deleteItem = orderService.deleteItem;
            scope.selectCheckinRoom = checkinService.selectCheckinRoom;
            scope.addItem = orderService.addItem;
            scope.changeItem = orderService.changeItem;
            scope.changeItemTime = orderService.changeItemTime;
            scope.changeItemMonth = orderService.changeItemMonth;
            scope.changeItemNum = orderService.changeItemNum;
            scope.calDeposit = orderService.calDeposit;
            scope.calLeft = orderService.calLeft;
            scope.deleteFood = orderService.deleteFood;
            scope.showRoomPeopleModal = orderService.showRoomPeopleModal;
            scope.decreaseTimeAmount = orderService.decreaseTimeAmount;

            scope.increaseTimeAmount = orderService.increaseTimeAmount;
            scope.submitCheckin = function(){
                var checkin = rootScope.checkin;
                var rooms = checkin.rooms;
                var selectedRooms = [];
                rooms.forEach(function(d){
                    if(d.selected){
                        selectedRooms.push({
                            startDate: d.startDate,
                            endDate: d.endDate,
                            roomId: d.roomId,
                            idCardList: JSON.stringify(d.idCardList),
                        });
                    }
                });
                if(selectedRooms.length === 0){
                    modal.somethingAlert("请选择入住房间!");
                    return false;
                }
                var playItems = [];
                checkin.playItems.map(function(el) {
                    if(el.amount === 0){
                        return false;
                    }
                    var playItem = {
                        amount: el.amount,
                        date: el.dateStr,
                        categoryId: el.isNew ? el.categoryId : 0,
                        categoryName: el.name,
                        price: el.price,
                        timeAmount: el.timeAmount,
                        playOrderId: el.playOrderId
                    };
                    playItems.push(playItem);
                });
                var items = [];
                checkin.goodsItems.forEach(function(d){
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
                var postRooms = [];
                rooms.forEach(function(d){
                    var room = {
                        endDate: d.endDate,
                        fee: d.fee,
                        id: d.typeId,
                        roomId: d.roomId,
                        startDate: d.startDate,
                        sub: d.sub,
                        idCardList: JSON.stringify(d.idCardList),
                    };
                    postRooms.push(room);
                });
                var order = {
                    name: checkin.customerName,
                    phone: checkin.customerPhone,
                    remark: checkin.remark,
                    orderId: checkin.orderId,
                    origin: checkin.origin,
                    originId: checkin.originId,
                    payments: JSON.stringify([]),
                    rooms: JSON.stringify(postRooms),
                    items: JSON.stringify(items),
                    foodItems: JSON.stringify([]),
                    playItems: JSON.stringify(playItems),
                };
                AJAXService.ajaxWithToken('GET', 'orderModifyUrl', order, function(result3){
                    if(result3.code === 1){
                        //开始入住
                        AJAXService.ajaxWithToken('GET', 'checkInOrCheckoutUrl', {
                            payments: JSON.stringify([]),
                            orderId: checkin.orderId,
                            type: 0,
                            rooms: JSON.stringify(selectedRooms)
                        }, function(result){
                            if(result.code === 1){
                                rootScope.getMoney = getMoneyService.resetGetMoney(checkin, checkin.orderId, 3);
                                rootScope.$apply();
                                $("#checkinModal").modal("hide");
                                $("#getMoneyModal").modal("show");
                            }else{
                                modal.somethingAlert(result.msg);
                            }
                        });
                    }else {
                        modal.somethingAlert(result3.msg);
                    }
                });
            };
        }]);
};

module.exports = checkinCtrl;
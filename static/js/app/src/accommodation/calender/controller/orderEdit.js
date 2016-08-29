var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var orderService = require("../services/orderService");
var validateService = require("../services/validateService");
var getDataService = require("../services/validateService");
var calendarService = require('../services/calendarService');
var idcObj = require("../ieidc");

var orderEditCtrl = function(app){
    orderService(app);
    validateService(app);
    getDataService(app);
    app.controller("orderEditCtrl", ['$rootScope', '$scope', 'orderService', 'validateService', 'getDataService', 'calendarService',
        function(rootScope, scope, orderService, validateService, getDataService, calendarService){
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

            scope.roomList = [];

            scope.roomCategoryList = [];

            AJAXService.ajaxWithToken('get', '/room/getRoomCategories', {}, function(res) {
                    scope.roomCategoryList = res.data.list.map(el => ({
                        categoryId: el.cId,
                        categoryName: el.cName,
                    }));
                });

            scope.decreaseTimeAmount = orderService.decreaseTimeAmount;

            scope.increaseTimeAmount = orderService.increaseTimeAmount;

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
                // if(orderEditId.$invalid){
                //     flag = true;
                // }
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
                        id: d.typeId || d.categoryId,
                        roomId: d.roomId,
                        startDate: d.startDate,
                        sub: d.sub,
                    };
                    rooms.push(room);
                });

                var playItems = [];
                orderEdit.playItems.map(function(el) {
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
                orderEdit.goodsItems.forEach(function(d){
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
                    items: JSON.stringify(items),
                    foodItems: JSON.stringify([]),
                    playItems: JSON.stringify(playItems),
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

            
            /**
             * 修改房型
             * @param  {} roomCategory 欲修改的房型
             * @param  {} room 房间
             */
            scope.changeRoomCategory = function(roomCategory, room) {
                AJAXService.ajaxWithToken('get', '/room/getAvailRoomsAndPrice',
                    {startDate: room.startDate, endDate: room.endDate, id: roomCategory.categoryId, sub: true})
                    .then(res => {
                        if (res.data.list.length > 0) {
                            scope.roomList = res.data.list;
                        
                            room.roomId = res.data.list[0].roomId;
                            room.serialNum = res.data.list[0].serialNum;
                            room.fee = res.data.price;

                            room.categoryId = roomCategory.categoryId;
                            room.categoryName = roomCategory.categoryName;

                            scope.$apply();  
                        } else {
                             
                            room.roomId = undefined;
                            room.serialNum = '无可用房间';

                            room.ostartDate = room.startDate;
                            room.oendDate = room.endDate;
                            room.sstartDate = room.startDate.substr(5, 5);
                            room.scanlerdarDate = room.startDate;
                            room.sendDate = room.endDate.substr(5, 5);
                            room.ecanlerdarDate = room.endDate;

                            room.categoryId = roomCategory.categoryId;
                            room.categoryName = roomCategory.categoryName;

                            room.fee = null;

                            calendarService.createRoomStartDateCalendar(room);
                            calendarService.createRoomEndDateCalendar(room);
                            
                            scope.$apply(); 
                        }
                                      
                    });
            };
            
            /**
             * 修改房间
             * @param  {} newRoom
             * @param  {} currentRoom
             */
            scope.changeRoom = function(newRoom, currentRoom) {
                newRoom = Object.assign(currentRoom, newRoom);
            }

            scope.$watch('', function() {

            });

            /**
             * 新增房间
             */
            scope.addRoom = function() {
                var orderEdit = rootScope.orderEdit;

                var startDate = orderEdit.rooms[0].startDate;

                // 进行中的订单开始时间为今天，其他状态订单开始时间为订单开始时间,持续一晚
                if (orderEdit.orderState === 3) {
                    startDate = util.dateFormat(new Date());
                } else {
                    orderEdit.rooms.map(el => {
                        if (util.compareDates(startDate, el.startDate)) {
                            startDate = el.startDate;
                        }
                    });

                    // 如果时间是过去，设为今天
                    if (util.compareDates(new Date(), startDate)) {
                        startDate = util.dateFormat(new Date());
                    }
                }
                              
                var endDate = util.dateFormat(util.tomorrow(new Date(startDate)));
               
                var room = {
                    startDate: startDate,
                    endDate: endDate,
                    isNew: true,
                    state: 0,
                    duration: 1,
                    sub: true,
                };

                orderEdit.rooms.push(room);

                // 时间变化后校验房间
                function onDateChange() {
                    if (!room.categoryId) {
                        room.categoryId = scope.roomCategoryList[0].categoryId;
                        room.categoryName = scope.roomCategoryList[0].categoryName;
                    }

                    AJAXService.ajaxWithToken('get', '/room/getAvailRoomsAndPrice',
                        {
                            startDate: room.startDate,
                            endDate: room.endDate,
                            id: room.categoryId,
                            sub: true,
                        })

                        .then(res => {
                            scope.roomList = res.data.list;

                            var hasCurrentRoom = scope.roomList.some(el => el.roomId === room.roomId);

                            // 判断是否有房间可用
                            if (scope.roomList.length > 0) {
                                // 如果没有房间ID或可用房间中没有当前选择的房间,就选择列表中的第一个房间
                                if (!room.roomId || !hasCurrentRoom) {
                                    room.roomId = scope.roomList[0].roomId;
                                    room.serialNum = scope.roomList[0].serialNum;

                                    room.ostartDate = room.startDate;
                                    room.oendDate = room.endDate;
                                    room.sstartDate = room.startDate.substr(5, 5);
                                    room.scanlerdarDate = room.startDate;
                                    room.sendDate = room.endDate.substr(5, 5);
                                    room.ecanlerdarDate = room.endDate;
                                    
                                    calendarService.createRoomStartDateCalendar(room);
                                    calendarService.createRoomEndDateCalendar(room);
                                }

                                room.fee = res.data.price;

                            } else {
                                room.roomId = undefined;
                                room.serialNum = '无可用房间';

                                room.ostartDate = room.startDate;
                                room.oendDate = room.endDate;
                                room.sstartDate = room.startDate.substr(5, 5);
                                room.scanlerdarDate = room.startDate;
                                room.sendDate = room.endDate.substr(5, 5);
                                room.ecanlerdarDate = room.endDate;

                                room.fee = null;

                                calendarService.createRoomStartDateCalendar(room);
                                calendarService.createRoomEndDateCalendar(room);
                                
                            }
                        });
                }

                scope.$watch(function () {
                        return room.endDate;
                    }, onDateChange);

                scope.$watch(function () {
                        return room.startDate;
                    }, onDateChange);
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
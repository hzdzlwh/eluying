var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var getDataService = require("../services/getDataService");
var accommodationService = require("../services/accommodationService");
var shopcartService = require("../services/shopcartService");
var orderService = require("../services/orderService");
var orderNewService = require("../services/orderNewService");
var calendarService = require("../services/calendarService");
var constService = require("../services/constService");
var getMoneyService = require("../services/getMoneyService");

var accommodationCtrl = function(app){
    getDataService(app);
    accommodationService(app);
    shopcartService(app);
    orderService(app);
    orderNewService(app);
    calendarService(app);
    constService(app);
    getMoneyService(app);
    app.controller("accommodationCtrl", ['$rootScope', '$scope', 'getDataService',
        'accommodationService', 'shopcartService', 'orderService', 'orderNewService',
        'calendarService','constService', 'getMoneyService',
        function(rootScope, scope, getDataService, accommodationService,
                 shopcartService, orderService, orderNewService, calendarService, constService, getMoneyService){
            rootScope.startDate = util.diffDate(new Date(), -2);
            rootScope.startDateStr = util.dateFormatWithoutYear(rootScope.startDate);
            rootScope.selectedEntries = {};
            rootScope.statusStr = constService.statusStr;
            rootScope.statusStr2 = constService.statusStr2;
            rootScope.orderStatusStr = constService.orderStatusStr;
            rootScope.entryRowsMin = constService.entryRowsMin;
            rootScope.entryRowsMax = constService.entryRowsMax;
            rootScope.update = function(){};
            rootScope.showOrderDetail = function(orderId){
                getDataService.getOrderDetail(orderId, rootScope);
            };
            rootScope.closeRoom = function(open, rid, dateItem){
                AJAXService.ajaxWithToken('GET', 'modifyRoomStatusUrl', {
                    isAll: false,
                    dateList: JSON.stringify([dateItem.date2]),
                    open: !open ? 0 : 1,
                    roomId: rid
                }, function(result){
                    if(result.code === 1){
                        if(dateItem.s === -1){
                            dateItem.s = 100;
                        }else{
                            dateItem.s = -1;
                        }
                        accommodationService.updateDateInventory(rootScope);
                        rootScope.$apply();
                    }
                });
            };
            rootScope.selectEntry = function(date, roomId){
                var cRoomStore = rootScope.cRoomStore;
                if(rootScope.selectedEntries[roomId + date]){
                    delete rootScope.selectedEntries[roomId + date];
                }else{
                    var roomStore = rootScope.roomStore;
                    var room;
                    for(var i = 0; i < roomStore.length; i++){
                        if(roomStore[i].id == roomId){
                            room = roomStore[i];
                            break;
                        }
                    }
                    var dayItem;
                    for(var j = 0; j < room.st.length; j++){
                        if(room.st[j].date == date){
                            dayItem = room.st[j];
                            break;
                        }
                    }
                    rootScope.selectedEntries[roomId + date] = {
                        date: date,
                        date2: dayItem.date2,
                        roomId: roomId,
                        price: dayItem.p,
                        sn: room.sn,
                        cRoomId: room.ti,
                        cRoomName: cRoomStore[room.ti].name,
                        pRoomId: room.pi
                    };
                }
                shopcartService.showShopCart(rootScope);
            };
            rootScope.processSelectedEntries = accommodationService.processSelectedEntries;
            rootScope.checkBeforeAdd = function(type){
                if(type == 'finish'){
                    if(rootScope.t || rootScope.f){
                        $("#finishWarningModal").modal("show");
                        return false;
                    }
                }else if(type == 'ing'){
                    if(rootScope.p){
                        $("#ingWarningModal").modal("show");
                        return false;
                    }
                }else if(type == 'book'){
                    if(rootScope.p){
                        $("#bookWarningModal").modal("show");
                        return false;
                    }
                }
                rootScope.processSelectedEntries(type);
                $("#newOrderModal").modal("show");
            };
            rootScope.checkoutAfterConfirm = function(type){
                var order;
                if(type === 4){
                    order = rootScope.checkoutAd;
                }else if(type === 2){
                    order = rootScope.checkout;
                }else{
                    return false;
                }
                var rooms = [];
                order.rooms.forEach(function(d){
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
                var oldItems = order.foodItems.concat(order.playItems).concat(order.goodsItems);
                oldItems.forEach(function(d){
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
                    items.push(item);
                });
                var orderItem = {
                    name: order.customerName,
                    phone: order.customerPhone,
                    remark: order.remark,
                    orderId: order.orderId,
                    origin: order.origin,
                    originId: order.originId,
                    payments: JSON.stringify([]),
                    rooms: JSON.stringify(rooms),
                    items: JSON.stringify(items)
                };
                AJAXService.ajaxWithToken('GET', 'orderModifyUrl', orderItem, function(result3){
                    if(result3.code === 1){
                        var rooms = [];
                        order.rooms.forEach(function(d){
                            if(d.selected){
                                rooms.push({
                                    startDate: d.startDate,
                                    endDate: d.endDate,
                                    roomId: d.roomId,
                                });
                            }
                        });
                        var checkoutType;
                        if(type === 4){
                            checkoutType = 2;
                        }else if (type === 2){
                            checkoutType = 1;
                        }
                        var asyncObj = {
                            penaltyAd: order.penaltyAd,
                            checkoutAdRefund: order.roomsRefund,
                            async: true,
                            checkoutType: checkoutType,
                            checkoutRooms: rooms,
                        };
                        rootScope.getMoney =
                            getMoneyService.resetGetMoney(order, order.orderId, type, asyncObj, rootScope.isLast);
                        rootScope.$apply();
                        $("#keepOrNotModal").modal("hide");
                        $("#checkoutAdModal").modal("hide");
                        $("#checkoutModal").modal("hide");
                        $("#getMoneyModal").modal("show");
                        rootScope.selectedCheckoutType = null;
                        rootScope.isLast = false;
                    }else {
                        modal.somethingAlert(result3.msg);
                    }
                });
            };
            rootScope.clearSelectedEntriesByType = accommodationService.clearSelectedEntriesByType;

            rootScope.payWithItems = function(){
                $("#arrearsModal").modal("hide");
                getMoneyService.pay(rootScope);
            };
            
            rootScope.calShowIndex = function(index){
                var roomStore = rootScope.roomStore;  
                var pRoomList = rootScope.pRoomList;  
                var result = 0;
                var count = 0;
                for(var key in roomStore){
                    if(count === index){
                        return result;
                    }
                    var r = roomStore[key];
                    count++;
                    if(pRoomList[r.pi].selected){
                        result++;
                    }
                }
            };

            getDataService.getChannel(function(result){
                rootScope.channels = result.channels;
            });
            getDataService.getItems(function(result){
                rootScope.foodList = result.foodList;
                rootScope.funList = result.funList;
                rootScope.goodsList = result.goodsList;
            });
            getDataService.getIDs(function(result){
                rootScope.idList = result.idList;
            });
            getDataService.getPayChannels(function(result){
                rootScope.payChannels = result.payChannels;
            });
            getDataService.getRoomsAndStatus(rootScope);

    }]);
};

module.exports = accommodationCtrl;
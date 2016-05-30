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
            rootScope.processSelectedEntries = function(type){
                var selectedEntries = rootScope.selectedEntries;
                var selectedEntries_new = {};
                var today = new Date();
                var roomHash = {};
                var selectedRooms = [];
                if(type == 'finish'){
                    for(var key in selectedEntries){
                        var item = selectedEntries[key];
                        var date = new Date(item.date2);
                        if(util.isSameDay(date, today) || date > today){
                            continue;
                        }
                        if(!roomHash[item.cRoomName + item.sn]){
                            selectedRooms.push(item.cRoomName + item.sn);
                            roomHash[item.cRoomName + item.sn] = true;
                        }
                        selectedEntries_new[key] = item;
                    }
                }else if(type == 'ing'){
                    for(var key in selectedEntries){
                        var item = selectedEntries[key];
                        var date = new Date(item.date2);
                        if(!util.isSameDay(date, today) && date < today){
                            continue;
                        }
                        if(!roomHash[item.cRoomName + item.sn]){
                            selectedRooms.push(item.cRoomName + item.sn);
                            roomHash[item.cRoomName + item.sn] = true;
                        }
                        selectedEntries_new[key] = item;
                    }
                }else if(type == 'book'){
                    for(var key in selectedEntries){
                        var item = selectedEntries[key];
                        var date = new Date(item.date2);
                        if(!util.isSameDay(date, today) && date < today){
                            continue;
                        }
                        if(!roomHash[item.cRoomName + item.sn]){
                            selectedRooms.push(item.cRoomName + item.sn);
                            roomHash[item.cRoomName + item.sn] = true;
                        }
                        selectedEntries_new[key] = item;
                    }
                }
                rootScope.selectedRooms = selectedRooms;
                rootScope.selectedEntries = selectedEntries_new;
                var entriesArray = [];
                for(var key in selectedEntries_new){
                    entriesArray.push(selectedEntries_new[key]);
                }
                entriesArray.sort(function(a, b){
                    if(parseInt(a.roomId) > parseInt(b.roomId)
                        || (parseInt(a.roomId) === parseInt(b.roomId) && new Date(a.date2) > new Date(b.date2))){
                        return 1;
                    }if(parseInt(a.roomId) < parseInt(b.roomId)
                        || (parseInt(a.roomId) === parseInt(b.roomId) && new Date(a.date2) < new Date(b.date2))){
                        return -1;
                    }else{
                        return 0;
                    }
                });
                var orderList = [];
                var entry;
                entry = entriesArray[0];
                var temp = orderService.createRoomItem(entry);
                for(var i = 1; i < entriesArray.length; i++){
                    entry = entriesArray[i];
                    var date1 = new Date(entry.date2);
                    var date2 = new Date(temp.endDate);
                    if(entry.roomId === temp.roomId && util.DateDiff(date2, date1) === 1){
                        temp.endDate = entry.date2;
                        temp.sendDate = entry.date;
                        temp.fee += entry.price;
                        temp.days++;
                    }else{
                        var checkoutDate = util.diffDate(new Date(temp.endDate), 1);
                        temp.endDate = util.dateFormat(checkoutDate);
                        temp.sendDate = util.dateFormatWithoutYear(checkoutDate);
                        temp.ecanlerdarDate = util.dateFormat(checkoutDate);
                        calendarService.createRoomStartDateCalendar(temp, type);
                        calendarService.createRoomEndDateCalendar(temp, type);
                        orderList.push(temp);
                        temp = orderService.createRoomItem(entry);
                    }
                }
                var checkoutDate = util.diffDate(new Date(temp.endDate), 1);
                temp.endDate = util.dateFormat(checkoutDate);
                temp.sendDate = util.dateFormatWithoutYear(checkoutDate);
                temp.ecanlerdarDate = util.dateFormat(checkoutDate);
                calendarService.createRoomStartDateCalendar(temp, type);
                calendarService.createRoomEndDateCalendar(temp, type);
                orderList.push(temp);
                rootScope.orderNew = orderNewService.resetOrderNew(type, orderList, rootScope.channels[0].name, -1);
                $(".msgModal").modal("hide");
                $("#newOrderModal").modal("show");
            };
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
                            getMoneyService.resetGetMoney(order, order.orderId, type, asyncObj);
                        // //加上提前违约金
                        // if(type == 4){
                        //     rootScope.getMoney.payments.push(
                        //         {type: 4, fee: order.penaltyAd}
                        //     );
                        //     rootScope.getMoney.penaltyAd = parseFloat(order.penaltyAd);
                        //     rootScope.getMoney.checkoutAdRefund = order.roomsRefund;
                        // }
                        // rootScope.getMoney.async = true; //付款和退房同步
                        rootScope.$apply();
                        $("#keepOrNotModal").modal("hide");
                        $("#checkoutAdModal").modal("hide");
                        $("#checkoutModal").modal("hide");
                        $("#getMoneyModal").modal("show");

                        // AJAXService.ajaxWithToken('GET', 'checkInOrCheckoutUrl', {
                        //     payments: JSON.stringify([]),
                        //     orderId: order.orderId,
                        //     type: checkoutType,
                        //     rooms: JSON.stringify(rooms)
                        // }, function(result){
                        //     if(result.code === 1){
                        //         rootScope.getMoney = getMoneyService.resetGetMoney(order, order.orderId, 4);
                        //         rootScope.$apply();
                        //         $("#keepOrNotModal").modal("hide");
                        //         $("#checkoutAdModal").modal("hide");
                        //         $("#checkoutModal").modal("hide");
                        //         $("#getMoneyModal").modal("show");
                        //     }else{
                        //         modal.somethingAlert(result.msg);
                        //     }
                        // });
                    }else {
                        modal.somethingAlert(result3.msg);
                    }
                });
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
var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var getDataService = require("../services/getDataService");
var accommodationService = require("../services/accommodationService");
var shopcartService = require("../services/shopcartService");
var orderNewService = require("../services/orderNewService");
var calendarService = require("../services/calendarService");
var constService = require("../services/constService");

var accommodationCtrl = function(app){
    getDataService(app);
    accommodationService(app);
    shopcartService(app);
    orderNewService(app);
    calendarService(app);
    constService(app);
    app.controller("accommodationCtrl", ['$rootScope', '$scope', 'getDataService',
        'accommodationService', 'shopcartService', 'orderNewService', 'calendarService','constService',
        function(rootScope, scope, getDataService, accommodationService, shopcartService, orderNewService,
                 calendarService, constService){
            rootScope.startDate = util.diffDate(new Date(), -2);
            rootScope.startDateStr = util.dateFormatWithoutYear(rootScope.startDate);
            rootScope.selectedEntries = {};
            rootScope.statusStr = constService.statusStr;
            rootScope.statusStr2 = constService.statusStr2;
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
                shopcartService.showShopCart();
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
                scope.selectedRooms = selectedRooms;
                scope.selectedEntries = selectedEntries_new;
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
                var temp = orderNewService.createRoomItem(entry);
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
                        calendarService.createRoomStartDateCalendar(temp);
                        calendarService.createRoomEndDateCalendar(temp);
                        orderList.push(temp);
                        temp = orderNewService.createRoomItem(entry);
                    }
                }
                var checkoutDate = util.diffDate(new Date(temp.endDate), 1);
                temp.endDate = util.dateFormat(checkoutDate);
                temp.sendDate = util.dateFormatWithoutYear(checkoutDate);
                temp.ecanlerdarDate = util.dateFormat(checkoutDate);
                calendarService.createRoomStartDateCalendar(temp);
                calendarService.createRoomEndDateCalendar(temp);
                orderList.push(temp);
                // rootScope.orderNew.type = type;
                // rootScope.orderNew.title = (function(){
                //     for(var i = 0; i < STATUS_STR.length; i++){
                //         if(STATUS_STR[i].classStr === type){
                //             return STATUS_STR[i].title;
                //         }
                //     }
                //     return null;
                // })();
                // rootScope.orderNew.selectedChannel = {
                //     name: rootScope.channels[0].name,
                //     id: -1,
                // };
                // rootScope.orderNew.roomList = orderList;
                $(".msgModal").modal("hide");
                $("#newOrderModal").modal("show");
            };

            getDataService.getChannel(function(result){
                rootScope.channels = result.channels;
            });
            getDataService.getItems(function(result){
                rootScope.foodList = result.foodList;
                rootScope.funList = result.funList;
            });
            getDataService.getIDs(function(result){
                rootScope.IDs = result.IDs;
            });
            getDataService.getRoomsAndStatus(rootScope);

    }]);
};

module.exports = accommodationCtrl;
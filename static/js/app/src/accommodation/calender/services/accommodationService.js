var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var shopcartService = require("./shopcartService");
var constService = require("./constService");
var calendarService = require("./calendarService");
var orderService = require("./orderService");
var orderNewService = require("./orderNewService");
var idcObj = require("../ieidc");


var accommodationService = function(app){
    shopcartService(app);
    constService(app);
    calendarService(app);
    orderNewService(app);
    orderService(app);
    app.service("accommodationService", ["$rootScope", "shopcartService", 'constService', 'calendarService', 'orderNewService', 'orderService',
        function(rootScope, shopcartService, constService, calendarService, orderNewService, orderService){
        this.updateDateInventory = function(scope){
            var roomStore = scope.roomStore;
            var lefts = [];
            for(var i = 0; i < constService.days; i++){
                lefts.push(0);
            }
            for(var key in roomStore){
                var room = roomStore[key];
                for(var i = 0; i < room.st.length; i++){
                    if(scope.pRoomList[room.pi].selected && room.st[i].s === -1){
                        lefts[i]++;
                    }
                }
            }
            for(var i = 0; i < constService.days; i++){
                scope.datesArray[i].left = lefts[i];
            }
        };

        this.updateGlyphsPos = function(rootScope){
            var gridHeight = 48;
            var roomIndexHash = {};
            var tnum = 0;
            var pRoomList = rootScope.pRoomList;
            var cRoomArray = rootScope.cRoomArray;
            for(var i = 0; i < cRoomArray.length; i++){
                var tempCRoom = cRoomArray[i];
                if(!pRoomList[tempCRoom.pId].selected){
                    continue;
                }
                for(var r in tempCRoom.rooms){
                    roomIndexHash[r] = tnum++;
                }
            }
            rootScope.glyphs.forEach(function(g){
                var room = roomIndexHash[g.accommodationId];
                var top = gridHeight * room + 1;
                g.top = top;
            });
        };
        
        this.emptySelectedEntries = function(rootScope){
            rootScope.selectedEntries = {};
            shopcartService.showShopCart(rootScope);
        };
        var clearSelectedEntriesByType = function(type){
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
                    if(!roomHash[item.cRoomName + '-' + item.sn]){
                        selectedRooms.push(item.cRoomName + '-' + item.sn);
                        roomHash[item.cRoomName + '-' + item.sn] = true;
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
                    if(!roomHash[item.cRoomName + '-' + item.sn]){
                        selectedRooms.push(item.cRoomName + '-' + item.sn);
                        roomHash[item.cRoomName + '-' + item.sn] = true;
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
                    if(!roomHash[item.cRoomName + '-' + item.sn]){
                        selectedRooms.push(item.cRoomName + '-' + item.sn);
                        roomHash[item.cRoomName + '-' + item.sn] = true;
                    }
                    selectedEntries_new[key] = item;
                }
            }
            rootScope.selectedRooms = selectedRooms;
            rootScope.selectedEntries = selectedEntries_new;
            shopcartService.showShopCart(rootScope);
            $(".msgModal").modal("hide");
        };
        this.clearSelectedEntriesByType = clearSelectedEntriesByType;
        this.processSelectedEntries = function(type){
            var selectedEntries = rootScope.selectedEntries;
            var entriesArray = [];
            for(var key in selectedEntries){
                entriesArray.push(selectedEntries[key]);
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
                    temp.duration++;
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
    }]);
};

module.exports = accommodationService;
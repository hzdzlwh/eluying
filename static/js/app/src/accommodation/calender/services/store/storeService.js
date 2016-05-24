var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var accommodationService = require('../accommodation/accommodationService.js');

var STATUS_STR = [
    {},
    {},
    {short: '预', long: '已预订', classStr: 'book', 'title': '预订'},
    {short: '住', long: '已入住', classStr: 'ing', 'title': '入住'},
    {},
    {short: '完', long: '已完成', classStr: 'finish', 'title': '补录'}
];

var storeService = function(app){
    accommodationService(app);
    app.service("storeService", ["$rootScope", 'accommodationService', function(rootScope, accommodationService){
        this.init = function(){
            this.getChannel();
            this.getItems();
        };
        this.getChannel = function(){
            AJAXService.ajaxWithToken('GET', 'getChannelsUrl', {
                type: 2
            }, function(result){
                var arr1 = [{name: '散客'}];
                var arr2 = result.data.list;
                rootScope.channels = arr1.concat(arr2);
            });
        };
        this.getItems = function(){
            AJAXService.ajaxWithToken('GET', 'getItemsUrl', {}, function(result){
                var items = result.data.list;
                var foods = [];
                var plays = [];
                items.forEach(function(d){
                    if(d.type == 1){
                        foods.push(d);
                    }else if(d.type == 2){
                        plays.push(d);
                    }
                });
                rootScope.foodList = foods;
                rootScope.funList = plays;
            });
        };
        this.getIDs = function(){
            rootScope.idList = [
                {key: 'id', label: '身份证'},
                {key: 'mid', label: '军官证'},
                {key: 'other', label: '其他'},
            ];
        };
        this.getRoomCategories = function(){

        };
        this.getRoomsAndStatus = function(){
            var startDate = rootScope.startDate;
            AJAXService.ajaxWithToken('GET', 'getRoomCategoriesUrl', {}, function(result){
                var pRooms = result.data.list;
                AJAXService.ajaxWithToken('GET', 'getRoomsAndStausUrl', {
                    date: util.dateFormat(startDate),
                    days: 30,
                    sub: true
                }, function(result2){
                    var holiday = result2.data.holidays;
                    var holidayHash = {};
                    holiday.forEach(function(d){
                        holidayHash[d.date] = {
                            str: d.holiday,
                            type: d.type
                        };
                    });
                    var cRooms = result2.data.rs;
                    var orderList = result2.data.orderList;
                    var cRoomStore = {};
                    var roomStore = [];
                    var pRoomList = {};
                    var cRoomList = {};
                    //保存父房型和子房型关系
                    for(var i = 0; i < cRooms.length; i++){
                        var cRoom = cRooms[i];
                        if(!cRoomList[cRoom.ti]){
                            cRoomList[cRoom.ti] = {};
                        }
                        cRoomList[cRoom.ti][cRoom.i] = {
                            id: cRoom.i,
                            sn: cRoom.sn,
                            st: cRoom.st
                        };
                    }
                    //保存子房型列表
                    for(var i = 0; i < pRooms.length; i++){
                        var pRoom = pRooms[i];
                        if(!pRoomList[pRoom.pId]){
                            pRoomList[pRoom.pId] = {
                                id: pRoom.pId,
                                name: pRoom.pName,
                                selected: true
                            };
                        }
                        if(!cRoomStore[pRoom.cId]){
                            cRoomStore[pRoom.cId] = {
                                id: pRoom.cId,
                                name: pRoom.cName,
                                pId: pRoom.pId,
                                rooms: cRoomList[pRoom.cId]
                            };
                        }
                    }
                    //保存房间列表
                    var roomIndexHash = {};
                    var tnum = 0;
                    for(var c in cRoomStore){
                        var tempCRoom = cRoomStore[c];
                        for(var r in tempCRoom.rooms){
                            for(var k = 0; k < tempCRoom.rooms[r].st.length; k++){
                                tempCRoom.rooms[r].st[k].date = util.dateFormatWithoutYear(util.diffDate(startDate, k));
                                tempCRoom.rooms[r].st[k].date2 = util.dateFormat(util.diffDate(startDate, k));
                            }
                            var temp = {
                                pi: tempCRoom.pId,
                                ti: tempCRoom.id,
                                id: r,
                                sn: tempCRoom.rooms[r].sn,
                                st: tempCRoom.rooms[r].st
                            };
                            roomIndexHash[r] = tnum++;
                            roomStore.push(temp);
                        }
                    }
                    //生成订单图元
                    var glyphs = [];
                    var gridWidth = 100;
                    var gridHeight = 48;
                    var occupyList = {};
                    orderList.forEach(function(order){
                        var startDate = new Date(order.checkInDate);
                        var seeStart = true;
                        if(startDate < startDate && !util.isSameDay(startDate, startDate)){
                            startDate = startDate;
                            seeStart = false;
                        }
                        var endDate = new Date(order.checkOutDate);
                        if(endDate > util.diffDate(startDate, 29)){
                            endDate = util.diffDate(startDate, 29);
                        }
                        var diff = util.DateDiff(startDate, endDate);
                        if(diff === 0){
                            diff = 1;
                        }
                        var startDiff = util.DateDiff(startDate, startDate);
                        var room = roomIndexHash[order.accommodationId];
                        var top = gridHeight * room + 1;
                        var left = gridWidth * startDiff + 2;
                        var width = gridWidth * diff - 6;
                        var glyph = order;
                        glyph.top = top;
                        glyph.left = left;
                        glyph.width = width;
                        glyph.stateStr = STATUS_STR[glyph.orderState].short;
                        var tempDate = new Date(order.checkInDate);
                        glyph.checkInDateShort = order.checkInDate.substr(5, 5);
                        glyph.checkOutDateShort = order.checkOutDate.substr(5, 5);
                        glyph.seeStart = seeStart;
                        if(util.isSameDay(startDate, endDate)){
                            occupyList[glyph.checkInDateShort + order.accommodationId] = true;
                        }else{
                            while(tempDate < endDate){
                                occupyList[util.dateFormatWithoutYear(tempDate) + order.accommodationId] = true;
                                tempDate = util.diffDate(tempDate, 1);
                            }
                        }
                        glyph.classStr = STATUS_STR[glyph.orderState].classStr;
                        glyphs.push(glyph);
                    });
                    rootScope.holidays = holidayHash;
                    rootScope.pRoomList = pRoomList;
                    rootScope.cRoomStore = cRoomStore;
                    rootScope.roomStore = roomStore;
                    rootScope.glyphs = glyphs;
                    rootScope.occupyList = occupyList;
                    rootScope.$apply();
                });
            });
        };
    }]);
};

module.exports = storeService;
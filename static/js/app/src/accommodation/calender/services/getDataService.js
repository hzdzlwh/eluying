var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var constService = require("./constService");
var accommodationService = require("./accommodationService");
var orderDetailService = require("./orderDetailService");
var idcObj = require("../ieidc");

var getDataService = function(app){
    constService(app);
    accommodationService(app);
    orderDetailService(app);
    app.service("getDataService", ['constService', 'accommodationService', 'orderDetailService',
        function(constService, accommodationService, orderDetailService){
        this.getChannel = function(callback){
            AJAXService.ajaxWithToken('GET', 'getChannelsUrl', {
                type: 2
            }, function(result){
                var arr1 = [{name: '散客'}];
                var arr2 = result.data.list;
                var channels = arr1.concat(arr2);
                callback({
                    channels: channels
                })
            });
        };
        this.getItems = function(callback){
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
                AJAXService.ajaxWithToken('GET', 'shopListUrl', {}, function(result1){
                    var goods = [];
                    result1.data.list.forEach(function(d){
                        d.gList.forEach(function(dd){
                            goods.push({
                                itemId: dd.i,
                                price: dd.p,
                                name: dd.n,
                                type: 3
                            });
                        });
                    });
                    callback({
                        foodList: foods,
                        funList: plays,
                        goodsList: goods,
                    });
                });
            });
        };
        this.getIDs = function(callback){
            var idList = [
                {key: '0', label: '身份证'},
                 {key: '1', label: '军官证'},
                 {key: '2', label: '通行证'},
                 {key: '3', label: '护照'},
                 {key: '4', label: '其他'},
            ];
            callback({
                idList: idList
            })
        };
        this.getPayChannels = function(callback){
            AJAXService.ajaxWithToken('GET', 'getPaymentMethodAndStateUrl', {}, function(result){
                var payChannels = result.data.payChannelCustomList;
                var map = result.data;
                var walletOpenAndUseStateList = map.walletOpenAndUseStateList;
                for (var key in walletOpenAndUseStateList) {
                   if (map.onlineCollectionMethod === 1 &&
                       walletOpenAndUseStateList[key].onlineType === 2
                       && walletOpenAndUseStateList[key].openState === 1 
                       && walletOpenAndUseStateList[key].useState === 1) {
                        payChannels.push({
                            channelId: -8,
                            name: '订单钱包'
                        });
                        break;
                   } 
                }
                var enterpriseOpenAndUseStateList = map.enterpriseOpenAndUseStateList;
                for (var key in enterpriseOpenAndUseStateList) {
                    if (map.onlineCollectionMethod === 2 &&
                        enterpriseOpenAndUseStateList[key].onlineType === 2
                        && enterpriseOpenAndUseStateList[key].openState === 1
                        && enterpriseOpenAndUseStateList[key].useState === 1) {
                        payChannels.push({
                            channelId: -6,
                            name: '企业支付宝'
                        });
                        break;
                    }
                }
                payChannels.push({
                    channelId: -1,
                    name: '现金'
                });
                payChannels.sort(function(a, b){
                    return a.channelId - b.channelId;
                });
                callback({
                    payChannels: payChannels
                });
            });
        };
        this.getOrderDetail = function(orderId, scope){
            return AJAXService.ajaxWithToken('GET', 'getOrderDetailUrl', {
                orderId: orderId,
                version: 7
            }, function(result){
                if(result.code === 1){
                    scope.orderDetail = orderDetailService.resetOrderDetail(result.data);
                    scope.$apply();
                    $("#orderDetailModal").modal("show");
                }
            });
        };
        this.getRoomsAndStatus = function(scope){
            var startDate = scope.startDate;
            AJAXService.ajaxWithToken('GET', 'getRoomCategoriesUrl', {}, function(result){
                var pRooms = result.data.list;
                AJAXService.ajaxWithToken('GET', 'getRoomsAndStausUrl', {
                    date: util.dateFormat(startDate),
                    days: constService.days,
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
                    var cRoomArray = [];
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
                            var selected;
                            if(scope.isSelected[pRoom.pId] === undefined){
                                scope.isSelected[pRoom.pId] = true;
                                selected = true;
                            }else{
                                selected = scope.isSelected[pRoom.pId];
                            }
                            pRoomList[pRoom.pId] = {
                                id: pRoom.pId,
                                name: pRoom.pName,
                                selected: selected
                            };
                        }
                        if(!cRoomStore[pRoom.cId]){
                            if(!cRoomList[pRoom.cId] || cRoomList[pRoom.cId].length === 0){
                                continue;
                            }
                            var temp = {
                                id: pRoom.cId,
                                name: pRoom.cName,
                                pId: pRoom.pId,
                                rooms: cRoomList[pRoom.cId]
                            };
                            cRoomStore[pRoom.cId] = temp;
                            cRoomArray.push(temp);
                        }
                    }
                    cRoomArray.sort(function(a, b){
                        if(a.pId > b.pId || (a.pId === b.pId && a.name > b.name)){
                            return 1;
                        }else{
                            return -1;
                        }
                    });
                    //保存房间列表
                    var roomIndexHash = {};
                    var tnum = 0;
                    for(var i = 0; i < cRoomArray.length; i++){
                        var tempCRoom = cRoomArray[i];
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
                        var checkInDate = new Date(order.checkInDate);
                        var seeStart = true;
                        if(checkInDate < startDate && !util.isSameDay(checkInDate, startDate)){
                            checkInDate = startDate;
                            seeStart = false;
                        }
                        var checkOutDate = new Date(order.checkOutDate);
                        if(checkOutDate > util.diffDate(startDate, 29)){
                            checkOutDate = util.diffDate(startDate, 29);
                        }
                        var diff = util.DateDiff(checkInDate, checkOutDate);
                        if(diff === 0){
                            diff = 1;
                        }
                        var startDiff = util.DateDiff(startDate, checkInDate);
                        var room = roomIndexHash[order.accommodationId];
                        var top = gridHeight * room + 1;
                        var left = gridWidth * startDiff + 2;
                        var width = gridWidth * diff - 6;
                        var glyph = order;
                        glyph.top = top;
                        glyph.left = left;
                        glyph.width = width;
                        glyph.stateStr = constService.statusStr2[glyph.roomState].short;
                        var tempDate = new Date(order.checkInDate);
                        glyph.checkInDateShort = order.checkInDate.substr(5, 5);
                        glyph.checkOutDateShort = order.checkOutDate.substr(5, 5);
                        glyph.seeStart = seeStart;
                        if(util.isSameDay(checkInDate, checkOutDate)){
                            occupyList[glyph.checkInDateShort + order.accommodationId] = true;
                        }else{
                            while(tempDate < checkOutDate && !util.isSameDay(tempDate, checkOutDate)){
                                occupyList[util.dateFormatWithoutYear(tempDate) + order.accommodationId] = true;
                                tempDate = util.diffDate(tempDate, 1);
                            }
                        }
                        glyph.classStr = constService.statusStr2[glyph.roomState].classStr;
                        glyphs.push(glyph);
                    });
                    scope.holidays = holidayHash;
                    scope.pRoomList = pRoomList;
                    scope.cRoomArray = cRoomArray;
                    scope.cRoomStore = cRoomStore;
                    scope.roomStore = roomStore;
                    scope.glyphs = glyphs;
                    scope.occupyList = occupyList;
                    accommodationService.updateDateInventory(scope);
                    accommodationService.updateGlyphsPos(scope);
                    scope.$apply();
                    util.leftHeaderAdjustLineHeight();
                });
            });
        };
    }]);
};

module.exports = getDataService;
/**
 * Created by huwanqi on 16/5/1.
 */
var AJAXService = require("AJAXService");
var header = require("header");
var leftMenu = require("leftMenu");
var topMenu = require("../../common/topMenu");
var util = require("util");
var modal = require("modal");
require("angular");

require("jqueryui");
require("datepicker-zh");
require("bootstrap");
require("validation");

var locked = false;
var STATUS_STR = [
    {},
    {},
    {short: '预', long: '已预订', classStr: 'book', 'title': '预订'},
    {short: '住', long: '已入住', classStr: 'ing', 'title': '入住'},
    {},
    {short: '完', long: '已完成', classStr: 'finish', 'title': '补录'}
];
var STATUS_STR2 = [
    {short: '预', long: '已预订', classStr: 'book', 'title': '预订'},
    {short: '住', long: '已入住', classStr: 'ing', 'title': '入住'},
    {short: '完', long: '已完成', classStr: 'finish', 'title': '补录'}
];
$(function(){
    //初始化界面
    header.showHeader();
    //高亮"前台录入"
    $(".settingsEntry").removeClass("selected");
    $(".accomodationEntry").addClass("selected");
    topMenu.showTopMenu();
    modal.modalInit();

    $(".entryList")[0].oncontextmenu = function(){
        return false;
    };
    $(".entryList")[0].onselectstart  = function(){
        return false;
    };

    events = {
        "show.bs.modal .modal": modal.centerModals,
        "scroll .calendor-container": function(){
            var scrollLeft = $(this).scrollLeft();
            var scrollTop = $(this).scrollTop();
            $(".accommodation-mainContainer .content .sheader").css("margin-left", -scrollLeft);
            $(".accommodation-mainContainer .content .leftHeader").css("margin-top", -scrollTop);
        },
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);},
        "mouseover body .entryItem": function(){
            // if(locked){
            //     return false;
            // }
            var date = $(this).attr("date");
            var room = $(this).attr("room");
            $(".room-item[room=" + room + "]").addClass("selected");
            $(".date-item[date=" + date + "]").addClass("selected");
        },
        "mouseleave body .entryItem": function(){
            // if(locked){
            //     return false;
            // }
            $(".room-item").removeClass("selected");
            $(".date-item").removeClass("selected");
        },
        "mousedown body .entryItem": function(ev){
            if(ev.which == 3){
                $(".entryOp").hide();
                $(this).find(".entryOp").show();
                locked = true;
                return false;
            }
        },
        "mousedown body .entryItem>.closeTips": function(ev){
            if(ev.which == 3){
                $(".entryOp").hide();
                $(this).siblings(".entryOp").show();
                locked = true;
                return false;
            }
        },
        "mousedown body .entryOp": function(ev){
            ev.stopPropagation();
        },
        "click body": function(ev){
            $(".entryOp").hide();
            $(".search .results").hide();
            $(".date-selector").removeClass("open");
            $(".category-filter").removeClass("open");
            $(".modal .date-table").hide();
            $(".modal .select1_options").hide();
            locked = false;
        },
        "click body .results": function(ev){
            ev.stopPropagation();
        },
        "click body .category-filter-switch": function(ev){
            ev.stopPropagation();
            if(!$(".category-filter").hasClass("open")){
                $(".category-filter").addClass("open");
                locked = true;
            }else{
                $(".category-filter").removeClass("open");
                locked = false;
            }
        },
        "click body .date-selector-switch": function(ev){
            ev.stopPropagation();
            if(!$(".date-selector").hasClass("open")){
                $(".date-selector").addClass("open");
                locked = true;
            }else{
                $(".date-selector").removeClass("open");
                locked = false;
            }
        },
        "mouseover body .glyph": function(ev){
            var clientY = ev.clientY;
            var infos = $(this).find(".infos");
            var height = infos.height();
            if(height + 180 > clientY){
                infos.removeClass("up");
                infos.addClass("down");
            }else{
                infos.removeClass("down");
                infos.addClass("up");
            }
            infos.show();
        },
        "mouseleave body .glyph": function(ev){
            $(this).find(".infos").hide();
        },
        "click body .consume-switch": function (ev) {
            ev.stopPropagation();
            if($(this).hasClass("open")){
                $(this).removeClass("open");
                $(this).parents(".consume-info").animate({
                    height: '24'
                });
            }else{
                $(this).addClass("open");
                $(this).parents(".consume-info").css({
                    height: 'auto'
                });
            }
        },
        "click body input.keyword": function(ev){
            ev.stopPropagation();
        },
        "focus body input.keyword": function(ev){
            $(".search .results").show();
            locked = true;
        },
        "click body .select1": function(ev){
            $(".select1_options").hide();
            $(this).find(".select1_options").show();
            ev.stopPropagation();
        },
        "click body input.datePicker": function(ev){
            $(".date-table").hide();
            $($(this).next(".date-table")[0]).show();
            ev.stopPropagation();
        }
    };

    util.bindDomAction(events);

    var app = angular.module('calenderApp', []);
    app.controller('calenderCtrl', ['$scope', function(scope) {
        scope.today = util.dateFormatWithoutYear(new Date());
        scope.startDate = util.diffDate(new Date(), -2);
        scope.startDateStr = util.dateFormatWithoutYear(scope.startDate);
        scope.datesArray = [];
        scope.calenderDays = [];
        scope.allPRoom = true;
        scope.statusStr = STATUS_STR;
        scope.statusStr2 = STATUS_STR2;
        scope.selectedEntries = {};
        scope.selectedRooms = [];
        scope.closeRoom = function(open, rid, dateItem){
            AJAXService.ajaxWithToken('GET', 'modifyRoomStatusUrl', {
                isAll: false,
                dateList: JSON.stringify([dateItem.date2]),
                open: !open ? 0 : 1,
                roomId: rid
            }, function(result){
                scope.updateData();
            });
        };

        //搜索用到的变量
        scope.searchKeyword = '';
        scope.searchResultPage = 0;
        scope.searchResultUnit = 5;
        scope.searchResultNextPage = function(){
            scope.searchResultPage < scope.filteredGlyphs().length / scope.searchResultUnit && scope.searchResultPage++;
        };
        scope.searchResultPreviousPage = function(){
            scope.searchResultPage > 0 && scope.searchResultPage--;
        };
        scope.filteredGlyphs = function(){
            if(!scope.glyphs){
                return {};
            }
            return scope.glyphs.filter(function(d){
                return d.serialNum.indexOf(scope.searchKeyword) > -1 ||
                    d.customerName.indexOf(scope.searchKeyword) > -1 || d.phone.indexOf(scope.searchKeyword) > -1;
            })
        };
        scope.searchResultOnClick = function(){
            alert(111);
        };
        scope.initialize = function(){
            initNewOrder();
            scope.selectedEntries = {};
            scope.selectedRooms = [];
            scope.shopcartShow = false;
            scope.finishShow = false;
            scope.bookShow = false;
            scope.ingShow = false;
        };
        scope.selectDate = function(date){
            scope.startDate = date;
            scope.selectedRooms = [];
            scope.selectedEntries = {};
            scope.updateData();
            scope.initialize();
        };
        scope.lastMonth = function(){
            var month = scope.startDate.getMonth();
            scope.startDate.setMonth(month - 1);
            scope.startDate.setDate(1);
            scope.selectedRooms = [];
            scope.selectedEntries = {};
            scope.updateData();
            scope.initialize();
        };
        scope.nextMonth = function(){
            var month = scope.startDate.getMonth();
            scope.startDate.setMonth(month + 1);
            scope.startDate.setDate(1);
            scope.selectedRooms = [];
            scope.selectedEntries = {};
            scope.updateData();
            scope.initialize();
        };
        scope.changePRoomSelect = function(id){
            var flag = true;
            for(var key in scope.pRoomList){
                if(scope.pRoomList[key].id == id){
                    scope.pRoomList[key].selected = !scope.pRoomList[key].selected;
                }
                if(!scope.pRoomList[key].selected){
                    flag = false;
                }
            }
            scope.allPRoom = flag;
            scope.updateGlyphsPos();
            scope.updateLeft();
            scope.initialize();
            // scope.updateData();
        };
        scope.selectAllPRoom = function(){
            scope.allPRoom = !scope.allPRoom;
            var flag = scope.allPRoom;
            for(var key in scope.pRoomList){
                scope.pRoomList[key].selected = flag;
            }
            scope.updateGlyphsPos();
            scope.updateLeft();
            scope.initialize();
        };
        scope.updateGlyphsPos = function(){
            var gridHeight = 48;
            var roomIndexHash = {};
            var tnum = 0;
            var pRoomList = scope.pRoomList;
            var cRoomStore = scope.cRoomStore;
            for(var c in cRoomStore){
                var tempCRoom = cRoomStore[c];
                if(!pRoomList[tempCRoom.pId].selected){
                    continue;
                }
                for(var r in tempCRoom.rooms){
                    roomIndexHash[r] = tnum++;
                }
            }
            scope.glyphs.forEach(function(g){
                var room = roomIndexHash[g.accommodationId];
                var top = gridHeight * room + 1;
                g.top = top;
            });
        };
        scope.updateLeft = function(){
            //统计每天有多少房间剩余
            var roomStore = scope.roomStore;
            var lefts = [];
            for(var i = 0; i < 30; i++){
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
            for(var i = 0; i < 30; i++){
                scope.datesArray[i].left = lefts[i];
            }
        };
        scope.updateData = function(){
            scope.startDateStr = util.dateFormatWithoutYear(scope.startDate);
            scope.datesArray = [];
            scope.glyphs = [];
            var tempDate = new Date(scope.startDate);
            for(var i = 0; i < 30; i++){
                scope.datesArray.push({
                    date: tempDate,
                    dateStrL: util.dateFormat(tempDate),
                    dateStr: util.dateFormatWithoutYear(tempDate),
                    weekday: util.getWeek(tempDate),
                    left: 0
                });
                tempDate = util.tomorrow(tempDate);
            }
            //维护日历
            var calenderDays = util.buildCalendar(scope.startDate);
            var iter = [];
            var days = [];
            for(var i = 0; i < calenderDays.length; i++){
                var sclass = '';
                var today = new Date();
                var text = null;
                if(util.isSameDay(calenderDays[i], today)){
                    sclass = 'today';
                    text = '今';
                }else if(calenderDays[i] < today){
                    sclass = 'invalid';
                }
                if(util.isSameDay(calenderDays[i], scope.startDate)){
                    sclass += ' selected';
                }
                iter.push({
                    text: text,
                    date: calenderDays[i],
                    sclass: sclass
                });
                if(i % 7 === 6){
                    days.push(iter);
                    iter = [];
                }
            }
            scope.calenderDays = days;
            //拉取房态
            AJAXService.ajaxWithToken('GET', 'getRoomCategoriesUrl', {}, function(result){
                var pRooms = result.data.list;
                AJAXService.ajaxWithToken('GET', 'getRoomsAndStausUrl', {
                    date: util.dateFormat(scope.startDate),
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
                    scope.holidays = holidayHash;
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
                                tempCRoom.rooms[r].st[k].date = util.dateFormatWithoutYear(util.diffDate(scope.startDate, k));
                                tempCRoom.rooms[r].st[k].date2 = util.dateFormat(util.diffDate(scope.startDate, k));
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
                        if(startDate < scope.startDate && !util.isSameDay(startDate, scope.startDate)){
                            startDate = scope.startDate;
                            seeStart = false;
                        }
                        var endDate = new Date(order.checkOutDate);
                        if(endDate > util.diffDate(scope.startDate, 29)){
                            endDate = util.diffDate(scope.startDate, 29);
                        }
                        var diff = util.DateDiff(startDate, endDate);
                        if(diff === 0){
                            diff = 1;
                        }
                        var startDiff = util.DateDiff(scope.startDate, startDate);
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
                    scope.pRoomList = pRoomList;
                    scope.cRoomStore = cRoomStore;
                    scope.roomStore = roomStore;
                    scope.updateLeft();
                    scope.glyphs = glyphs;
                    scope.occupyList = occupyList;
                    scope.$apply();
                });
            });
        };
        //下面是订房逻辑
        scope.addRoom = function(date, roomId){
            var cRoomStore = scope.cRoomStore;
            if(locked){
                locked = false;
                return false;
            }
            if(scope.selectedEntries[roomId + date]){
                delete scope.selectedEntries[roomId + date];
            }else{
                //找房间
                var roomStore = scope.roomStore;
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
                scope.selectedEntries[roomId + date] = {
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
            scope.showShopCart();
        };
        //购物车显示逻辑
        scope.shopcartShow = false;
        scope.bookShow = false;
        scope.finishShow = false;
        scope.ingShow = false;
        scope.t = false;
        scope.f = false;
        scope.p = false;
        scope.showShopCart = function(){
            var selectedEntries = scope.selectedEntries;
            if(util.objLen(selectedEntries) === 0){
                scope.shopcartShow = false;
            }else{
                scope.shopcartShow = true;
                var today = new Date();
                var p = false;
                var t = false;
                var f = false;
                var roomHash = {};
                var selectedRooms = [];
                for(var key in selectedEntries){
                    var item = selectedEntries[key];
                    var date = new Date(item.date2);
                    if(util.isSameDay(date, today)){
                        t = true;
                    }else if(date > today){
                        f = true;
                    }else if(date < today){
                        p = true;
                    }
                    if(!roomHash[item.cRoomName + item.sn]){
                        selectedRooms.push(item.cRoomName + item.sn);
                        roomHash[item.cRoomName + item.sn] = true;
                    }
                }
                scope.t = t;
                scope.f = f;
                scope.p = p;
                scope.selectedRooms = selectedRooms;
                scope.finishShow = p&&!t&&!f || p&&t&&!f || p&&t&&f || p&&!t&&f;
                scope.ingShow = p&&t&&!f || p&&t&&f || !p&&t&&!f || !p&&t&&f;
                scope.bookShow = p&&!t&&f || !p&&t&&!f || !p&&t&&f || !p&&!t&&f;
            }
        };
        scope.checkBeforeAdd = function(type){
            if(type == 'finish'){
                if(scope.t || scope.f){
                    $("#finishWarningModal").modal("show");
                    return false;
                }
            }else if(type == 'ing'){
                if(scope.p){
                    $("#ingWarningModal").modal("show");
                    return false;
                }
            }else if(type == 'book'){
                if(scope.p){
                    $("#bookWarningModal").modal("show");
                    return false;
                }
            }
            scope.processBeforeAdd(type);
            $("#newOrderModal").modal("show");
        };
        scope.processBeforeAdd = function(type){
            initNewOrder();
            var selectedEntries = scope.selectedEntries;
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
            //处理成订单所需格式
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
            var temp = {
                startDate: entry.date2,
                sstartDate: entry.date,
                scanlerdarDate: entry.date2,
                endDate: entry.date2,
                sendDate: entry.date,
                roomId: entry.roomId,
                id: entry.cRoomId,
                fee: entry.price,
                sub: true,
                sn: entry.sn,
                name: entry.cRoomName,
                days: 1
            };
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
                    //结束日期加一天
                    var checkoutDate = util.diffDate(new Date(temp.endDate), 1);
                    temp.endDate = util.dateFormat(checkoutDate);
                    temp.sendDate = util.dateFormatWithoutYear(checkoutDate);
                    temp.ecanlerdarDate = util.dateFormat(checkoutDate);
                    this.newOrder.createRoomCalendar(temp);
                    orderList.push(temp);
                    temp = {
                        startDate: entry.date2,
                        sstartDate: entry.date,
                        scanlerdarDate: entry.date2,
                        endDate: entry.date2,
                        sendDate: entry.date,
                        roomId: entry.roomId,
                        id: entry.cRoomId,
                        fee: entry.price,
                        sub: true,
                        sn: entry.sn,
                        name: entry.cRoomName,
                        days: 1
                    };
                }
            }
            //结束日期加一天
            var checkoutDate = util.diffDate(new Date(temp.endDate), 1);
            temp.endDate = util.dateFormat(checkoutDate);
            temp.sendDate = util.dateFormatWithoutYear(checkoutDate);
            temp.ecanlerdarDate = util.dateFormat(checkoutDate);
            this.newOrder.createRoomCalendar(temp);
            orderList.push(temp);
            //新增订单弹出框数据准备
            scope.newOrder.type = type;
            scope.newOrder.title = (function(){
                for(var i = 0; i < STATUS_STR.length; i++){
                    if(STATUS_STR[i].classStr === type){
                        return STATUS_STR[i].title;
                    }
                }
                return null;
            })();
            scope.newOrder.selectedChannel = {
                name: scope.channels[0].name,
                id: -1,
            };
            scope.newOrder.roomList = orderList;
            $(".msgModal").modal("hide");
            $("#newOrderModal").modal("show");
        };
        scope.updateData();

        //新增订单用到的变量
        AJAXService.ajaxWithToken('GET', 'getChannelsUrl', {
            type: 2
        }, function(result3){
            var arr1 = [{name: '散客'}];
            var arr2 = result3.data.list;
            scope.channels = arr1.concat(arr2);
        });
        AJAXService.ajaxWithToken('GET', 'getItemsUrl', {}, function(result){
            var items = result.data.list;
            var foods = [];
            var funs = [];
            items.forEach(function(d){
                if(d.type == 1){
                    foods.push(d);
                }else if(d.type == 2){
                    funs.push(d);
                }
            });
            scope.foodList = foods;
            scope.funList = funs;
        });
        scope.idList = [
            {key: 'id', label: '身份证'},
            {key: 'mid', label: '军官证'},
            {key: 'other', label: '其他'},
        ];
        scope.orderDetail = {};
        scope.getOrderDetail = function(orderId){
            AJAXService.ajaxWithToken('GET', 'getOrderDetailUrl', {
                orderId: orderId
            }, function(result){
                if(result.code === 1){
                    scope.orderDetail = result.data;
                    scope.$apply();
                    $("#orderDetailModal").modal("show");
                }
            });
        };
        var initNewOrder = function(){
            scope.newOrder = {
                title: null,
                type: null,
                selectedChannel: null,
                guestInfo: {
                    name: null,
                    phone: null,
                    selectedId: '身份证',
                    idVal: null
                },
                roomList: [],
                foodList: [],
                funList: [],
                checkPhone: function(){
                    var reg = /^1[3|4|5|7|8]\d{9}$/;
                    return reg.test(this.guestInfo.phone);
                },
                changeIds: function(str){
                    this.guestInfo.selectedId = str;
                    this.guestInfo.idVal = null;
                    $(".select1_options").hide();
                },
                changeChannel: function(id, name){
                    this.selectedChannel = {
                        id: id,
                        name: name,
                    };
                    $(".select1_options").hide();
                },
                createRoomCalendar: function(room){
                    this.createRoomCalendarStart(room);
                    this.createRoomCalendarEnd(room);
                },
                createRoomCalendarStart: function(room){
                    var startDate = new Date(room.startDate);
                    var scanlerdarDate = new Date(room.scanlerdarDate);
                    var calenderDays = util.buildCalendar(scanlerdarDate);
                    AJAXService.ajaxWithToken('GET', 'getRoomStausUrl', {
                        date: util.dateFormat(calenderDays[0]),
                        days: calenderDays.length,
                        id: room.roomId
                    }, function(result2){
                        var rs = result2.data.rs;
                        var iter = [];
                        var days = [];
                        for(var i = 0; i < calenderDays.length; i++){
                            var sclass = '';
                            var today = new Date();
                            var text = null;
                            if(calenderDays[i] < today || rs.status[i].s!==-1){
                                sclass = 'invalid';
                            }
                            if(util.isSameDay(calenderDays[i], today)){
                                sclass += ' today';
                                text = '今';
                            }
                            if(util.isSameDay(calenderDays[i], startDate)){
                                sclass += ' selected';
                            }
                            iter.push({
                                text: text,
                                date: calenderDays[i],
                                sclass: sclass,
                                price: rs.status[i].p
                            });
                            if(i % 7 === 6){
                                days.push(iter);
                                iter = [];
                            }
                        }
                        room.startDays = days;
                        scope.$apply();
                    });
                },
                createRoomCalendarEnd: function(room){
                    var startDate = new Date(room.startDate);
                    var endDate = new Date(room.endDate);
                    var ecanlerdarDate = new Date(room.ecanlerdarDate);
                    var calenderDays = util.buildCalendar(ecanlerdarDate);
                    AJAXService.ajaxWithToken('GET', 'getRoomStausUrl', {
                        date: util.dateFormat(calenderDays[0]),
                        days: calenderDays.length,
                        id: room.roomId
                    }, function(result2){
                        var rs = result2.data.rs;
                        var iter = [];
                        var days = [];
                        for(var i = 0; i < calenderDays.length; i++){
                            var sclass = '';
                            var today = new Date();
                            var text = null;
                            if(calenderDays[i] < today || calenderDays[i] <= startDate
                                || (i > 0 && rs.status[i-1].s!==-1)){
                                sclass = 'invalid';
                            }
                            if(util.isSameDay(calenderDays[i], today)){
                                sclass += ' today';
                                text = '今';
                            }
                            if(util.isSameDay(calenderDays[i], endDate)){
                                sclass += ' selected';
                            }
                            iter.push({
                                text: text,
                                date: calenderDays[i],
                                sclass: sclass,
                                price: rs.status[i].p
                            });
                            if(i % 7 === 6){
                                days.push(iter);
                                iter = [];
                            }
                        }
                        room.endDays = days;
                        scope.$apply();
                    });
                },
                changeRoomStartDate: function(room, date, sclass){
                    if(sclass == 'invalid'){
                        return false;
                    }
                    //开始日期大于结束日期
                    if(date >= new Date(room.endDate)){
                        var nendDate = util.diffDate(date, 1);
                        room.endDate = util.dateFormat(nendDate);
                        room.sendDate = util.dateFormatWithoutYear(nendDate);
                        room.days = 1;
                    }
                    room.startDate = util.dateFormat(date);
                    room.scanlerdarDate = util.dateFormat(date);
                    room.sstartDate = util.dateFormatWithoutYear(date);
                    room.days = util.DateDiff(date, new Date(room.endDate));
                    var temp = new Date(date);
                    var fee = 0;
                    for(var i = 0; i < room.startDays.length; i++){
                        if(util.isSameDay(temp, new Date(room.endDate))){
                            break;
                        }
                        var row = room.startDays[i];
                        for(var j = 0; j < row.length; j++){
                            if(util.isSameDay(temp, row[j].date)){
                                fee += row[j].price;
                                temp = util.tomorrow(temp);
                            }
                            if(util.isSameDay(temp, new Date(room.endDate))){
                                break;
                            }
                        }
                    }
                    room.fee = fee;
                    this.createRoomCalendar(room);
                },
                changeRoomEndDate: function(room, date, sclass){
                    if(sclass == 'invalid'){
                        return false;
                    }
                    var startDate = new Date(room.startDate);
                    //中间有被占用的房间
                    var temp = new Date(startDate);
                    temp = util.diffDate(temp, 1);
                    for(var i = 0; i < room.endDays.length; i++){
                        if(util.isSameDay(temp, new Date(date))){
                            break;
                        }
                        var row = room.endDays[i];
                        for(var j = 0; j < row.length; j++){
                            if(util.isSameDay(row[j].date, temp)){
                                if(row[j].sclass === 'invalid'){
                                    return false;
                                }
                                temp = util.diffDate(temp, 1);
                            }
                            if(util.isSameDay(temp, new Date(date))){
                                break;
                            }
                        }
                    }
                    room.endDate = util.dateFormat(date);
                    room.ecanlerdarDate = util.dateFormat(date);
                    room.sendDate = util.dateFormatWithoutYear(date);
                    room.days = util.DateDiff(new Date(startDate), new Date(room.endDate));
                    temp = new Date(startDate);
                    var fee = 0;
                    for(var i = 0; i < room.endDays.length; i++){
                        if(util.isSameDay(temp, new Date(room.endDate))){
                            break;
                        }
                        var row = room.endDays[i];
                        for(var j = 0; j < row.length; j++){
                            if(util.isSameDay(temp, row[j].date)){
                                fee += row[j].price;
                                temp = util.tomorrow(temp);
                            }
                            if(util.isSameDay(temp, new Date(room.endDate))){
                                break;
                            }
                        }
                    }
                    room.fee = fee;
                    this.createRoomCalendar(room);
                },
                changeRoomStartMonth: function(room, monthDiff){
                    var scanlerdarDate = new Date(room.scanlerdarDate);
                    scanlerdarDate.setMonth(scanlerdarDate.getMonth() + monthDiff);
                    room.scanlerdarDate = util.dateFormat(scanlerdarDate);
                    this.createRoomCalendarStart(room);
                },
                changeRoomEndMonth: function(room, monthDiff){
                    var ecanlerdarDate = new Date(room.ecanlerdarDate);
                    ecanlerdarDate.setMonth(ecanlerdarDate.getMonth() + monthDiff);
                    room.ecanlerdarDate = util.dateFormat(ecanlerdarDate);
                    this.createRoomCalendarEnd(room);
                },
                deleteRoom: function(index){
                    this.roomList.splice(index, 1);
                    if(this.roomList.length == 0){
                        $("#newOrderModal").modal("hide");
                    }
                },
                deleteFood: function(index){
                    this.foodList.splice(index, 1);
                },
                addFood: function(){
                    var food = scope.foodList[0];
                    var that = this;
                    AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                        date: util.dateFormat(new Date()),
                        id: food.itemId
                    }, function(result){
                        var temp = {
                            type: 1,
                            id: food.itemId,
                            name: food.name,
                            price: food.price,
                            num: (result.data.inventory < 1) ? 0 : 1,
                            date: new Date(),
                            dateStr: util.dateFormat(new Date()),
                            dateStr2: util.dateFormatWithoutYear(new Date()),
                            inventory: result.data.inventory,
                        };
                        temp.days = that.createFoodFunCalendar(temp);
                        that.foodList.push(temp);
                        scope.$apply();
                    });
                },
                changeFood: function(foodItem, food){
                    var index = (this.foodList.indexOf(foodItem));
                    var that = this;
                    AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                        date: util.dateFormat(new Date()),
                        id: food.itemId
                    }, function(result){
                        that.foodList[index] = {
                            type: 1,
                            id: food.itemId,
                            name: food.name,
                            price: food.price,
                            num: (result.data.inventory < 1) ? 0 : 1,
                            date: new Date(),
                            dateStr: util.dateFormat(new Date()),
                            dateStr2: util.dateFormatWithoutYear(new Date()),
                            inventory: result.data.inventory
                        };
                        that.foodList[index].days = that.createFoodFunCalendar(that.foodList[index]);
                        scope.$apply();
                    });
                    $(".select1_options").hide();
                },
                minusFood: function(i){
                    this.foodList[i].num--;
                    if(this.foodList[i].num < 0){
                        this.foodList[i].num = 0
                    }
                },
                plusFood: function(i){
                    this.foodList[i].num++;
                    var max = this.foodList[i].inventory;
                    if(this.foodList[i].num > max){
                        this.foodList[i].num = max;
                    }
                },
                deleteFun: function(index){
                    this.funList.splice(index, 1);
                },
                addFun: function(){
                    var fun = scope.funList[0];
                    var that = this;
                    AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                        date: util.dateFormat(new Date()),
                        id: fun.itemId
                    }, function(result){
                        var temp = {
                            type: 2,
                            id: fun.itemId,
                            name: fun.name,
                            price: fun.price,
                            num: (result.data.inventory < 1) ? 0 : 1,
                            date: new Date(),
                            dateStr: util.dateFormat(new Date()),
                            dateStr2: util.dateFormatWithoutYear(new Date()),
                            inventory: result.data.inventory,
                        };
                        temp.days = that.createFoodFunCalendar(temp);
                        that.funList.push(temp);
                        scope.$apply();
                    });
                },
                changeFun: function(funItem, fun){
                    var index = (this.funList.indexOf(funItem));
                    var that = this;
                    AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                        date: util.dateFormat(new Date()),
                        id: fun.itemId
                    }, function(result){
                        that.funList[index] = {
                            type: 2,
                            id: fun.itemId,
                            name: fun.name,
                            price: fun.price,
                            num: (result.data.inventory < 1) ? 0 : 1,
                            date: new Date(),
                            dateStr: util.dateFormat(new Date()),
                            dateStr2: util.dateFormatWithoutYear(new Date()),
                            inventory: result.data.inventory
                        };
                        that.funList[index].days = that.createFoodFunCalendar(that.funList[index]);
                        scope.$apply();
                    });
                    $(".select1_options").hide();
                },
                changeItemTime: function(item, date){
                    var today = new Date();
                    today.setDate(today.getDate() - 1);
                    if(date < today){
                        return false;
                    }
                    var that = this;
                    AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                        date: util.dateFormat(date),
                        id: item.id
                    }, function(result){
                        item.date = date;
                        item.dateStr = util.dateFormat(date);
                        item.dateStr2 = util.dateFormatWithoutYear(date);
                        item.inventory = result.data.inventory;
                        item.num = (result.data.inventory < 1) ? 0 : 1;
                        item.days = that.createFoodFunCalendar(item);
                        scope.$apply();
                    });
                },
                minusFun: function(i){
                    this.funList[i].num--;
                    if(this.funList[i].num < 0){
                        this.funList[i].num = 0
                    }
                },
                plusFun: function(i){
                    this.funList[i].num++;
                    var max = this.funList[i].inventory;
                    if(this.funList[i].num > max){
                        this.funList[i].num = max;
                    }
                },
                totalPrice: function(){
                    var price = 0;
                    for(var i = 0; i < this.roomList.length; i++){
                        price += this.roomList[i].fee;
                    }
                    for(var i = 0; i < this.foodList.length; i++){
                        price += this.foodList[i].num * this.foodList[i].price;
                    }
                    for(var i = 0; i < this.funList.length; i++){
                        price += this.funList[i].num * this.funList[i].price;
                    }
                    price = price - this.discounts;
                    return price < 0 ? 0.01 : price;
                },
                createFoodFunCalendar: function(item){
                    var date = new Date(item.dateStr);
                    //维护日历
                    var calenderDays = util.buildCalendar(date);
                    var iter = [];
                    var days = [];
                    for(var i = 0; i < calenderDays.length; i++){
                        var sclass = '';
                        var today = new Date();
                        var text = null;
                        if(util.isSameDay(calenderDays[i], today)){
                            sclass = 'today';
                            text = '今';
                        }else if(calenderDays[i] < today){
                            sclass = 'invalid';
                        }
                        if(util.isSameDay(calenderDays[i], date)){
                            sclass += ' selected';
                        }
                        iter.push({
                            text: text,
                            date: calenderDays[i],
                            sclass: sclass
                        });
                        if(i % 7 === 6){
                            days.push(iter);
                            iter = [];
                        }
                    }
                    return days;
                },
                itemLastMonth: function(item){
                    var that = this;
                    var date = item.date;
                    var newDate = new Date(date);
                    newDate.setMonth(newDate.getMonth()-1);
                    newDate.setDate(1);
                    var today = new Date();
                    if(newDate < today){
                        newDate = today;
                    }
                    AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                        date: util.dateFormat(newDate),
                        id: item.id
                    }, function(result){
                        item.date = newDate;
                        item.dateStr = util.dateFormat(newDate);
                        item.dateStr2 = util.dateFormatWithoutYear(newDate);
                        item.days = that.createFoodFunCalendar(item);
                        item.inventory = result.data.inventory;
                        scope.$apply();
                    });
                },
                itemNextMonth: function(item){
                    var that = this;
                    var date = item.date;
                    var newDate = new Date(date);
                    newDate.setMonth(newDate.getMonth()+1);
                    newDate.setDate(1);
                    var today = new Date();
                    if(newDate < today){
                        newDate = today;
                    }
                    AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                        date: util.dateFormat(newDate),
                        id: item.id
                    }, function(result){
                        item.date = newDate;
                        item.dateStr = util.dateFormat(newDate);
                        item.dateStr2 = util.dateFormatWithoutYear(newDate);
                        item.days = that.createFoodFunCalendar(item);
                        item.inventory = result.data.inventory;
                        scope.$apply();
                    });
                },
                submitOrder: function(){
                    //校验库存
                    var inventory = {};
                    var itemList = this.foodList.concat(this.funList);
                    //数量为0的项目去掉,项目日期一样的项目合并
                    for(var i = 0; i < itemList.length; i++){
                        var item = itemList[i];
                        var inv = inventory[item.id + item.dateStr];
                        if(!inv){
                            inventory[item.id + item.dateStr] = {
                                num: item.num,
                                inventory: item.inventory
                            }
                        }else{
                            inv.num += item.num;
                            if(inv.num > inv.inventory){
                                modal.somethingAlert(util.dateFormatWithoutYearCn(item.dateStr2)
                                    + '的' + item.name + "项目库存不足!");
                                return false;
                            }
                        }
                    }
                    //格式化房间数据
                    var rooms = [];
                    this.roomList.forEach(function(d){
                        var room = {
                            startDate: d.startDate,
                            endDate: d.endDate,
                            roomId: parseInt(d.roomId),
                            id: d.id,
                            fee: d.fee,
                            sub: true,
                        };
                        rooms.push(room);
                    });
                    //准备接口所需数据
                    var items = [];
                    itemList.forEach(function(d, i){
                        items.push({
                            amount: d.num,
                            date: d.dateStr,
                            id: d.id,
                            name: d.name,
                            price: d.price,
                            priceId: 0,
                            type: d.type
                        });
                    });
                    var type = 0;
                    if(this.type === 'book'){
                        type = 2;
                    }else if(this.type === 'finish'){
                        type = 1
                    }
                    var orderItem = {
                        name: this.guestInfo.name,
                        origin: this.selectedChannel.name,
                        originId: this.selectedChannel.id,
                        phone: this.guestInfo.phone,
                        remark: this.remarks,
                        type: type,
                        items: JSON.stringify(items),
                        payments: JSON.stringify([{
                            fee: this.discounts,
                            type: 5
                        }]),
                        rooms: JSON.stringify(rooms)
                    };
                    AJAXService.ajaxWithToken('GET', 'confirmOrderUrl', orderItem, function(result3){
                        if(result3.code === 1){
                            AJAXService.ajaxWithToken('GET', 'getOrderDetailUrl', {
                                orderId: result3.data.orderId
                            }, function(result){
                                if(result.code === 1){
                                    initGetMoneyItem();
                                    scope.getMoneyItem.newOrder(result.data);
                                    $("#newOrderModal").modal("hide");
                                    $("#getMoneyModal").modal("show");
                                    scope.initialize();
                                    scope.updateData();
                                    scope.$apply();
                                }
                            });
                        }
                    });
                },
                remarks: '',
                discounts: 0,
            };
        };
        var initGetMoneyItem = function(){
            scope.getMoneyItem = {
                newOrder: function(orderItem){
                    for(var i in orderItem){
                        scope.getMoneyItem[i] = orderItem[i];
                    }
                    scope.getMoneyItem.payments.forEach(function(d){
                       if(d.type === 5){
                           scope.discounts = d.fee;
                       }
                        if(d.type === 3){
                           scope.deposit = d.fee;
                       }
                    });
                    scope.getMoneyItem.type = 'new';
                }
            };
        };
        var initOrderEdit = function(orderDetail){
            var orderEdit = {
                selectedId: '身份证',
                idVal: null,
                checkPhone: function(){
                    var reg = /^1[3|4|5|7|8]\d{9}$/;
                    return reg.test(this.customerPhone);
                },
                changeIds: function(str){
                    this.selectedId = str;
                    this.idVal = null;
                    $(".select1_options").hide();
                },
                changeChannel: function(id, name){
                    this.origin = name;
                    this.originId = id;
                    $(".select1_options").hide();
                },
                calPrice: function(){
                    var price = 0;
                    for(var i = 0; i < this.rooms.length; i++){
                        price += this.rooms[i].fee;
                    }
                    for(var i = 0; i < this.foodItems.length; i++){
                        price += this.foodItems[i].amount * this.foodItems[i].price;
                    }
                    for(var i = 0; i < this.playItems.length; i++){
                        price += this.playItems[i].amount * this.playItems[i].price;
                    }
                    price = price - this.discounts;
                    return price < 0 ? 0.01 : price;
                },
                deleteRoom: function(index){
                    if(this.rooms.length == 1){
                        return false
                    }
                    this.rooms.splice(index, 1);
                },
                addFood: function(){
                    var food = scope.foodList[0];
                    var that = this;
                    AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                        date: util.dateFormat(new Date()),
                        id: food.itemId
                    }, function(result){
                        var temp = {
                            isNew: true,
                            type: 1,
                            serviceId: food.itemId,
                            name: food.name,
                            price: food.price,
                            amount: (result.data.inventory < 1) ? 0 : 1,
                            date: new Date(),
                            dateStr: util.dateFormat(new Date()),
                            dateStr2: util.dateFormatWithoutYear(new Date()),
                            inventory: result.data.inventory,
                        };
                        temp.days = that.createFoodFunCalendar(temp);
                        that.foodItems.push(temp);
                        scope.$apply();
                    });
                },
                changeFood: function(foodItem, food){
                    var index = (this.foodItems.indexOf(foodItem));
                    var that = this;
                    AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                        date: util.dateFormat(new Date()),
                        id: food.itemId
                    }, function(result){
                        that.foodItems[index] = {
                            isNew: true,
                            type: 1,
                            serviceId: food.itemId,
                            name: food.name,
                            price: food.price,
                            amount: (result.data.inventory < 1) ? 0 : 1,
                            date: new Date(),
                            dateStr: util.dateFormat(new Date()),
                            dateStr2: util.dateFormatWithoutYear(new Date()),
                            inventory: result.data.inventory
                        };
                        that.foodItems[index].days = that.createFoodFunCalendar(that.foodItems[index]);
                        scope.$apply();
                    });
                    $(".select1_options").hide();
                },
                addFun: function(){
                    var fun = scope.funList[0];
                    var that = this;
                    AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                        date: util.dateFormat(new Date()),
                        id: fun.itemId
                    }, function(result){
                        var temp = {
                            isNew: true,
                            type: 2,
                            serviceId: fun.itemId,
                            name: fun.name,
                            price: fun.price,
                            amount: (result.data.inventory < 1) ? 0 : 1,
                            date: new Date(),
                            dateStr: util.dateFormat(new Date()),
                            dateStr2: util.dateFormatWithoutYear(new Date()),
                            inventory: result.data.inventory,
                        };
                        temp.days = that.createFoodFunCalendar(temp);
                        that.playItems.push(temp);
                        scope.$apply();
                    });
                },
                changeFun: function(playItem, fun){
                    var index = (this.playItems.indexOf(playItem));
                    var that = this;
                    AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                        date: util.dateFormat(new Date()),
                        id: fun.itemId
                    }, function(result){
                        that.playItem[index] = {
                            isNew: true,
                            type: 2,
                            serviceId: fun.itemId,
                            name: fun.name,
                            price: fun.price,
                            amount: (result.data.inventory < 1) ? 0 : 1,
                            date: new Date(),
                            dateStr: util.dateFormat(new Date()),
                            dateStr2: util.dateFormatWithoutYear(new Date()),
                            inventory: result.data.inventory
                        };
                        that.playItems[index].days = that.createFoodFunCalendar(that.playItems[index]);
                        scope.$apply();
                    });
                    $(".select1_options").hide();
                },
                createRoomCalendar: function(room){
                    this.createRoomCalendarStart(room);
                    this.createRoomCalendarEnd(room);
                },
                createRoomCalendarStart: function(room){
                    var startDate = new Date(room.startDate);
                    var endDate = new Date(room.endDate);
                    var scanlerdarDate = new Date(room.scanlerdarDate);
                    var calenderDays = util.buildCalendar(scanlerdarDate);
                    AJAXService.ajaxWithToken('GET', 'getRoomStausUrl', {
                        date: util.dateFormat(calenderDays[0]),
                        days: calenderDays.length,
                        id: room.roomId
                    }, function(result2){
                        var rs = result2.data.rs;
                        var iter = [];
                        var days = [];
                        for(var i = 0; i < calenderDays.length; i++){
                            var sclass = '';
                            var today = new Date();
                            var text = null;
                            if(calenderDays[i] < today ||
                                (rs.status[i].s!==-1&&!(calenderDays[i]>=startDate&&calenderDays[i]<=endDate))){
                                sclass = 'invalid';
                            }
                            if(util.isSameDay(calenderDays[i], today)){
                                sclass += ' today';
                                text = '今';
                            }
                            if(util.isSameDay(calenderDays[i], startDate)){
                                sclass += ' selected';
                            }
                            iter.push({
                                text: text,
                                date: calenderDays[i],
                                sclass: sclass,
                                price: rs.status[i].p
                            });
                            if(i % 7 === 6){
                                days.push(iter);
                                iter = [];
                            }
                        }
                        room.startDays = days;
                        scope.$apply();
                    });
                },
                createRoomCalendarEnd: function(room){
                    var startDate = new Date(room.startDate);
                    var endDate = new Date(room.endDate);
                    var ecanlerdarDate = new Date(room.ecanlerdarDate);
                    var calenderDays = util.buildCalendar(ecanlerdarDate);
                    AJAXService.ajaxWithToken('GET', 'getRoomStausUrl', {
                        date: util.dateFormat(calenderDays[0]),
                        days: calenderDays.length,
                        id: room.roomId
                    }, function(result2){
                        var rs = result2.data.rs;
                        var iter = [];
                        var days = [];
                        for(var i = 0; i < calenderDays.length; i++){
                            var sclass = '';
                            var today = new Date();
                            var text = null;
                            if(calenderDays[i] < today || calenderDays[i] <= startDate
                                || (i > 0 && rs.status[i-1].s!==-1 && !(calenderDays[i]>startDate&&calenderDays[i]<=endDate))){
                                sclass = 'invalid';
                            }
                            if(util.isSameDay(calenderDays[i], today)){
                                sclass += ' today';
                                text = '今';
                            }
                            if(util.isSameDay(calenderDays[i], endDate)){
                                sclass += ' selected';
                            }
                            iter.push({
                                text: text,
                                date: calenderDays[i],
                                sclass: sclass,
                                price: rs.status[i].p
                            });
                            if(i % 7 === 6){
                                days.push(iter);
                                iter = [];
                            }
                        }
                        room.endDays = days;
                        scope.$apply();
                    });
                },
                changeRoomStartDate: function(room, date, sclass){
                    if(sclass == 'invalid'){
                        return false;
                    }
                    //开始日期大于结束日期
                    if(date >= new Date(room.endDate)){
                        var nendDate = util.diffDate(date, 1);
                        room.endDate = util.dateFormat(nendDate);
                        room.sendDate = util.dateFormatWithoutYear(nendDate);
                        room.duration = 1;
                    }
                    room.startDate = util.dateFormat(date);
                    room.scanlerdarDate = util.dateFormat(date);
                    room.sstartDate = util.dateFormatWithoutYear(date);
                    room.duration = util.DateDiff(date, new Date(room.endDate));
                    var temp = new Date(date);
                    var fee = 0;
                    for(var i = 0; i < room.startDays.length; i++){
                        if(util.isSameDay(temp, new Date(room.endDate))){
                            break;
                        }
                        var row = room.startDays[i];
                        for(var j = 0; j < row.length; j++){
                            if(util.isSameDay(temp, row[j].date)){
                                fee += row[j].price;
                                temp = util.tomorrow(temp);
                            }
                            if(util.isSameDay(temp, new Date(room.endDate))){
                                break;
                            }
                        }
                    }
                    room.fee = fee;
                    this.createRoomCalendar(room);
                },
                changeRoomEndDate: function(room, date, sclass){
                    if(sclass == 'invalid'){
                        return false;
                    }
                    var startDate = new Date(room.startDate);
                    //中间有被占用的房间
                    var temp = new Date(startDate);
                    temp = util.diffDate(temp, 1);
                    for(var i = 0; i < room.endDays.length; i++){
                        if(util.isSameDay(temp, new Date(date))){
                            break;
                        }
                        var row = room.endDays[i];
                        for(var j = 0; j < row.length; j++){
                            if(util.isSameDay(row[j].date, temp)){
                                if(row[j].sclass === 'invalid'){
                                    return false;
                                }
                                temp = util.diffDate(temp, 1);
                            }
                            if(util.isSameDay(temp, new Date(date))){
                                break;
                            }
                        }
                    }
                    room.endDate = util.dateFormat(date);
                    room.ecanlerdarDate = util.dateFormat(date);
                    room.sendDate = util.dateFormatWithoutYear(date);
                    room.duration = util.DateDiff(new Date(startDate), new Date(room.endDate));
                    temp = new Date(startDate);
                    var fee = 0;
                    for(var i = 0; i < room.endDays.length; i++){
                        if(util.isSameDay(temp, new Date(room.endDate))){
                            break;
                        }
                        var row = room.endDays[i];
                        for(var j = 0; j < row.length; j++){
                            if(util.isSameDay(temp, row[j].date)){
                                fee += row[j].price;
                                temp = util.tomorrow(temp);
                            }
                            if(util.isSameDay(temp, new Date(room.endDate))){
                                break;
                            }
                        }
                    }
                    room.fee = fee;
                    this.createRoomCalendar(room);
                },
                changeRoomStartMonth: function(room, monthDiff){
                    var scanlerdarDate = new Date(room.scanlerdarDate);
                    scanlerdarDate.setMonth(scanlerdarDate.getMonth() + monthDiff);
                    room.scanlerdarDate = util.dateFormat(scanlerdarDate);
                    this.createRoomCalendarStart(room);
                },
                changeRoomEndMonth: function(room, monthDiff){
                    var ecanlerdarDate = new Date(room.ecanlerdarDate);
                    ecanlerdarDate.setMonth(ecanlerdarDate.getMonth() + monthDiff);
                    room.ecanlerdarDate = util.dateFormat(ecanlerdarDate);
                    this.createRoomCalendarEnd(room);
                },
                createFoodFunCalendar: function(item){
                    var date = new Date(item.dateStr);
                    //维护日历
                    var calenderDays = util.buildCalendar(date);
                    var iter = [];
                    var days = [];
                    for(var i = 0; i < calenderDays.length; i++){
                        var sclass = '';
                        var today = new Date();
                        var text = null;
                        if(util.isSameDay(calenderDays[i], today)){
                            sclass = 'today';
                            text = '今';
                        }else if(calenderDays[i] < today){
                            sclass = 'invalid';
                        }
                        if(util.isSameDay(calenderDays[i], date)){
                            sclass += ' selected';
                        }
                        iter.push({
                            text: text,
                            date: calenderDays[i],
                            sclass: sclass
                        });
                        if(i % 7 === 6){
                            days.push(iter);
                            iter = [];
                        }
                    }
                    return days;
                },
                itemLastMonth: function(item){
                    var that = this;
                    var date = item.date;
                    var newDate = new Date(date);
                    newDate.setMonth(newDate.getMonth()-1);
                    newDate.setDate(1);
                    var today = new Date();
                    if(newDate < today){
                        newDate = today;
                    }
                    AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                        date: util.dateFormat(newDate),
                        id: item.id
                    }, function(result){
                        item.date = newDate;
                        item.dateStr = util.dateFormat(newDate);
                        item.dateStr2 = util.dateFormatWithoutYear(newDate);
                        item.days = that.createFoodFunCalendar(item);
                        item.inventory = result.data.inventory;
                        scope.$apply();
                    });
                },
                itemNextMonth: function(item){
                    var that = this;
                    var date = item.date;
                    var newDate = new Date(date);
                    newDate.setMonth(newDate.getMonth()+1);
                    newDate.setDate(1);
                    var today = new Date();
                    if(newDate < today){
                        newDate = today;
                    }
                    AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                        date: util.dateFormat(newDate),
                        id: item.id
                    }, function(result){
                        item.date = newDate;
                        item.dateStr = util.dateFormat(newDate);
                        item.dateStr2 = util.dateFormatWithoutYear(newDate);
                        item.days = that.createFoodFunCalendar(item);
                        item.inventory = result.data.inventory;
                        scope.$apply();
                    });
                },
                changeItemTime: function(item, date){
                    var today = new Date();
                    today.setDate(today.getDate() - 1);
                    if(date < today){
                        return false;
                    }
                    var that = this;
                    AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                        date: util.dateFormat(date),
                        id: item.id
                    }, function(result){
                        item.date = date;
                        item.dateStr = util.dateFormat(date);
                        item.dateStr2 = util.dateFormatWithoutYear(date);
                        item.inventory = result.data.inventory;
                        item.num = (result.data.inventory < 1) ? 0 : 1;
                        item.days = that.createFoodFunCalendar(item);
                        scope.$apply();
                    });
                },
                minusFood: function(i){
                    var food = this.foodItems[i];
                    food.amount--;
                    if(food.amount < food.usedAmount){
                        food.amount = food.usedAmount;
                    }
                },
                plusFood: function(i){
                    var food = this.foodItems[i];
                    food.amount++;
                    var max = food.inventory + food.usedAmount;
                    if(food.amount > max){
                        food.amount = max;
                    }
                },
                deleteFood: function(index){
                    this.foodItems.splice(index, 1);
                },
                minusFun: function(i){
                    var play = this.playItems[i];
                    play.amount--;
                    if(play.amount < play.usedAmount){
                        play.amount = play.usedAmount;
                    }
                },
                plusFun: function(i){
                    var play = this.playItems[i];
                    play.amount++;
                    var max = play.inventory + play.usedAmount;
                    if(play.amount > max){
                        play.amount = max;
                    }
                },
                deleteFun: function(index){
                    this.playItems.splice(index, 1);
                },
                submitOrder: function(){
                    console.log(this);
                }
            };
            for(var key in orderDetail){
                orderEdit[key] = orderDetail[key];
            }
            orderEdit.payments.forEach(function(d){
                if(d.type === 5){
                    orderEdit.discounts = d.fee;
                }
            });
            //准备好房间数据
            orderEdit.rooms.forEach(function(d){
                d.sstartDate = d.startDate.substr(5, 5);
                d.scanlerdarDate = d.startDate;
                d.sendDate = d.endDate.substr(5, 5);
                d.ecanlerdarDate = d.endDate;
                console.log(d);
                if(d.state === 0){
                    //创建两个日历
                    orderEdit.createRoomCalendarStart(d);
                    orderEdit.createRoomCalendarEnd(d);
                }
            });
            //准备好餐饮数据
            orderEdit.foodItems.forEach(function(d){
                console.log(scope);
                AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                    date: d.date,
                    id: d.serviceId
                }, function(result){
                    d.dateStr = d.date;
                    d.dateStr2 = d.date.substr(5, 5);
                    d.date = new Date(d.date);
                    d.inventory = result.data.inventory;
                    d.days = orderEdit.createFoodFunCalendar(d);
                    scope.$apply();
                });
            });
            //准备好娱乐数据
            orderEdit.playItems.forEach(function(d){
                AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                    date: d.date,
                    id: d.serviceId
                }, function(result){
                    d.dateStr = d.date;
                    d.dateStr2 = d.date.substr(5, 5);
                    d.date = new Date(d.date);
                    d.inventory = result.data.inventory;
                    d.days = orderEdit.createFoodFunCalendar(d);
                    scope.$apply();
                });
            });
            scope.orderEdit = orderEdit;
        };
        scope.showOrderCancel = function(){
            $("#orderDetailModal").modal("hide");
            $("#orderCancelModal").modal("show");
        };
        scope.showOrderEdit = function(){
            initOrderEdit(scope.orderDetail);
            $("#orderDetailModal").modal("hide");
            $("#orderEditModel").modal("show");
        };
    }]);

});

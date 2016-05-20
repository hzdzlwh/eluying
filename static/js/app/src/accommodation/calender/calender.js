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
            scope.initialize();
        };
        scope.selectAllPRoom = function(){
            scope.allPRoom = !scope.allPRoom;
            var flag = scope.allPRoom;
            for(var key in scope.pRoomList){
                scope.pRoomList[key].selected = flag;
            }
            scope.updateGlyphsPos();
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
        scope.updateData = function(){
            scope.startDateStr = util.dateFormatWithoutYear(scope.startDate);
            scope.datesArray = [];
            scope.glyphs = [];
            var tempDate = new Date(scope.startDate);
            for(var i = 0; i < 30; i++){
                scope.datesArray.push({
                    date: tempDate,
                    dateStr: util.dateFormatWithoutYear(tempDate),
                    weekday: util.getWeek(tempDate),
                    left: 111
                });
                tempDate = util.tomorrow(tempDate);
            }
            //维护日历
            var selectedMonth = null;
            var calenderDays = [];
            var firstDay = new Date(scope.startDate);
            firstDay.setDate(1);
            var firstDay_Month = firstDay.getMonth();
            var firstDay_weekday = firstDay.getDay();
            if(selectedMonth && firstDay_Month !== selectedMonth){
                firstDay.setMonth(selectedMonth);
            }
            if(firstDay_weekday === 0){
                for(var i = 6; i > 0; i--){
                    calenderDays.push(util.diffDate(firstDay, -i));
                }
            } else{
                for(var i = firstDay_weekday-1; i > 0; i--){
                    calenderDays.push(util.diffDate(firstDay, -i));
                }
            }
            calenderDays.push(firstDay);
            var temp = util.diffDate(firstDay, 1);
            while(temp.getMonth() === firstDay_Month || calenderDays.length % 7 !== 0){
                calenderDays.push(temp);
                temp = util.diffDate(temp, 1);
            }
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
                endDate: entry.date2,
                sendDate: entry.date,
                roomId: entry.roomId,
                id: entry.cRoomId,
                fee: entry.price,
                sub: true,
                sn: entry.sn,
                name: entry.cRoomName,
                days: 0
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
                    orderList.push(temp);
                    temp = {
                        startDate: entry.date2,
                        sstartDate: entry.date,
                        endDate: entry.date2,
                        sendDate: entry.date,
                        roomId: entry.roomId,
                        id: entry.cRoomId,
                        fee: entry.price,
                        sub: true,
                        sn: entry.sn,
                        name: entry.cRoomName,
                        days: 0
                    };
                }
            }
            orderList.push(temp);
            //新增订单弹出框数据准备
            initNewOrder();
            scope.newOrder.type = type;
            scope.newOrder.title = (function(){
                for(var i = 0; i < STATUS_STR.length; i++){
                    if(STATUS_STR[i].classStr === type){
                        return STATUS_STR[i].title;
                    }
                }
                return null;
            })();
            scope.newOrder.selectedChannel = scope.channels[0].name;
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
                checkPhone: function(){
                    var reg = /^1[3|4|5|7|8]\d{9}$/;
                    return reg.test(this.guestInfo.phone);
                },
                roomList: [],
                foodList: [],
                funList: [],
                changeIds: function(str){
                    this.guestInfo.selectedId = str;
                    this.guestInfo.idVal = null;
                    $(".select1_options").hide();
                },
                changeChannel: function(str){
                    this.selectedChannel = str;
                    $(".select1_options").hide();
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
                        that.foodList.push({
                            id: food.itemId,
                            name: food.name,
                            price: food.price,
                            num: (result.data.inventory < 1) ? 0 : 1,
                            date: new Date(),
                            dateStr: util.dateFormat(new Date()),
                            dateStr2: util.dateFormatWithoutYear(new Date()),
                            inventory: result.data.inventory
                        });
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
                            id: food.itemId,
                            name: food.name,
                            price: food.price,
                            num: (result.data.inventory < 1) ? 0 : 1,
                            date: new Date(),
                            dateStr: util.dateFormat(new Date()),
                            dateStr2: util.dateFormatWithoutYear(new Date()),
                            inventory: result.data.inventory
                        };
                        scope.$apply();
                    });
                    $(".select1_options").hide();
                },
                changeFoodTime: function(index, date){
                    console.log(index, date);
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
                        that.funList.push({
                            id: fun.itemId,
                            name: fun.name,
                            price: fun.price,
                            num: (result.data.inventory < 1) ? 0 : 1,
                            date: new Date(),
                            dateStr: util.dateFormat(new Date()),
                            dateStr2: util.dateFormatWithoutYear(new Date()),
                            inventory: result.data.inventory
                        });
                        scope.$apply();
                    });
                },
                changeFun: function(funItem, fun){
                    var index = (this.funList.indexOf(funItem));
                    this.funList[index] = {
                        id: fun.itemId,
                        name: fun.name,
                        price: fun.price,
                        num: (result.data.inventory < 1) ? 0 : 1,
                        date: new Date(),
                        dateStr: util.dateFormat(new Date()),
                        dateStr2: util.dateFormatWithoutYear(new Date()),
                    };
                    $(".select1_options").hide();
                },
                changeFunTime: function(index, date){
                    console.log(index, date);
                },
                minusFun: function(i){
                    this.funList[i].num--;
                    if(this.funList[i].num < 0){
                        this.funList[i].num = 0
                    }
                },
                plusFun: function(i){
                    this.funList[i].num++;
                    var max = 100;
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
                    var selectedMonth = null;
                    var calenderDays = [];
                    var firstDay = new Date(date);
                    firstDay.setDate(1);
                    var firstDay_Month = firstDay.getMonth();
                    var firstDay_weekday = firstDay.getDay();
                    if(selectedMonth && firstDay_Month !== selectedMonth){
                        firstDay.setMonth(selectedMonth);
                    }
                    if(firstDay_weekday === 0){
                        for(var i = 6; i > 0; i--){
                            calenderDays.push(util.diffDate(firstDay, -i));
                        }
                    } else{
                        for(var i = firstDay_weekday-1; i > 0; i--){
                            calenderDays.push(util.diffDate(firstDay, -i));
                        }
                    }
                    calenderDays.push(firstDay);
                    var temp = util.diffDate(firstDay, 1);
                    while(temp.getMonth() === firstDay_Month || calenderDays.length % 7 !== 0){
                        calenderDays.push(temp);
                        temp = util.diffDate(temp, 1);
                    }
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
                remarks: '',
                discounts: 0,
            };
        };
    }]);

});

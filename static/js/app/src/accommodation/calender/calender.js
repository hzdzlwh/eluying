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

var locked = true;
var statusStr = [
    {},
    {},
    {short: '预', long: '已预订', classStr: 'book'},
    {short: '住', long: '已入住', classStr: 'ing'},
    {},
    {short: '完', long: '已完成', classStr: 'finish'}
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
            if(locked){
                locked = false;
                return false;
            }
            if($(this).hasClass("selected")){
                $(this).removeClass("selected");
            }else{
                $(this).addClass("selected");
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
        // "blur body input.keyword": function(ev){
        //     $(".search .results").hide();
        // },
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
        scope.statusStr = statusStr;

        //搜索用到的变量
        scope.searchKeyword = '';
        scope.filteredGlyphs = function(){
            if(!scope.glyphs){
                return {};
            }
            return scope.glyphs.filter(function(d){
                return d.customerName.indexOf(scope.searchKeyword) > -1 || d.phone.indexOf(scope.searchKeyword) > -1;
            })
        };
        scope.searchResultOnClick = function(){
            alert(111);
        };
        scope.selectDate = function(date){
            scope.startDate = date;
            scope.updateData();
        };
        scope.lastMonth = function(){
            var month = scope.startDate.getMonth();
            scope.startDate.setMonth(month - 1);
            scope.startDate.setDate(1);
            scope.updateData();
        };
        scope.nextMonth = function(){
            var month = scope.startDate.getMonth();
            scope.startDate.setMonth(month + 1);
            scope.startDate.setDate(1);
            scope.updateData();
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
        };
        scope.selectAllPRoom = function(){
            scope.allPRoom = !scope.allPRoom;
            var flag = scope.allPRoom;
            for(var key in scope.pRoomList){
                scope.pRoomList[key].selected = flag;
            }
            scope.updateGlyphsPos();
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
                        console.log(order);
                        var startDate = new Date(order.checkInDate);
                        var endDate = new Date(order.checkOutDate);
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
                        glyph.stateStr = statusStr[glyph.orderState].short;
                        var tempDate = new Date(order.checkInDate);
                        glyph.checkInDateShort = order.checkInDate.substr(5, 5);
                        glyph.checkOutDateShort = order.checkOutDate.substr(5, 5);
                        if(util.isSameDay(startDate, endDate)){
                            occupyList[glyph.checkInDateShort + order.accommodationId] = true;
                        }else{
                            while(tempDate < endDate){
                                occupyList[util.dateFormatWithoutYear(tempDate) + order.accommodationId] = true;
                                tempDate = util.diffDate(tempDate, 1);
                            }
                        }
                        glyph.classStr = statusStr[glyph.orderState].classStr;
                        glyphs.push(glyph);
                    });
                    scope.pRoomList = pRoomList;
                    scope.cRoomStore = cRoomStore;
                    scope.roomStore = roomStore;
                    scope.glyphs = glyphs;
                    scope.occupyList = occupyList;
                    console.log(scope);
                    scope.$apply();
                });
            });
        };
        scope.updateData();
    }]);

});

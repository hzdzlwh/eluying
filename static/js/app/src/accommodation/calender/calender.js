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

var accommodationCtrl = require('./controller/accommodation');
var pRoomFilterCtrl = require('./controller/pRoomFilter');
var dateSelectorCtrl = require('./controller/dateSelector');
var orderNewCtrl = require('./controller/orderNew');
var orderEditCtrl = require('./controller/orderEdit');
var orderDetailCtrl = require('./controller/orderDetail');
var orderSearch = require('./controller/orderSearch');

// var storeService = require('./services/store/getDataService.js');
// var mainCalendarService = require('./services/calendar/mainCalendarService.js');
// var filterService = require('./services/filter/filterService.js');
// var accommodationService = require('./services/accommodation/accommodationService.js');
// var shopcartService = require('./services/shopcart/shopcartService.js');
// var preprocessService = require('./services/order/preprocessService.js');
// var orderService = require('./services/order/orderService.js');

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
            var date = $(this).attr("date");
            var room = $(this).attr("room");
            $(".room-item[room=" + room + "]").addClass("selected");
            $(".date-item[date=" + date + "]").addClass("selected");
        },
        "mouseleave body .entryItem": function(){
            $(".room-item").removeClass("selected");
            $(".date-item").removeClass("selected");
        },
        "mousedown body .entryItem": function(ev){
            if(ev.which == 3){
                $(".entryOp").hide();
                $(this).find(".entryOp").show();
                return false;
            }
        },
        "mousedown body .entryItem>.closeTips": function(ev){
            if(ev.which == 3){
                $(".entryOp").hide();
                $(this).siblings(".entryOp").show();
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
        },
        "click body .results": function(ev){
            ev.stopPropagation();
        },
        "click body .category-filter-switch": function(ev){
            ev.stopPropagation();
            if(!$(".category-filter").hasClass("open")){
                $(".category-filter").addClass("open");
            }else{
                $(".category-filter").removeClass("open");
            }
        },
        "click body .date-selector-switch": function(ev){
            ev.stopPropagation();
            if(!$(".date-selector").hasClass("open")){
                $(".date-selector").addClass("open");
            }else{
                $(".date-selector").removeClass("open");
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
        // "focus body input.keyword": function(ev){
        //     $(".search .results").show();
        // },
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
    dateSelectorCtrl(app);
    pRoomFilterCtrl(app);
    accommodationCtrl(app);
    orderNewCtrl(app);
    orderEditCtrl(app);
    orderDetailCtrl(app);
    orderSearch(app);
    // app.controller('calenderCtrl', ['$rootScope', 'scope', function(rootScope, scope) {
    //
    //     rootScope.datesArray = [];
    //     rootScope.calenderDays = [];
    //     rootScope.statusStr = STATUS_STR;
    //     rootScope.statusStr2 = STATUS_STR2;
    //     rootScope.selectedEntries = {};
    //     rootScope.selectedRooms = [];
    //     rootScope.orderNew = orderService.createOrderNew();
    //
    //     //rootScope全局方法
    //     rootScope.initialize = function(){
    //         initNewOrder();
    //         rootScope.selectedEntries = {};
    //         rootScope.selectedRooms = [];
    //         rootScope.shopcartShow = false;
    //         rootScope.finishShow = false;
    //         rootScope.bookShow = false;
    //         rootScope.ingShow = false;
    //     };
    //     rootScope.updateData = function(){
    //         rootScope.startDateStr = util.dateFormatWithoutYear(rootScope.startDate);
    //         rootScope.datesArray = [];
    //         rootScope.glyphs = [];
    //         var tempDate = new Date(rootScope.startDate);
    //         for(var i = 0; i < 30; i++){
    //             rootScope.datesArray.push({
    //                 date: tempDate,
    //                 dateStrL: util.dateFormat(tempDate),
    //                 dateStr: util.dateFormatWithoutYear(tempDate),
    //                 weekday: util.getWeek(tempDate),
    //                 left: 0
    //             });
    //             tempDate = util.tomorrow(tempDate);
    //         }
    //         //维护日历
    //         mainCalendarService.createCalendar();
    //         //mainCalendarService.createCalendar();
    //         //拉取房态
    //         storeService.getRoomsAndStatus();
    //     };
    //
    //     rootScope.closeRoom = accommodationService.closeRoom;
    //
    //     //下面是订房逻辑
    //     rootScope.addRoom = accommodationService.addRoom;
    //     //购物车显示逻辑
    //     rootScope.shopcartShow = false;
    //     rootScope.bookShow = false;
    //     rootScope.finishShow = false;
    //     rootScope.ingShow = false;
    //     rootScope.t = false;
    //     rootScope.f = false;
    //     rootScope.p = false;
    //     rootScope.showShopCart = shopcartService.showShopCart;
    //     rootScope.checkBeforeAdd = preprocessService.checkBeforeAdd;
    //     rootScope.processBeforeAdd = preprocessService.processBeforeAdd;
    //     rootScope.updateData();
    //
    //     storeService.init();
    //
    //     rootScope.getOrderDetail = orderService.getOrderDetail;
    //     var initNewOrder = function(){
    //         rootScope.newOrder = {
    //             title: null,
    //             type: null,
    //             selectedChannel: null,
    //             guestInfo: {
    //                 name: null,
    //                 phone: null,
    //                 selectedId: '身份证',
    //                 idVal: null
    //             },
    //             roomList: [],
    //             foodList: [],
    //             funList: [],
    //             checkPhone: function(){
    //                 var reg = /^1[3|4|5|7|8]\d{9}$/;
    //                 return reg.test(this.guestInfo.phone);
    //             },
    //             changeIds: function(str){
    //                 this.guestInfo.selectedId = str;
    //                 this.guestInfo.idVal = null;
    //                 $(".select1_options").hide();
    //             },
    //             changeChannel: function(id, name){
    //                 this.selectedChannel = {
    //                     id: id,
    //                     name: name,
    //                 };
    //                 $(".select1_options").hide();
    //             },
    //             createRoomCalendar: function(room){
    //                 this.createRoomCalendarStart(room);
    //                 this.createRoomCalendarEnd(room);
    //             },
    //             createRoomCalendarStart: function(room){
    //                 var startDate = new Date(room.startDate);
    //                 var scanlerdarDate = new Date(room.scanlerdarDate);
    //                 var calenderDays = util.buildCalendar(scanlerdarDate);
    //                 AJAXService.ajaxWithToken('GET', 'getRoomStausUrl', {
    //                     date: util.dateFormat(calenderDays[0]),
    //                     days: calenderDays.length,
    //                     id: room.roomId
    //                 }, function(result2){
    //                     var rs = result2.data.rs;
    //                     var iter = [];
    //                     var days = [];
    //                     for(var i = 0; i < calenderDays.length; i++){
    //                         var sclass = '';
    //                         var today = new Date();
    //                         var text = null;
    //                         if(calenderDays[i] < today || rs.status[i].s!==-1){
    //                             sclass = 'invalid';
    //                         }
    //                         if(util.isSameDay(calenderDays[i], today)){
    //                             sclass += ' today';
    //                             text = '今';
    //                         }
    //                         if(util.isSameDay(calenderDays[i], startDate)){
    //                             sclass += ' selected';
    //                         }
    //                         iter.push({
    //                             text: text,
    //                             date: calenderDays[i],
    //                             sclass: sclass,
    //                             price: rs.status[i].p
    //                         });
    //                         if(i % 7 === 6){
    //                             days.push(iter);
    //                             iter = [];
    //                         }
    //                     }
    //                     room.startDays = days;
    //                     rootScope.$apply();
    //                 });
    //             },
    //             createRoomCalendarEnd: function(room){
    //                 var startDate = new Date(room.startDate);
    //                 var endDate = new Date(room.endDate);
    //                 var ecanlerdarDate = new Date(room.ecanlerdarDate);
    //                 var calenderDays = util.buildCalendar(ecanlerdarDate);
    //                 AJAXService.ajaxWithToken('GET', 'getRoomStausUrl', {
    //                     date: util.dateFormat(calenderDays[0]),
    //                     days: calenderDays.length,
    //                     id: room.roomId
    //                 }, function(result2){
    //                     var rs = result2.data.rs;
    //                     var iter = [];
    //                     var days = [];
    //                     for(var i = 0; i < calenderDays.length; i++){
    //                         var sclass = '';
    //                         var today = new Date();
    //                         var text = null;
    //                         if(calenderDays[i] < today || calenderDays[i] <= startDate
    //                             || (i > 0 && rs.status[i-1].s!==-1)){
    //                             sclass = 'invalid';
    //                         }
    //                         if(util.isSameDay(calenderDays[i], today)){
    //                             sclass += ' today';
    //                             text = '今';
    //                         }
    //                         if(util.isSameDay(calenderDays[i], endDate)){
    //                             sclass += ' selected';
    //                         }
    //                         iter.push({
    //                             text: text,
    //                             date: calenderDays[i],
    //                             sclass: sclass,
    //                             price: rs.status[i].p
    //                         });
    //                         if(i % 7 === 6){
    //                             days.push(iter);
    //                             iter = [];
    //                         }
    //                     }
    //                     room.endDays = days;
    //                     rootScope.$apply();
    //                 });
    //             },
    //             changeRoomStartDate: function(room, date, sclass){
    //                 if(sclass == 'invalid'){
    //                     return false;
    //                 }
    //                 //开始日期大于结束日期
    //                 if(date >= new Date(room.endDate)){
    //                     var nendDate = util.diffDate(date, 1);
    //                     room.endDate = util.dateFormat(nendDate);
    //                     room.sendDate = util.dateFormatWithoutYear(nendDate);
    //                     room.days = 1;
    //                 }
    //                 room.startDate = util.dateFormat(date);
    //                 room.scanlerdarDate = util.dateFormat(date);
    //                 room.sstartDate = util.dateFormatWithoutYear(date);
    //                 room.days = util.DateDiff(date, new Date(room.endDate));
    //                 var temp = new Date(date);
    //                 var fee = 0;
    //                 for(var i = 0; i < room.startDays.length; i++){
    //                     if(util.isSameDay(temp, new Date(room.endDate))){
    //                         break;
    //                     }
    //                     var row = room.startDays[i];
    //                     for(var j = 0; j < row.length; j++){
    //                         if(util.isSameDay(temp, row[j].date)){
    //                             fee += row[j].price;
    //                             temp = util.tomorrow(temp);
    //                         }
    //                         if(util.isSameDay(temp, new Date(room.endDate))){
    //                             break;
    //                         }
    //                     }
    //                 }
    //                 room.fee = fee;
    //                 this.createRoomCalendar(room);
    //             },
    //             changeRoomEndDate: function(room, date, sclass){
    //                 if(sclass == 'invalid'){
    //                     return false;
    //                 }
    //                 var startDate = new Date(room.startDate);
    //                 //中间有被占用的房间
    //                 var temp = new Date(startDate);
    //                 temp = util.diffDate(temp, 1);
    //                 for(var i = 0; i < room.endDays.length; i++){
    //                     if(util.isSameDay(temp, new Date(date))){
    //                         break;
    //                     }
    //                     var row = room.endDays[i];
    //                     for(var j = 0; j < row.length; j++){
    //                         if(util.isSameDay(row[j].date, temp)){
    //                             if(row[j].sclass === 'invalid'){
    //                                 return false;
    //                             }
    //                             temp = util.diffDate(temp, 1);
    //                         }
    //                         if(util.isSameDay(temp, new Date(date))){
    //                             break;
    //                         }
    //                     }
    //                 }
    //                 room.endDate = util.dateFormat(date);
    //                 room.ecanlerdarDate = util.dateFormat(date);
    //                 room.sendDate = util.dateFormatWithoutYear(date);
    //                 room.days = util.DateDiff(new Date(startDate), new Date(room.endDate));
    //                 temp = new Date(startDate);
    //                 var fee = 0;
    //                 for(var i = 0; i < room.endDays.length; i++){
    //                     if(util.isSameDay(temp, new Date(room.endDate))){
    //                         break;
    //                     }
    //                     var row = room.endDays[i];
    //                     for(var j = 0; j < row.length; j++){
    //                         if(util.isSameDay(temp, row[j].date)){
    //                             fee += row[j].price;
    //                             temp = util.tomorrow(temp);
    //                         }
    //                         if(util.isSameDay(temp, new Date(room.endDate))){
    //                             break;
    //                         }
    //                     }
    //                 }
    //                 room.fee = fee;
    //                 this.createRoomCalendar(room);
    //             },
    //             changeRoomStartMonth: function(room, monthDiff){
    //                 var scanlerdarDate = new Date(room.scanlerdarDate);
    //                 scanlerdarDate.setMonth(scanlerdarDate.getMonth() + monthDiff);
    //                 room.scanlerdarDate = util.dateFormat(scanlerdarDate);
    //                 this.createRoomCalendarStart(room);
    //             },
    //             changeRoomEndMonth: function(room, monthDiff){
    //                 var ecanlerdarDate = new Date(room.ecanlerdarDate);
    //                 ecanlerdarDate.setMonth(ecanlerdarDate.getMonth() + monthDiff);
    //                 room.ecanlerdarDate = util.dateFormat(ecanlerdarDate);
    //                 this.createRoomCalendarEnd(room);
    //             },
    //             deleteRoom: function(index){
    //                 this.roomList.splice(index, 1);
    //                 if(this.roomList.length == 0){
    //                     $("#newOrderModal").modal("hide");
    //                 }
    //             },
    //             deleteFood: function(index){
    //                 this.foodList.splice(index, 1);
    //             },
    //             addFood: function(){
    //                 var food = rootScope.foodList[0];
    //                 var that = this;
    //                 AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
    //                     date: util.dateFormat(new Date()),
    //                     id: food.itemId
    //                 }, function(result){
    //                     var temp = {
    //                         type: 1,
    //                         id: food.itemId,
    //                         name: food.name,
    //                         price: food.price,
    //                         num: (result.data.inventory < 1) ? 0 : 1,
    //                         date: new Date(),
    //                         dateStr: util.dateFormat(new Date()),
    //                         dateStr2: util.dateFormatWithoutYear(new Date()),
    //                         inventory: result.data.inventory,
    //                     };
    //                     temp.days = that.createFoodFunCalendar(temp);
    //                     that.foodList.push(temp);
    //                     rootScope.$apply();
    //                 });
    //             },
    //             changeFood: function(foodItem, food){
    //                 var index = (this.foodList.indexOf(foodItem));
    //                 var that = this;
    //                 AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
    //                     date: util.dateFormat(new Date()),
    //                     id: food.itemId
    //                 }, function(result){
    //                     that.foodList[index] = {
    //                         type: 1,
    //                         id: food.itemId,
    //                         name: food.name,
    //                         price: food.price,
    //                         num: (result.data.inventory < 1) ? 0 : 1,
    //                         date: new Date(),
    //                         dateStr: util.dateFormat(new Date()),
    //                         dateStr2: util.dateFormatWithoutYear(new Date()),
    //                         inventory: result.data.inventory
    //                     };
    //                     that.foodList[index].days = that.createFoodFunCalendar(that.foodList[index]);
    //                     rootScope.$apply();
    //                 });
    //                 $(".select1_options").hide();
    //             },
    //             minusFood: function(i){
    //                 this.foodList[i].num--;
    //                 if(this.foodList[i].num < 0){
    //                     this.foodList[i].num = 0
    //                 }
    //             },
    //             plusFood: function(i){
    //                 this.foodList[i].num++;
    //                 var max = this.foodList[i].inventory;
    //                 if(this.foodList[i].num > max){
    //                     this.foodList[i].num = max;
    //                 }
    //             },
    //             deleteFun: function(index){
    //                 this.funList.splice(index, 1);
    //             },
    //             addFun: function(){
    //                 var fun = rootScope.funList[0];
    //                 var that = this;
    //                 AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
    //                     date: util.dateFormat(new Date()),
    //                     id: fun.itemId
    //                 }, function(result){
    //                     var temp = {
    //                         type: 2,
    //                         id: fun.itemId,
    //                         name: fun.name,
    //                         price: fun.price,
    //                         num: (result.data.inventory < 1) ? 0 : 1,
    //                         date: new Date(),
    //                         dateStr: util.dateFormat(new Date()),
    //                         dateStr2: util.dateFormatWithoutYear(new Date()),
    //                         inventory: result.data.inventory,
    //                     };
    //                     temp.days = that.createFoodFunCalendar(temp);
    //                     that.funList.push(temp);
    //                     rootScope.$apply();
    //                 });
    //             },
    //             changeFun: function(funItem, fun){
    //                 var index = (this.funList.indexOf(funItem));
    //                 var that = this;
    //                 AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
    //                     date: util.dateFormat(new Date()),
    //                     id: fun.itemId
    //                 }, function(result){
    //                     that.funList[index] = {
    //                         type: 2,
    //                         id: fun.itemId,
    //                         name: fun.name,
    //                         price: fun.price,
    //                         num: (result.data.inventory < 1) ? 0 : 1,
    //                         date: new Date(),
    //                         dateStr: util.dateFormat(new Date()),
    //                         dateStr2: util.dateFormatWithoutYear(new Date()),
    //                         inventory: result.data.inventory
    //                     };
    //                     that.funList[index].days = that.createFoodFunCalendar(that.funList[index]);
    //                     rootScope.$apply();
    //                 });
    //                 $(".select1_options").hide();
    //             },
    //             changeItemTime: function(item, date){
    //                 var today = new Date();
    //                 today.setDate(today.getDate() - 1);
    //                 if(date < today){
    //                     return false;
    //                 }
    //                 var that = this;
    //                 AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
    //                     date: util.dateFormat(date),
    //                     id: item.id
    //                 }, function(result){
    //                     item.date = date;
    //                     item.dateStr = util.dateFormat(date);
    //                     item.dateStr2 = util.dateFormatWithoutYear(date);
    //                     item.inventory = result.data.inventory;
    //                     item.num = (result.data.inventory < 1) ? 0 : 1;
    //                     item.days = that.createFoodFunCalendar(item);
    //                     rootScope.$apply();
    //                 });
    //             },
    //             minusFun: function(i){
    //                 this.funList[i].num--;
    //                 if(this.funList[i].num < 0){
    //                     this.funList[i].num = 0
    //                 }
    //             },
    //             plusFun: function(i){
    //                 this.funList[i].num++;
    //                 var max = this.funList[i].inventory;
    //                 if(this.funList[i].num > max){
    //                     this.funList[i].num = max;
    //                 }
    //             },
    //             totalPrice: function(){
    //                 var price = 0;
    //                 for(var i = 0; i < this.roomList.length; i++){
    //                     price += this.roomList[i].fee;
    //                 }
    //                 for(var i = 0; i < this.foodList.length; i++){
    //                     price += this.foodList[i].num * this.foodList[i].price;
    //                 }
    //                 for(var i = 0; i < this.funList.length; i++){
    //                     price += this.funList[i].num * this.funList[i].price;
    //                 }
    //                 price = price - this.discounts;
    //                 return price < 0 ? 0.01 : price;
    //             },
    //             createFoodFunCalendar: function(item){
    //                 var date = new Date(item.dateStr);
    //                 //维护日历
    //                 var calenderDays = util.buildCalendar(date);
    //                 var iter = [];
    //                 var days = [];
    //                 for(var i = 0; i < calenderDays.length; i++){
    //                     var sclass = '';
    //                     var today = new Date();
    //                     var text = null;
    //                     if(util.isSameDay(calenderDays[i], today)){
    //                         sclass = 'today';
    //                         text = '今';
    //                     }else if(calenderDays[i] < today){
    //                         sclass = 'invalid';
    //                     }
    //                     if(util.isSameDay(calenderDays[i], date)){
    //                         sclass += ' selected';
    //                     }
    //                     iter.push({
    //                         text: text,
    //                         date: calenderDays[i],
    //                         sclass: sclass
    //                     });
    //                     if(i % 7 === 6){
    //                         days.push(iter);
    //                         iter = [];
    //                     }
    //                 }
    //                 return days;
    //             },
    //             itemLastMonth: function(item){
    //                 var that = this;
    //                 var date = item.date;
    //                 var newDate = new Date(date);
    //                 newDate.setMonth(newDate.getMonth()-1);
    //                 newDate.setDate(1);
    //                 var today = new Date();
    //                 if(newDate < today){
    //                     newDate = today;
    //                 }
    //                 AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
    //                     date: util.dateFormat(newDate),
    //                     id: item.id
    //                 }, function(result){
    //                     item.date = newDate;
    //                     item.dateStr = util.dateFormat(newDate);
    //                     item.dateStr2 = util.dateFormatWithoutYear(newDate);
    //                     item.days = that.createFoodFunCalendar(item);
    //                     item.inventory = result.data.inventory;
    //                     rootScope.$apply();
    //                 });
    //             },
    //             itemNextMonth: function(item){
    //                 var that = this;
    //                 var date = item.date;
    //                 var newDate = new Date(date);
    //                 newDate.setMonth(newDate.getMonth()+1);
    //                 newDate.setDate(1);
    //                 var today = new Date();
    //                 if(newDate < today){
    //                     newDate = today;
    //                 }
    //                 AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
    //                     date: util.dateFormat(newDate),
    //                     id: item.id
    //                 }, function(result){
    //                     item.date = newDate;
    //                     item.dateStr = util.dateFormat(newDate);
    //                     item.dateStr2 = util.dateFormatWithoutYear(newDate);
    //                     item.days = that.createFoodFunCalendar(item);
    //                     item.inventory = result.data.inventory;
    //                     rootScope.$apply();
    //                 });
    //             },
    //             submitOrder: function(){
    //                 //校验库存
    //                 var inventory = {};
    //                 var itemList = this.foodList.concat(this.funList);
    //                 //数量为0的项目去掉,项目日期一样的项目合并
    //                 for(var i = 0; i < itemList.length; i++){
    //                     var item = itemList[i];
    //                     var inv = inventory[item.id + item.dateStr];
    //                     if(!inv){
    //                         inventory[item.id + item.dateStr] = {
    //                             num: item.num,
    //                             inventory: item.inventory
    //                         }
    //                     }else{
    //                         inv.num += item.num;
    //                         if(inv.num > inv.inventory){
    //                             modal.somethingAlert(util.dateFormatWithoutYearCn(item.dateStr2)
    //                                 + '的' + item.name + "项目库存不足!");
    //                             return false;
    //                         }
    //                     }
    //                 }
    //                 //格式化房间数据
    //                 var rooms = [];
    //                 this.roomList.forEach(function(d){
    //                     var room = {
    //                         startDate: d.startDate,
    //                         endDate: d.endDate,
    //                         roomId: parseInt(d.roomId),
    //                         id: d.id,
    //                         fee: d.fee,
    //                         sub: true,
    //                     };
    //                     rooms.push(room);
    //                 });
    //                 //准备接口所需数据
    //                 var items = [];
    //                 itemList.forEach(function(d, i){
    //                     items.push({
    //                         amount: d.num,
    //                         date: d.dateStr,
    //                         id: d.id,
    //                         name: d.name,
    //                         price: d.price,
    //                         priceId: 0,
    //                         type: d.type
    //                     });
    //                 });
    //                 var type = 0;
    //                 if(this.type === 'book'){
    //                     type = 2;
    //                 }else if(this.type === 'finish'){
    //                     type = 1
    //                 }
    //                 var orderItem = {
    //                     name: this.guestInfo.name,
    //                     origin: this.selectedChannel.name,
    //                     originId: this.selectedChannel.id,
    //                     phone: this.guestInfo.phone,
    //                     remark: this.remarks,
    //                     type: type,
    //                     items: JSON.stringify(items),
    //                     payments: JSON.stringify([{
    //                         fee: this.discounts,
    //                         type: 5
    //                     }]),
    //                     rooms: JSON.stringify(rooms)
    //                 };
    //                 AJAXService.ajaxWithToken('GET', 'confirmOrderUrl', orderItem, function(result3){
    //                     if(result3.code === 1){
    //                         AJAXService.ajaxWithToken('GET', 'getOrderDetailUrl', {
    //                             orderId: result3.data.orderId
    //                         }, function(result){
    //                             if(result.code === 1){
    //                                 initGetMoneyItem();
    //                                 rootScope.getMoneyItem.newOrder(result.data);
    //                                 $("#newOrderModal").modal("hide");
    //                                 $("#getMoneyModal").modal("show");
    //                                 rootScope.initialize();
    //                                 rootScope.updateData();
    //                                 rootScope.$apply();
    //                             }
    //                         });
    //                     }
    //                 });
    //             },
    //             remarks: '',
    //             discounts: 0,
    //         };
    //     };
    //     var initGetMoneyItem = function(){
    //         rootScope.getMoneyItem = {
    //             newOrder: function(orderItem){
    //                 for(var i in orderItem){
    //                     rootScope.getMoneyItem[i] = orderItem[i];
    //                 }
    //                 rootScope.getMoneyItem.payments.forEach(function(d){
    //                    if(d.type === 5){
    //                        rootScope.discounts = d.fee;
    //                    }
    //                     if(d.type === 3){
    //                        rootScope.deposit = d.fee;
    //                    }
    //                 });
    //                 rootScope.getMoneyItem.type = 'new';
    //             }
    //         };
    //     };
    //     var initOrderEdit = function(orderDetail){
    //         var orderEdit = {
    //             selectedId: '身份证',
    //             idVal: null,
    //             checkPhone: function(){
    //                 var reg = /^1[3|4|5|7|8]\d{9}$/;
    //                 return reg.test(this.customerPhone);
    //             },
    //             changeIds: function(str){
    //                 this.selectedId = str;
    //                 this.idVal = null;
    //                 $(".select1_options").hide();
    //             },
    //             changeChannel: function(id, name){
    //                 this.origin = name;
    //                 this.originId = id;
    //                 $(".select1_options").hide();
    //             },
    //             calPrice: function(){
    //                 var price = 0;
    //                 for(var i = 0; i < this.rooms.length; i++){
    //                     price += this.rooms[i].fee;
    //                 }
    //                 for(var i = 0; i < this.foodItems.length; i++){
    //                     price += this.foodItems[i].amount * this.foodItems[i].price;
    //                 }
    //                 for(var i = 0; i < this.playItems.length; i++){
    //                     price += this.playItems[i].amount * this.playItems[i].price;
    //                 }
    //                 price = price - this.discounts;
    //                 return price < 0 ? 0.01 : price;
    //             },
    //             deleteRoom: function(index){
    //                 if(this.rooms.length == 1){
    //                     return false
    //                 }
    //                 this.rooms.splice(index, 1);
    //             },
    //             addFood: function(){
    //                 var food = rootScope.foodList[0];
    //                 var that = this;
    //                 AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
    //                     date: util.dateFormat(new Date()),
    //                     id: food.itemId
    //                 }, function(result){
    //                     var temp = {
    //                         isNew: true,
    //                         type: 1,
    //                         serviceId: food.itemId,
    //                         name: food.name,
    //                         price: food.price,
    //                         amount: (result.data.inventory < 1) ? 0 : 1,
    //                         date: new Date(),
    //                         dateStr: util.dateFormat(new Date()),
    //                         dateStr2: util.dateFormatWithoutYear(new Date()),
    //                         inventory: result.data.inventory,
    //                     };
    //                     temp.days = that.createFoodFunCalendar(temp);
    //                     that.foodItems.push(temp);
    //                     rootScope.$apply();
    //                 });
    //             },
    //             changeFood: function(foodItem, food){
    //                 var index = (this.foodItems.indexOf(foodItem));
    //                 var that = this;
    //                 AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
    //                     date: util.dateFormat(new Date()),
    //                     id: food.itemId
    //                 }, function(result){
    //                     that.foodItems[index] = {
    //                         isNew: true,
    //                         type: 1,
    //                         serviceId: food.itemId,
    //                         name: food.name,
    //                         price: food.price,
    //                         amount: (result.data.inventory < 1) ? 0 : 1,
    //                         date: new Date(),
    //                         dateStr: util.dateFormat(new Date()),
    //                         dateStr2: util.dateFormatWithoutYear(new Date()),
    //                         inventory: result.data.inventory
    //                     };
    //                     that.foodItems[index].days = that.createFoodFunCalendar(that.foodItems[index]);
    //                     rootScope.$apply();
    //                 });
    //                 $(".select1_options").hide();
    //             },
    //             addFun: function(){
    //                 var fun = rootScope.funList[0];
    //                 var that = this;
    //                 AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
    //                     date: util.dateFormat(new Date()),
    //                     id: fun.itemId
    //                 }, function(result){
    //                     var temp = {
    //                         isNew: true,
    //                         type: 2,
    //                         serviceId: fun.itemId,
    //                         name: fun.name,
    //                         price: fun.price,
    //                         amount: (result.data.inventory < 1) ? 0 : 1,
    //                         date: new Date(),
    //                         dateStr: util.dateFormat(new Date()),
    //                         dateStr2: util.dateFormatWithoutYear(new Date()),
    //                         inventory: result.data.inventory,
    //                     };
    //                     temp.days = that.createFoodFunCalendar(temp);
    //                     that.playItems.push(temp);
    //                     rootScope.$apply();
    //                 });
    //             },
    //             changeFun: function(playItem, fun){
    //                 var index = (this.playItems.indexOf(playItem));
    //                 var that = this;
    //                 AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
    //                     date: util.dateFormat(new Date()),
    //                     id: fun.itemId
    //                 }, function(result){
    //                     that.playItem[index] = {
    //                         isNew: true,
    //                         type: 2,
    //                         serviceId: fun.itemId,
    //                         name: fun.name,
    //                         price: fun.price,
    //                         amount: (result.data.inventory < 1) ? 0 : 1,
    //                         date: new Date(),
    //                         dateStr: util.dateFormat(new Date()),
    //                         dateStr2: util.dateFormatWithoutYear(new Date()),
    //                         inventory: result.data.inventory
    //                     };
    //                     that.playItems[index].days = that.createFoodFunCalendar(that.playItems[index]);
    //                     rootScope.$apply();
    //                 });
    //                 $(".select1_options").hide();
    //             },
    //             createRoomCalendar: function(room){
    //                 this.createRoomCalendarStart(room);
    //                 this.createRoomCalendarEnd(room);
    //             },
    //             createRoomCalendarStart: function(room){
    //                 var startDate = new Date(room.startDate);
    //                 var endDate = new Date(room.endDate);
    //                 var scanlerdarDate = new Date(room.scanlerdarDate);
    //                 var calenderDays = util.buildCalendar(scanlerdarDate);
    //                 AJAXService.ajaxWithToken('GET', 'getRoomStausUrl', {
    //                     date: util.dateFormat(calenderDays[0]),
    //                     days: calenderDays.length,
    //                     id: room.roomId
    //                 }, function(result2){
    //                     var rs = result2.data.rs;
    //                     var iter = [];
    //                     var days = [];
    //                     for(var i = 0; i < calenderDays.length; i++){
    //                         var sclass = '';
    //                         var today = new Date();
    //                         var text = null;
    //                         if(calenderDays[i] < today ||
    //                             (rs.status[i].s!==-1&&!(calenderDays[i]>=startDate&&calenderDays[i]<=endDate))){
    //                             sclass = 'invalid';
    //                         }
    //                         if(util.isSameDay(calenderDays[i], today)){
    //                             sclass += ' today';
    //                             text = '今';
    //                         }
    //                         if(util.isSameDay(calenderDays[i], startDate)){
    //                             sclass += ' selected';
    //                         }
    //                         iter.push({
    //                             text: text,
    //                             date: calenderDays[i],
    //                             sclass: sclass,
    //                             price: rs.status[i].p
    //                         });
    //                         if(i % 7 === 6){
    //                             days.push(iter);
    //                             iter = [];
    //                         }
    //                     }
    //                     room.startDays = days;
    //                     rootScope.$apply();
    //                 });
    //             },
    //             createRoomCalendarEnd: function(room){
    //                 var startDate = new Date(room.startDate);
    //                 var endDate = new Date(room.endDate);
    //                 var ecanlerdarDate = new Date(room.ecanlerdarDate);
    //                 var calenderDays = util.buildCalendar(ecanlerdarDate);
    //                 AJAXService.ajaxWithToken('GET', 'getRoomStausUrl', {
    //                     date: util.dateFormat(calenderDays[0]),
    //                     days: calenderDays.length,
    //                     id: room.roomId
    //                 }, function(result2){
    //                     var rs = result2.data.rs;
    //                     var iter = [];
    //                     var days = [];
    //                     for(var i = 0; i < calenderDays.length; i++){
    //                         var sclass = '';
    //                         var today = new Date();
    //                         var text = null;
    //                         if(calenderDays[i] < today || calenderDays[i] <= startDate
    //                             || (i > 0 && rs.status[i-1].s!==-1 && !(calenderDays[i]>startDate&&calenderDays[i]<=endDate))){
    //                             sclass = 'invalid';
    //                         }
    //                         if(util.isSameDay(calenderDays[i], today)){
    //                             sclass += ' today';
    //                             text = '今';
    //                         }
    //                         if(util.isSameDay(calenderDays[i], endDate)){
    //                             sclass += ' selected';
    //                         }
    //                         iter.push({
    //                             text: text,
    //                             date: calenderDays[i],
    //                             sclass: sclass,
    //                             price: rs.status[i].p
    //                         });
    //                         if(i % 7 === 6){
    //                             days.push(iter);
    //                             iter = [];
    //                         }
    //                     }
    //                     room.endDays = days;
    //                     rootScope.$apply();
    //                 });
    //             },
    //             changeRoomStartDate: function(room, date, sclass){
    //                 if(sclass == 'invalid'){
    //                     return false;
    //                 }
    //                 //开始日期大于结束日期
    //                 if(date >= new Date(room.endDate)){
    //                     var nendDate = util.diffDate(date, 1);
    //                     room.endDate = util.dateFormat(nendDate);
    //                     room.sendDate = util.dateFormatWithoutYear(nendDate);
    //                     room.duration = 1;
    //                 }
    //                 room.startDate = util.dateFormat(date);
    //                 room.scanlerdarDate = util.dateFormat(date);
    //                 room.sstartDate = util.dateFormatWithoutYear(date);
    //                 room.duration = util.DateDiff(date, new Date(room.endDate));
    //                 var temp = new Date(date);
    //                 var fee = 0;
    //                 for(var i = 0; i < room.startDays.length; i++){
    //                     if(util.isSameDay(temp, new Date(room.endDate))){
    //                         break;
    //                     }
    //                     var row = room.startDays[i];
    //                     for(var j = 0; j < row.length; j++){
    //                         if(util.isSameDay(temp, row[j].date)){
    //                             fee += row[j].price;
    //                             temp = util.tomorrow(temp);
    //                         }
    //                         if(util.isSameDay(temp, new Date(room.endDate))){
    //                             break;
    //                         }
    //                     }
    //                 }
    //                 room.fee = fee;
    //                 this.createRoomCalendar(room);
    //             },
    //             changeRoomEndDate: function(room, date, sclass){
    //                 if(sclass == 'invalid'){
    //                     return false;
    //                 }
    //                 var startDate = new Date(room.startDate);
    //                 //中间有被占用的房间
    //                 var temp = new Date(startDate);
    //                 temp = util.diffDate(temp, 1);
    //                 for(var i = 0; i < room.endDays.length; i++){
    //                     if(util.isSameDay(temp, new Date(date))){
    //                         break;
    //                     }
    //                     var row = room.endDays[i];
    //                     for(var j = 0; j < row.length; j++){
    //                         if(util.isSameDay(row[j].date, temp)){
    //                             if(row[j].sclass === 'invalid'){
    //                                 return false;
    //                             }
    //                             temp = util.diffDate(temp, 1);
    //                         }
    //                         if(util.isSameDay(temp, new Date(date))){
    //                             break;
    //                         }
    //                     }
    //                 }
    //                 room.endDate = util.dateFormat(date);
    //                 room.ecanlerdarDate = util.dateFormat(date);
    //                 room.sendDate = util.dateFormatWithoutYear(date);
    //                 room.duration = util.DateDiff(new Date(startDate), new Date(room.endDate));
    //                 temp = new Date(startDate);
    //                 var fee = 0;
    //                 for(var i = 0; i < room.endDays.length; i++){
    //                     if(util.isSameDay(temp, new Date(room.endDate))){
    //                         break;
    //                     }
    //                     var row = room.endDays[i];
    //                     for(var j = 0; j < row.length; j++){
    //                         if(util.isSameDay(temp, row[j].date)){
    //                             fee += row[j].price;
    //                             temp = util.tomorrow(temp);
    //                         }
    //                         if(util.isSameDay(temp, new Date(room.endDate))){
    //                             break;
    //                         }
    //                     }
    //                 }
    //                 room.fee = fee;
    //                 this.createRoomCalendar(room);
    //             },
    //             changeRoomStartMonth: function(room, monthDiff){
    //                 var scanlerdarDate = new Date(room.scanlerdarDate);
    //                 scanlerdarDate.setMonth(scanlerdarDate.getMonth() + monthDiff);
    //                 room.scanlerdarDate = util.dateFormat(scanlerdarDate);
    //                 this.createRoomCalendarStart(room);
    //             },
    //             changeRoomEndMonth: function(room, monthDiff){
    //                 var ecanlerdarDate = new Date(room.ecanlerdarDate);
    //                 ecanlerdarDate.setMonth(ecanlerdarDate.getMonth() + monthDiff);
    //                 room.ecanlerdarDate = util.dateFormat(ecanlerdarDate);
    //                 this.createRoomCalendarEnd(room);
    //             },
    //             createFoodFunCalendar: function(item){
    //                 var date = new Date(item.dateStr);
    //                 //维护日历
    //                 var calenderDays = util.buildCalendar(date);
    //                 var iter = [];
    //                 var days = [];
    //                 for(var i = 0; i < calenderDays.length; i++){
    //                     var sclass = '';
    //                     var today = new Date();
    //                     var text = null;
    //                     if(util.isSameDay(calenderDays[i], today)){
    //                         sclass = 'today';
    //                         text = '今';
    //                     }else if(calenderDays[i] < today){
    //                         sclass = 'invalid';
    //                     }
    //                     if(util.isSameDay(calenderDays[i], date)){
    //                         sclass += ' selected';
    //                     }
    //                     iter.push({
    //                         text: text,
    //                         date: calenderDays[i],
    //                         sclass: sclass
    //                     });
    //                     if(i % 7 === 6){
    //                         days.push(iter);
    //                         iter = [];
    //                     }
    //                 }
    //                 return days;
    //             },
    //             itemLastMonth: function(item){
    //                 var that = this;
    //                 var date = item.date;
    //                 var newDate = new Date(date);
    //                 newDate.setMonth(newDate.getMonth()-1);
    //                 newDate.setDate(1);
    //                 var today = new Date();
    //                 if(newDate < today){
    //                     newDate = today;
    //                 }
    //                 AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
    //                     date: util.dateFormat(newDate),
    //                     id: item.id
    //                 }, function(result){
    //                     item.date = newDate;
    //                     item.dateStr = util.dateFormat(newDate);
    //                     item.dateStr2 = util.dateFormatWithoutYear(newDate);
    //                     item.days = that.createFoodFunCalendar(item);
    //                     item.inventory = result.data.inventory;
    //                     rootScope.$apply();
    //                 });
    //             },
    //             itemNextMonth: function(item){
    //                 var that = this;
    //                 var date = item.date;
    //                 var newDate = new Date(date);
    //                 newDate.setMonth(newDate.getMonth()+1);
    //                 newDate.setDate(1);
    //                 var today = new Date();
    //                 if(newDate < today){
    //                     newDate = today;
    //                 }
    //                 AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
    //                     date: util.dateFormat(newDate),
    //                     id: item.id
    //                 }, function(result){
    //                     item.date = newDate;
    //                     item.dateStr = util.dateFormat(newDate);
    //                     item.dateStr2 = util.dateFormatWithoutYear(newDate);
    //                     item.days = that.createFoodFunCalendar(item);
    //                     item.inventory = result.data.inventory;
    //                     rootScope.$apply();
    //                 });
    //             },
    //             changeItemTime: function(item, date){
    //                 var today = new Date();
    //                 today.setDate(today.getDate() - 1);
    //                 if(date < today){
    //                     return false;
    //                 }
    //                 var that = this;
    //                 AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
    //                     date: util.dateFormat(date),
    //                     id: item.id
    //                 }, function(result){
    //                     item.date = date;
    //                     item.dateStr = util.dateFormat(date);
    //                     item.dateStr2 = util.dateFormatWithoutYear(date);
    //                     item.inventory = result.data.inventory;
    //                     item.num = (result.data.inventory < 1) ? 0 : 1;
    //                     item.days = that.createFoodFunCalendar(item);
    //                     rootScope.$apply();
    //                 });
    //             },
    //             minusFood: function(i){
    //                 var food = this.foodItems[i];
    //                 food.amount--;
    //                 if(food.amount < food.usedAmount){
    //                     food.amount = food.usedAmount;
    //                 }
    //             },
    //             plusFood: function(i){
    //                 var food = this.foodItems[i];
    //                 food.amount++;
    //                 var max = food.inventory + food.usedAmount;
    //                 if(food.amount > max){
    //                     food.amount = max;
    //                 }
    //             },
    //             deleteFood: function(index){
    //                 this.foodItems.splice(index, 1);
    //             },
    //             minusFun: function(i){
    //                 var play = this.playItems[i];
    //                 play.amount--;
    //                 if(play.amount < play.usedAmount){
    //                     play.amount = play.usedAmount;
    //                 }
    //             },
    //             plusFun: function(i){
    //                 var play = this.playItems[i];
    //                 play.amount++;
    //                 var max = play.inventory + play.usedAmount;
    //                 if(play.amount > max){
    //                     play.amount = max;
    //                 }
    //             },
    //             deleteFun: function(index){
    //                 this.playItems.splice(index, 1);
    //             },
    //             submitOrder: function(){
    //                 console.log(this);
    //             }
    //         };
    //         for(var key in orderDetail){
    //             orderEdit[key] = orderDetail[key];
    //         }
    //         orderEdit.payments.forEach(function(d){
    //             if(d.type === 5){
    //                 orderEdit.discounts = d.fee;
    //             }
    //         });
    //         //准备好房间数据
    //         orderEdit.rooms.forEach(function(d){
    //             d.sstartDate = d.startDate.substr(5, 5);
    //             d.scanlerdarDate = d.startDate;
    //             d.sendDate = d.endDate.substr(5, 5);
    //             d.ecanlerdarDate = d.endDate;
    //             console.log(d);
    //             if(d.state === 0){
    //                 //创建两个日历
    //                 orderEdit.createRoomCalendarStart(d);
    //                 orderEdit.createRoomCalendarEnd(d);
    //             }
    //         });
    //         //准备好餐饮数据
    //         orderEdit.foodItems.forEach(function(d){
    //             console.log(rootScope);
    //             AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
    //                 date: d.date,
    //                 id: d.serviceId
    //             }, function(result){
    //                 d.dateStr = d.date;
    //                 d.dateStr2 = d.date.substr(5, 5);
    //                 d.date = new Date(d.date);
    //                 d.inventory = result.data.inventory;
    //                 d.days = orderEdit.createFoodFunCalendar(d);
    //                 rootScope.$apply();
    //             });
    //         });
    //         //准备好娱乐数据
    //         orderEdit.playItems.forEach(function(d){
    //             AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
    //                 date: d.date,
    //                 id: d.serviceId
    //             }, function(result){
    //                 d.dateStr = d.date;
    //                 d.dateStr2 = d.date.substr(5, 5);
    //                 d.date = new Date(d.date);
    //                 d.inventory = result.data.inventory;
    //                 d.days = orderEdit.createFoodFunCalendar(d);
    //                 rootScope.$apply();
    //             });
    //         });
    //         rootScope.orderEdit = orderEdit;
    //     };
    //     rootScope.showOrderCancel = function(){
    //         $("#orderDetailModal").modal("hide");
    //         $("#orderCancelModal").modal("show");
    //     };
    //     rootScope.showOrderEdit = function(){
    //         initOrderEdit(rootScope.orderDetail);
    //         $("#orderDetailModal").modal("hide");
    //         $("#orderEditModel").modal("show");
    //     };
    // }]);

});

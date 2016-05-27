/*
订单创建、编辑、取消等过程中所用到的所有通用的方法
 */
var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var constService = require("../services/constService");
var calendarService = require("../services/calendarService");

var orderService = function(app){
    constService(app);
    calendarService(app);
    app.service("orderService", ['$rootScope', 'constService', 'calendarService',
        function(rootScope, constService, calendarService){
        this.createRoomItem = function(data){
            return {
                startDate: data.date2,
                sstartDate: data.date,
                scanlerdarDate: data.date2,
                endDate: data.date2,
                sendDate: data.date,
                roomId: data.roomId,
                id: data.cRoomId,
                fee: data.price,
                sub: true,
                sn: data.sn,
                name: data.cRoomName,
                duration: 1
            }
        };
        this.changeIds = function(method, order){
            order.guestInfo.selectedId = method;
            order.guestInfo.idVal = null;
            $(".select1_options").hide();
        };
        this.changeChannel = function(cid, cname, order){
            order.origin = cname;
            order.originId = cid;
            $(".select1_options").hide();
        };
        this.changeRoomStartDateMonth = function(room, monthDiff){
            var scanlerdarDate = new Date(room.scanlerdarDate);
            scanlerdarDate.setMonth(scanlerdarDate.getMonth() + monthDiff);
            room.scanlerdarDate = util.dateFormat(scanlerdarDate);
            calendarService.createRoomStartDateCalendar(room);
        };
        this.changeRoomEndDateMonth = function(room, monthDiff){
            var ecanlerdarDate = new Date(room.ecanlerdarDate);
            ecanlerdarDate.setMonth(ecanlerdarDate.getMonth() + monthDiff);
            room.ecanlerdarDate = util.dateFormat(ecanlerdarDate);
            calendarService.createRoomEndDateCalendar(room);
        };
        this.changeRoomStartDate = function(room, date, sclass){
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
            for(var i = 0; i < room.scalendar.length; i++){
                if(util.isSameDay(temp, new Date(room.endDate))){
                     break;
                }
                var row = room.scalendar[i];
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
            calendarService.createRoomStartDateCalendar(room);
            calendarService.createRoomEndDateCalendar(room);
        };
        this.changeRoomEndDate = function(room, date, sclass){
            if(sclass == 'invalid'){
                return false;
            }
            var startDate = new Date(room.startDate);
            //中间有被占用的房间
            var temp = new Date(startDate);
            temp = util.diffDate(temp, 1);
            for(var i = 0; i < room.ecalendar.length; i++){
                if(util.isSameDay(temp, new Date(date))){
                    break;
                }
                var row = room.ecalendar[i];
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
            for(var i = 0; i < room.ecalendar.length; i++){
                if(util.isSameDay(temp, new Date(room.endDate))){
                    break;
                }
                var row = room.ecalendar[i];
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
            calendarService.createRoomStartDateCalendar(room);
            calendarService.createRoomEndDateCalendar(room);
        };
        this.deleteRoom = function(rooms, index){
            rooms.splice(index, 1);
            if(rooms.length == 0){
                $("#newOrderModal").modal("hide");
            }
        };
        this.addItem = function(type, itemList, order){
            var item = itemList[0];
            if(!item){
                return false;
            }
            AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                date: util.dateFormat(new Date()),
                id: item.itemId
            }, function(result){
                var temp = {
                    isNew: true,
                    type: type,
                    categoryId: item.itemId,
                    name: item.name,
                    price: item.price,
                    amount: (result.data.inventory < 1) ? 0 : 1,
                    date: new Date(),
                    dateStr: util.dateFormat(new Date()),
                    dateStr2: util.dateFormatWithoutYear(new Date()),
                    inventory: result.data.inventory
                };
                temp.calendar = calendarService.createCalendar(temp.date);
                if(type === 1){
                    order.foodItems.push(temp);
                }else if(type === 2){
                    order.playItems.push(temp);
                }
                rootScope.$apply();
            });
        };
        this.changeItem = function(items, item, ITEM){
            var index = (items.indexOf(item));
            AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                date: util.dateFormat(new Date()),
                id: ITEM.itemId
            }, function(result){
                var temp = {
                    type: 1,
                    id: ITEM.itemId,
                    name: ITEM.name,
                    price: ITEM.price,
                    amount: (result.data.inventory < 1) ? 0 : 1,
                    date: new Date(),
                    dateStr: util.dateFormat(new Date()),
                    dateStr2: util.dateFormatWithoutYear(new Date()),
                    inventory: result.data.inventory
                };
                temp.calendar = calendarService.createCalendar(temp.date);
                items[index] = temp;
                $(".select1_options").hide();
                rootScope.$apply();
            });
        };
        this.changeItemNum = function(item, num){
            item.amount = num;
            if(num < 0){
                item.amount = 0;
            }
            if(num > item.inventory){
                item.amount = item.inventory;
            }
        };
        this.changeItemTime = function(item, date){
            var today = new Date();
            today.setDate(today.getDate() - 1);
            if(date < today){
                return false;
            }
            var that = this;
            AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                date: util.dateFormat(date),
                id: item.categoryId
            }, function(result){
                item.date = date;
                item.dateStr = util.dateFormat(date);
                item.dateStr2 = util.dateFormatWithoutYear(date);
                item.inventory = result.data.inventory;
                item.num = (result.data.inventory < 1) ? 0 : 1;
                item.calendar = calendarService.createCalendar(item.date);
                rootScope.$apply();
            });
        };
        this.calPrice = function(order){
            var price = 0;
            for(var i = 0; i < order.rooms.length; i++){
                price += order.rooms[i].fee;
            }
            for(var i = 0; i < order.foodItems.length; i++){
                price += order.foodItems[i].amount * order.foodItems[i].price;
            }
            for(var i = 0; i < order.playItems.length; i++){
                price += order.playItems[i].amount * order.playItems[i].price;
            }
            price = price - order.discounts;
            return price < 0 ? 0.01 : price;
        };
        this.calLeft = function(order){
            var price = 0;
            for(var i = 0; i < order.rooms.length; i++){
                price += order.rooms[i].fee;
            }
            for(var i = 0; i < order.foodItems.length; i++){
                price += order.foodItems[i].amount * order.foodItems[i].price;
            }
            for(var i = 0; i < order.playItems.length; i++){
                price += order.playItems[i].amount * order.playItems[i].price;
            }
            price = price - order.discounts;
            var payments = order.payments;
            var left = price;
            for(var i = 0; i < payments.length; i++){
                if(payments[i].type === 0){
                    left -= payments[i].fee;
                }
            }
            return left;
        };
        this.itemPrice = function(order){
            var price = 0;
            for(var i = 0; i < order.rooms.length; i++){
                price += order.rooms[i].fee;
            }
            for(var i = 0; i < order.foodItems.length; i++){
                price += order.foodItems[i].amount * order.foodItems[i].price;
            }
            for(var i = 0; i < order.playItems.length; i++){
                price += order.playItems[i].amount * order.playItems[i].price;
            }
            return price;
        };
        this.deleteItem = function(items, index){
            items.splice(index, 1);
        };
        this.changeItemMonth = function(item, monthDiff){
            var that = this;
            var date = item.date;
            var newDate = new Date(date);
            newDate.setMonth(newDate.getMonth() + monthDiff);
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
                item.calendar = calendarService.createCalendar(item.date);
                item.inventory = result.data.inventory;
                rootScope.$apply();
            });
        };
    }]);
};

module.exports = orderService;
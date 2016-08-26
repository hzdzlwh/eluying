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
        this.showRoomPeopleModal = function(idCardList, serviceId, orderId, roomName) {
            rootScope.$broadcast('showRoomPeopleModal', idCardList, serviceId, orderId, roomName);
            $('#roomPeopleModal').modal('show');
        };
        this.changeIds = function(method, methodLabel, order){
            order.selectedId = method;
            order.selectedIdLabel = methodLabel;
            order.idVal = null;
            order.readable = (methodLabel === '身份证');
            $(".select1_options").hide();
        };
        this.changeChannel = function(cid, cname, order){
            order.origin = cname;
            order.originId = cid;
            $(".select1_options").hide();
        };
        this.changeRoomStartDateMonth = function(room, monthDiff, orderNewType){
            var scanlerdarDate = new Date(room.scanlerdarDate);
            scanlerdarDate.setMonth(scanlerdarDate.getMonth() + monthDiff);
            room.scanlerdarDate = util.dateFormat(scanlerdarDate);
            calendarService.createRoomStartDateCalendar(room, orderNewType);
        };
        this.changeRoomEndDateMonth = function(room, monthDiff, orderNewType){
            var ecanlerdarDate = new Date(room.ecanlerdarDate);
            ecanlerdarDate.setMonth(ecanlerdarDate.getMonth() + monthDiff);
            room.ecanlerdarDate = util.dateFormat(ecanlerdarDate);
            calendarService.createRoomEndDateCalendar(room, orderNewType);
        };
        this.changeRoomStartDate = function(room, date, sclass, orderNewType){
            if(sclass.indexOf('invalid') != -1){
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
            calendarService.createRoomStartDateCalendar(room, orderNewType);
            calendarService.createRoomEndDateCalendar(room, orderNewType);
        };
        this.changeRoomEndDate = function(room, date, sclass, orderNewType){
            if(sclass.indexOf('invalid') != -1){
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
            calendarService.createRoomStartDateCalendar(room, orderNewType);
            calendarService.createRoomEndDateCalendar(room, orderNewType);
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
            var getInventoryDate = order.itemStartDate ? new Date(order.itemStartDate) : new Date();
            if(type === 1 || type === 2){
                AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                    date: util.dateFormat(getInventoryDate),
                    id: item.itemId
                }, function(result){
                    var temp = {
                        isNew: true,
                        type: type,
                        categoryId: item.itemId,
                        name: item.name,
                        price: item.price,
                        amount: (result.data.inventory < 1) ? 0 : 1,
                        date: getInventoryDate,
                        dateStr: util.dateFormat(getInventoryDate),
                        dateStr2: util.dateFormatWithoutYear(getInventoryDate),
                        inventory: result.data.inventory
                    };
                    if(type === 1 && order.foodsAmount && order.foodsAmount[item.date]){
                        temp.inventory += order.foodsAmount[item.date];
                    }
                    if(type === 2 && order.playsAmount && order.playsAmount[item.date]){
                        temp.inventory += order.playsAmount[item.date];
                    }
                    temp.calendar = calendarService.createItemCalendar(temp.date, order.roomEndDate);
                    var sday = util.dateFormat(temp.calendar[0][0].date);
                    var eday = util.dateFormat(temp.calendar[temp.calendar.length-1][6].date);
                    AJAXService.ajaxWithToken('GET', 'getCategoryInventoriesUrl', {
                        startDate: sday,
                        endDate: eday,
                        categoryId: temp.categoryId,
                    }, function(result1){
                        if(result1.code === 1){
                            var inventoryList = result1.data.list;
                            inventoryList.forEach(function(d, i){
                                if(d.remain === 0){
                                    if(temp.calendar[Math.floor(i/7)][i%7].sclass.indexOf('invalid') === -1){
                                        temp.calendar[Math.floor(i/7)][i%7].sclass += ' invalid';
                                    }
                                }
                            });
                            if(type === 1){
                                //order.foodItems.push(temp);
                            }else if(type === 2){
                                order.playItems.push(temp);
                            }
                            rootScope.$apply();
                        }else{

                        }
                    });
                });
            }else if(type === 3){
                order.goodsItems.push({
                    isNew: true,
                    type: type,
                    categoryId: item.itemId,
                    name: item.name,
                    price: item.price,
                    amount: 1,
                });
            }

        };
        
        this.addET = function(order) {
            AJAXService.ajaxWithToken('get', '/entertainment/getCategoryList', {})
                .then(res => {
                    console.log(res);
                });
        };

        this.changeItem = function(order, items, item, ITEM, isGoods){
            var index = (items.indexOf(item));
            if(isGoods){
                items[index] = {
                    isNew: item.isNew,
                    type: 3,
                    categoryId: ITEM.itemId,
                    name: ITEM.name,
                    price: ITEM.price,
                    amount: 1
                };
                $(".select1_options").hide();
                return false;
            }
            var getInventoryDate = order.itemStartDate ? new Date(order.itemStartDate) : new Date();
            AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                date: util.dateFormat(getInventoryDate),
                id: ITEM.itemId
            }, function(result){
                var temp = {
                    isNew: item.isNew,
                    type: 1,
                    categoryId: ITEM.itemId,
                    chargeMode: ITEM.chargeMode, //收费模式 0-按次，1-按时间
                    timeUnit: ITEM.timeUnit, // 时间单位，分钟、小时等
                    unitTime: ITEM.unitTime, // 计时收费最小时间
                    timeAmount: ITEM.unitTime,
                    name: ITEM.name,
                    price: ITEM.price,
                    amount: (result.data.inventory < 1) ? 0 : 1,
                    date: getInventoryDate,
                    dateStr: util.dateFormat(getInventoryDate),
                    dateStr2: util.dateFormatWithoutYear(getInventoryDate),
                    inventory: result.data.inventory
                };
                temp.calendar = calendarService.createItemCalendar(temp.date, order.roomEndDate);
                var sday = util.dateFormat(temp.calendar[0][0].date);
                var eday = util.dateFormat(temp.calendar[temp.calendar.length-1][6].date);
                AJAXService.ajaxWithToken('GET', 'getCategoryInventoriesUrl', {
                    startDate: sday,
                    endDate: eday,
                    categoryId: temp.categoryId,
                }, function(result1){
                    if(result1.code === 1){
                        var inventoryList = result1.data.list;
                        inventoryList.forEach(function(d, i){
                            if(d.remain === 0){
                                if(temp.calendar[Math.floor(i/7)][i%7].sclass.indexOf('invalid') === -1){
                                    temp.calendar[Math.floor(i/7)][i%7].sclass += ' invalid';
                                }
                            }
                        });
                        items[index] = temp;
                        $(".select1_options").hide();
                        rootScope.$apply();
                    }
                });
            });
        };
        this.changeItemNum = function(item, num){
            item.amount = num;
            if(num < 0){
                item.amount = 0;
            }
            if (item.processAmount !== undefined && num < item.processAmount) {
                item.amount = item.processAmount;
            }
            var max = item.inventory > 999 ? 999 : item.inventory 
            if(item.inventory !== undefined && num > max){
                item.amount = max;
            }
        };
        
        /**
         * 减少娱乐时长
         * @param  {} item 娱乐
         */
        this.decreaseTimeAmount = function(item) {
            if (item.timeAmount - item.unitTime >= item.unitTime) {
                item.timeAmount = item.timeAmount - item.unitTime;
            }
        };
        
        /**
         * 增加娱乐时长
         * @param  {} item 娱乐
         */
        this.increaseTimeAmount = function(item) {
            if (item.timeAmount + item.unitTime <= 999) {
                item.timeAmount = item.timeAmount + item.unitTime;
            }
        };
        this.changeItemTime = function(item, date, sclass, order){
            if(sclass.indexOf('invalid') !== -1){
                return false;
            }
            AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                date: util.dateFormat(date),
                id: item.categoryId || item.id
            }, function(result){
                item.date = date;
                item.dateStr = util.dateFormat(date);
                item.dateStr2 = util.dateFormatWithoutYear(date);
                item.inventory = result.data.inventory;
                item.amount = 1;
                item.calendar = calendarService.createItemCalendar(item.date, order && order.roomEndDate);
                var sday = util.dateFormat(item.calendar[0][0].date);
                var eday = util.dateFormat(item.calendar[item.calendar.length-1][6].date);
                AJAXService.ajaxWithToken('GET', 'getCategoryInventoriesUrl', {
                    startDate: sday,
                    endDate: eday,
                    categoryId: item.categoryId,
                }, function(result1){
                    if(result1.code === 1){
                        var inventoryList = result1.data.list;
                        inventoryList.forEach(function(d, i){
                            if(d.remain === 0){
                                if(item.calendar[Math.floor(i/7)][i%7].sclass.indexOf('invalid') === -1){
                                    item.calendar[Math.floor(i/7)][i%7].sclass += ' invalid';
                                }
                            }
                        });
                        rootScope.$apply();
                    }
                });
            });
        };
        //计算订单中客户应付多少钱
        this.calPrice = function(order){
            var price = 0;
            for(var i = 0; i < order.rooms.length; i++){
                price += order.rooms[i].fee;
            }
            for(var i = 0; i < order.foodItems.length; i++){
                if(order.foodItems[i].foodState === 3){
                    continue;
                }
                price += order.foodItems[i].foodPrice;
            }
            for(var i = 0; i < order.playItems.length; i++){
                price += order.playItems[i].amount
                    * order.playItems[i].price
                    * (order.playItems[i].chargeMode == 1 ? (order.playItems[i].timeAmount / order.playItems[i].unitTime) : 1);
            }
            for(var i = 0; i < order.goodsItems.length; i++){
                price += order.goodsItems[i].amount * order.goodsItems[i].price;
            }
            price = price - order.discounts;
            if(price < 0){
                price = 0;
            }
            price = price.toFixed(2)*100/100;
            return price;
        };
        //计算商家需付/客户需补
        this.calLeft = function(order){
            var price = 0;
            for(var i = 0; i < order.rooms.length; i++){
                price += order.rooms[i].fee;
            }
            for(var i = 0; i < order.foodItems.length; i++){
                if(order.foodItems[i].foodState === 3){
                    continue;
                }
                price += order.foodItems[i].foodPrice;
            }
            for(var i = 0; i < order.playItems.length; i++){
                price += order.playItems[i].amount 
                    * order.playItems[i].price 
                    * (order.playItems[i].chargeMode == 1 ? (order.playItems[i].timeAmount / order.playItems[i].unitTime) : 1);
            }
            for(var i = 0; i < order.goodsItems.length; i++){
                price += order.goodsItems[i].amount * order.goodsItems[i].price;
            }
            var left = price;
            left = left - order.discounts;
            var payments = order.payments;
            if(payments){
                for(var i = 0; i < payments.length; i++){
                    if(payments[i].type === 0){
                        left -= parseFloat(payments[i].fee);
                    }else if(payments[i].type === 2){
                        left += parseFloat(payments[i].fee);
                    }else if(payments[i].type === 4){
                        left += parseFloat(payments[i].fee);
                    }
                }
            }
            return parseFloat(left.toFixed(2));
        };
        //计算已收押金
        this.calDeposit = function(order){
            var deposit = 0;
            var payments = order.payments;
            for(var i = 0; i < payments.length; i++){
                if(payments[i].type === 1){
                    deposit += parseFloat(payments[i].fee);
                }
            }
            return deposit;
        };
        this.calDepositLeft = function(order){
            var payments = order.payments;
            var depositTotal = 0;
            var deposit = 0;
            payments.forEach(function(d){
                if(d.type === 1){
                    depositTotal += parseFloat(d.fee);
                }
                if(d.type === 3){
                    deposit += parseFloat(d.fee);
                }
            });
            return depositTotal - deposit;
        };
        this.itemPrice = function(order){
            var price = 0;
            for(var i = 0; i < order.rooms.length; i++){
                price += order.rooms[i].fee;
            }
            for(var i = 0; i < order.foodItems.length; i++){
                if(order.foodItems[i].foodState === 3){
                    continue;
                }
                price += order.foodItems[i].foodPrice;
            }
            for(var i = 0; i < order.playItems.length; i++){
                price += order.playItems[i].amount * order.playItems[i].price;
            }
            for(var i = 0; i < order.goodsItems.length; i++){
                price += order.goodsItems[i].amount * order.goodsItems[i].price;
            }
            return parseFloat(price.toFixed(2));
        };
        //判断订单中有无项目(数量为0的项目表示已经删除的)
        this.itemsExist = function(items){
            if(items.length === 0){
                return false;
            }else {
                var flag = false;
                items.forEach(function(d){
                    if(d.amount > 0){
                        flag = true;
                    }
                });
                return flag;
            }
        };
        // this.deleteItem = function(items, index){
        //     items.splice(index, 1);
        // };
        this.deleteItem = function(items, index){
            if(items[index].isNew){
                items.splice(index, 1);
            }else{
                items[index].amount = items[index].usedAmount || 0;
            }
        };
        this.changeItemMonth = function(item, monthDiff, order){
            var that = this;
            var date = item.date;
            var newDate = new Date(date);
            newDate.setMonth(newDate.getMonth() + monthDiff);
            newDate.setDate(1);
            AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                date: util.dateFormat(newDate),
                id: item.categoryId
            }, function(result){
                item.date = newDate;
                item.dateStr = util.dateFormat(newDate);
                item.dateStr2 = util.dateFormatWithoutYear(newDate);
                item.calendar = calendarService.createItemCalendar(item.date, order.roomEndDate);
                item.inventory = result.data.inventory;
                if(item.type === 1 && order.foodsAmount && order.foodsAmount[item.date]){
                    item.inventory += order.foodsAmount[item.date];
                }
                if(item.type === 2 && order.playsAmount && order.playsAmount[item.date]){
                    item.inventory += order.playsAmount[item.date];
                }
                var sday = util.dateFormat(item.calendar[0][0].date);
                var eday = util.dateFormat(item.calendar[item.calendar.length-1][6].date);
                AJAXService.ajaxWithToken('GET', 'getCategoryInventoriesUrl', {
                    startDate: sday,
                    endDate: eday,
                    categoryId: item.categoryId,
                }, function(result1){
                    if(result1.code === 1){
                        var inventoryList = result1.data.list;
                        inventoryList.forEach(function(d, i){
                            if(d.remain === 0){
                                if(item.calendar[Math.floor(i/7)][i%7].sclass.indexOf('invalid') === -1){
                                    item.calendar[Math.floor(i/7)][i%7].sclass += ' invalid';
                                }
                            }
                        });
                        rootScope.$apply();
                    }
                });
                rootScope.$apply();
            });
        };
        this.moneyInputChange = function(money){
            money = parseFloat(money) || 0;
            money = parseFloat(money.toFixed(2));
        };
        this.deleteFood = function(order, food){
            var index = order.foodItems.indexOf(food);
            AJAXService.ajaxWithToken('GET', 'cateringCancelOrderUrl', {
                caterOrderId: food.foodOrderId,
                payments: '[]',
                restId: food.restId,
                remark: ''
            }, function(result1){
                if(result1.code === 1){
                    order.foodItems.splice(index, 1);
                    rootScope.$apply();
                }
            });
        }
    }]);
};

module.exports = orderService;
var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var startDateCalendarService = require("../calendar/startDateCalendarService.js");
var endDateCalendarService = require("../calendar/endDateCalendarService.js");

var STATUS_STR = [
    {},
    {},
    {short: '预', long: '已预订', classStr: 'book', 'title': '预订'},
    {short: '住', long: '已入住', classStr: 'ing', 'title': '入住'},
    {},
    {short: '完', long: '已完成', classStr: 'finish', 'title': '补录'}
];

var preprocessService = function(app){
    startDateCalendarService(app);
    endDateCalendarService(app);
    app.service("preprocessService", ["$rootScope", "startDateCalendarService", "endDateCalendarService", function(rootScope, startDateCalendarService, endDateCalendarService){
        this.checkBeforeAdd = function(type){
            if(type == 'finish'){
                if(rootScope.t || rootScope.f){
                    $("#finishWarningModal").modal("show");
                    return false;
                }
            }else if(type == 'ing'){
                if(rootScope.p){
                    $("#ingWarningModal").modal("show");
                    return false;
                }
            }else if(type == 'book'){
                if(rootScope.p){
                    $("#bookWarningModal").modal("show");
                    return false;
                }
            }
            this.processBeforeAdd(type);
            $("#newOrderModal").modal("show");
        };
        this.processBeforeAdd = function(type){
            //处理一下选择的房间
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
            rootScope.selectedRooms = selectedRooms;
            rootScope.selectedEntries = selectedEntries_new;
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
                    startDateCalendarService.createCalendar(temp);
                    endDateCalendarService.createCalendar(temp);
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
            startDateCalendarService.createCalendar(temp);
            endDateCalendarService.createCalendar(temp);
            orderList.push(temp);
            //新增订单弹出框数据准备
            rootScope.orderNew.type = type;
            rootScope.orderNew.title = (function(){
                for(var i = 0; i < STATUS_STR.length; i++){
                    if(STATUS_STR[i].classStr === type){
                        return STATUS_STR[i].title;
                    }
                }
                return null;
            })();
            rootScope.orderNew.selectedChannel = {
                name: rootScope.channels[0].name,
                id: -1,
            };
            rootScope.orderNew.roomList = orderList;
            $(".msgModal").modal("hide");
            $("#newOrderModal").modal("show");
        };
    }]);
};

module.exports = preprocessService;
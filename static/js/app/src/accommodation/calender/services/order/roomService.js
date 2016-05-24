var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var roomService = function(app){
    app.service("roomService",["$rootScope", "startDateCalendarService", "endDateCalendarService",
        function(rootScope, startDateCalendarService, endDateCalendarService){
            this.changeRoomStartDate = function(room, date, sclass){
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
                //算房间总价
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
                startDateCalendarService.createCalendar(room);
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
                room.days = util.DateDiff(new Date(startDate), new Date(room.endDate));
                //算房间总价
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
                endDateCalendarService.createCalendar(room);
            },
            this.changeRoomMonth = function(room, calerdarDate, monthDiff){
                var tempDate = new Date(calerdarDate);
                tempDate.setMonth(tempDate.getMonth() + monthDiff);
                calerdarDate = util.dateFormat(tempDate);
                startDateCalendarService.createCalendar(room);
            };
            this.deleteRoom = function(rooms, index){
                rooms.splice(index, 1);
                if(rooms.length === 0){
                    $(".modal").modal("hide");
                }
            };
    }]);
};

module.exports = roomService;
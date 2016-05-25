var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var calendarService = function(app){
    app.service("calendarService", function(){
        var self = this;
        this.buildCalendarTable = function(date){
            var selectedMonth = null;
            var calendarTable = [];
            var firstDay = new Date(date);
            firstDay.setDate(1);
            var firstDay_Month = firstDay.getMonth();
            var firstDay_weekday = firstDay.getDay();
            if(selectedMonth && firstDay_Month !== selectedMonth){
                firstDay.setMonth(selectedMonth);
            }
            if(firstDay_weekday === 0){
                for(var i = 6; i > 0; i--){
                    calendarTable.push(util.diffDate(firstDay, -i));
                }
            } else{
                for(var i = firstDay_weekday-1; i > 0; i--){
                    calendarTable.push(util.diffDate(firstDay, -i));
                }
            }
            calendarTable.push(firstDay);
            var temp = util.diffDate(firstDay, 1);
            while(temp.getMonth() === firstDay_Month || calendarTable.length % 7 !== 0){
                calendarTable.push(temp);
                temp = util.diffDate(temp, 1);
            }
            return calendarTable;
        };
        this.createCalendar = function(startDate){
            var calenderTable = this.buildCalendarTable(startDate);
            var iter = [];
            var days = [];
            for(var i = 0; i < calenderTable.length; i++){
                var sclass = '';
                var today = new Date();
                var text = null;
                if(util.isSameDay(calenderTable[i], today)){
                    sclass = 'today';
                    text = '今';
                }else if(calenderTable[i] < today){
                    sclass = 'invalid';
                }
                if(util.isSameDay(calenderTable[i], startDate)){
                    sclass += ' selected';
                }
                iter.push({
                    text: text,
                    date: calenderTable[i],
                    sclass: sclass
                });
                if(i % 7 === 6){
                    days.push(iter);
                    iter = [];
                }
            }
            return days;
        };
        this.createRoomStartDateCalendar = function(room){
            var startDate = new Date(room.startDate);
            var scanlerdarDate = new Date(room.scanlerdarDate);
            var calenderTable = this.buildCalendarTable(scanlerdarDate);
            AJAXService.ajaxWithToken('GET', 'getRoomStausUrl', {
                date: util.dateFormat(calenderTable[0]),
                days: calenderTable.length,
                id: room.roomId
            }, function(result2){
                var rs = result2.data.rs;
                var iter = [];
                var days = [];
                for(var i = 0; i < calenderTable.length; i++){
                    var sclass = '';
                    var today = new Date();
                    var text = null;
                    if(calenderTable[i] < today || rs.status[i].s!==-1){
                        sclass = 'invalid';
                    }
                    if(util.isSameDay(calenderTable[i], today)){
                        sclass += ' today';
                        text = '今';
                    }
                    if(util.isSameDay(calenderTable[i], startDate)){
                        sclass += ' selected';
                    }
                    iter.push({
                        text: text,
                        date: calenderTable[i],
                        sclass: sclass,
                        price: rs.status[i].p
                    });
                    if(i % 7 === 6){
                        days.push(iter);
                        iter = [];
                    }
                }
                room.scalendar = days;
            });
        };
        this.createRoomEndDateCalendar = function(room){
            var startDate = new Date(room.startDate);
            var endDate = new Date(room.endDate);
            var ecanlerdarDate = new Date(room.ecanlerdarDate);
            var calenderTable = this.buildCalendarTable(ecanlerdarDate);
            AJAXService.ajaxWithToken('GET', 'getRoomStausUrl', {
                date: util.dateFormat(calenderTable[0]),
                days: calenderTable.length,
                id: room.roomId
            }, function(result2){
                var rs = result2.data.rs;
                var iter = [];
                var days = [];
                for(var i = 0; i < calenderTable.length; i++){
                    var sclass = '';
                    var today = new Date();
                    var text = null;
                    if(calenderTable[i] < today || calenderTable[i] <= startDate
                        || (i > 0 && rs.status[i-1].s!==-1)){
                        sclass = 'invalid';
                    }
                    if(util.isSameDay(calenderTable[i], today)){
                        sclass += ' today';
                        text = '今';
                    }
                    if(util.isSameDay(calenderTable[i], endDate)){
                        sclass += ' selected';
                    }
                    iter.push({
                        text: text,
                        date: calenderTable[i],
                        sclass: sclass,
                        price: rs.status[i].p
                    });
                    if(i % 7 === 6){
                        days.push(iter);
                        iter = [];
                    }
                }
                room.ecalendar = days;
                scope.$apply();
            });
        };
    });
};

module.exports = calendarService;
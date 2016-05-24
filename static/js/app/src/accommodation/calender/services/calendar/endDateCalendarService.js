var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var endDateCalendarService = function(app){
    app.service("endDateCalendarService",["$rootScope", 'calendarService', function(rootScope, calendarService){
        var self = this;
        this.createCalendar = function(room){
            var startDate = new Date(room.startDate);
            var endDate = new Date(room.endDate);
            var ecanlerdarDate = new Date(room.ecanlerdarDate);
            var calenderTable = calendarService.buildCalendarTable(ecanlerdarDate);
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
                        text = '½ñ';
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
        this.changeMonth = function(room, monthDiff){
            var ecanlerdarDate = new Date(room.ecanlerdarDate);
            ecanlerdarDate.setMonth(ecanlerdarDate.getMonth() + monthDiff);
            room.ecanlerdarDate = util.dateFormat(ecanlerdarDate);
            this.createCalendar(room);
        }
    }]);
};

module.exports = endDateCalendarService;
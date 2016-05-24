var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var startDateCalendarService = function(app){
    app.service("startDateCalendarService",["$rootScope", 'calendarService', function(rootScope, calendarService){
        var self = this;
        this.createCalendar = function(room){
            var startDate = new Date(room.startDate);
            var scanlerdarDate = new Date(room.scanlerdarDate);
            var calenderTable = calendarService.buildCalendarTable(scanlerdarDate);
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
                        text = '½ñ';
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
                rootScope.$apply();
            });
        };
        this.changeMonth = function(room, monthDiff){
            var scanlerdarDate = new Date(room.scanlerdarDate);
            scanlerdarDate.setMonth(scanlerdarDate.getMonth() + monthDiff);
            room.scanlerdarDate = util.dateFormat(scanlerdarDate);
            this.createCalendar(room);
        }
    }]);
};

module.exports = startDateCalendarService;
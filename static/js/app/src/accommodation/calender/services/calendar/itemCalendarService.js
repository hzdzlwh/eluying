var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var itemCalendarService = function(app){
    app.service("itemCalendarService",["$rootScope", 'calendarService', function(rootScope, calendarService){
        var self = this;
        this.createCalendar = function(item){
            var date = new Date(item.dateStr);
            var calendarTable = calendarService.buildCalendarTable(date);
            var iter = [];
            var calendar = [];
            for(var i = 0; i < calendarTable.length; i++){
                var sclass = '';
                var today = new Date();
                var text = null;
                if(util.isSameDay(calendarTable[i], today)){
                    sclass = 'today';
                    text = '��';
                }else if(calendarTable[i] < today){
                    sclass = 'invalid';
                }
                if(util.isSameDay(calendarTable[i], date)){
                    sclass += ' selected';
                }
                iter.push({
                    text: text,
                    date: calendarTable[i],
                    sclass: sclass
                });
                if(i % 7 === 6){
                    calendar.push(iter);
                    iter = [];
                }
            }
            item.calendar = calendar;
        };
        this.changeMonth = function(item, diff){
            var self = this;
            var date = item.date;
            var newDate = new Date(date);
            newDate.setMonth(newDate.getMonth() + diff);
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
                self.createCalendar(item);
                item.inventory = result.data.inventory;
                rootScope.$apply();
            });
        };
    }]);
};

module.exports = itemCalendarService;
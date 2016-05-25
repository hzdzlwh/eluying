var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var calendarService = require("./../calendarService.js");

var mainCalendarService = function(app){
    calendarService(app);
    app.service("mainCalendarService", ["$rootScope", 'calendarService', function(rootScope, calendarService){
        this.createCalendar = function(){
            var startDate = rootScope.startDate;
            var calenderTable = calendarService.buildCalendarTable(startDate);
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
            rootScope.calenderDays =  days;
        };
        this.selectDate = function(date){
            rootScope.startDate = date;
            rootScope.selectedRooms = [];
            rootScope.selectedEntries = {};
            rootScope.updateData();
            rootScope.initialize();
        };
        this.lastMonth = function(){
            var month = rootScope.startDate.getMonth();
            rootScope.startDate.setMonth(month - 1);
            rootScope.startDate.setDate(1);
            rootScope.selectedRooms = [];
            rootScope.selectedEntries = {};
            rootScope.updateData();
            rootScope.initialize();
        };
        this.nextMonth = function(){
            var month = rootScope.startDate.getMonth();
            rootScope.startDate.setMonth(month + 1);
            rootScope.startDate.setDate(1);
            rootScope.selectedRooms = [];
            rootScope.selectedEntries = {};
            rootScope.updateData();
            rootScope.initialize();
        };
    }]);
};

module.exports = mainCalendarService;
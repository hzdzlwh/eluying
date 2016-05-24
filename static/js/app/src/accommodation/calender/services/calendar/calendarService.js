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
    });
};

module.exports = calendarService;
var util = require("util");
require("angular");

var calendarService = require("../services/calendarService");

var dateSelectorCtrl = function(app){
    calendarService(app);
    app.controller("dateSelectorCtrl", ['$rootScope', '$scope', 'calendarService',
        function(rootScope, scope, calendarService){
            rootScope.today = util.dateFormatWithoutYear(new Date());
            scope.mainCalendar = null;
            
            var create30Days = function(){
                rootScope.datesArray = [];
                var tempDate = new Date(rootScope.startDate);
                for(var i = 0; i < 30; i++){
                    rootScope.datesArray.push({
                        date: tempDate,
                        dateStrL: util.dateFormat(tempDate),
                        dateStr: util.dateFormatWithoutYear(tempDate),
                        weekday: util.getWeek(tempDate),
                        left: 0
                    });
                    tempDate = util.tomorrow(tempDate);
                }
            };
            
            var update = function(){
                rootScope.startDateStr = util.dateFormatWithoutYear(rootScope.startDate);
                create30Days();
                scope.mainCalendar = calendarService.createCalendar(rootScope.startDate);
            };
    
            scope.changeMainMonth = function(monthDiff){
                var startDate = rootScope.startDate;
                var month = startDate.getMonth();
                startDate.setMonth(month + monthDiff);
                startDate.setDate(1);
                update();
            };
            scope.changeMainDate = function(date){
                rootScope.startDate = date;
                update();
            };
            update();
    }]);
};

module.exports = dateSelectorCtrl;
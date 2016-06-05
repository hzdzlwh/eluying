var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var getDataService = require("../services/getDataService");
var calendarService = require("../services/calendarService");

var orderEditService = function(app){
    getDataService(app);
    calendarService(app);
    app.service("orderEditService", ['getDataService', 'calendarService', function(getDataService, calendarService){
        this.resetOrderEdit = function(scope){
            var orderDetail = scope.orderDetail;
            var orderEdit = {};
            for(var key in orderDetail){
                orderEdit[key] = orderDetail[key];
            }
            orderEdit.payments.forEach(function(d){
                if(d.type === 5){
                    orderEdit.discounts = d.fee;
                }
            });
            //准备好房间数据
            orderEdit.rooms.forEach(function(d){
                d.ostartDate = d.startDate;
                d.oendDate = d.endDate;
                d.sstartDate = d.startDate.substr(5, 5);
                d.scanlerdarDate = d.startDate;
                d.sendDate = d.endDate.substr(5, 5);
                d.ecanlerdarDate = d.endDate;
                if(d.state === 0){
                    //创建两个日历
                    calendarService.createRoomStartDateCalendar(d);
                    calendarService.createRoomEndDateCalendar(d);
                }
            });
            //准备好餐饮数据
            orderEdit.foodItems.forEach(function(d){
                AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                    date: d.date,
                    id: d.categoryId
                }, function(result){
                    d.dateStr = d.date;
                    d.dateStr2 = d.date.substr(5, 5);
                    d.date = new Date(d.date);
                    d.inventory = parseInt(result.data.inventory);
                    if(orderEdit.foodsAmount && orderEdit.foodsAmount[d.dateStr]){
                        d.inventory += orderEdit.foodsAmount[d.dateStr];
                    }
                    d.calendar = calendarService.createCalendar(d.date);
                    scope.$apply();
                });
            });
            //准备好娱乐数据
            orderEdit.playItems.forEach(function(d){
                AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                    date: d.date,
                    id: d.categoryId
                }, function(result){
                    d.dateStr = d.date;
                    d.dateStr2 = d.date.substr(5, 5);
                    d.date = new Date(d.date);
                    d.inventory = parseInt(result.data.inventory);
                    if(orderEdit.playsAmount && orderEdit.playsAmount[d.dateStr]){
                        d.inventory += orderEdit.playsAmount[d.dateStr];
                    }
                    d.calendar = calendarService.createCalendar(d.date);
                    scope.$apply();
                });
            });
            console.log(orderEdit);
            return orderEdit;
        };
    }]);
};

module.exports = orderEditService;
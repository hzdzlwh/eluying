var util = require("util");
require("angular");

var constService = require("../services/constService");
var idcObj = require("../ieidc");

var orderNewService = function(app){
    constService(app);
    app.service("orderNewService", ['$rootScope', 'constService', function(rootScope, constService){
        this.resetOrderNew = function(type, rooms, channel, channelId){
            var title = (function(){
                for(var i = 0; i < constService.statusStr.length; i++){
                    if(constService.statusStr[i].classStr === type){
                        return constService.statusStr[i].title;
                    }
                }
                return null;
            })();
            var itemStartDate;
            var roomEndDate;
            rooms.forEach(function(d){
                if(!itemStartDate || new Date(d.startDate) < itemStartDate){
                    itemStartDate = new Date(d.startDate);
                }
                if(!roomEndDate || new Date(d.endDate) > roomEndDate){
                    roomEndDate = new Date(d.endDate);
                }
            });
            return {
                title: title,
                type: type,
                origin: channel,
                originId: channelId,
                customerName: '',
                customerPhone: '',
                selectedId: 0,
                selectedIdLabel: '身份证',
                idVal: null,
                rooms: rooms,
                foodItems: [],
                playItems: [],
                goodsItems: [],
                remark: '',
                payments: [],
                discounts: null,
                itemStartDate: itemStartDate,
                roomEndDate: roomEndDate,
                readable: true,
            }
        };
    }]);
};

module.exports = orderNewService;
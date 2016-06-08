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
            rooms.forEach(function(d){
                if(!itemStartDate || new Date(d.startDate) < itemStartDate){
                    itemStartDate = d.startDate;
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
                itemStartDate: itemStartDate
            }
        };
    }]);
};

module.exports = orderNewService;
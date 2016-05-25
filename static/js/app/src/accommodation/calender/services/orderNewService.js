var util = require("util");
require("angular");

var constService = require("../services/constService");

var orderNewService = function(app){
    app.service("orderNewService", ['constService', function(constService){
        this.createRoomItem = function(data){
            return {
                startDate: data.date2,
                sstartDate: data.date,
                scanlerdarDate: data.date2,
                endDate: data.date2,
                sendDate: data.date,
                roomId: data.roomId,
                id: data.cRoomId,
                fee: data.price,
                sub: true,
                sn: data.sn,
                name: data.cRoomName,
                days: 1
            }
        };
        this.resetOrderNew = function(type, roomList){
            var title = (function(){
                for(var i = 0; i < constService.statusStr.length; i++){
                    if(constService.statusStr[i].classStr === type){
                        return constService.statusStr[i].title;
                    }
                }
                return null;
            })();
            var selectedChannel = {
                name: rootScope.channels[0].name,
                id: -1,
            };
            return {
                title: title,
                type: type,
                selectedChannel: selectedChannel,
                guestInfo: {
                    name: null,
                    phone: null,
                    selectedId: '身份证',
                    idVal: null
                },
                roomList: roomList,
                foodList: [],
                funList: [],
                remarks: '',
                discounts: 0,
            }
        };
    }]);
};

module.exports = orderNewService;
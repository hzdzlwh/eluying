var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var accommodationService = function(app){
    app.service("accommodationService", ["$rootScope", function(rootScope){
        this.updateDateInventory = function(){
            var roomStore = rootScope.roomStore;
            var lefts = [];
            for(var i = 0; i < 30; i++){
                lefts.push(0);
            }
            for(var key in roomStore){
                var room = roomStore[key];
                for(var i = 0; i < room.st.length; i++){
                    if(rootScope.pRoomList[room.pi].selected && room.st[i].s === -1){
                        lefts[i]++;
                    }
                }
            }
            for(var i = 0; i < 30; i++){
                rootScope.datesArray[i].left = lefts[i];
            }
        };
        this.closeRoom = function(open, rid, dateItem){
            AJAXService.ajaxWithToken('GET', 'modifyRoomStatusUrl', {
                isAll: false,
                dateList: JSON.stringify([dateItem.date2]),
                open: !open ? 0 : 1,
                roomId: rid
            }, function(result){
                rootScope.updateData();
            });
        };
        this.addRoom = function(date, roomId){
            var cRoomStore = rootScope.cRoomStore;
            if(rootScope.selectedEntries[roomId + date]){
                delete rootScope.selectedEntries[roomId + date];
            }else{
                //ÕÒ·¿¼ä
                var roomStore = rootScope.roomStore;
                var room;
                for(var i = 0; i < roomStore.length; i++){
                    if(roomStore[i].id == roomId){
                        room = roomStore[i];
                        break;
                    }
                }
                var dayItem;
                for(var j = 0; j < room.st.length; j++){
                    if(room.st[j].date == date){
                        dayItem = room.st[j];
                        break;
                    }
                }
                rootScope.selectedEntries[roomId + date] = {
                    date: date,
                    date2: dayItem.date2,
                    roomId: roomId,
                    price: dayItem.p,
                    sn: room.sn,
                    cRoomId: room.ti,
                    cRoomName: cRoomStore[room.ti].name,
                    pRoomId: room.pi
                };
            }
            rootScope.showShopCart();
        };
    }]);
};

module.exports = accommodationService;
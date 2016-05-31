var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var shopcartService = require("./shopcartService");

var accommodationService = function(app){
    shopcartService(app);
    app.service("accommodationService", ["shopcartService", function(shopcartService){
        this.updateDateInventory = function(scope){
            var roomStore = scope.roomStore;
            var lefts = [];
            for(var i = 0; i < 30; i++){
                lefts.push(0);
            }
            for(var key in roomStore){
                var room = roomStore[key];
                for(var i = 0; i < room.st.length; i++){
                    if(scope.pRoomList[room.pi].selected && room.st[i].s === -1){
                        lefts[i]++;
                    }
                }
            }
            for(var i = 0; i < 30; i++){
                scope.datesArray[i].left = lefts[i];
            }
        };

        this.updateGlyphsPos = function(rootScope){
            var gridHeight = 48;
            var roomIndexHash = {};
            var tnum = 0;
            var pRoomList = rootScope.pRoomList;
            var cRoomStore = rootScope.cRoomStore;
            for(var c in cRoomStore){
                var tempCRoom = cRoomStore[c];
                if(!pRoomList[tempCRoom.pId].selected){
                    continue;
                }
                for(var r in tempCRoom.rooms){
                    roomIndexHash[r] = tnum++;
                }
            }
            rootScope.glyphs.forEach(function(g){
                var room = roomIndexHash[g.accommodationId];
                var top = gridHeight * room + 1;
                g.top = top;
            });
        };
        
        this.emptySelectedEntries = function(rootScope){
            rootScope.selectedEntries = {};
            shopcartService.showShopCart(rootScope);
        }
        
    }]);
};

module.exports = accommodationService;
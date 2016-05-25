var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var accommodationService = function(app){
    app.service("accommodationService", function(){
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
        
        this.updateAccommodation = function(scope){
            
        };
        
    });
};

module.exports = accommodationService;
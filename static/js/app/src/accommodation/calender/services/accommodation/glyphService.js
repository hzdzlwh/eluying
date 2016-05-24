var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var glyphService = function(app){
    app.service("glyphService", ["$rootScope", function(rootScope){
        this.updateGlyphsPos = function(){
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
    }]);
};

module.exports = glyphService;
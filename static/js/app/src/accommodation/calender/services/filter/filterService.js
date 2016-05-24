var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var filterService = function(app){
    app.service("filterService", ["$rootScope", function(rootScope){
        this.init = function(){
            rootScope.allPRoom = true;
        };
        this.selectAllPRoom = function(){
            rootScope.allPRoom = !rootScope.allPRoom;
            var flag = rootScope.allPRoom;
            var pRoomList = rootScope.pRoomList;
            for(var key in pRoomList){
                pRoomList[key].selected = flag;
            }
            //scope.updateGlyphsPos();
            //scope.updateLeft();
            //scope.initialize();
        };
        this.changePRoomSelect = function(id){
            var flag = true;
            var pRoomList = rootScope.pRoomList;
            for(var key in pRoomList){
                if(pRoomList[key].id == id){
                    pRoomList[key].selected = !pRoomList[key].selected;
                }
                if(!pRoomList[key].selected){
                    flag = false;
                }
            }
            rootScope.allPRoom = flag;
            //scope.updateGlyphsPos();
            //scope.updateLeft();
            //scope.initialize();
        };
    }]);
};

module.exports = filterService;
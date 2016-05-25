var util = require("util");
require("angular");

var pRoomFilterCtrl = function(app){
    app.controller("pRoomFilterCtrl", ['$rootScope', '$scope', function(rootScope, scope){
        rootScope.allPRoom = true;
        scope.selectAllPRoom = function(){
            scope.allPRoom = !scope.allPRoom;
            var flag = scope.allPRoom;
            var pRoomList = rootScope.pRoomList;
            for(var key in pRoomList){
                pRoomList[key].selected = flag;
            }
            // glyphService.updateGlyphsPos();
            // accommodationService.updateLeft();
            // rootScope.initialize();
        };
        scope.changePRoomSelect = function(id){
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
            scope.allPRoom = flag;
            // glyphService.updateGlyphsPos();
            // accommodationService.updateLeft();
            // rootScope.initialize();
        };
    }]);
};

module.exports = pRoomFilterCtrl;
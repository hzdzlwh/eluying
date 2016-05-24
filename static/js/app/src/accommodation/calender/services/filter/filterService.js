var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var accommodationService = require('../accommodation/accommodationService.js');
var glyphService = require('../accommodation/glyphService.js');

var filterService = function(app){
    accommodationService(app);
    glyphService(app);
    app.service("filterService", ["$rootScope", 'accommodationService', "glyphService", function(rootScope, accommodationService, glyphService){
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
            glyphService.updateGlyphsPos();
            accommodationService.updateLeft();
            rootScope.initialize();
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
            glyphService.updateGlyphsPos();
            accommodationService.updateLeft();
            rootScope.initialize();
        };
    }]);
};

module.exports = filterService;
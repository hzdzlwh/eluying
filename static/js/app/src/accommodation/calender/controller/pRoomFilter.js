var util = require("util");
require("angular");

var accommodationService = require('../services/accommodationService');

var pRoomFilterCtrl = function(app){
    accommodationService(app);
    app.controller("pRoomFilterCtrl", ['$rootScope', '$scope', 'accommodationService',
        function(rootScope, scope, accommodationService){
        rootScope.allPRoom = true;
        rootScope.isSelected = {};
        rootScope.isAllSelected = function(){
            var flag = true;
            for(var key in rootScope.isSelected){
                if(!rootScope.isSelected[key]){
                    flag = false;
                }
            }
            return flag
        };
        rootScope.selectAllPRoom = function(){
            var flag = !rootScope.isAllSelected();
            for(var key in rootScope.isSelected){
                rootScope.isSelected[key] = flag;
            }
        };
        rootScope.selectPRoom = function(id){
            rootScope.isSelected[id] = !rootScope.isSelected[id];
        };
        rootScope.resetFilter = function(){
            for(var key in rootScope.pRoomList){
                rootScope.isSelected[key] = rootScope.pRoomList[key].selected;
            }
            var filterDom = $(".category-filter");
            if(!filterDom.hasClass("open")){
                filterDom.addClass("open");
            }else{
                filterDom.removeClass("open");
            }
        };
        rootScope.filterPRoom = function() {
            for(var key in rootScope.isSelected){
                rootScope.pRoomList[key].selected = rootScope.isSelected[key];
            }
            accommodationService.updateDateInventory(rootScope);
            accommodationService.updateGlyphsPos(rootScope);
            $(".category-filter").removeClass("open");
        };
    }]);
};

module.exports = pRoomFilterCtrl;
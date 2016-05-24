var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var storeService = function(app){
    app.service("storeService",["$rootScope", function(rootScope){
        this.init = function(){
            this.getChannel();
            this.getItems();
        };
        this.getChannel = function(){
            AJAXService.ajaxWithToken('GET', 'getChannelsUrl', {
                type: 2
            }, function(result){
                var arr1 = [{name: 'ɢ��'}];
                var arr2 = result.data.list;
                rootScope.channels = arr1.concat(arr2);
            });
        };
        this.getItems = function(){
            AJAXService.ajaxWithToken('GET', 'getItemsUrl', {}, function(result){
                var items = result.data.list;
                var foods = [];
                var plays = [];
                items.forEach(function(d){
                    if(d.type == 1){
                        foods.push(d);
                    }else if(d.type == 2){
                        plays.push(d);
                    }
                });
                rootScope.foodList = foods;
                rootScope.funList = plays;
            });
        };
        this.getIDs = function(){
            rootScope.idList = [
                {key: 'id', label: '���֤'},
                {key: 'mid', label: '����֤'},
                {key: 'other', label: '����'},
            ];
        };
        this.getRoomCategories = function(){

        };
        this.getRoomsAndStatus = function(){

        };
    }]);
};

module.exports = storeService;
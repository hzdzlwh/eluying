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
                var arr1 = [{name: '散客'}];
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
                {key: 'id', label: '身份证'},
                {key: 'mid', label: '军官证'},
                {key: 'other', label: '其他'},
            ];
        };
        this.getRoomCategories = function(){

        };
        this.getRoomsAndStatus = function(){

        };
    }]);
};

module.exports = storeService;
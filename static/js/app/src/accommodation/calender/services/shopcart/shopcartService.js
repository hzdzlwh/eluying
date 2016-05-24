var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var shopcartService = function(app){
    app.service("shopcartService", ["$rootScope", function(rootScope){
        this.init = function(){
            rootScope.t = false;
            rootScope.f = false;
            rootScope.p = false;
            rootScope.selectedEntries = {};
            rootScope.selectedRooms = [];
            rootScope.shopcartShow = false;
            rootScope.finishShow = false;
            rootScope.bookShow = false;
            rootScope.ingShow = false;
        };
        this.showShopCart = function(){
            var selectedEntries = rootScope.selectedEntries;
            if(util.objLen(selectedEntries) === 0){
                rootScope.shopcartShow = false;
            }else{
                rootScope.shopcartShow = true;
                var today = new Date();
                var p = false;
                var t = false;
                var f = false;
                var roomHash = {};
                var selectedRooms = [];
                for(var key in selectedEntries){
                    var item = selectedEntries[key];
                    var date = new Date(item.date2);
                    if(util.isSameDay(date, today)){
                        t = true;
                    }else if(date > today){
                        f = true;
                    }else if(date < today){
                        p = true;
                    }
                    if(!roomHash[item.cRoomName + item.sn]){
                        selectedRooms.push(item.cRoomName + item.sn);
                        roomHash[item.cRoomName + item.sn] = true;
                    }
                }
                rootScope.t = t;
                rootScope.f = f;
                rootScope.p = p;
                rootScope.selectedRooms = selectedRooms;
                rootScope.finishShow = p&&!t&&!f || p&&t&&!f || p&&t&&f || p&&!t&&f;
                rootScope.ingShow = p&&t&&!f || p&&t&&f || !p&&t&&!f || !p&&t&&f;
                rootScope.bookShow = p&&!t&&f || !p&&t&&!f || !p&&t&&f || !p&&!t&&f;
            }
        };
    }]);
};

module.exports = shopcartService;
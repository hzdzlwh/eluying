var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var shopcartService = function(app){
    app.service("shopcartService", ["$rootScope", function(rootScope){
        this.showShopCart = function(scope){
            var selectedEntries = scope.selectedEntries;
            if(util.objLen(selectedEntries) === 0){
                scope.shopcartShow = false;
                $(".accommodation-mainContainer").css("bottom", "0");
            }else{
                scope.shopcartShow = true;
                $(".accommodation-mainContainer").css("bottom", "102px");
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
                scope.t = t;
                scope.f = f;
                scope.p = p;
                scope.selectedRooms = selectedRooms;
                scope.finishShow = p&&!t&&!f || p&&t&&!f || p&&t&&f || p&&!t&&f;
                scope.ingShow = p&&t&&!f || p&&t&&f || !p&&t&&!f || !p&&t&&f;
                scope.bookShow = p&&!t&&f || !p&&t&&!f || !p&&t&&f || !p&&!t&&f;
            }
        };
    }]);
};

module.exports = shopcartService;
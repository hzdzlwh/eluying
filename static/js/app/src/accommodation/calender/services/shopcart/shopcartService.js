var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var shopcartService = function(app){
    app.service("shopcartService", ["$rootScope", function(rootScope){
        this.init = function(){
            rootScope.selectedEntries = {};
            rootScope.selectedRooms = [];
            rootScope.shopcartShow = false;
            rootScope.finishShow = false;
            rootScope.bookShow = false;
            rootScope.ingShow = false;
        };
    }]);
};

module.exports = shopcartService;
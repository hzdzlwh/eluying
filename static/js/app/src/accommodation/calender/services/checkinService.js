var util = require("util");
require("angular");

var checkinService = function(app){
    app.service("checkinService",function(){
        this.resetCheckin = function(order){
            var checkin = {};
            return checkin;
        };
    });
};

module.exports = checkinService;
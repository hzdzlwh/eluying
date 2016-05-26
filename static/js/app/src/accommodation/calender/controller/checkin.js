var util = require("util");
require("angular");

var checkinService = require("../services/checkinService");

var checkinCtrl = function(app){
    checkinService(app);
    app.controller("checkinCtrl", ['$rootScope', '$scope', 'checkinService',
        function(rootScope, scope, checkinService){

        }]);
};

module.exports = checkinCtrl;
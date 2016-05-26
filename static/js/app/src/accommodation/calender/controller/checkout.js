var util = require("util");
require("angular");

var checkoutService = require("../services/checkoutService");

var checkoutCtrl = function(app){
    checkoutService(app);
    app.controller("checkoutCtrl", ['$rootScope', '$scope', 'checkoutService',
        function(rootScope, scope, checkoutService){

        }]);
};

module.exports = checkoutCtrl;
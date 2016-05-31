var util = require("util");
require("angular");

var accommodationService = require("../services/accommodationService");

var shopcartCtrl = function(app){
    accommodationService(app);
    app.controller("shopcartCtrl", ['$rootScope', '$scope', 'accommodationService',
        function(rootScope, scope, accommodationService){
            rootScope.shopcartShow = false;
            rootScope.finishShow = false;
            rootScope.bookShow = false;
            rootScope.ingShow = false;
            rootScope.t = false;
            rootScope.f = false;
            rootScope.p = false;
            scope.checkSelectedEntries = function(type){
                if(type == 'finish'){
                    if(rootScope.t || rootScope.f){
                        $("#finishWarningModal").modal("show");
                        return false;
                    }
                }else if(type == 'ing'){
                    if(rootScope.p){
                        $("#ingWarningModal").modal("show");
                        return false;
                    }
                }else if(type == 'book'){
                    if(rootScope.p){
                        $("#bookWarningModal").modal("show");
                        return false;
                    }
                }
                accommodationService.processSelectedEntries(type);
                $("#newOrderModal").modal("show");
            };
        }]);
};

module.exports = shopcartCtrl;
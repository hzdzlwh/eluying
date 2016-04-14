var AJAXService = require("AJAXService");
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
require("angular");

require("bootstrap");
require("validation");

$(function(){
    //检测IE
    util.checkExplorer();
    //初始化界面
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();
    modal.modalInit();

    events = {
        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
    };

    util.bindDomAction(events);

    var app = angular.module('methodApp', []);
    app.controller('methodCtrl', function($scope) {
        AJAXService.ajaxWithToken('GET', 'getPaymentMethodAndStateUrl', {}, function(result){
            console.log(result);
            $scope.$apply();
        });
    });

});


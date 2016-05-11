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
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();
    modal.modalInit();

    events = {
        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);}
    };

    util.bindDomAction(events);

    var that = this;
    var app = angular.module('guestApp', []);
    app.controller('guestCtrl', ['$scope', function(scope) {

    }]);

});


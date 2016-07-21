var AJAXService = require("AJAXService");
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
var auth = require('../../common/auth');
auth.checkAuth(auth.BUSINESS_ID);
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

    var events = {
        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);},
        // "click .btn-ok": function(){var that = this; modal.clearModal(that);}
    };

    util.bindDomAction(events);

    var that = this;
    var app = angular.module('guestApp', []);
    app.controller('guestCtrl', ['$scope', function(scope) {
        scope.guestList = [];
        scope.guestToDelete = null;
        scope.newGuest = '';
        scope.errorTipsShow = false;
        AJAXService.ajaxWithToken('GET', 'getChannelsUrl', {
            type: 2
        }, function(result){
            scope.guestList = result.data.list;
            scope.$apply();
        });
        scope.addGuest = function(){
            if(!scope.newGuest){
                scope.errorTipsShow = true;
                return false;
            }
            AJAXService.ajaxWithToken('GET', 'addChannelUrl', {
                type: 2,
                channelName: scope.newGuest
            }, function(result){
                AJAXService.ajaxWithToken('GET', 'getChannelsUrl', {
                    type: 2
                }, function(result){
                    scope.guestList = result.data.list;
                    scope.newGuest = '';
                    $(".modal").modal("hide");
                    scope.$apply();
                });
            });
        };
        scope.deleteGuest = function(){
            AJAXService.ajaxWithToken('GET', 'removeChannelUrl', {
                type: 2,
                channelId: scope.guestToDelete
            }, function(result){
                AJAXService.ajaxWithToken('GET', 'getChannelsUrl', {
                    type: 2
                }, function(result){
                    scope.guestList = result.data.list;
                    $(".modal").modal("hide");
                    scope.$apply();
                });
            });
        };
        scope.toDeleteGuest = function(id){
            scope.guestToDelete = id;
        };
        scope.resetGuest = function(){
            scope.guestToDelete = null;
        };
    }]);

});


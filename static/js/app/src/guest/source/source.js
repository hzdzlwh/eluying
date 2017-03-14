var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
var auth = require('../../common/auth');
import init from '../../common/init';
init({
    id: auth.BUSINESS_ID,
    clearModal: true
});
require("angular");

require("bootstrap");
require("validation");

$(function(){
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


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
        scope.companyStatus = 0;
        scope.repeatTipsShow = false;
        scope.errorTipsShow = false;
        AJAXService.ajaxWithToken('GET', 'getChannelsUrl', {
            type: 2,
            isAll: true
        }, function(result){
            scope.guestList = result.data.list;
            scope.companyStatus = result.data.companyStatus;
            scope.$apply();
        });
        scope.hideRepeatTips = function() {
            scope.errorTipsShow = false;
            scope.repeatTipsShow = false;
        };
        scope.positiveFilter = function(item) {
            return item.id > 0;
        }
        scope.negativeFilter = function(item) {
            return item.id < 0;
        }
        scope.addGuest = function(){
            if(!scope.newGuest){
                scope.errorTipsShow = true;
                return false;
            }
            if (scope.repeatTipsShow) {
                return false;
            }
            AJAXService.ajaxWithToken('GET', 'addChannelUrl', {
                type: 2,
                channelName: scope.newGuest
            }, function(result){
                if (result.code === 2) {
                    scope.repeatTipsShow = true;
                    scope.$apply();
                } else if (result.code === 1) {
                    AJAXService.ajaxWithToken('GET', 'getChannelsUrl', {
                        type: 2,
                        isAll: true
                    }, function(result){
                        scope.guestList = result.data.list;
                        scope.companyStatus = result.data.companyStatus;
                        scope.newGuest = '';
                        $(".modal").modal("hide");
                        scope.$apply();
                    });
                }
            });
        };
        scope.deleteGuest = function(){
            AJAXService.ajaxWithToken('GET', 'removeChannelUrl', {
                type: 2,
                channelId: scope.guestToDelete
            }, function(result){
                AJAXService.ajaxWithToken('GET', 'getChannelsUrl', {
                    type: 2,
                    isAll: true
                }, function(result){
                    scope.guestList = result.data.list;
                    scope.companyStatus = result.data.companyStatus;
                    $(".modal").modal("hide");
                    scope.$apply();
                });
            });
        };
        scope.cancelAdd = function() {
            scope.hideRepeatTips();
        };
        scope.toDeleteGuest = function(id){
            scope.guestToDelete = id;
        };
        scope.resetGuest = function(){
            scope.guestToDelete = null;
        };
    }]);

});


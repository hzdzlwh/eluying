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
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);},
        "click #alipayMethod-ok": function(){
            var pidDom = document.getElementById("alipayMethod-pid");
            var accountName = document.getElementById("alipayMethod-accountName");
            var publicKey = document.getElementById("alipayMethod-publicKey");
            var privateKey = document.getElementById("alipayMethod-privateKey");
            if(!pidDom.checkValidity()){
                modal.somethingAlert("pid不能为空!");
                return false;
            } else if(!accountName.checkValidity()){
                modal.somethingAlert("支付宝帐号不能为空!");
                return false;
            }else if(!publicKey.checkValidity()){
                modal.somethingAlert("支付宝公钥不能为空!");
                return false;
            }else if(!publicKey.checkValidity()){
                modal.somethingAlert("支付宝私钥不能为空!");
                return false;
            }
            $("#comfirmSubmit").modal("show");
        }
    };

    util.bindDomAction(events);

    var that = this;
    var app = angular.module('methodApp', []);
    app.controller('methodCtrl', ['$scope', function(scope) {
        scope.accountName = '';
        scope.pid = '';
        scope.privateKey = '';
        scope.publicKey = '';
        scope.methodToDelete = null;
        scope.addMethod = function(){
            var newMethod = document.getElementById("newMethod-input");
            if(!newMethod.checkValidity()){
                modal.somethingAlert("支付方式名称不能为空");
                return false;
            }
            AJAXService.ajaxWithToken('GET', 'newDeleteCollectionMethodUrl', {
                channelName: newMethod.value
            }, function(result){
                modal.somethingAlert(result.msg);
                $("#newMethod").modal("hide");
                AJAXService.ajaxWithToken('GET', 'getPaymentMethodAndStateUrl', {}, function(result){
                    scope.cash = result.data.map.cash;
                    scope.alipay = result.data.map.alipay;
                    scope.payChannelCustomList = result.data.payChannelCustomList;
                    scope.$apply();
                });
            });
        };
        scope.setMethodToDelete = function(id){
            scope.methodToDelete = id;
        };
        scope.deleteMethod = function(){
            $("#deleteMethod").modal("hide");
            AJAXService.ajaxWithToken('GET', 'newDeleteCollectionMethodUrl', {
                channelId: scope.methodToDelete
            }, function(result){
                scope.methodToDelete = null;
                modal.somethingAlert(result.msg);
                AJAXService.ajaxWithToken('GET', 'getPaymentMethodAndStateUrl', {}, function(result){
                    scope.cash = result.data.map.cash;
                    scope.alipay = result.data.map.alipay;
                    scope.payChannelCustomList = result.data.payChannelCustomList;
                    scope.$apply();
                });
            });
        };
        scope.submitAlipay = function(){
            AJAXService.ajaxWithToken('GET', 'bindAlipayAccountUrl', {
                accountName: scope.accountName,
                pid: scope.pid,
                publicKey: scope.publicKey,
                privateKey: scope.privateKey,
            }, function(result){
                if(result.code !== 1){
                    util.somethingAlert(result.msg);
                }else{
                    $("#comfirmSubmit").modal("hide");
                    $("#alipayMethod").modal("hide");
                    AJAXService.ajaxWithToken('GET', 'getPaymentMethodAndStateUrl', {}, function(result){
                        scope.cash = result.data.map.cash;
                        scope.alipay = result.data.map.alipay;
                        scope.payChannelCustomList = result.data.payChannelCustomList;
                        scope.$apply();
                    });
                }
            });
        };
        AJAXService.ajaxWithToken('GET', 'getPaymentMethodAndStateUrl', {}, function(result){
            scope.cash = result.data.map.cash;
            scope.alipay = result.data.map.alipay;
            scope.payChannelCustomList = result.data.payChannelCustomList;
            console.log(scope);
            scope.$apply();
        });
    }]);

});


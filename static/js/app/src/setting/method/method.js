var AJAXService = require("AJAXService");
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
var auth = require('../../common/auth');
auth.checkModule(auth.BUSINESS_ID);

require("angular");

require("bootstrap");
require("validation");

var checkedUrl = 'http://7xsrk6.com2.z0.glb.qiniucdn.com/C348E5DF-BF35-474F-99D0-18B4ECE48ABF@1x.png';
var uncheckedUrl = 'http://7xsrk6.com2.z0.glb.qiniucdn.com/B8DB0EA1-D946-44FF-A073-566D9F7DF283@1x.png';

$(function(){
    //检测IE
    util.checkExplorer();
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();
    modal.modalInit();

    var checkAlipayForm = function(){
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
        return true;
    };

    var events = {
        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);},
        "click body #alipayMethod-ok": function(){
            if(checkAlipayForm()){
                $("#method-comfirmSubmit").modal("show");
            }
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
        scope.errorTips = '';
        scope.onlinePay = {};
        scope.alichatStatusStr = ['审核中', '已开通', '审核失败', '未绑定'];
        scope.walletPayStatusStr = {
            '-1': '未知',
            '0': '正常',
            '1': '冻结'
        };
        scope.chooseMethod = function(method){
            if(method == 2 && scope.onlinePay.alipay !== 1){
                modal.somethingAlert("您还未绑定支付宝！");
                return false;
            }
            if(method == 2 && scope.onlinePay.weixinPay !== 1){
                modal.somethingAlert("您还未绑定微信！");
                return false;
            }
            if(method == 1 && scope.onlinePay.walletPay !== 0){
                modal.somethingAlert("您还未开通订单钱包！");
                return false;
            }
            AJAXService.ajaxWithToken('GET', 'selectPayWapUrl', {
                type: method
            }, function(result){
                AJAXService.ajaxWithToken('GET', 'getPaymentMethodAndStateUrl', {}, function(result){
                    console.log(result.data.map);
                    scope.onlinePay = result.data.map;
                    scope.payChannelCustomList = result.data.payChannelCustomList;
                    scope.$apply();
                });
            });
        };
        scope.addMethod = function(){
            var newMethod = document.getElementById("newMethod-input");
            if(!newMethod.checkValidity()){
                // modal.somethingAlert("支付方式名称不能为空");
                scope.errorTips = ("支付方式名称不能为空");
                return false;
            }
            if(newMethod.value.length > 16){
                // modal.somethingAlert("支付方式名称不能为空");
                scope.errorTips = ("支付方式名称长度不能超过16");
                return false;
            }
            var flag = true;
            var payChannelCustomList = scope.payChannelCustomList;
            payChannelCustomList.forEach(function(d){
                if(d.name === newMethod.value){
                    flag = false;
                }
            });
            if(!flag){
                // modal.somethingAlert("支付方式重复");
                scope.errorTips = ("支付方式重复");
                return false;
            }
            scope.errorTips = '';
            AJAXService.ajaxWithToken('GET', 'newDeleteCollectionMethodUrl', {
                channelName: newMethod.value
            }, function(result){
                modal.somethingAlert(result.msg);
                $("#method-newMethod").modal("hide");
                newMethod.value = '';
                AJAXService.ajaxWithToken('GET', 'getPaymentMethodAndStateUrl', {}, function(result){
                    scope.onlinePay = result.data.map;
                    scope.payChannelCustomList = result.data.payChannelCustomList;
                    scope.$apply();
                });
            });
        };
        scope.setMethodToDelete = function(id){
            scope.methodToDelete = id;
        };
        scope.deleteMethod = function(){
            $("#method-deleteMethod").modal("hide");
            AJAXService.ajaxWithToken('GET', 'newDeleteCollectionMethodUrl', {
                channelId: scope.methodToDelete
            }, function(result){
                scope.methodToDelete = null;
                AJAXService.ajaxWithToken('GET', 'getPaymentMethodAndStateUrl', {}, function(result){
                    scope.onlinePay = result.data.map;
                    scope.payChannelCustomList = result.data.payChannelCustomList;
                    scope.$apply();
                });
            });
        };
        scope.submitAlipay = function(){
            if(checkAlipayForm()){
                AJAXService.ajaxWithToken('GET', 'bindAlipayAccountUrl', {
                    accountName: scope.accountName,
                    pid: scope.pid,
                    publicKey: scope.publicKey,
                    privateKey: scope.privateKey,
                }, function(result){
                    if(result.code !== 1){
                        modal.somethingAlert(result.msg);
                    }else{
                        $("#method-comfirmSubmit").modal("hide");
                        $("#method-alipayMethod").modal("hide");
                        AJAXService.ajaxWithToken('GET', 'getPaymentMethodAndStateUrl', {}, function(result){
                            scope.onlinePay = result.data.map;
                            scope.payChannelCustomList = result.data.payChannelCustomList;
                            scope.$apply();
                        });
                    }
                });
            }
        };
        scope.submitWechat = function(){
            AJAXService.ajaxWithToken('GET', 'applyWxPayUrl', {}, function(result){
                if(result.code !== 1){
                    modal.somethingAlert(result.msg);
                }else{
                    $("#method-comfirmSubmit").modal("hide");
                    $("#method-wechatMethod").modal("hide");
                    AJAXService.ajaxWithToken('GET', 'getPaymentMethodAndStateUrl', {}, function(result){
                        scope.onlinePay = result.data.map;
                        scope.payChannelCustomList = result.data.payChannelCustomList;
                        scope.$apply();
                    });
                }
            });
        };
        AJAXService.ajaxWithToken('GET', 'getPaymentMethodAndStateUrl', {}, function(result){
            scope.onlinePay = result.data.map;
            scope.payChannelCustomList = result.data.payChannelCustomList;
            scope.$apply();
        });
    }]);

});


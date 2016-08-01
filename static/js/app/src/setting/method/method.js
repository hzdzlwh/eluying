/*
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

*/
var Vue = require('vue');
var header = require('header');
var leftMenu = require('leftMenu');
var util = require('util');
var modal = require('modal');
var AJAXService= require('AJAXService');
var auth = require('../../common/auth');
auth.checkAuth(auth.BUSINESS_ID);

require("bootstrap");
require("validation");

$(function(){
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();
    modal.modalInit();
    var events = {

        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
        "click .btn-cancel": function(){$(this).parents(".modal").modal("hide");},
        "click .head-img-close": function(){$(this).parents(".modal").modal("hide");},
    };

    util.bindDomAction(events);
    var ajaxChannel;
    var companyAccountStateList=[{ typeId: -1, typeStr: '未开通', typeStyle: 'grey', operationStr: '绑定账号' },
                                 { typeId: 0, typeStr: '审核中', typeStyle: 'yellow', operationStr: '' },
                                 { typeId: 1, typeStr: '已开通', typeStyle: 'blue', operationStr: '更换账号' },
                                 { typeId: 2, typeStr: '审核失败', typeStyle: 'red', operationStr: '重新绑定' }
                                ];
    var mainContainer = new Vue({
        el: '.mainContainer',
        data: {
            codeStatus: '',
            walletStatus: '',
            companyStatus: '',
            w_webPayStatus: '',
            w_facePayStatus: '',
            w_immediaPayStatus: '',
            c_webPayStatus: '',
            c_facePayStatus: '',
            c_immediaPayStatus: '',
            payList: [],
            c_webObj: {},
            c_faceObj: {},
            c_immediaObj: {},
            c_aliObj: {},
            c_weChatObj: {},
            deleteItem: {}
        },
        ready: function(){
            AJAXService.ajaxWithToken('get', '/collectionMethod/getPaymentMethodAndState', { }, function(result){
                this.codeStatus = (result.data.onpassState === 1) ? 'open' : 'close';
                this.walletStatus = (result.data.onlineCollectionMethod === 1) ? 'open' : 'close';
                this.companyStatus = (result.data.onlineCollectionMethod === 2) ? 'open' : 'close';
                this.payList = result.data.payChannelCustomList;
                result.data.walletOpenAndUseStateList.forEach(function(item){
                    if(item.onlineType === 1){
                        this.w_webPayStatus = (item.useState === 1) ? 'open' : 'close';
                    }else if(item.onlineType === 2){
                        this.w_facePayStatus = (item.useState === 1) ? 'open' : 'close';
                    }else{
                        this.w_immediaPayStatus = (item.useState === 1) ? 'open' : 'close';
                    }
                }.bind(this));
                result.data.enterpriseOpenAndUseStateList.forEach(function(item){
                    if(item.onlineType === 1){
                        this.c_webPayStatus = (item.useState === 1) ? 'open' : 'close';
                        item.openState = (result.data.alipay === 1 && result.data.wechatPay === 1) ? 1 : -1;
                        companyAccountStateList.forEach(function(child){
                            if(child.typeId === item.openState ){
                                this.c_webObj = child;
                            }
                        }.bind(this));
                    }else if(item.onlineType === 2){
                        this.c_facePayStatus = (item.useState === 1) ? 'open' : 'close';
                        companyAccountStateList.forEach(function(child){
                            if(child.typeId === item.openState ){
                                this.c_faceObj = child;
                            }
                        }.bind(this));
                    }else{
                        this.c_immediaPayStatus = (item.useState === 1) ? 'open' : 'close';
                        companyAccountStateList.forEach(function(child){
                            if(child.typeId === item.openState ){
                                this.c_immediaObj = child;
                            }
                        }.bind(this));
                    }
                }.bind(this));
                companyAccountStateList.forEach(function(child){
                    if(child.typeId === result.data.alipay){
                        this.c_aliObj = child;
                    }
                    if(child.typeId === result.data.wechatPay){
                        this.c_weChatObj = child;
                    }
                }.bind(this));
            }.bind(this));
        },
        methods: {
            toggleStatus: function(str){
                switch(str){
                    case 'code':
                        AJAXService.ajaxWithToken('get', '/collectionMethod/openCloseOnePass', { status: (this.codeStatus === 'close'  ? 1 : 0) }, function(result){
                            if (result.code !== 1 ){
                                modal.somethingAlert(result.msg);
                            }else{
                                this.codeStatus = (this.codeStatus === 'open') ? 'close' : 'open';
                            }
                        }.bind(this));
                        break;
                    case 'wallet':
                        AJAXService.ajaxWithToken('get', '/collectionMethod/openCloseWallet', { status: (this.walletStatus === 'close'  ? 1 : 0) }, function(result){
                            if (result.code === 1){
                                this.walletStatus = (this.walletStatus === 'open') ? 'close' : (function(){
                                    if (this.companyStatus === 'open'){
                                        this.companyStatus = 'close';
                                    }
                                    return 'open'
                                }).bind(this)();
                            }else{
                                modal.somethingAlert(result.msg);
                            }
                        }.bind(this));
                        break;
                    case 'company':
                        AJAXService.ajaxWithToken('get', '/collectionMethod/openCloseEnterprisePay', { status: (this.companyStatus === 'close'  ? 1 : 0) }, function(result){
                            if (result.code === 1){
                                this.companyStatus = (this.companyStatus === 'open') ? 'close' : (function(){
                                    if (this.walletStatus === 'open'){
                                        this.walletStatus = 'close';
                                    }
                                    return 'open'
                                }).bind(this)();
                            }else{
                                modal.somethingAlert(result.msg);
                            }
                        }.bind(this));
                        break;
                    case 'web-w':
                        AJAXService.ajaxWithToken('get', '/collectionMethod/useOrNotUseOnlinePay', { accountType: 1, onlineType: 1, status: (this.w_webPayStatus === 'close'  ? 1 : 0) }, function(result){
                            if (result.code !== 1 ){
                                modal.somethingAlert(result.msg);
                            }else{
                                this.w_webPayStatus = (this.w_webPayStatus === 'open') ? 'close' : 'open';
                            }
                        }.bind(this));
                        break;
                    case 'face-w':
                        AJAXService.ajaxWithToken('get', '/collectionMethod/useOrNotUseOnlinePay', { accountType: 1, onlineType: 2, status: (this.w_facePayStatus === 'close'  ? 1 : 0) }, function(result){
                            if (result.code !== 1 ){
                                modal.somethingAlert(result.msg);
                            }else{
                                this.w_facePayStatus = (this.w_facePayStatus === 'open') ? 'close' : 'open';
                            }
                        }.bind(this));
                        break;
                    case 'immedia-w':
                        AJAXService.ajaxWithToken('get', '/collectionMethod/useOrNotUseOnlinePay', { accountType: 1, onlineType: 3, status: (this.w_immediaPayStatus === 'close'  ? 1 : 0) }, function(result){
                            if (result.code !== 1 ){
                                modal.somethingAlert(result.msg);
                            }else{
                                this.w_immediaPayStatus = (this.w_immediaPayStatus === 'open') ? 'close' : 'open';
                            }
                        }.bind(this));
                        break;
                    case 'web-c':
                        AJAXService.ajaxWithToken('get', '/collectionMethod/useOrNotUseOnlinePay', { accountType: 2, onlineType: 1, status: (this.c_webPayStatus === 'close'  ? 1 : 0) }, function(result){
                            if (result.code !== 1 ){
                                modal.somethingAlert(result.msg);
                            }else{
                                this.c_webPayStatus = (this.c_webPayStatus === 'open') ? 'close' : 'open';
                            }
                        }.bind(this));
                        break;
                    case 'face-c':
                        AJAXService.ajaxWithToken('get', '/collectionMethod/useOrNotUseOnlinePay', { accountType: 2, onlineType: 2, status: (this.c_facePayStatus === 'close'  ? 1 : 0) }, function(result){
                            if (result.code !== 1 ){
                                modal.somethingAlert(result.msg);
                            }else{
                                this.c_facePayStatus = (this.c_facePayStatus === 'open') ? 'close' : 'open';
                            }
                        }.bind(this));
                        break;
                    case 'immedia-c':
                        AJAXService.ajaxWithToken('get', '/collectionMethod/useOrNotUseOnlinePay', { accountType: 2, onlineType: 3, status: (this.c_immediaPayStatus === 'close'  ? 1 : 0) }, function(result){
                            if (result.code !== 1 ){
                                modal.somethingAlert(result.msg);
                            }else{
                                this.c_immediaPayStatus = (this.c_immediaPayStatus === 'open') ? 'close' : 'open';
                            }
                        }.bind(this));
                        break;
                }
            },
            setDeleteItem: function(item){
                this.deleteItem = item;
            }
        },
        computed: {
            walletShow: function(){
                return this.walletStatus === 'open'
            },
            companyShow: function(){
                return this.companyStatus === 'open'
            }
        }
    });

    var companyAli = new Vue({
        el: '#company-aliPay',
        data: {
            apiServiceType: 1,
            publicKey: '',
            valid: 'invalid',
            pid: '',
            pidTips: true
        },
        methods: {
            reset: function(){
                this.valid = 'invalid';
                this.pid = '';
                this.pidTips = true;
            },
            copyText: function(){
                var ele = document.querySelector('#commonKey');
                util.copyText(ele);
                $(".copy-success").css('display', 'inline-block');
                setTimeout(function () {
                    $(".copy-success").css('display', 'none');
                }, 3000);
            },
            checkValid: function(){
                this.pidTips = (this.pid === '' || this.pid === null);
                this.valid = this.pidTips ? 'invalid' : 'valid';
            },
            submitAble: function(){
                if (this.valid === 'invalid'){
                    return false
                } else {
                    ajaxChannel = 'companyAli';
                    $("#method-confirmSubmit").modal("show");
                    confirmSubmit.tipHead = '提交审核新的企业支付宝申请将会自动:';
                    confirmSubmit.tipFirst = '1、解绑原来的企业支付宝账号';
                    confirmSubmit.tipSecond = '2、下架直销官网';
                }
            }
        }
    });
    $('#company-aliPay').on('show.bs.modal', function(){
        AJAXService.ajaxWithToken('get', '/collectionMethod/getAlipayAccountInfo', { apiServiceType: companyAli.apiServiceType }, function(result){
            companyAli.publicKey = result.data.publicKey;
            companyAli.pid = result.data.pid;
            companyAli.pidTips = (companyAli.pid === '' || companyAli.pid === null);
            companyAli.valid = companyAli.pidTips ? 'invalid' : 'valid';
        });
    });

    var aliImmedia = new Vue({
            el: '#ali-immediaPay',
            data: {
                apiServiceType: 3,
                publicKey: '',
                valid: 'invalid',
                pid: '',
                pidTips: true
            },
            methods: {
                reset: function(){
                    this.valid = 'invalid';
                    this.pid = '';
                    this.pidTips = true;
                },
                copyText: function(){
                    var ele = document.querySelector('#commonKey');
                    util.copyText(ele);
                    $(".copy-success").css('display', 'inline-block');
                    setTimeout(function () {
                        $(".copy-success").css('display', 'none');
                    }, 3000);
                },
                checkValid: function(){
                    this.pidTips = (this.pid === '' || this.pid === null);
                    this.valid = this.pidTips ? 'invalid' : 'valid';
                },
                submitAble: function(){
                    if (this.valid === 'invalid'){
                        return false
                    } else {
                        ajaxChannel = 'aliImmedia';
                        $("#method-confirmSubmit").modal("show");
                        confirmSubmit.tipHead = '提交审核新的支付宝即时到账申请将会自动:';
                        confirmSubmit.tipFirst = '1、解绑原来的支付宝即时到账账号';
                        confirmSubmit.tipSecond = '2、暂停APP扫码支付';
                    }
                }
            }
        });
    $('#ali-immediaPay').on('show.bs.modal', function(){
        AJAXService.ajaxWithToken('get', '/collectionMethod/getAlipayAccountInfo', { apiServiceType: aliImmedia.apiServiceType }, function(result){
            aliImmedia.publicKey = result.data.publicKey;
            aliImmedia.pid = result.data.pid;
            aliImmedia.pidTips = (aliImmedia.pid === '' || aliImmedia.pid === null);
            aliImmedia.valid = aliImmedia.pidTips ? 'invalid' : 'valid';
        });
    });

    var aliFace = new Vue({
        el: "#ali-facePay",
        data: {
            apiServiceType: 2,
            publicKey: '',
            valid: 'invalid',
            pid: '',
            appId: '',
            pidTips: true,
            appIdTips: true
        },
        methods: {
            reset: function(){
                this.valid = 'invalid';
                this.pid = '';
                this.appId = '';
                this.pidTips = true;
                this.appIdTips = true;
            },
            copyText: function(){
                var ele = document.querySelector('#common-key');
                util.copyText(ele);
                $('.copy-success').css('display', 'inline-block');
                setTimeout(function(){
                    $('.copy-success').css('display', 'none');
                }, 3000);
            },
            checkValid: function(){
                this.pidTips = (this.pid === '' || this.pid === null);
                this.appIdTips = (this.appId === '' || this.appId === null);
                this.valid = (this.pidTips || this.appIdTips) ? 'invalid' : 'valid';
            },
            submitAble: function(){
                if (this.valid === 'invalid'){
                    return false
                } else {
                    ajaxChannel = 'aliFace';
                    $("#method-confirmSubmit").modal("show");
                    confirmSubmit.tipHead = '提交审核新的支付宝当面付申请将会自动:';
                    confirmSubmit.tipFirst = '1、解绑原来的支付宝当面付账号';
                    confirmSubmit.tipSecond = '2、暂停PC条码支付';
                }
            }
        }
    });
    $('#ali-facePay').on('show.bs.modal', function(){
        AJAXService.ajaxWithToken('get', '/collectionMethod/getAlipayAccountInfo', { apiServiceType: aliFace.apiServiceType }, function(result){
            aliFace.publicKey = result.data.publicKey;
            aliFace.pid = result.data.pid;
            aliFace.appId = result.data.appId;
            aliFace.pidTips = (aliFace.pid === '' || aliFace.pid === null);
            aliFace.appIdTips = (aliFace.appId === '' || aliFace.appId === null);
            aliFace.valid = (aliFace.pidTips || aliFace.appIdTips) ? 'invalid' : 'valid';
        });
    });

    var confirmSubmit = new Vue({
        el: "#method-confirmSubmit",
        data: {
            tipHead: '',
            tipFirst: '',
            tipSecond: ''
        },
        methods: {
            confirm: function(){
                if(ajaxChannel === 'aliImmedia'){
                    AJAXService.ajaxWithToken('get', '/collectionMethod/bindAlipayAccount', { apiServiceType: aliImmedia.apiServiceType, pid: aliImmedia.pid }, function(result){
                        if(result.code === 1){
                            $('#method-submitSuccess').modal('show');
                            $('#method-confirmSubmit').modal('hide');
                            $('#ali-immediaPay').modal('hide');
                            mainContainer.c_immediaObj = { typeId: 0, typeStr: '审核中', typeStyle: 'yellow', operationStr: '' };
                                setTimeout(function(){
                                $('#method-submitSuccess').modal('hide');
                            },2000)
                        }else{
                            submitFail.failMessage = result.msg;
                            $('#method-submitFail').modal('show');
                            $('#method-confirmSubmit').modal('hide');
                        }
                    });
                }else if(ajaxChannel === 'aliFace'){
                    AJAXService.ajaxWithToken('get', '/collectionMethod/bindAlipayAccount', { apiServiceType: aliFace.apiServiceType, pid: aliFace.pid, appId: aliFace.appId }, function(result){
                        if(result.code === 1){
                            $('#method-submitSuccess').modal('show');
                            $('#method-confirmSubmit').modal('hide');
                            $('#ali-facePay').modal('hide');
                            mainContainer.c_faceObj = { typeId: 0, typeStr: '审核中', typeStyle: 'yellow', operationStr: '' };
                                setTimeout(function(){
                                $('#method-submitSuccess').modal('hide');
                            },2000)
                        }else{
                            submitFail.failMessage = result.msg;
                            $('#method-submitFail').modal('show');
                            $('#method-confirmSubmit').modal('hide');
                        }
                    });
                }else{
                    AJAXService.ajaxWithToken('get', '/collectionMethod/bindAlipayAccount', { apiServiceType: companyAli.apiServiceType, pid: companyAli.pid }, function(result){
                        if(result.code === 1){
                            $('#method-submitSuccess').modal('show');
                            $('#method-confirmSubmit').modal('hide');
                            $('#company-aliPay').modal('hide');
                            mainContainer.c_aliObj = { typeId: 0, typeStr: '审核中', typeStyle: 'yellow', operationStr: '' };
                            mainContainer.c_webObj = { typeId: -1, typeStr: '未开通', typeStyle: 'grey', operationStr: '绑定账号' };
                                setTimeout(function(){
                                $('#method-submitSuccess').modal('hide');
                            },2000)
                        }else{
                            submitFail.failMessage = result.msg;
                            $('#method-submitFail').modal('show');
                            $('#method-confirmSubmit').modal('hide');
                        }
                    });
                }
            }
        }
    });

    var submitFail = new Vue({
        el: "#method-submitFail",
        data: {
            failMessage: ''
        }
    });

    var wechatMethod = new Vue({
        el: "#method-wechatMethod",
        methods: {
            confirm: function(){
                AJAXService.ajaxWithToken('GET', 'applyWxPayUrl', {}, function(result){
                    if(result.code !== 1){
                        modal.somethingAlert(result.msg);
                    }else{
                        $("#method-wechatMethod").modal("hide");
                        mainContainer.c_weChatObj = { typeId: 0, typeStr: '审核中', typeStyle: 'yellow', operationStr: '' };
                        mainContainer.c_webObj = { typeId: -1, typeStr: '未开通', typeStyle: 'grey', operationStr: '绑定账号' };
                    }
                });
            }
        }
    });
    
    var newMethod = new Vue({
        el: "#method-newMethod",
        data: {
          errorTips: ''  
        },
        methods:{
            addMethod: function(){
                var newMethod = document.getElementById("newMethod-input");
                if(!newMethod.checkValidity()){
                    this.errorTips = ("支付方式名称不能为空");
                    return false;
                }
                if(newMethod.value.length > 16){
                    this.errorTips = ("支付方式名称长度不能超过16");
                    return false;
                }
                var flag = true;
                var payChannelCustomList = mainContainer.payList;
                payChannelCustomList.forEach(function(d){
                    if(d.name === newMethod.value){
                        flag = false;
                    }
                });
                if(!flag){
                    this.errorTips = ("支付方式重复");
                    return false;
                }
                this.errorTips = '';
                AJAXService.ajaxWithToken('GET', 'newDeleteCollectionMethodUrl', {
                    channelName: newMethod.value
                }, function(result){
                    modal.somethingAlert(result.msg);
                    $("#method-newMethod").modal("hide");
                    newMethod.value = '';
                    AJAXService.ajaxWithToken('GET', 'getPaymentMethodAndStateUrl', {}, function(result){
                        mainContainer.payList = result.data.payChannelCustomList;
                    });
                });
            }
        }
    });

    var deleteMethod = new Vue({
        el: "#method-deleteMethod",
        methods: {
            deleteMethod: function(){
                AJAXService.ajaxWithToken('GET', 'newDeleteCollectionMethodUrl', {
                    channelId: mainContainer.deleteItem.channelId
                }, function(result){
                    if(result.code ===1 ){
                        $("#method-deleteMethod").modal("hide");
                        mainContainer.payList.$remove(mainContainer.deleteItem);
                        mainContainer.deleteItem = {};
                    }else{
                        modal.somethingAlert(result.msg);
                    }
                });
            }
        }
    });
});
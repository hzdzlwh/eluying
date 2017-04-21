var Vue = require('vue1');
var util = require('util');
var modal = require('modal');
var http = require('http');
var auth = require('../../common/auth');
import init from '../../common/init';
init({
    id: auth.BUSINESS_ID
});

require('bootstrap');
require('validation');

$(function() {
    var events = {

        'click .btn-cancel': function() { $(this).parents('.modal').modal('hide'); },
        'click .head-img-close': function() { $(this).parents('.modal').modal('hide'); }
    };

    util.bindDomAction(events);
    var ajaxChannel;
    var companyAccountStateList = [{ typeId: -1, typeStr: '未开通', typeStyle: 'grey', operationStr: '绑定账号' },
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
            w_cardPayStatus: '',
            w_immediaPayStatus: '',
            w_codePayStatus: '',
            c_webPayStatus: '',
            c_facePayStatus: '',
            c_immediaPayStatus: '',
            c_cardPayStatus: '',
            c_codePayStatus: '',
            payList: [],
            c_webObj: {},
            c_faceObj: {},
            c_immediaObj: {},
            c_aliObj: {},
            c_weChatObj: {},
            deleteItem: {}
        },
        created: function() {
            http.get('/collectionMethod/getPaymentMethodAndState', { })
                .then(result => {
                    this.codeStatus = (result.data.onpassState === 1) ? 'open' : 'close';
                    this.walletStatus = (result.data.onlineCollectionMethod === 1) ? 'open' : 'close';
                    this.companyStatus = (result.data.onlineCollectionMethod === 2) ? 'open' : 'close';
                    this.payList = result.data.payChannelCustomList;
                    result.data.walletOpenAndUseStateList.forEach(function(item) {
                        if (item.onlineType === 1) {
                            this.w_webPayStatus = (item.useState === 1) ? 'open' : 'close';
                        } else if (item.onlineType === 2) {
                            this.w_facePayStatus = (item.useState === 1) ? 'open' : 'close';
                        } else if (item.onlineType === 3) {
                            this.w_immediaPayStatus = (item.useState === 1) ? 'open' : 'close';
                        } else if (item.onlineType === 4) {
                            this.w_cardPayStatus = (item.useState === 1) ? 'open' : 'close';
                        } else {
                            this.w_codePayStatus = (item.useState === 1) ? 'open' : 'close';
                        }
                    }.bind(this));
                    result.data.enterpriseOpenAndUseStateList.forEach(function(item) {
                        if (item.onlineType === 1) {
                            this.c_webPayStatus = (item.useState === 1) ? 'open' : 'close';
                            item.openState = (result.data.alipay === 1 && result.data.wechatPay === 1) ? 1 : -1;
                            companyAccountStateList.forEach(function(child) {
                                if (child.typeId === item.openState) {
                                    this.c_webObj = child;
                                }
                            }.bind(this));
                        } else if (item.onlineType === 2) {
                            this.c_facePayStatus = (item.useState === 1) ? 'open' : 'close';
                            companyAccountStateList.forEach(function(child) {
                                if (child.typeId === item.openState) {
                                    this.c_faceObj = child;
                                }
                            }.bind(this));
                        } else if (item.onlineType === 3) {
                            this.c_immediaPayStatus = (item.useState === 1) ? 'open' : 'close';
                            companyAccountStateList.forEach(function(child) {
                                if (child.typeId === item.openState) {
                                    this.c_immediaObj = child;
                                }
                            }.bind(this));
                        } else if (item.onlineType === 4) {
                            this.c_cardPayStatus = (item.useState === 1) ? 'open' : 'close';
                        } else {
                            this.c_codePayStatus = (item.useState === 1) ? 'open' : 'close';
                        }
                    }.bind(this));
                    companyAccountStateList.forEach(function(child) {
                        if (child.typeId === result.data.alipay) {
                            this.c_aliObj = child;
                        }
                        if (child.typeId === result.data.wechatPay) {
                            this.c_weChatObj = child;
                        }
                    }.bind(this));
                });
        },
        methods: {
            toggleStatus: function(str) {
                switch (str) {
                    case 'code':
                        http.get('/collectionMethod/openCloseOnePass', { status: (this.codeStatus === 'close' ? 1 : 0) })
                            .then(result => {
                                this.codeStatus = (this.codeStatus === 'open') ? 'close' : 'open';
                            });
                        break;
                    case 'wallet':
                        if (this.companyStatus === 'open') {
                            http.get('/collectionMethod/openCloseEnterprisePay', { status: 0 })
                                .then(function(result) {
                                    this.companyStatus = 'close';
                                    this.c_webPayStatus = 'close';
                                    this.c_facePayStatus = 'close';
                                    this.c_immediaPayStatus = 'close';
                                    this.c_cardPayStatus = 'close';
                                    this.c_codePayStatus = 'close';
                                    return http.get('/collectionMethod/openCloseWallet', { status: (this.walletStatus === 'close' ? 1 : 0) });
                                })
                                .then(result => {
                                    this.walletStatus = (this.walletStatus === 'close') ? 'open' : function() {
                                        this.w_webPayStatus = 'close';
                                        this.w_facePayStatus = 'close';
                                        this.w_immediaPayStatus = 'close';
                                        this.w_cardPayStatus = 'close';
                                        this.w_codePayStatus = 'close';
                                        return 'close';
                                    }.bind(this)();
                                });
                        }
                        if (this.companyStatus === 'close') {
                            http.get('/collectionMethod/openCloseWallet', { status: (this.walletStatus === 'close' ? 1 : 0) })
                                .then(result => {
                                    this.walletStatus = (this.walletStatus === 'close') ? 'open' : function() {
                                        this.w_webPayStatus = 'close';
                                        this.w_facePayStatus = 'close';
                                        this.w_immediaPayStatus = 'close';
                                        this.w_cardPayStatus = 'close';
                                        this.w_codePayStatus = 'close';
                                        return 'close';
                                    }.bind(this)();
                                });
                        }
                        break;
                    case 'company':
                        if (this.walletStatus === 'open') {
                            http.get('/collectionMethod/openCloseWallet', { status: 0 })
                                .then(result => {
                                    this.walletStatus = 'close';
                                    this.w_webPayStatus = 'close';
                                    this.w_facePayStatus = 'close';
                                    this.w_immediaPayStatus = 'close';
                                    this.w_cardPayStatus = 'close';
                                    this.w_codePayStatus = 'close';
                                    return http.get('/collectionMethod/openCloseEnterprisePay', { status: (this.companyStatus === 'close' ? 1 : 0) });
                                })
                                .then(result => {
                                    this.companyStatus = (this.companyStatus === 'close') ? 'open' : function() {
                                        this.c_webPayStatus = 'close';
                                        this.c_facePayStatus = 'close';
                                        this.c_immediaPayStatus = 'close';
                                        this.c_cardPayStatus = 'close';
                                        this.c_codePayStatus = 'close';
                                        return 'close';
                                    }.bind(this)();
                                });
                        }
                        if (this.walletStatus === 'close') {
                            http.get('/collectionMethod/openCloseEnterprisePay', { status: (this.companyStatus === 'close' ? 1 : 0) })
                                .then(result => {
                                    this.companyStatus = (this.companyStatus === 'close') ? 'open' : function() {
                                        this.c_webPayStatus = 'close';
                                        this.c_facePayStatus = 'close';
                                        this.c_immediaPayStatus = 'close';
                                        this.c_cardPayStatus = 'close';
                                        this.c_codePayStatus = 'close';
                                        return 'close';
                                    }.bind(this)();
                                });
                        }
                        break;
                    case 'web-w':
                        http.get('/collectionMethod/useOrNotUseOnlinePay', { accountType: 1, onlineType: 1, status: (this.w_webPayStatus === 'close' ? 1 : 0) })
                            .then(result => {
                                this.w_webPayStatus = (this.w_webPayStatus === 'open') ? 'close' : 'open';
                            });
                        break;
                    case 'face-w':
                        http.get('/collectionMethod/useOrNotUseOnlinePay', { accountType: 1, onlineType: 2, status: (this.w_facePayStatus === 'close' ? 1 : 0) })
                            .then(result => {
                                this.w_facePayStatus = (this.w_facePayStatus === 'open') ? 'close' : 'open';
                            });
                        break;
                    case 'immedia-w':
                        http.get('/collectionMethod/useOrNotUseOnlinePay', { accountType: 1, onlineType: 3, status: (this.w_immediaPayStatus === 'close' ? 1 : 0) })
                            .then(result => {
                                this.w_immediaPayStatus = (this.w_immediaPayStatus === 'open') ? 'close' : 'open';
                            });
                        break;
                    case 'card-w':
                        http.get('/collectionMethod/useOrNotUseOnlinePay', { accountType: 1, onlineType: 4, status: (this.w_cardPayStatus === 'close' ? 1 : 0) })
                            .then(result => {
                                this.w_cardPayStatus = (this.w_cardPayStatus === 'open') ? 'close' : 'open';
                            });
                        break;
                    case 'code-w':
                        http.get('/collectionMethod/useOrNotUseOnlinePay', { accountType: 1, onlineType: 5, status: (this.w_codePayStatus === 'close' ? 1 : 0) })
                            .then(function(result) {
                                this.w_codePayStatus = (this.w_codePayStatus === 'open') ? 'close' : 'open';
                            });
                        break;
                    case 'web-c':
                        http.ajaxWithToken('get', '/collectionMethod/useOrNotUseOnlinePay', { accountType: 2, onlineType: 1, status: (this.c_webPayStatus === 'close' ? 1 : 0) }, function(result) {
                            if (result.code !== 1) {
                                modal.alert(result.msg);
                            } else {
                                this.c_webPayStatus = (this.c_webPayStatus === 'open') ? 'close' : 'open';
                            }
                        }.bind(this));
                        break;
                    case 'face-c':
                        http.ajaxWithToken('get', '/collectionMethod/useOrNotUseOnlinePay', { accountType: 2, onlineType: 2, status: (this.c_facePayStatus === 'close' ? 1 : 0) }, function(result) {
                            if (result.code !== 1) {
                                modal.alert(result.msg);
                            } else {
                                this.c_facePayStatus = (this.c_facePayStatus === 'open') ? 'close' : 'open';
                            }
                        }.bind(this));
                        break;
                    case 'immedia-c':
                        http.ajaxWithToken('get', '/collectionMethod/useOrNotUseOnlinePay', { accountType: 2, onlineType: 3, status: (this.c_immediaPayStatus === 'close' ? 1 : 0) }, function(result) {
                            if (result.code !== 1) {
                                modal.alert(result.msg);
                            } else {
                                this.c_immediaPayStatus = (this.c_immediaPayStatus === 'open') ? 'close' : 'open';
                            }
                        }.bind(this));
                        break;
                    case 'card-c':
                        http.ajaxWithToken('get', '/collectionMethod/useOrNotUseOnlinePay', { accountType: 2, onlineType: 4, status: (this.c_cardPayStatus === 'close' ? 1 : 0) }, result => {
                            if (result.code !== 1) {
                                modal.alert(result.msg);
                            } else {
                                this.c_cardPayStatus = (this.c_cardPayStatus === 'open') ? 'close' : 'open';
                            }
                        });
                        break;
                    case 'code-c':
                        http.ajaxWithToken('get', '/collectionMethod/useOrNotUseOnlinePay', { accountType: 2, onlineType: 5, status: (this.c_codePayStatus === 'close' ? 1 : 0) }, result => {
                            if (result.code !== 1) {
                                modal.alert(result.msg);
                            } else {
                                this.c_codePayStatus = (this.c_codePayStatus === 'open') ? 'close' : 'open';
                            }
                        });
                        break;
                }
            },
            setDeleteItem: function(item) {
                this.deleteItem = item;
            }
        },
        computed: {
            walletShow: function() {
                return this.walletStatus === 'open';
            },
            companyShow: function() {
                return this.companyStatus === 'open';
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
            reset: function() {
                this.valid = 'invalid';
                this.pid = '';
                this.pidTips = true;
            },
            copyText: function() {
                var ele = document.querySelector('#commonKey');
                util.copyText(ele);
                $('.copy-success').css('display', 'inline-block');
                setTimeout(function() {
                    $('.copy-success').css('display', 'none');
                }, 3000);
            },
            checkValid: function() {
                this.pidTips = (this.pid === '' || this.pid === null);
                this.valid = this.pidTips ? 'invalid' : 'valid';
            },
            submitAble: function() {
                if (this.valid === 'invalid') {
                    return false;
                } else {
                    ajaxChannel = 'companyAli';
                    $('#method-confirmSubmit').modal('show');
                    confirmSubmit.tipHead = '提交审核新的企业支付宝申请将会自动:';
                    confirmSubmit.tipFirst = '1、解绑原来的企业支付宝账号';
                    confirmSubmit.tipSecond = '2、下架微官网';
                }
            }
        }
    });
    $('#company-aliPay').on('show.bs.modal', function() {
        http.get('/collectionMethod/getAlipayAccountInfo', { apiServiceType: companyAli.apiServiceType })
            .then(result => {
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
            reset: function() {
                this.valid = 'invalid';
                this.pid = '';
                this.pidTips = true;
            },
            copyText: function() {
                var ele = document.querySelector('#commonKey');
                util.copyText(ele);
                $('.copy-success').css('display', 'inline-block');
                setTimeout(function() {
                    $('.copy-success').css('display', 'none');
                }, 3000);
            },
            checkValid: function() {
                this.pidTips = (this.pid === '' || this.pid === null);
                this.valid = this.pidTips ? 'invalid' : 'valid';
            },
            submitAble: function() {
                if (this.valid === 'invalid') {
                    return false;
                } else {
                    ajaxChannel = 'aliImmedia';
                    $('#method-confirmSubmit').modal('show');
                    confirmSubmit.tipHead = '提交审核新的支付宝即时到账申请将会自动:';
                    confirmSubmit.tipFirst = '1、解绑原来的支付宝即时到账账号';
                    confirmSubmit.tipSecond = '2、暂停APP扫码支付';
                }
            }
        }
    });
    $('#ali-immediaPay').on('show.bs.modal', function() {
        http.get('/collectionMethod/getAlipayAccountInfo', { apiServiceType: aliImmedia.apiServiceType })
            .then(result => {
                aliImmedia.publicKey = result.data.publicKey;
                aliImmedia.pid = result.data.pid;
                aliImmedia.pidTips = (aliImmedia.pid === '' || aliImmedia.pid === null);
                aliImmedia.valid = aliImmedia.pidTips ? 'invalid' : 'valid';
            });
    });

    var aliFace = new Vue({
        el: '#ali-facePay',
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
            reset: function() {
                this.valid = 'invalid';
                this.pid = '';
                this.appId = '';
                this.pidTips = true;
                this.appIdTips = true;
            },
            copyText: function() {
                var ele = document.querySelector('#common-key');
                util.copyText(ele);
                $('.copy-success').css('display', 'inline-block');
                setTimeout(function() {
                    $('.copy-success').css('display', 'none');
                }, 3000);
            },
            checkValid: function() {
                this.pidTips = (this.pid === '' || this.pid === null);
                this.appIdTips = (this.appId === '' || this.appId === null);
                this.valid = (this.pidTips || this.appIdTips) ? 'invalid' : 'valid';
            },
            submitAble: function() {
                if (this.valid === 'invalid') {
                    return false;
                } else {
                    ajaxChannel = 'aliFace';
                    $('#method-confirmSubmit').modal('show');
                    confirmSubmit.tipHead = '提交审核新的支付宝当面付申请将会自动:';
                    confirmSubmit.tipFirst = '1、解绑原来的支付宝当面付账号';
                    confirmSubmit.tipSecond = '2、暂停PC条码支付';
                }
            }
        }
    });
    $('#ali-facePay').on('show.bs.modal', function() {
        http.get('/collectionMethod/getAlipayAccountInfo', { apiServiceType: aliFace.apiServiceType })
            .then(result => {
                aliFace.publicKey = result.data.publicKey;
                aliFace.pid = result.data.pid;
                aliFace.appId = result.data.appId;
                aliFace.pidTips = (aliFace.pid === '' || aliFace.pid === null);
                aliFace.appIdTips = (aliFace.appId === '' || aliFace.appId === null);
                aliFace.valid = (aliFace.pidTips || aliFace.appIdTips) ? 'invalid' : 'valid';
            });
    });

    var confirmSubmit = new Vue({
        el: '#method-confirmSubmit',
        data: {
            tipHead: '',
            tipFirst: '',
            tipSecond: ''
        },
        methods: {
            confirm: function() {
                if (ajaxChannel === 'aliImmedia') {
                    http.get('/collectionMethod/bindAlipayAccount', { apiServiceType: aliImmedia.apiServiceType, pid: aliImmedia.pid })
                        .then(result => {
                            $('#method-submitSuccess').modal('show');
                            $('#method-confirmSubmit').modal('hide');
                            $('#ali-immediaPay').modal('hide');
                            mainContainer.c_immediaObj = { typeId: 0, typeStr: '审核中', typeStyle: 'yellow', operationStr: '' };
                            mainContainer.c_immediaPayStatus = 'close';
                            setTimeout(function() {
                                $('#method-submitSuccess').modal('hide');
                            }, 2000);
                        })
                        .catch(res => {
                            submitFail.failMessage = result.msg;
                            $('#method-submitFail').modal('show');
                            $('#method-confirmSubmit').modal('hide');
                        });
                } else if (ajaxChannel === 'aliFace') {
                    http.get('/collectionMethod/bindAlipayAccount', { apiServiceType: aliFace.apiServiceType, pid: aliFace.pid, appId: aliFace.appId })
                        .then(result => {
                            $('#method-submitSuccess').modal('show');
                            $('#method-confirmSubmit').modal('hide');
                            $('#ali-facePay').modal('hide');
                            mainContainer.c_faceObj = { typeId: 0, typeStr: '审核中', typeStyle: 'yellow', operationStr: '' };
                            mainContainer.c_facePayStatus = 'close';
                            setTimeout(function() {
                                $('#method-submitSuccess').modal('hide');
                            }, 2000);
                        })
                        .catch(res => {
                            submitFail.failMessage = result.msg;
                            $('#method-submitFail').modal('show');
                            $('#method-confirmSubmit').modal('hide');
                        });
                } else {
                    http.get('/collectionMethod/bindAlipayAccount', { apiServiceType: companyAli.apiServiceType, pid: companyAli.pid })
                        .then(result => {
                            $('#method-submitSuccess').modal('show');
                            $('#method-confirmSubmit').modal('hide');
                            $('#company-aliPay').modal('hide');
                            mainContainer.c_aliObj = { typeId: 0, typeStr: '审核中', typeStyle: 'yellow', operationStr: '' };
                            mainContainer.c_webObj = { typeId: -1, typeStr: '未开通', typeStyle: 'grey', operationStr: '绑定账号' };
                            mainContainer.c_webPayStatus = 'close';
                            setTimeout(function() {
                                $('#method-submitSuccess').modal('hide');
                            }, 2000);
                        })
                        .catch(res => {
                            submitFail.failMessage = result.msg;
                            $('#method-submitFail').modal('show');
                            $('#method-confirmSubmit').modal('hide');
                        });
                }
            }
        }
    });

    var submitFail = new Vue({
        el: '#method-submitFail',
        data: {
            failMessage: ''
        }
    });

    var wechatMethod = new Vue({
        el: '#method-wechatMethod',
        methods: {
            confirm: function() {
                http.get('applyWxPayUrl', {})
                    .then(result => {
                        $('#method-wechatMethod').modal('hide');
                        mainContainer.c_weChatObj = { typeId: 0, typeStr: '审核中', typeStyle: 'yellow', operationStr: '' };
                        mainContainer.c_webObj = { typeId: -1, typeStr: '未开通', typeStyle: 'grey', operationStr: '绑定账号' };
                        mainContainer.c_webPayStatus = 'close';
                    });
            }
        }
    });

    var newMethod = new Vue({
        el: '#method-newMethod',
        data: {
            errorTips: ''
        },
        methods: {
            addMethod: function() {
                var newMethod = document.getElementById('newMethod-input');
                if (!newMethod.checkValidity()) {
                    this.errorTips = ('支付方式名称不能为空');
                    return false;
                }
                if (newMethod.value.length > 16) {
                    this.errorTips = ('支付方式名称长度不能超过16');
                    return false;
                }
                var flag = true;
                var payChannelCustomList = mainContainer.payList;
                payChannelCustomList.forEach(function(d) {
                    if (d.name === newMethod.value) {
                        flag = false;
                    }
                });
                if (!flag) {
                    this.errorTips = ('支付方式重复');
                    return false;
                }
                this.errorTips = '';
                http.get('newDeleteCollectionMethodUrl', { channelName: newMethod.value })
                    .then(result => {
                        modal.alert(result.msg);
                        $('#method-newMethod').modal('hide');
                        newMethod.value = '';
                        http.get('getPaymentMethodAndStateUrl', {})
                            .then(result => {
                                mainContainer.payList = result.data.payChannelCustomList;
                            });
                    });
            }
        }
    });

    var deleteMethod = new Vue({
        el: '#method-deleteMethod',
        methods: {
            deleteMethod: function() {
                http.get('newDeleteCollectionMethodUrl', { channelId: mainContainer.deleteItem.channelId })
                    .then(result => {
                        $('#method-deleteMethod').modal('hide');
                        mainContainer.payList.$remove(mainContainer.deleteItem);
                        mainContainer.deleteItem = {};
                    });
            }
        }
    });
});

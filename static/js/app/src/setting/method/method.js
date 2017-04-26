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
    const companyAccountStateLists = {
        '-1': { typeId: -1, typeStr: '未开通', typeStyle: 'grey', operationStr: '绑定账号' },
        '0': { typeId: 0, typeStr: '审核中', typeStyle: 'yellow', operationStr: '' },
        '1': { typeId: 1, typeStr: '已开通', typeStyle: 'blue', operationStr: '更换账号' },
        '2': { typeId: 2, typeStr: '审核失败', typeStyle: 'red', operationStr: '重新绑定' }
    };
    const walletOrCompanyTips = [ // 各渠道用途提示信息
        '用于微官网、一码通在线充值',
        '用于PC条码支付',
        '用于PC条码支付',
        '用于APP扫码支付',
        '用于APP扫码支付'
    ];
    var mainContainer = new Vue({
        el: '.mainContainer',
        data: {
            codeStatus: 0,
            paymentChannel: 0,
            walletStatus: '',
            companyStatus: '',
            walletChannels: [],
            companyChannels: [],
            payList: [],
            companyStatusStyle: {
                1: {},
                2: {},
                3: {},
                aliPay: {},
                weChatPay: {}
            },
            companyChannelsStatus: { // 各渠道开启状态
                1: 0, // 手机网站 0-关闭, 1-开启
                2: 0, // 支付宝当面付
                3: 0, // 支付宝即时到账
                4: 0, // 微信刷卡
                5: 0 // 微信扫码
            },
            deleteItem: {}
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                http.get('/collectionMethod/getPaymentMethodAndState', {})
                    .then(result => {
                        this.initData(result);
                    });
            },
            initData(result) {
                this.codeStatus = result.data.onpassState;
                this.paymentChannel = result.data.onlineCollectionMethod;
                this.walletStatus = (result.data.onlineCollectionMethod === 1) ? 'open' : 'close';
                this.companyStatus = (result.data.onlineCollectionMethod === 2) ? 'open' : 'close';
                this.payList = result.data.payChannelCustomList;
                this.walletChannels = [...result.data.walletOpenAndUseStateList];
                this.walletChannels.map((channel, index) => {
                    channel.tip = walletOrCompanyTips[index];
                    channel.type = 1; // 钱包
                });
                this.companyChannels = [...result.data.enterpriseOpenAndUseStateList];
                this.companyChannels.map((channel) => {
                    channel.type = 2; // 企业
                    this.companyChannelsStatus[channel.onlineType] = channel.useState;
                    if (channel.onlineType === 1) { // 手机网站支付
                        const openState = (result.data.alipay === 1 && result.data.wechatPay === 1) ? 1 : -1;
                        this.companyStatusStyle[channel.onlineType] = companyAccountStateLists[openState];
                    } else if (channel.onlineType < 4) {
                        this.companyStatusStyle[channel.onlineType] = companyAccountStateLists[channel.openState];
                    }
                });
                this.companyStatusStyle.aliPay = companyAccountStateLists[result.data.alipay];
                this.companyStatusStyle.weChatPay = companyAccountStateLists[result.data.wechatPay];
            },
            /**
             * 切换一码通开启状态
             */
            toggleOneCodeStatus() {
                http.get('/collectionMethod/openCloseOnePass', { status: this.codeStatus ^ 1 }) // 异或运算0->1, 1->0
                    .then(result => {
                        this.codeStatus = this.codeStatus ^ 1;
                    });
            },
            /**
             * 切换订单钱包开启状态
             */
            toggleWalletStatus() {
                http.get('/collectionMethod/selectPaymentMethod', { status: (this.walletStatus === 'close' ? 1 : 0), type: 1 })
                    .then(result => {
                        this.initData(result);
                    });
            },
            /**
             * 切换企业账户开启状态
             */
            toggleCompanyStatus() {
                http.get('/collectionMethod/selectPaymentMethod', { status: (this.companyStatus === 'close' ? 1 : 0), type: 2 })
                    .then(result => {
                        this.initData(result);
                    });
            },
            /**
             * 切换各种子渠道的开启状态
             * @param channel
             */
            toggleChannelStatus(channel) {
                const params = {
                    accountType: channel.type,
                    onlineType: channel.onlineType,
                    status: channel.useState ^ 1
                };
                http.get('/collectionMethod/useOrNotUseOnlinePay', params)
                    .then(result => {
                        this.initData(result);
                    });
            },
            setDeleteItem(item) {
                this.deleteItem = item;
            }
        },
        computed: {
            walletShow() {
                return this.walletStatus === 'open';
            },
            companyShow() {
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
            reset() {
                this.valid = 'invalid';
                this.pid = '';
                this.pidTips = true;
            },
            copyText() {
                var ele = document.querySelector('#commonKey');
                util.copyText(ele);
                $('.copy-success').css('display', 'inline-block');
                setTimeout(function() {
                    $('.copy-success').css('display', 'none');
                }, 3000);
            },
            checkValid() {
                this.pidTips = (this.pid === '' || this.pid === null);
                this.valid = this.pidTips ? 'invalid' : 'valid';
            },
            submitAble() {
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
            reset() {
                this.valid = 'invalid';
                this.pid = '';
                this.pidTips = true;
            },
            copyText() {
                var ele = document.querySelector('#commonKey');
                util.copyText(ele);
                $('.copy-success').css('display', 'inline-block');
                setTimeout(function() {
                    $('.copy-success').css('display', 'none');
                }, 3000);
            },
            checkValid() {
                this.pidTips = (this.pid === '' || this.pid === null);
                this.valid = this.pidTips ? 'invalid' : 'valid';
            },
            submitAble() {
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
            reset() {
                this.valid = 'invalid';
                this.pid = '';
                this.appId = '';
                this.pidTips = true;
                this.appIdTips = true;
            },
            copyText() {
                var ele = document.querySelector('#common-key');
                util.copyText(ele);
                $('.copy-success').css('display', 'inline-block');
                setTimeout(function() {
                    $('.copy-success').css('display', 'none');
                }, 3000);
            },
            checkValid() {
                this.pidTips = (this.pid === '' || this.pid === null);
                this.appIdTips = (this.appId === '' || this.appId === null);
                this.valid = (this.pidTips || this.appIdTips) ? 'invalid' : 'valid';
            },
            submitAble() {
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

    var submitFail = new Vue({
        el: '#method-submitFail',
        data: {
            failMessage: ''
        }
    });
    var confirmSubmit = new Vue({
        el: '#method-confirmSubmit',
        data: {
            tipHead: '',
            tipFirst: '',
            tipSecond: ''
        },
        methods: {
            confirm() {
                let params;
                let flag;
                if (ajaxChannel === 'aliImmedia') {
                    params = { apiServiceType: aliImmedia.apiServiceType, pid: aliImmedia.pid };
                    flag = '#ali-immediaPay';
                } else if (ajaxChannel === 'aliFace') {
                    params = { apiServiceType: aliFace.apiServiceType, pid: aliFace.pid, appId: aliFace.appId };
                    flag = '#ali-facePay';
                } else {
                    params = { apiServiceType: companyAli.apiServiceType, pid: companyAli.pid };
                    flag = '#company-aliPay';
                }
                http.get('/collectionMethod/bindAlipayAccount', params)
                    .then(result => {
                        this.handleSuccess();
                        $(flag).modal('hide');
                    })
                    .catch(result => {
                        this.handleError(result);
                    });
            },
            handleError(result) {
                $('#method-submitFail').modal('show');
                $('#method-confirmSubmit').modal('hide');
                submitFail.failMessage = result.msg;
            },
            handleSuccess() {
                $('#method-submitSuccess').modal('show');
                $('#method-confirmSubmit').modal('hide');
                mainContainer.getData();
                setTimeout(() => {
                    $('#method-submitSuccess').modal('hide');
                }, 2000);
            }
        }
    });

    var wechatMethod = new Vue({
        el: '#method-wechatMethod',
        methods: {
            confirm() {
                http.get('applyWxPayUrl', {})
                    .then(result => {
                        $('#method-wechatMethod').modal('hide');
                        mainContainer.getData();
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
            addMethod() {
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
            deleteMethod() {
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

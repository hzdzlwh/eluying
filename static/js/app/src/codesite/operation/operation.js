/**
 * Created by zhaoyongsheng on 16/7/7.
 */

var Vue = require('vue1');
var util = require('util');
var modal = require('modal');
var http= require('http');
var auth = require('../../common/auth');
auth.checkAuth(auth.BUSINESS_ID);
import init from '../../common/init';
init({
    id: auth.BUSINESS_ID,
});

require("bootstrap");
require("validation");

$(function(){
    var events = {
        "mouseenter .cbtn-grey": function(){
            $(".tips").show();
            $(".tips-arrow").show();
        },
        "mouseleave .cbtn-grey": function(){
            $(".tips").hide();
            $(".tips-arrow").hide();
        }

    };

    util.bindDomAction(events);

    var codesite = new Vue({
        el: '.mainContainer',
        data: {
            onepassQrCode: '',
            onepassUrl: '',
            selfRecharge: false,
            wapPayStatus: false,
            selfRechargeTypeStyle: '',
            selfRechargeTypeStr: '',
            wapPayTypeStr: ''
        },
        created: function(){
            http.get('/onePass/getOnePassSettingPC', {})
                .then(result => {
                    this.onepassQrCode = result.data.onepassQrCode;
                    this.onepassUrl = result.data.onepassUrl;
                    this.selfRecharge = (result.data.selfRecharge === 0);
                    this.wapPayStatus = (result.data.wapPayStatus === 0);
                    this.selfRechargeTypeStyle = this.selfRecharge ? 'grey' : 'blue';
                    this.selfRechargeTypeStr = this.selfRecharge ? '未启用' : '已启用';
                    this.wapPayTypeStr = this.selfRecharge ? '启用' : '关闭';
                });
        },
        methods: {
            copyText: function(){
                var ele = document.querySelector('#campUrl');
                util.copyText(ele);
                $(".copy-success").css('display', 'inline-block');
                setTimeout(function () {
                    $(".copy-success").css('display', 'none');
                }, 3000);
            },
            modifySelfChargeStatus: function(){
                http.get('/onePass/openCloseSelfCharge', { status: this.selfRecharge ? 1 : 0 })
                    .then(result => {
                        this.selfRechargeTypeStyle = (this.selfRechargeTypeStyle === 'grey') ? 'blue' : 'grey';
                        this.selfRechargeTypeStr = (this.selfRechargeTypeStr === '未启用') ? '已启用' : '未启用';
                        this.wapPayTypeStr = (this.wapPayTypeStr === '启用') ? '关闭' : '启用';
                    });
            }
        }
    });
});
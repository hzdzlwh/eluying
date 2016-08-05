/**
 * Created by zhaoyongsheng on 16/7/7.
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
        ready: function(){
            AJAXService.ajaxWithToken('GET', '/onePass/getOnePassSettingPC', {}, function(result){
                this.onepassQrCode = result.data.onepassQrCode;
                this.onepassUrl = result.data.onepassUrl;
                this.selfRecharge = (result.data.selfRecharge === 0);
                this.wapPayStatus = (result.data.wapPayStatus === 0);
                this.selfRechargeTypeStyle = this.selfRecharge ? 'grey' : 'blue';
                this.selfRechargeTypeStr = this.selfRecharge ? '未启用' : '已启用';
                this.wapPayTypeStr = this.selfRecharge ? '启用' : '关闭';
            }.bind(this));
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
                AJAXService.ajaxWithToken('GET', '/onePass/openCloseSelfCharge', { status: this.selfRecharge ? 1 : 0 }, function(result){
                    if(result.code === 1){
                        this.selfRechargeTypeStyle = (this.selfRechargeTypeStyle === 'grey') ? 'blue' : 'grey';
                        this.selfRechargeTypeStr = (this.selfRechargeTypeStr === '未启用') ? '已启用' : '未启用';
                        this.wapPayTypeStr = (this.wapPayTypeStr === '启用') ? '关闭' : '启用';
                    }else{
                        modal.somethingAlert(result.msg);
                    }
                }.bind(this));
            }
        }
    });
});
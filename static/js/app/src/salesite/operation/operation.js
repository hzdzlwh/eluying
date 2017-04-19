import http from 'http';
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
var auth = require('../../common/auth');
import init from '../../common/init';
init({
    id: auth.BUSINESS_ID,
});
require("angular");

require("bootstrap");
require("validation");

var pics = {
    "pay-yes": '//static.dingdandao.com/ABAFF64A-FBF7-4673-BDBE-FE35E1681567@1x.png',
    "pay-no": '//static.dingdandao.com/69E97833-57EE-4CC5-982E-E4257220D538@1x.png',
    "info-yes": '//static.dingdandao.com/image/png/info-yes.png74E426B7-1EAC-' +
    '4805-808B-46E45FF261CD@1x.png',
    "info-no": '//static.dingdandao.com/image/png/info-no.png38DB2513-13DF-' +
    '4010-A7AF-B4954D0D96FE@1x.png',
};

$(function(){

    var events = {
        "click .cancel": function(){
            $("#announcement").modal("hide");
        },
    };

    util.bindDomAction(events);

    var app = angular.module('operationApp', []);
    app.controller('operationCtrl', ['$scope', function(scope) {
        scope.status = {
            isOnlinePay: {
                status: false,
                href: '/view/settings/payment/method/method.html',
                yesUrl: pics['pay-yes'],
                yesText: '启用手机网站支付',
                noUrl: pics['pay-no'],
                noText: '点我去启用手机网站支付'
            },
            campBasicInfo: {
                status: false,
                href: '/view/settings/salesite/info/info.html',
                yesUrl: pics['info-yes'],
                yesText: '网站基本信息填写完整',
                noUrl: pics['info-no'],
                noText: '点我去填写网站基本信息'
            },
            //wechatPay: {
            //    status: false,
            //    yesUrl: pics['wechat-yes'],
            //    yesText: '绑定企业微信支付',
            //    noUrl: pics['wechat-no'],
            //    noText: '点我去绑定企业微信支付'
            //},
        };
        scope.campUrl = null;
        scope.directNetStatus = null;
        scope.notice = null;
        scope.notice2 = null;
        scope.noticeLength = scope.notice2 ? scope.notice2.length : 0;
        scope.noticeTime = null;
        scope.campQrCode = null;
        scope.onWebsite = function(s){
            window.location = s.href;
        };
        scope.textOnChange = function(){
            scope.noticeLength = scope.notice2 ? scope.notice2.length : 0;
        };
        scope.changeSiteState = function(){
            var data = scope.directNetStatus ? 0 : 1;
            http.get('openCloseDirectNetUrl', {
                directNetStatus: data
            })
                .then(function(result){
                    http.get('checkDirectNetOnlineUrl', {
                        version: 5
                    })
                        .then(function(result){
                            scope.status.isOnlinePay.status = result.data.isOnlinePay;
                            scope.status.campBasicInfo.status = result.data.campBasicInfo;
                            scope.$apply();
                        });
                    http.get('getOperationInfoUrl', {})
                        .then(function(result){
                            scope.campQrCode = result.data.campQrCode;
                            scope.campUrl = result.data.campUrl;
                            scope.directNetStatus = result.data.directNetStatus;
                            scope.notice = result.data.notice;
                            scope.notice2 = result.data.notice;
                            scope.noticeLength = scope.notice2 ? scope.notice2.length : 0;
                            scope.noticeTime = result.data.noticeTime;
                            scope.$apply();
                        });
                });
        };
        scope.publishNotice = function(){
            if(scope.noticeLength <= 140){
                http.post('modifyNoticeUrl', {
                    notice: scope.notice2
                })
                    .then(function(result){
                        modal.somethingAlert(result.msg);
                        http.get('getOperationInfoUrl', {})
                            .then(function(result){
                                scope.campQrCode = result.data.campQrCode;
                                scope.campUrl = result.data.campUrl;
                                scope.directNetStatus = result.data.directNetStatus;
                                scope.notice = result.data.notice;
                                scope.notice2 = result.data.notice;
                                scope.noticeLength = scope.notice2 ? scope.notice2.length : 0;
                                scope.noticeTime = result.data.noticeTime;
                                scope.$apply();
                            });
                        $("#announcement").modal("hide");
                    });
            }
        };
        scope.copySite = function(){
            var ele = document.querySelector('#campUrl');
            util.copyText(ele);
            $(".copy-success").css('display', 'inline-block');
            setTimeout(function () {
                $(".copy-success").css('display', 'none');
            }, 3000);
        };
        http.get('checkDirectNetOnlineUrl', {
            version: 5
        })
            .then(function(result){
                scope.status.isOnlinePay.status = result.data.isOnlinePay;
                scope.status.campBasicInfo.status = result.data.campBasicInfo;
                // console.log(scope.status);
                scope.$apply();
            });
        http.get('getOperationInfoUrl', {})
            .then(
                function(result){
                    scope.campQrCode = result.data.campQrCode;
                    scope.campUrl = result.data.campUrl;
                    scope.directNetStatus = result.data.directNetStatus;
                    scope.notice = result.data.notice;
                    scope.noticeLength = scope.notice2 ? scope.notice2.length : 0;
                    scope.noticeTime = result.data.noticeTime;
                    scope.$apply();
                }
            );
    }]);

});

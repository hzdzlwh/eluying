var AJAXService = require("AJAXService");
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
require("angular");

require("bootstrap");
require("validation");

var pics = {
    "wechat-no": 'http://7xsrk6.com2.z0.glb.qiniucdn.com/image/png/wechat-no.pngA470F11E-' +
    'D4FB-4DC0-AA40-B29B04963F58@1x.png',
    "wechat-yes": 'http://7xsrk6.com2.z0.glb.qiniucdn.com/image/png/wechat-yes.pngAA606F8D-' +
    '006E-4097-B26C-AD7932941D68@1x.png',
    "alipay-yes": 'http://7xsrk6.com2.z0.glb.qiniucdn.com/image/png/alipay-yes.png3CEBA994-' +
    '4117-4311-A979-43880CB06009@1x.png',
    "alipay-no": 'http://7xsrk6.com2.z0.glb.qiniucdn.com/image/png/alipay-no.png691A00BF-' +
    '7DC3-47E2-B869-DA60BDF169C2@1x.png',
    "info-yes": 'http://7xsrk6.com2.z0.glb.qiniucdn.com/image/png/info-yes.png74E426B7-1EAC-' +
    '4805-808B-46E45FF261CD@1x.png',
    "info-no": 'http://7xsrk6.com2.z0.glb.qiniucdn.com/image/png/info-no.png38DB2513-13DF-' +
    '4010-A7AF-B4954D0D96FE@1x.png',
};

$(function(){
    //检测IE
    util.checkExplorer();
    //初始化界面
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();
    modal.modalInit();


    events = {
        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);},
        "click .cancel,.publish": function(){
            $("#announcement").modal("hide");
        }
    };

    util.bindDomAction(events);

    var app = angular.module('operationApp', []);
    app.controller('operationCtrl', ['$scope', function(scope) {
        scope.status = {
            alipay: {
                status: false,
                href: '/view/setting/method/method.html',
                yesUrl: pics['alipay-yes'],
                yesText: '绑定企业支付宝',
                noUrl: pics['alipay-no'],
                noText: '点我去绑定企业支付宝'
            },
            campBasicInfo: {
                status: false,
                href: '/view/salesite/info/info.html',
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
        scope.noticeLength = scope.notice ? scope.notice.length : 0;
        scope.noticeTime = null;
        scope.campQrCode = null;
        scope.textOnChange = function(){
            scope.noticeLength = scope.notice ? scope.notice.length : 0;
        };
        scope.changeSiteState = function(){
            var data = scope.directNetStatus ? 0 : 1;
            AJAXService.ajaxWithToken('GET', 'openCloseDirectNetUrl', {
                directNetStatus: data
            }, function(result){
                console.log(result);
                AJAXService.ajaxWithToken('GET', 'checkDirectNetOnlineUrl', {}, function(result){
                    scope.status.alipay.status = result.data.alipay;
                    scope.status.campBasicInfo.status = result.data.campBasicInfo;
                    scope.$apply();
                });
                AJAXService.ajaxWithToken('GET', 'getOperationInfoUrl', {}, function(result){
                    scope.campQrCode = result.data.campQrCode;
                    scope.campUrl = result.data.campUrl;
                    scope.directNetStatus = result.data.directNetStatus;
                    scope.notice = result.data.notice;
                    scope.notice2 = result.data.notice;
                    scope.noticeLength = scope.notice ? scope.notice.length : 0;
                    scope.noticeTime = result.data.noticeTime;
                    scope.$apply();
                });
            });
        };
        scope.publishNotice = function(){
            AJAXService.ajaxWithToken('GET', 'modifyNoticeUrl', {
                notice: scope.notice2
            }, function(result){
                modal.somethingAlert(result.msg);
                scope.notice = scope.notice2;
            });
        };
        scope.copySite = function(){
            if(window.clipboardData && window.clipboardData.setData){
                window.clipboardData.setData('Text', scope.campUrl);
                $("#copySuccess").modal("show");
                setTimeout(function(){
                    window.location.href = scope.campUrl;
                }, 1000);
            }else{
                modal.somethingAlert("您的浏览器不支持此复制功能，请使用Ctrl+C或鼠标右键。");
                $("#campUrl").select();
            }
        };
        AJAXService.ajaxWithToken('GET', 'checkDirectNetOnlineUrl', {}, function(result){
            scope.status.alipay.status = result.data.alipay;
            scope.status.campBasicInfo.status = result.data.campBasicInfo;
            scope.$apply();
        });
        AJAXService.ajaxWithToken('GET', 'getOperationInfoUrl', {}, function(result){
            scope.campQrCode = result.data.campQrCode;
            scope.campUrl = result.data.campUrl;
            scope.directNetStatus = result.data.directNetStatus;
            scope.notice = result.data.notice;
            scope.noticeLength = scope.notice ? scope.notice.length : 0;
            scope.noticeTime = result.data.noticeTime;
            scope.$apply();
        });
    }]);

});

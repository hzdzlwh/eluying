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
    // leftMenu.showLeftMenu();
    util.mainContainer();
    modal.modalInit();


    events = {
        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);},
    };

    util.bindDomAction(events);

    var app = angular.module('operationApp', []);
    app.controller('operationCtrl', function($scope) {
        $scope.status = {
            alipay: {
                status: false,
                yesUrl: pics['alipay-yes'],
                yesText: '开通企业支付宝',
                noUrl: pics['alipay-no'],
                noText: '点我去开通企业支付宝'
            },
            campBasicInfo: {
                status: false,
                yesUrl: pics['info-yes'],
                yesText: '网站基本信息填写完整',
                noUrl: pics['info-no'],
                noText: '点我去填写网站基本信息'
            },
            //wechatPay: {
            //    status: false,
            //    yesUrl: pics['wechat-yes'],
            //    yesText: '开通企业微信支付',
            //    noUrl: pics['wechat-no'],
            //    noText: '点我去开通企业微信支付'
            //},
        };
        $.ajax({
            url: AJAXService.getUrl2("checkDirectNetOnlineUrl"),
            data:{
                campId: 56,
                uid: 85
            },
            success: function(result){
                $scope.status.alipay.status = result.data.alipay;
                $scope.status.campBasicInfo.status = result.data.campBasicInfo;
            }
        });
        $.ajax({
            url: AJAXService.getUrl2("getOperationInfoUrl"),
            data:{
                campId: 56,
                uid: 85
            },
            success: function(result){
                console.log(result);
            }
        });
    });

});

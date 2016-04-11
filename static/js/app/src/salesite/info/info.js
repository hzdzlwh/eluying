var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
require("angular");
var dsy = require("dsy");

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
        "click body": function(){
            $(".selectBox .toselect-container").hide();
        },
        "click .item.selected": function(ev){
            ev.stopPropagation();
            $(".selectBox .toselect-container").hide();
            $(this).siblings(".toselect-container").show();
        }

    };

    util.bindDomAction(events);

    var app = angular.module('infoApp', []);
    app.controller('infoCtrl', function($scope) {
        $scope.types = ["营地类型1", "营地类型2", "营地类型3", "营地类型33", "营地类型34", "营地类型342", "营地类型3423"];
        $scope.selectedType = 0;
        $scope.selectType = function(type){
            $scope.selectedType = type;
        };
        $scope.phone = '18768114210';
        $scope.items = dsy.Items;
        $scope.selectedProvince = 0;
        $scope.selectProvince = function(index){
            $scope.selectedProvince = index;
            $scope.selectedCity = 0;
            $scope.selectedDistrict = 0;
            $scope.cityItems = dsy.Items[0 + '_' + $scope.selectedProvince];
            $scope.districtItems = dsy.Items[0 + '_' + $scope.selectedProvince + '_' + $scope.selectedCity];
            console.log($scope);
        };
        $scope.selectedCity = 0;
        $scope.selectCity = function(index){
            $scope.selectedCity = index;
            $scope.selectedDistrict = 0;
            $scope.districtItems = dsy.Items[0 + '_' + $scope.selectedProvince + '_' + $scope.selectedCity];
            console.log($scope);
        };
        $scope.selectedDistrict = 0;
        $scope.selectDistrict = function(index){
            $scope.selectedDistrict = index;
        };
        $scope.provinceItems = dsy.Items[$scope.selectedProvince]
        $scope.cityItems = dsy.Items[0 + '_' + $scope.selectedProvince];
        $scope.districtItems = dsy.Items[0 + '_' + $scope.selectedProvince + '_' + $scope.selectedCity];
        $scope.addressMore = '123';
    });

});

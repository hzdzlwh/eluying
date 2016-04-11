var AJAXService = require("AJAXService");
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
require("angular");
var dsy = require("dsy");

require("bootstrap");
require("validation");

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
    app.controller('infoCtrl', function($scope, $http) {
        $scope.types = ["营地", "景区", "农庄", "游乐园"];
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
        };
        $scope.selectedCity = 0;
        $scope.selectCity = function(index){
            $scope.selectedCity = index;
            $scope.selectedDistrict = 0;
            $scope.districtItems = dsy.Items[0 + '_' + $scope.selectedProvince + '_' + $scope.selectedCity];
        };
        $scope.selectedDistrict = 0;
        $scope.selectDistrict = function(index){
            $scope.selectedDistrict = index;
        };
        $scope.provinceItems = dsy.Items[$scope.selectedProvince]
        $scope.cityItems = dsy.Items[0 + '_' + $scope.selectedProvince];
        $scope.districtItems = dsy.Items[0 + '_' + $scope.selectedProvince + '_' + $scope.selectedCity];
        $scope.addressMore = '123';
        $scope.cover = null;
        $scope.campName = '111';
        $scope.submit = function(){
            var address = $scope.addressMore;
            var campName = $scope.campName;
            var city = $scope.cityItems[$scope.selectedCity];
            var country = $scope.districtItems[$scope.selectedDistrict];
            var imgUrl = $scope.cover;
            var province = $scope.provinceItems[$scope.selectedProvince];
            var recePhone = $scope.phone;
            var type = $scope.selectedType;
        };
        $http.get(AJAXService.getUrl2("getBasicInfoUrl"), {
            params: {
                campId: 56,
                uid: 85
            }
        }).success(function(result){
            console.log(result);
            var infos = result.data;
            var address = infos.address;
            var campName = infos.campName;
            var city = infos.city;
            var country = infos.country;
            var imgUrl = infos.imgUrl;
            var province = infos.province;
            var recePhone = infos.recePhone;
            var type = infos.type;
            $scope.selectedProvince = findIndex(dsy.Items['0'], province);
            $scope.selectedCity = findIndex(dsy.Items['0_' + $scope.selectedProvince], city);
            $scope.selectedDistrict = findIndex(dsy.Items['0_' + $scope.selectedProvince + '_' + $scope.selectedCity], country);
            $scope.cityItems = dsy.Items[0 + '_' + $scope.selectedProvince];
            $scope.districtItems = dsy.Items[0 + '_' + $scope.selectedProvince + '_' + $scope.selectedCity];
            $scope.phone = recePhone;
            $scope.selectedType = type;
            $scope.addressMore = address;
            $scope.cover = imgUrl;
            $scope.campName = campName;
        });
    });

});

var findIndex = function(array, str){
    var result = 0;
    array.forEach(function(d, i){
        if(d === str){
            result = i;
        }
    });
    return result;
};

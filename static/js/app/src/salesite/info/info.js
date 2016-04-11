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
        $.ajax({
            url: AJAXService.getUrl2("getBasicInfoUrl"),
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

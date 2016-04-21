var AJAXService = require("AJAXService");
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
require("fileupload");
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

    $("#coverUpload").fileupload({
        url: AJAXService.getUrl2("uploadImageUrl"),
        done: function (e, data) {
            var result = data.result[0].body ? data.result[0].body.innerHTML : data.result;
            result = JSON.parse(result);
            console.log(result);
            angular.element(this).scope().cover = result.data.url;
            angular.element(this).scope().$apply();
            //$(".cover .photoContainer").html("<img onclick='selectPhoto(this)' class='coverImg' height='205px' src='" + result.data.url + "' />");
            //$(".cover .create").hide();
            //$(".coverError").addClass("hide");
            //showInfo.changed = true;
        }
    });

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
        },
        "click .sbtn.upload": function(){
            $("input#coverUpload").click();
        }
    };

    util.bindDomAction(events);

    var app = angular.module('infoApp', []);
    app.controller('infoCtrl',['$scope', function(scope) {
        scope.types = ["营地", "景区", "农庄", "游乐园","度假村","客栈","青旅"];
        scope.selectedType = 0;
        scope.selectType = function(type){
            scope.selectedType = type;
        };
        scope.phone = '18768114210';
        scope.items = dsy.Items;
        scope.selectedProvince = 0;
        scope.selectProvince = function(index){
            scope.selectedProvince = index;
            scope.selectedCity = 0;
            scope.selectedDistrict = 0;
            scope.cityItems = dsy.Items[0 + '_' + scope.selectedProvince];
            scope.districtItems = dsy.Items[0 + '_' + scope.selectedProvince + '_' + scope.selectedCity];
        };
        scope.selectedCity = 0;
        scope.selectCity = function(index){
            scope.selectedCity = index;
            scope.selectedDistrict = 0;
            scope.districtItems = dsy.Items[0 + '_' + scope.selectedProvince + '_' + scope.selectedCity];
        };
        scope.selectedDistrict = 0;
        scope.selectDistrict = function(index){
            scope.selectedDistrict = index;
        };
        scope.provinceItems = dsy.Items[scope.selectedProvince]
        scope.cityItems = dsy.Items[0 + '_' + scope.selectedProvince];
        scope.districtItems = dsy.Items[0 + '_' + scope.selectedProvince + '_' + scope.selectedCity];
        scope.addressMore = '123';
        scope.cover = null;
        scope.campName = '111';
        scope.submit = function(){
            var address = scope.addressMore;
            var campName = scope.campName;
            var city = scope.cityItems[scope.selectedCity];
            try{
                var country = scope.districtItems[scope.selectedDistrict];
            }catch(e){
                var country = '';
            }

            var imgUrl = scope.cover;
            var province = scope.provinceItems[scope.selectedProvince];
            var recePhone = scope.phone;
            var type = scope.selectedType;
            AJAXService.ajaxWithToken('GET', 'editBasicInfoUrl', {
                address: address,
                campType: type,
                city: city,
                county: country,
                imgUrl: imgUrl,
                province: province,
                recePhone: recePhone
            }, function(result){
                modal.somethingAlert(result.msg);
                scope.$apply();
            });
        };
        scope.uploadCover = function(){
            console.log(this);
        };
        AJAXService.ajaxWithToken('GET', 'getBasicInfoUrl', {}, function(result){
            var infos = result.data;
            var address = infos.address;
            var campName = infos.campName;
            var city = infos.city;
            var county = infos.county;
            var imgUrl = infos.imgUrl;
            var province = infos.province;
            var recePhone = infos.recePhone;
            var type = infos.type;
            scope.selectedProvince = findIndex(dsy.Items['0'], province);
            scope.selectedCity = findIndex(dsy.Items['0_' + scope.selectedProvince], city);
            scope.selectedDistrict = findIndex(dsy.Items['0_' + scope.selectedProvince + '_' + scope.selectedCity], county);
            scope.cityItems = dsy.Items[0 + '_' + scope.selectedProvince];
            scope.districtItems = dsy.Items[0 + '_' + scope.selectedProvince + '_' + scope.selectedCity];
            scope.phone = recePhone;
            scope.selectedType = type;
            scope.addressMore = address;
            scope.cover = imgUrl;
            scope.campName = campName;
            scope.$apply();
        });
    }]);

});

var findIndex = function(array, str){
    var result = 0;
    if(!array){
        return result;
    }
    array.forEach(function(d, i){
        if(d === str){
            result = i;
        }
    });
    return result;
};

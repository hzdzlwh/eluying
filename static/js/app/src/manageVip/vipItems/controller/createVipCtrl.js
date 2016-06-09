/**
 * Created by lingchenxuan on 16/6/5.
 */
require('angular');
var dsy = require("dsy");
var createVipService = require('../services/createVipService');

var createVipCtrl = function(app) {
    createVipService(app);
    app.controller('createVipCtrl', ['$rootScope', '$scope', 'createVipService',
        function(rootScope, scope, createVipService) {
            scope.mailFilter = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
            scope.newVip = {name: '', phone: ''};
            scope.genderList = [
                { key:0, label: '男' },
                { key:1, label: '女' }
            ];
            
            
            scope.items = dsy.Items;
            scope.selectedProvince = 0;
            scope.selectProvince = function(index){
                scope.selectedProvince = index;
                scope.selectedCity = 0;
                scope.selectedDistrict = 0;
                scope.cityItems = dsy.Items[0 + '_' + scope.selectedProvince];
                scope.districtItems = dsy.Items[0 + '_' + scope.selectedProvince + '_' + scope.selectedCity];
                scope.newVip.province = scope.provinceItems[scope.selectedProvince];
                if(rootScope.item){
                    rootScope.item.province = scope.provinceItems[scope.selectedProvince];
                };
            };
            scope.selectedCity = 0;
            scope.selectCity = function(index){
                scope.selectedCity = index;
                scope.selectedDistrict = 0;
                scope.districtItems = dsy.Items[0 + '_' + scope.selectedProvince + '_' + scope.selectedCity];
                scope.newVip.city = scope.cityItems[scope.selectedCity];
                if(rootScope.item){
                    rootScope.item.city = scope.cityItems[scope.selectedCity];
                };
            };
            scope.selectedDistrict = 0;
            scope.selectDistrict = function(index){
                scope.selectedDistrict = index;
                scope.newVip.county = scope.districtItems[scope.selectedDistrict];
                if(rootScope.item){
                    rootScope.item.county = scope.districtItems[scope.selectedDistrict];
                };
            };
            scope.provinceItems = dsy.Items[scope.selectedProvince]
            scope.cityItems = dsy.Items[0 + '_' + scope.selectedProvince];
            scope.districtItems = dsy.Items[0 + '_' + scope.selectedProvince + '_' + scope.selectedCity];


            scope.changeGender = function(key, label) {
                scope.newVip.gender = key;
                if(rootScope.item){
                    rootScope.item.gender = key;
                };
                scope.selectedGenderLabel = label;
                $(".select1_options").hide();
            };
            scope.idCardList = [
                {key: '0', label: '身份证'},
                {key: '1', label: '军官证'},
                {key: '2', label: '通行证'},
                {key: '3', label: '护照'},
                {key: '4', label: '其他'},
            ];
            scope.changeIdCard = function(key, label) {
                scope.newVip.idCardType = key;
                if(rootScope.item){
                    rootScope.item.idCardType = key;
                };
                scope.selectedIdLabel = label;
                $(".select1_options").hide();
            };
            rootScope.createVip = function() {
                createVipService.createVip(scope.newVip, rootScope);
            };
            scope.editVip = function(){
                createVipService.editVip(rootScope.item);
            };
        }]);
};

module.exports = createVipCtrl;
/**
 * Created by lingchenxuan on 16/6/5.
 */
require('angular');
import { dsy } from 'dsy';
var createVipService = require('../services/createVipService');

var createVipCtrl = function(app) {
    createVipService(app);
    app.controller('createVipCtrl', ['$rootScope', '$scope', 'createVipService',
        function(rootScope, scope, createVipService) {
            scope.mailFilter = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
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
                rootScope.vip.province = scope.provinceItems[scope.selectedProvince];
                if(rootScope.item){
                    rootScope.item.province = scope.provinceItems[scope.selectedProvince];
                }
            };
            scope.selectedCity = 0;
            scope.selectCity = function(index){
                scope.selectedCity = index;
                scope.selectedDistrict = 0;
                scope.districtItems = dsy.Items[0 + '_' + scope.selectedProvince + '_' + scope.selectedCity];
                rootScope.vip.city = scope.cityItems[scope.selectedCity];
                if(rootScope.item){
                    rootScope.item.city = scope.cityItems[scope.selectedCity];
                }
            };
            scope.selectedDistrict = 0;
            scope.selectDistrict = function(index){
                scope.selectedDistrict = index;
                rootScope.vip.county = scope.districtItems[scope.selectedDistrict];
                if(rootScope.item){
                    rootScope.item.county = scope.districtItems[scope.selectedDistrict];
                }
            };
            scope.provinceItems = dsy.Items[scope.selectedProvince];
            scope.cityItems = dsy.Items[0 + '_' + scope.selectedProvince];
            scope.districtItems = dsy.Items[0 + '_' + scope.selectedProvince + '_' + scope.selectedCity];

            scope.changeGender = function(key, label) {
                rootScope.vip.gender = key;
                $(".select1_options").hide();
            };
            scope.changeLevel = function(id, name) {
                rootScope.vip.level = id;
                rootScope.vip.levelName = name;
                $(".select1_options").hide();
            };
            rootScope.idCardList = [
                {key: '0', label: '身份证'},
                {key: '1', label: '军官证'},
                {key: '2', label: '通行证'},
                {key: '3', label: '护照'},
                {key: '4', label: '其他'},
            ];
            scope.changeIdCard = function(key, label) {
                scope.vip.idCardType = key;
                $(".select1_options").hide();
            };
            scope.hasSubmit = false;
            rootScope.createVip = function() {
                scope.hasSubmit = true;
                if (rootScope.vip.name.length < 2 || rootScope.vip.phone.length !== 11 || (rootScope.vip.email && !scope.mailFilter.test(rootScope.vip.email))) {
                    return
                }
                createVipService.addEditVip(rootScope.vip, rootScope);
                scope.hasSubmit = false;
            };
            scope.editVip = function(){
                scope.hasSubmit = true;
                if ((rootScope.item.email && !scope.mailFilter.test(rootScope.item.email))) {
                    return
                }
                createVipService.editVip(rootScope.item, rootScope);
            };
            scope.close = function() {
                scope.hasSubmit = false;
                scope.newVip = {name: '', phone: '', idCardType: 0};
                rootScope.item = {};
            }
        }]);
};

module.exports = createVipCtrl;
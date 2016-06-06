/**
 * Created by lingchenxuan on 16/6/5.
 */
require('angular');
var createVipService = require('../services/createVipService');
var createVipCtrl = function(app) {
    createVipService(app);
    app.controller('createVipCtrl', ['$rootScope', '$scope', 'createVipService',
        function(rootScope, scope, createVipService) {
            scope.newVip = {};
            scope.genderList = [
                { key:0, label: '男' },
                { key:1, label: '女' }
            ];
            scope.changeGender = function(key, label) {
                scope.newVip.gender = key;
                scope.selectedGenderLabel = label;
                $(".select1_options").hide();
            };
            scope.createVip = function() {
                createVipService.createVip(scope.newVip);
            };
            scope.editVip = function(){
                createVipService.editVip(rootScope.item);
            };
        }]);
};

module.exports = createVipCtrl;
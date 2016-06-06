/**
 * Created by zhaoyongsheng on 16/6/3.
 */
var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var getItemsService = require("../services/getItemsService");

var itemsCtrl = function(app){
    getItemsService(app);
    app.controller("itemsCtrl",['$rootScope', '$scope', 'getItemsService',
        function(rootScope, scope, getItemsService){
            /*AJAXService.ajaxWithToken('GET', '/vipUser/getVipUserListPC', {
                pageNo: 1,
                pageSize: 20
            }, function(result){
                scope.dataItems = result.data.list;
                scope.$apply();
            });*/
            rootScope.outPutExcel = function(){
                AJAXService.ajaxWithToken('GET', '/vipUser/vipUserListToExcel', {});
            };
            rootScope.addNewVip = function(){
                $("#newVipModal").modal("show");
                rootScope.modify = false;
            };
            rootScope.modifyVip = function(item){
                $("#newVipModal").modal("show");
                console.log(item);
                rootScope.item = item;
                rootScope.modify = true;
            };
            rootScope.removeVip = function(){
                $("#removeVipModal").modal("show");
            };
            getItemsService.getVipItems(1,scope);
            getItemsService.getIdList(function(result){
                rootScope.idList = result.idList;
            });
            getItemsService.getGender(function(result){
                rootScope.genderList = result.genderList;
            });
        }
    ]);
};

module.exports = itemsCtrl;
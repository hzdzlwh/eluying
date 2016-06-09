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
                var campId = localStorage.getItem("campId");
                var uid = localStorage.getItem("uid");
                var host = AJAXService.getUrl2('/vipUser/vipUserListToExcel');
                var url = host + '?' + 'campId='+ campId + '&uid='+ uid;
                return url;
                // AJAXService.ajaxWithToken('GET', '/vipUser/vipUserListToExcel', {});
            };
            rootScope.addNewVip = function(){
                $("#newVipModal").modal("show");
                rootScope.modify = false;
            };
            rootScope.modifyVip = function(item){
                $("#newVipModal").modal("show");
                rootScope.item = item;
                rootScope.modify = true;
            };
            rootScope.removeVipModal = function(item){
                $("#removeVipModal").modal("show");
                rootScope.item = item;
            };
            rootScope.removeVip = function(){
                AJAXService.ajaxWithToken('GET', '/vipUser/removeVipUserPC', {vipId: rootScope.item.vipId},
                    function(result){
                        if (result.code === 1) {
                            $("#removeVipModal").modal("hide");
                            getItemsService.getVipItems(1, rootScope.pageSize, '', rootScope);
                            getItemsService.getVipUserCount(rootScope);
                        }
                    });
            };
            rootScope.pageSize = 20;
            scope.filterSearch = function (ev) {
                if (ev.keyCode === 13) {
                    getItemsService.getVipItems(scope.currentPage, rootScope.pageSize, scope.searchPattern, rootScope);
                }
            };
            scope.onPageChange = function () {
                getItemsService.getVipItems(scope.currentPage, rootScope.pageSize, scope.searchPattern, rootScope);
            };
            getItemsService.getVipUserCount(rootScope);
            scope.pageCount = !!scope.vipUserCount && Math.ceil(scope.vipUserCount / rootScope.pageSize);
            getItemsService.getVipItems(1, rootScope.pageSize, scope.searchPattern, rootScope);
        }
    ]);
};

module.exports = itemsCtrl;
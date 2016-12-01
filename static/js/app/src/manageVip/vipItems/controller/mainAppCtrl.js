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
                var url = host + '?' + 'campId='+ campId + '&uid='+ uid + '&terminal=1&version=10&timestamp=' + (new Date()).valueOf() + '&sign=' + util.getSign();
                return url;
                // AJAXService.ajaxWithToken('GET', '/vipUser/vipUserListToExcel', {});
            };
            rootScope.addNewVip = function(){
                rootScope.modify = false;
                $("#newVipModal").modal("show");
            };
            rootScope.modifyVip = function(item){
                rootScope.modify = true;
                $("#newVipModal").modal("show");
                rootScope.item = Object.assign({}, item);
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
                            scope.search();
                        }
                    });
            };
            rootScope.pageSize = 15;
            rootScope.searchText = '';
            rootScope.currentPage = 1;
            var flag;
            scope.filterSearch = function() {
                /*if (ev.keyCode === 13) {
                    scope.search();
                }*/
                clearTimeout(flag);
                flag = setTimeout(function(){
                    scope.search();
                }, 1000);
            };
            scope.getIdCardIcon = function(num) {
                return rootScope.idCardList[num].label.substring(0 ,1);
            };
            scope.onPageChange = function () {
                scope.searchPattern = rootScope.searchText;
                getItemsService.getVipItems(rootScope.currentPage, rootScope.pageSize, scope.searchPattern, rootScope);
            };
            scope.search = function() {
                scope.searchPattern = rootScope.searchText;
                rootScope.currentPage = 1;
                getItemsService.getVipItems(rootScope.currentPage, rootScope.pageSize, scope.searchPattern, rootScope);
                getItemsService.getVipUserCount(rootScope, scope.searchPattern);
            };
            getItemsService.getVipUserCount(rootScope);
            scope.getPageCount = function() {
                return !!scope.vipUserCount && Math.ceil(scope.vipUserCount / rootScope.pageSize);
            };
            getItemsService.getVipItems(rootScope.currentPage, rootScope.pageSize, rootScope.searchText, rootScope);
        }
    ]);
};

module.exports = itemsCtrl;
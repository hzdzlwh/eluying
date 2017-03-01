/**
 * Created by zhaoyongsheng on 16/6/3.
 */
var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("../../../common/modal");
require("angular");
var getItemsService = require("../services/getItemsService");

var itemsCtrl = function(app){
    getItemsService(app);
    app.controller("itemsCtrl",['$rootScope', '$scope', 'getItemsService',
        function(rootScope, scope, getItemsService){
            rootScope.outPutExcel = function(){
                var campId = localStorage.getItem("campId");
                var uid = localStorage.getItem("uid");
                var host = AJAXService.getUrl2('/vipUser/vipUserListToExcel');
                var url = host + '?' + 'campId='+ campId + '&uid='+ uid + '&terminal=1&version=10&timestamp=' + (new Date()).valueOf() + '&sign=' + util.getSign();
                return url;
                // AJAXService.ajaxWithToken('GET', '/vipUser/vipUserListToExcel', {});
            };
            rootScope.addNewVip = function(){
                rootScope.vip = { idCardType: 0, levelName: '—', level: '' };
                $("#newVipModal").modal("show");
            };
            rootScope.openDetail = function(item) {
                getItemsService.getVipUser(item.vipUserId, rootScope);
            };
            rootScope.modify = function() {
                rootScope.vip.modify = true;
                rootScope.vip.detail = false;
            };
            rootScope.removeVipModal = function(item){
                $("#removeVipModal").modal("show");
                rootScope.item = item;
            };
            rootScope.removeVip = function(){
                modal.confirmDialog({
                    message: '删除会员之后不可找回，您确定要删除吗？'
                },
                function () {
                    AJAXService.ajaxWithToken('GET', '/vipUser/removeVip', {vipUserId: rootScope.vip.vipUserId},
                        function(result){
                            if (result.code === 1) {
                                $("#newVipModal").modal("hide");
                                scope.search();
                            }
                        });
                });
            };
            rootScope.pageSize = 30;
            rootScope.searchText = '';
            rootScope.currentPage = 1;
            rootScope.vip = {};
            var flag;
            scope.filterSearch = function() {
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
            getItemsService.getVipLevels(rootScope);

            scope.getPageCount = function() {
                return !!scope.vipUserCount && Math.ceil(scope.vipUserCount / rootScope.pageSize);
            };
            getItemsService.getVipItems(rootScope.currentPage, rootScope.pageSize, rootScope.searchText, rootScope);
        }
    ]);
};

module.exports = itemsCtrl;
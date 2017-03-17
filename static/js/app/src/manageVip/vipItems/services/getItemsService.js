/**
 * Created by zhaoyongsheng on 16/6/4.
 */
var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var getItemsService = function(app){
    app.service("getItemsService",[function(){
        this.getVipItems = function(pageNo, pageSize, searchPattern, rootScope) {
            AJAXService.ajaxWithToken('GET', '/vipUser/getVipUserListPC', {
                pageNo: pageNo,
                searchPattern: searchPattern,
                sortColumn: rootScope.sortColumn,
                sortType: rootScope.sortType
            }, function(result){
                rootScope.dataItems = result.data.vipUserList;
                rootScope.vipUserCount = result.data.vipUserListSize;
                rootScope.$apply();
            });
        };
        this.getVipLevels = function(rootScope) {
            AJAXService.get('/vipUser/getVipLevels')
                .then(res => {
                    rootScope.levels = [{
                        vipLevelId: '',
                        vipLevelName: '—'
                    }];
                    rootScope.levels = rootScope.levels.concat(res.data.list);
                    rootScope.$apply();
                })
        };
        this.getVipUser = function(id, rootScope) {
            AJAXService.get('/vipUser/getVipUserDetailInfoPC', { vipUserId: id })
                .then(res => {
                    if (res.code === 1) {
                        rootScope.vip = res.data.vipUserDetailInfoResp;
                        Object.assign(rootScope.vip, res.data);
                        rootScope.vip.detail = true;
                        delete rootScope.vip.vipUserDetailInfoResp;
                        rootScope.$apply();
                        $("#newVipModal").modal("show");
                    }
                })
        }
    }]);
};
module.exports = getItemsService;
/**
 * Created by zhaoyongsheng on 16/6/4.
 */
var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var getItemsService = function(app){
    app.service("getItemsService",[function(){
        this.getVipItems = function(pageNo, pageSize, searchPattern, rootScope){
            AJAXService.ajaxWithToken('GET', '/vipUser/getVipUserList', {
                pageNo: pageNo,
                searchPattern: searchPattern
            }, function(result){
                rootScope.dataItems = result.data.vipUserList;
                rootScope.$apply();
            });
        };
        this.getVipLevels = function(rootScope) {
            AJAXService.get('/vipUser/getVipLevels')
                .then(res => {
                    rootScope.levels = res.data.list;
                    rootScope.levels.push({
                        vipLevelId: '',
                        vipLevelName: '—'
                    });
                    rootScope.$apply();
                })
        };
        this.getVipUserCount = function(rootScope) {
            AJAXService.ajaxWithToken('GET', '/vipUser/getVipUserCount', {searchPattern: rootScope.searchText},
            function(result) {
                if (result.code === 1) {
                    rootScope.vipUserCount = result.data;
                    rootScope.$apply();
                }
            })
        };
    }]);
};
module.exports = getItemsService;
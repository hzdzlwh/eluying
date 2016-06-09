/**
 * Created by lingchenxuan on 16/6/5.
 */
var AJAXService = require("AJAXService");
var getItemsService = require('./getItemsService');
require('angular');
var createVipService = function(app){
    app.service('createVipService', ['getItemsService', function() {
        this.createVip = function(newVip,rootScope) {
            AJAXService.ajaxWithToken('POST', '/vipUser/addVipUser', newVip,
                function(result) {
                    if (result.code === 1) {
                        $("#newVipModal").modal("hide");
                        getVipItems(1, 20, '', rootScope);
                        getVipUserCount(rootScope);
                    }
                }
            )
        };
        this.editVip = function(item) {
            AJAXService.ajaxWithToken('POST', '/vipUser/editVipUserDetailInfo', item,
                function(result) {
                    if (result.code === 1) {
                        $("#newVipModal").modal("hide");
                    }
                }
            )
        }
    }]);
};
var getVipItems = function(pageNo, pageSize, searchPattern, rootScope){
    AJAXService.ajaxWithToken('GET', '/vipUser/getVipUserListPC', {
        pageNo: pageNo,
        pageSize: pageSize,
        searchPattern: searchPattern
    }, function(result){
        rootScope.dataItems = result.data.list;
        rootScope.$apply();
    });
};
var getVipUserCount = function(rootScope) {
    AJAXService.ajaxWithToken('GET', '/vipUser/getVipUserCount', {},
        function(result) {
            if (result.code === 1) {
                rootScope.vipUserCount = result.data;
                rootScope.$apply();
            }
        })
};
module.exports = createVipService;
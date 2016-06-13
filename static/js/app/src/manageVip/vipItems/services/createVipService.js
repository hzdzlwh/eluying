/**
 * Created by lingchenxuan on 16/6/5.
 */
var AJAXService = require("AJAXService");
var getItemsService = require('./getItemsService');
var modal = require('modal');
require('angular');
var createVipService = function(app){
    app.service('createVipService', ['getItemsService', function() {
        this.createVip = function(newVip,rootScope) {
            AJAXService.ajaxWithToken('POST', '/vipUser/addVipUser', newVip,
                function(result) {
                    if (result.code === 1) {
                        $("#newVipModal").modal("hide");
                        getVipItems(1, 15, '', rootScope);
                        getVipUserCount(rootScope);
                    } else {
                        modal.somethingAlert(result.msg);
                    }
                }
            )
        };
        this.editVip = function(item, rootScope) {
            AJAXService.ajaxWithToken('POST', '/vipUser/editVipUserDetailInfo', item,
                function(result) {
                    if (result.code === 1) {
                        $("#newVipModal").modal("hide");
                        var index;
                        angular.forEach(rootScope.dataItems, function(element, i){
                            if (element.vipId === item.vipId) {
                                index = i;
                            }
                        });
                        delete item.sign;
                        rootScope.dataItems[index] = item;
                    } else {
                        modal.somethingAlert(result.msg);
                    }
                    rootScope.$apply();
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
var getVipUserCount = function(rootScope, searchPattern) {
    AJAXService.ajaxWithToken('GET', '/vipUser/getVipUserCount', {searchPattern: searchPattern},
        function(result) {
            if (result.code === 1) {
                rootScope.vipUserCount = result.data;
                rootScope.$apply();
            }
        })
};
module.exports = createVipService;
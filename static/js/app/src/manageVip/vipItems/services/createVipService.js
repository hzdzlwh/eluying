/**
 * Created by lingchenxuan on 16/6/5.
 */
var AJAXService = require("AJAXService");
var getItemsService = require('./getItemsService');
var modal = require('modal');
require('angular');
var createVipService = function(app){
    app.service('createVipService', ['getItemsService', function(getItemsService) {
        this.addEditVip = function(vip, rootScope) {
            if (vip.vipUserId) {
                delete vip.phone;
            }

            vip.vipLevelId = vip.level;
            AJAXService.ajaxWithToken('POST', '/vipUser/addEditVip', vip,
                function(result) {
                    if (result.code === 1) {
                        $("#newVipModal").modal("hide");
                        vip = {name: '', phone: '', idCardType: 0};
                        getItemsService.getVipItems(rootScope.currentPage, rootScope.pageSize, rootScope.searchText, rootScope);
                    } else {
                        modal.somethingAlert(result.msg);
                    }
                }
            )
        };
    }]);
};
module.exports = createVipService;
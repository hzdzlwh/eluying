/**
 * Created by lingchenxuan on 16/6/5.
 */
var AJAXService = require("AJAXService");
require('angular');
var createVipService = function(app){
    app.service('createVipService', [function(){
        this.createVip = function(newVip) {
            AJAXService.ajaxWithToken('POST', '/vipUser/addVipUser', newVip,
                function(result) {
                    if (result.code === 1) {
                        alert('成功');
                    }
                }
            )
        };
        this.editVip = function(item) {
            AJAXService.ajaxWithToken('POST', '/vipUser/editVipUserDetailInfo', item,
                function(result) {
                    if (result.code === 1) {
                        alert('成功');
                    }
                }
            )
        }
    }]);
};
module.exports = createVipService;
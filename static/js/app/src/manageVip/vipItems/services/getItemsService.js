/**
 * Created by zhaoyongsheng on 16/6/4.
 */
var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var getItemsService = function(app){
    app.service("getItemsService",[function(){
        this.getVipItems = function(pageNo, pageSize, scope){
            AJAXService.ajaxWithToken('GET', '/vipUser/getVipUserListPC', {
                pageNo: pageNo,
                pageSize: pageSize
            }, function(result){
                scope.dataItems = result.data.list;
                scope.$apply();
            });
        };
        this.getVipUserCount = function(scope) {
            AJAXService.ajaxWithToken('GET', '/vipUser/getVipUserCount', {},
            function(result) {
            })
        };
        this.getIdList = function(callback){
            var idList = [
                {key: '0', label: '身份证'},
                {key: '1', label: '军官证'},
                {key: '2', label: '通行证'},
                {key: '3', label: '护照'},
                {key: '4', label: '其他'},
            ];
            callback({
                idList: idList
            });
        };
        this.getGender = function(callback){
            var genderList = [
                {key: 'first', gender: '男'},
                {key: 'second', gender: '女'}
            ];
            callback({
                genderList: genderList
            });
        };
    }]);
};
module.exports = getItemsService;
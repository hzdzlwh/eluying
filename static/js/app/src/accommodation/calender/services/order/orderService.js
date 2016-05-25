var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var orderService = function(app){
    app.service("orderService", ["$rootScope", function(rootScope){
        this.getOrderDetail = function(orderId){
            AJAXService.ajaxWithToken('GET', 'getOrderDetailUrl', {
                orderId: orderId
            }, function(result){
                if(result.code === 1){
                    rootScope.orderDetail = result.data;
                    rootScope.$apply();
                    $("#orderDetailModal").modal("show");
                }
            });
        };
        this.createOrderNew = function(){
            return {
                title: null,
                type: null,
                selectedChannel: null,
                guestInfo: {
                    name: null,
                    phone: null,
                    selectedId: '身份证',
                    idVal: null
                },
                roomList: [],
                foodList: [],
                funList: [],
                remarks: '',
                discounts: 0,
            }
        };
    }]);
};

module.exports = orderService;
var util = require("util");
require("angular");

var constService = require("../services/constService");

var getMoneyService = function(app){
    constService(app);
    app.service("getMoneyService", ['constService', function(constService){
        this.resetGetMoney = function(order, orderId, type){
            var getMoney = {};
            for(var key in order){
                getMoney[key] = order[key];
            }
            getMoney.orderId = orderId;
            getMoney.getMoneyType = type; //0为新建订单进入，1为订单详情进入, 2为退房进入, 3为办理入住， 4为提前退房
            getMoney.remark = '';
            if(type === 0){
                getMoney.payments = [{type: 5, fee: order.discounts}]
            }
            return getMoney;
        };
        this.addPayment = function(payments, type, payChannel){
            var payment = {
                isNew: true,
                fee: 0,
                payChannel: payChannel[0].name,
                payChannelId: payChannel[0].channelId,
                type: type
            };
            payments.push(payment)
        };
        this.changePayChannel = function(p, pp){
            p.fee = 0;
            p.payChannel = pp.name;
            p.payChannelId = pp.channelId;
        };
    }]);
};

module.exports = getMoneyService;
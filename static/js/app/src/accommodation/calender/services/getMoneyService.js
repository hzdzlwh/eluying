var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var constService = require("../services/constService");
var orderService = require("../services/orderService");

var getMoneyService = function(app){
    constService(app);
    orderService(app);
    app.service("getMoneyService", ['constService', 'orderService', function(constService, orderService){
        this.resetGetMoney = function(order, orderId, type){
            var getMoney = {};
            for(var key in order){
                getMoney[key] = order[key];
            }
            getMoney.orderId = orderId;
            getMoney.getMoneyType = type; //0为新建订单进入，1为订单详情进入, 2为退房进入, 3为办理入住， 4为提前退房
            // getMoney.remark = '';

            //判断是收钱还是付钱
            var depositMode = 0; //0是收,1是退
            var feeMode = 0; //0是收,1是退
            //退房是退押金
            if(type === 2 || type === 4){
                depositMode = 1;
            }
            var feeLeft = orderService.calLeft(order);
            if(feeLeft < 0){
                feeMode = 1;
            }
            getMoney.depositMode = depositMode;
            getMoney.feeMode = feeMode;

            if(type === 0){
                getMoney.payments = [{type: 5, fee: order.discounts}]
            } else{

            }
            return getMoney;
        };
        /*
        payChannels: 用户的收款方式
        type: 0-支付，1-押金，2-退款，3-已退押金，4-违约金,5-优惠
         */
        this.addPayment = function(getMoney, payChannels, type){
            var left = 0;
            if(type === 0){
                left = orderService.calLeft(getMoney);
            }else if(type === 2){
                left = -orderService.calLeft(getMoney);
            }
            var payChannel, payChannelId;
            if(type === 2 || type === 3){
                for(var i = 0; i < payChannels.length; i++){
                    if(payChannels[i].channelId != -8 && payChannels[i].channelId != -6){
                        payChannel = payChannels[i].name;
                        payChannelId = payChannels[i].channelId;
                        break;
                    }
                }
            }else{
                payChannel = payChannels[0].name;
                payChannelId = payChannels[0].channelId;
            }
            var payment = {
                isNew: true,
                fee: left,
                payChannel: payChannel,
                payChannelId: payChannelId,
                type: type
            };
            getMoney.payments.push(payment)
        };
        this.changePayChannel = function(p, pp){
            p.payChannel = pp.name;
            p.payChannelId = pp.channelId;
        };
        this.finishPay = function(payments, orderId, remark){
            AJAXService.ajaxWithToken('GET', 'finishPaymentUrl', {
                payments: JSON.stringify(payments_new),
                remark: getMoney.remark,
                orderId: getMoney.orderId
            }, function(result){
                // if(result.code === 1){
                //     //TODO 提示收银成功
                //     $("#getMoneyModal").modal("hide");
                //     getDataService.getRoomsAndStatus(rootScope);
                //     accommodationService.emptySelectedEntries(rootScope);
                // }
                callback(result);
            });
        }
    }]);
};

module.exports = getMoneyService;
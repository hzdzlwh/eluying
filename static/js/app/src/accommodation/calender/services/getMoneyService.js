var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var constService = require("../services/constService");
var orderService = require("../services/orderService");
var getDataService = require("../services/getDataService");
var accommodationService = require("../services/accommodationService");
var getMoneyWithGunService = require("../services/getMoneyWithGunService");
var validateService = require("../services/validateService");

var getMoneyService = function(app){
    constService(app);
    orderService(app);
    getDataService(app);
    accommodationService(app);
    getMoneyWithGunService(app);
    validateService(app);
    app.service("getMoneyService", ['constService', 'orderService', 'getDataService', 'accommodationService', 
        'getMoneyWithGunService', 'validateService',
        function(constService, orderService, getDataService, accommodationService, getMoneyWithGunService, validateService){
        var calLeft = function(getMoney){
            var left = orderService.itemPrice(getMoney);
            left -= parseFloat(getMoney.roomsRefund || 0);
            left = left - getMoney.discounts;
            if(left < 0){
                left = 0;
            }
            left += parseFloat(getMoney.penaltyAd || 0);
            var payments = getMoney.payments;
            if(payments){
                for(var i = 0; i < payments.length; i++){
                    if(payments[i].type === 0){
                        left -= parseFloat(payments[i].fee);
                    }else if(payments[i].type === 2){
                        left += parseFloat(payments[i].fee);
                    }
                }
            }
            return left.toFixed(2);
        };
        this.calLeft = calLeft;
        this.resetGetMoney = function(order, orderId, type, asyncObj, isLast){
            var getMoney = {};
            for(var key in order){
                getMoney[key] = order[key];
            }
            if(asyncObj){
                for(var key in asyncObj){
                    getMoney[key] = asyncObj[key];
                }
                asyncObj.penaltyAd && getMoney.payments.push({
                    type: 4, fee: parseFloat(asyncObj.penaltyAd), isNew: true, payChannel: '违约金', payChannelId: -5,
                });
            }
            getMoney.orderId = orderId;
            getMoney.getMoneyType = type; //0为新建订单进入，1为订单详情进入, 2为退房进入, 3为办理入住， 4为提前退房
            getMoney.isLast = isLast; //
            // getMoney.remark = '';

            //判断是收钱还是付钱
            var depositMode = 0; //0是收,1是退
            var feeMode = 0; //0是收,1是退
            //退房是退押金
            if(type === 2 || type === 4){
                depositMode = 1;
            }
            var feeLeft = calLeft(getMoney);
            getMoney.feeLeft = feeLeft;
            getMoney.depositTotal = orderService.calDepositLeft(getMoney);
            if(feeLeft <= 0){
                feeMode = 1;
            }
            getMoney.depositMode = depositMode;
            getMoney.feeMode = feeMode;
            if(type === 0){
                getMoney.payments = [{type: 5, fee: order.discounts}]
            } else{

            }
            // getMoney.payRemark = '';

            getMoney.playItems.map(el => {
                if (el.date instanceof Date) {
                    el.date = util.dateFormat(el.date);
                }
            })

            return getMoney;
        };
        /*
        payChannels: 用户的收款方式
        type: 0-支付，1-押金，2-退款，3-已退押金，4-违约金,5-优惠
         */
        this.addPayment = function(getMoney, payChannels, type){
            if (payChannels.length === 0) {
                modal.somethingAlert('没有可用收款方式');
                return;
            }
            var left = 0;
            if(type === 0){
                left = calLeft(getMoney);
            }else if(type === 2){
                left = -calLeft(getMoney);
            }else if(type === 3){
                left = orderService.calDeposit(getMoney);
            }
            if(left < 0){
                left = 0;
            }
            var payChannel, payChannelId;
            if (payChannels.length > 0) {
                if(type === 2 || type === 3 || type === 1){
                    for(var i = 0; i < payChannels.length; i++){
                        if(payChannels[i].channelId != -8 && payChannels[i].channelId != -6 && payChannels[i].channelId != -7){
                            payChannel = payChannels[i].name;
                            payChannelId = payChannels[i].channelId;
                            break;
                        }
                    }
                }else{
                    if (getMoney.payments.some(function(el) {
                            return el.payChannelId === -6 || el.payChannelId === -8 || el.payChannelId === -7;
                        })) {
                        for(var i = 0; i < payChannels.length; i++){
                            if(payChannels[i].channelId != -8 && payChannels[i].channelId != -6 && payChannels[i].channelId != -7){
                                payChannel = payChannels[i].name;
                                payChannelId = payChannels[i].channelId;
                                break;
                            }
                        }
                    } else {
                        payChannel = payChannels[0].name;
                        payChannelId = payChannels[0].channelId;
                    }
                }
            } else {
                payChannel = '请添加收银方式';
            }
            
            var payment = {
                isNew: true,
                fee: left,
                payChannel: payChannel,
                payChannelId: payChannelId,
                type: type
            };
            getMoney.payments.push(payment);
        };
        this.deletePayment = function(index, payments){
            payments.splice(index, 1);
        };
        this.changePayChannel = function(p, pp){
            p.payChannel = pp.name;
            p.payChannelId = pp.channelId;
        };
        // this.finishPay = function(payments, orderId, remark){
        //     AJAXService.ajaxWithToken('GET', 'finishPaymentUrl', {
        //         payments: JSON.stringify(payments_new),
        //         remark: getMoney.remark,
        //         orderId: getMoney.orderId
        //     }, function(result){
        //         // if(result.code === 1){
        //         //     //TODO 提示收银成功
        //         //     $("#getMoneyModal").modal("hide");
        //         //     getDataService.getRoomsAndStatus(rootScope);
        //         //     accommodationService.emptySelectedEntries(rootScope);
        //         // }
        //         callback(result);
        //     });
        // };
        var submitGetMoney = function(getMoney, scope){
            /*var payments_new = [];
            getMoney.payments.forEach(function(d){
                if(d.payChannelId !== -8 && d.payChannelId != -6){
                    if(d.isNew && d.fee > 0){
                        payments_new.push(d);
                    }
                }
            });*/
            if(!getMoney.async){
                AJAXService.ajaxWithToken('GET', 'finishPaymentUrl', {
                    payments: JSON.stringify(getMoney.payments),
                    remark: getMoney.remark,
                    orderId: getMoney.orderId,
                    dateTime: (new Date()).valueOf(),
                    orderType: -1
                }, function(result){
                    if(result.code === 1){
                        modal.somethingAlert("收银成功");
                        $("#getMoneyModal").modal("hide");
                        getDataService.getRoomsAndStatus(scope);
                        accommodationService.emptySelectedEntries(scope);
                        setTimeout(function(){
                            getDataService.getOrderDetail(getMoney.orderId, scope);
                        }, 2500);
                    }else{
                        modal.somethingAlert(result.msg);
                    }
                });
            }else{
                //还有钱没有付完
                if(getMoney.isLast && scope.arrearLeft && scope.arrearLeft !== 0){
                    AJAXService.ajaxWithToken('GET', 'finishPaymentUrl', {
                        payments: JSON.stringify(getMoney.payments),
                        remark: getMoney.remark,
                        orderId: getMoney.orderId,
                        dateTime: (new Date()).valueOf(),
                        orderType: -1
                    }, function(result){
                        if(result.code === 1){
                            $("#getMoneyModal").modal("hide");
                            getDataService.getRoomsAndStatus(scope);
                            accommodationService.emptySelectedEntries(scope);
                            setTimeout(function(){
                                getDataService.getOrderDetail(getMoney.orderId, scope);
                                setTimeout(function(){
                                    modal.somethingAlert("订单款项未结清,房间操作失败!");
                                }, 500);
                            }, 500);
                        }else{
                            modal.somethingAlert(result.msg);
                        }
                    });
                    return false;
                }
                AJAXService.ajaxWithToken('GET', 'checkInOrCheckoutUrl', {
                    payments: JSON.stringify(payments_new),
                    orderId: getMoney.orderId,
                    rooms: JSON.stringify(getMoney.checkoutRooms),
                    type: getMoney.checkoutType,
                }, function(result){
                    if(result.code === 1){
                        modal.somethingAlert("操作成功!");
                        $("#getMoneyModal").modal("hide");
                        getDataService.getRoomsAndStatus(scope);
                        accommodationService.emptySelectedEntries(scope);
                        // setTimeout(function(){
                        //     getDataService.getOrderDetail(getMoney.orderId, scope);
                        // }, 2500);
                    }else{
                        modal.somethingAlert(result.msg);
                    }
                });
            }
        };
        this.submitGetMoney = submitGetMoney;
        this.pay = function(scope){
            var getMoney = scope.getMoney;
            var payments_new = [];
            var alipayMoneyTotal = 0;
            var onlineType = null;
            var paymentType = null;
            getMoney.payments.forEach(function(d){
                if(d.isNew && d.fee > 0){
                    payments_new.push(d);
                    if(d.payChannelId === -6 || d.payChannelId === -7 || d.payChannelId === -11 || d.payChannelId === -12){
                        alipayMoneyTotal += parseFloat(d.fee);
                        onlineType = d.payChannelId;
                        paymentType = d.type;
                    }
                }
            });
            if(alipayMoneyTotal > 0){
                //要去扫码付钱
                var onlineTypeMap = {
                    '-6': 2,
                    '-7': 2,
                    '-11': 1,
                    '-12': 1
                };
                var payChannelTypeMap = {
                    '-6': 1,
                    '-7': 2,
                    '-11': 1,
                    '-12': 2
                };
                var payChannelType = payChannelTypeMap[onlineType];
                onlineType = onlineTypeMap[onlineType];
                scope.getMoneyWithGun =
                    getMoneyWithGunService.resetGetMoneyWithGun(alipayMoneyTotal, onlineType, paymentType, getMoney, payChannelType);
                $("#getMoneyModal").modal("hide");
                $("#orderCancelModal").modal("hide");
                $("#payWithAlipayModal").modal("show");
            }else{
                submitGetMoney(getMoney, scope);
            }
        }
    }]);
};

module.exports = getMoneyService;
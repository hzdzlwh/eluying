var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("angular");

var orderCancelService = function(app){
    app.service("orderCancelService",function(){
        this.resetOrderCancel = function(scope){
            var orderDetail = scope.orderDetail;
            var orderCancel = {};
            for(var key in orderDetail){
                orderCancel[key] = orderDetail[key];
            }
            orderCancel.newPayments = [];
            return orderCancel;
        };
        var calRefund = function(orderCancel){
            var payments = orderCancel.payments;
            var refund = 0;
            payments.forEach(function(d){
                if(d.type === 0){
                    refund += d.fee;
                }
                if(d.type === 2){
                    refund -= d.fee;
                }
            });
            return refund;
        };
        var calDeposit = function(orderCancel){
            var payments = orderCancel.payments;
            var deposit = 0;
            payments.forEach(function(d){
                if(d.type === 1){
                    deposit += d.fee;
                }
            });
            return deposit;
        };
        var calRefundLeft = function(orderCancel){
            var payments = orderCancel.payments;
            var newPayments = orderCancel.newPayments;
            var refundTotal = 0;
            var refund = 0;
            payments.forEach(function(d){
                if(d.type === 0){
                    refundTotal += parseFloat(d.fee);
                }
            });
            newPayments.forEach(function(d){
                if(d.type === 2){
                    refund += parseFloat(d.fee);
                }
            });
            return refundTotal - refund;
        };
        var calDepositLeft = function(orderCancel){
            var payments = orderCancel.payments;
            var newPayments = orderCancel.newPayments;
            var depositTotal = 0;
            var deposit = 0;
            payments.forEach(function(d){
                if(d.type === 1){
                    depositTotal += parseFloat(d.fee);
                }
            });
            newPayments.forEach(function(d){
                if(d.type === 3){
                    deposit += parseFloat(d.fee);
                }
            });
            return depositTotal - deposit;
        };
        this.calRefund = calRefund;
        this.calDeposit = calDeposit;
        this.addNewPayments = function(orderCancel, type, payChannels){
            var left = 0;
            if(type === 2){
                left = calRefundLeft(orderCancel);
            }else if(type === 3){
                left = calDepositLeft(orderCancel);
            }
            if(left <= 0){
                if(type === 2){
                    modal.somethingAlert("已退完所有款项!");
                }else if(type === 3){
                    modal.somethingAlert("已退完所有押金!");
                }
                return false;
            }
            var payChannel, payChannelId;
            //退款不能用支付宝或者订单钱包
            for(var i = 0; i < payChannels.length; i++){
                if(payChannels[i].channelId != -8 && payChannels[i].channelId != -6){
                    payChannel = payChannels[i].name;
                    payChannelId = payChannels[i].channelId;
                    break;
                }
            }
            var payment = {
                fee: left,
                payChannel: payChannel,
                payChannelId: payChannelId,
                type: type
            };
            orderCancel.newPayments.push(payment);
        };
        this.changePayChannel = function(p, pp){
            p.payChannel = pp.name;
            p.payChannelId = pp.channelId;
        };
        this.calRefundLeft = calRefundLeft;
        this.calDepositLeft = calDepositLeft;
    });
};

module.exports = orderCancelService;
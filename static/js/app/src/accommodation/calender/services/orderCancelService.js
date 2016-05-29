var AJAXService = require("AJAXService");
var util = require("util");
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
                    refundTotal += d.fee;
                }
            });
            newPayments.forEach(function(d){
                if(d.type === 2){
                    refund += d.fee;
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
                    depositTotal += d.fee;
                }
            });
            newPayments.forEach(function(d){
                if(d.type === 3){
                    deposit += d.fee;
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
                left = calDeposit(orderCancel);
            }
            var payment = {
                fee: left,
                payChannel: payChannels[0].name,
                payChannelId: payChannels[0].channelId,
                type: type
            };
            orderCancel.newPayments.push(payment);
        };
        this.changePayChannel = function(p, pp, orderCancel){
            // var left = 0;
            // if(p.type === 2){
            //     left = calRefundLeft(orderCancel);
            // }else if(p.type === 3){
            //     left = calDeposit(orderCancel);
            // }
            // p.fee = left;
            p.payChannel = pp.name;
            p.payChannelId = pp.channelId;
        };
        this.calRefundLeft = calRefundLeft;
        this.calDepositLeft = calDepositLeft;
    });
};

module.exports = orderCancelService;
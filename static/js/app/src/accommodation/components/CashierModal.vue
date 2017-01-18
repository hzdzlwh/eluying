<template>
    <div>
        <div class="modal fade roomModals" id="cashier" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <span class="header-text">收银台</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="roomModals-body" style="overflow: inherit">
                        <div class="content-item">
                            <p class="content-item-title"><span>{{orderState ? '订单收款' : '订单退款'}}</span></p>
                            <div class="cashier-order-item">
                                <span class="cashier-money-text">订单金额:<span>¥{{type === 'cancel' ? 0 : orderPayment.payableFee}}</span></span>
                                <span class="cashier-money-text" v-if="penalty && penalty > 0">违约金:<span>¥{{penalty}}</span></span>
                                <span class="cashier-money-text">已付金额:<span>¥{{orderPayment.paidFee - orderPayment.refundFee}}</span></span>
                                <span class="cashier-money-text">{{orderState ? '需补金额:' : '需退金额:'}}<span>¥{{Math.abs((type === 'cancel' ? 0 : orderPayment.payableFee) - (orderPayment.paidFee - orderPayment.refundFee) + penalty).toFixed(2)}}</span></span>
                            </div>
                            <div class="cashier-getMoney-container">
                                <div class="cashier-getMoney-channels" v-if="payments.length > 0">
                                    <div class="cashier-getMoney-channel" v-for="(payment, index) in payments">
                                        <span>金额:</span>
                                        <input type="number" class="dd-input" v-model="payment.fee">
                                        <span style="margin-left: 24px">{{orderState ? '收款' : '退款'}}方式:</span>
                                        <dd-select v-model="payment.payChannelId" :placeholder="`请选择${orderState ? '收款' : '退款'}方式`">
                                            <dd-option v-for="payChannel in getPayChannels(index)" :value="payChannel.channelId" :label="payChannel.name">
                                            </dd-option>
                                        </dd-select>
                                        <span class="cashier-delBtn-icon" @click="deletePayMent(index)"></span>
                                    </div>
                                </div>
                                <div class="cashier-addBtn" @click="addPayMent">
                                    <span class="cashier-addBtn-icon"></span>
                                    <span style="cursor: pointer">添加{{orderState ? '收款' : '退款'}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="content-item" v-if="appearDeposit">
                            <p class="content-item-title"><span>{{(orderPayment.deposit || 0) - (orderPayment.refundDeposit || 0) > 0 && type !== 'checkIn' ? '押金退款' : '押金收款'}}</span></p>
                            <div class="cashier-order-item">
                                <span class="cashier-money-text">已付押金:<span>{{(orderPayment.deposit || 0) - (orderPayment.refundDeposit || 0)}}</span></span>
                                <span class="cashier-money-text" v-if="orderPayment.deposit > 0 && type !== 'checkIn'">需退押金:<span>{{(orderPayment.deposit || 0) - (orderPayment.refundDeposit || 0)}}</span></span>
                            </div>
                            <div class="cashier-deposit-container">
                                <div class="cashier-deposit-info" v-if="showDeposit">
                                    <span>押金:</span>
                                    <input type="number" class="dd-input" v-model="deposit" placeholder="请输入押金金额">
                                    <span style="margin-left: 24px">{{(orderPayment.deposit || 0) - (orderPayment.refundDeposit || 0) > 0 && type !== 'checkIn' ? '退款' : '收款'}}方式:</span>
                                    <dd-select v-model="depositPayChannel" :placeholder="`请选择${(orderPayment.deposit || 0) - (orderPayment.refundDeposit || 0) > 0 && type !== 'checkIn' ? '退款' : '收款'}方式`">
                                        <dd-option v-for="payChannel in depositPayChannels" :value="payChannel.channelId" :label="payChannel.name">
                                        </dd-option>
                                    </dd-select>
                                    <span class="cashier-delBtn-icon" @click="deleteDeposit"></span>
                                </div>
                                <div class="cashier-addBtn"  @click="addDeposit" v-if="!showDeposit">
                                    <span class="cashier-addBtn-icon"></span>
                                    <span style="cursor: pointer">添加押金</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div>
                            <span class="footer-label">{{orderState ? '需补金额:' : '需退金额:'}}<span class="order-price-num red">¥{{Math.abs((type === 'cancel' ? 0 : orderPayment.payableFee) - (orderPayment.paidFee - orderPayment.refundFee) + penalty).toFixed(2)}}</span></span>
                            <span v-if="totalDeposit != 0" class="footer-label">{{(totalDeposit > 0 && type !== 'checkIn') ? '需退押金' : '需补押金'}}:<span class="order-price-num green">¥{{Math.abs(totalDeposit)}}</span></span>
                        </div>
                        <div class="dd-btn dd-btn-primary" @click="payMoney">完成</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="sass" type="text/css" rel="stylesheet/scss">
    .cashier-money-text {
        margin-right: 24px;
    }
    .cashier-order-item {
        padding-bottom: 15px;
        margin-bottom: 16px;
        border-bottom: 1px dotted #e6e6e6;
    }
    .cashier-getMoney-container {
        display: flex;
        align-items: flex-end;
    }
    .cashier-deposit-container {
        display: flex;
        align-items: center;
    }
    .cashier-getMoney-channels {
        display: flex;
        flex-direction: column;
    }
    .cashier-getMoney-channel {
        display: flex;
        align-items: center;
        &:not(:last-child) {
            margin-bottom: 16px;
        }
    }
    .cashier-deposit-info {
        display: flex;
        align-items: center;
    }
    .cashier-addBtn {
        height: 24px;
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    .cashier-addBtn-icon {
        width: 16px;
        height: 16px;
        background: url("../../../../../image/modal/room_modal_add.png");
        background-size: contain;
        margin-right: 4px;
        cursor: pointer;
    }
    .cashier-delBtn-icon {
        width: 16px;
        height: 16px;
        background: url("../../../../../image/modal/room_modal_min.png");
        background-size: contain;
        margin-left: 8px;
        margin-right: 24px;
        cursor: pointer;
    }
</style>
<script>
    import { DdSelect, DdOption } from 'dd-vue-component';
    import AJAXService from 'AJAXService';
    import modal from 'modal';
    import { mapState } from 'vuex';
    export default{
        props: {
            type: {
                type: String,
                default: ''//该界面的跳转来源界面类型
            },
            business: {
                type: Object,
                default: function(){ return {} }
            },
            show: {
                type: Boolean
            }
        },
        data(){
            return{
                showDeposit: false,
                payments: [],
                payChannels: [],
                depositPayChannels: [],
                depositPayChannel: undefined,
                deposit: undefined,
                orderPayment: {},
                disabledBtn: false
            }
        },
        computed:{
            ...mapState(['orderDetail', 'roomBusinessInfo']),
            orderState() {
                if (this.orderPayment) {
                    let income = (this.type === 'cancel' ? 0 : this.orderPayment.payableFee) + this.penalty - (this.orderPayment.paidFee - this.orderPayment.refundFee);
                    return income >= 0;
                }
                return false;
            },
            totalDeposit() {
                return ((this.type === 'checkIn' ? (this.deposit || 0) : 0)).toFixed(2);
            },
            penalty() {
                return (this.orderPayment.penalty || 0) + ((this.business && this.business.penalty) || 0);
            },
            appearDeposit() {
                const type = this.type;
                const cashierType = this.business.cashierType;
                const deposit = this.orderPayment.deposit;
                return (type === 'checkIn' || cashierType === 'ing' || deposit !== 0);
            }
        },
        created() {
            this.getData();
        },
        watch: {
            show(val) {
                if (val) {
                    this.getOrderPayment();
                    $('#cashier').modal({backdrop: 'static'});
                } else {
                    $('#cashier').modal('hide');
                }
            }
        },
        methods: {
            resetData() {
                this.payments = [];
                this.showDeposit = false;
                this.deposit = undefined;
                this.depositPayChannel = undefined;
            },
            getPayChannels(index) {
                if (this.type === 'register' && this.business.cashierType === 'finish') {
                    return this.depositPayChannels;
                }
                if (this.payments.length <= 1) {
                    return this.payChannels;
                } else {
                    let own = false;
                    let arr = this.payChannels;
                    this.payments.forEach((pay, num) => {
                        let id = pay.payChannelId;
                        if ((id === -6 || id === -7 || id === -11 || id === -12) && (num !== index)) {
                            own = true;
                        }
                    });
                    if (own) {
                        arr = this.payChannels.filter(item => {
                            let index = item.channelId;
                            return index !== -6 && index !== -7 && index !== -11 && index !== -12
                        })
                    }
                    return arr
                }
            },
            getOrderPayment() {
                let params = undefined;
                if (this.type === 'register') {
                    params = { orderId: this.business.orderDetail.orderId, orderType: this.business.orderDetail.orderType };
                } else {
                    let operationType;
                    let penalty;
                    if (this.type === 'checkOut') {
                        operationType = 1;
                        penalty = this.business.penalty;
                    }
                    const orderId = this.orderDetail.orderType === -1 ? this.orderDetail.orderId : this.orderDetail.subOrderId;
                    let subOrderIds = [];
                    if (this.roomBusinessInfo.roomOrderInfoList && this.type !== 'orderDetail') {
                        this.roomBusinessInfo.roomOrderInfoList.forEach(item => {
                            if (item.selected) {
                                subOrderIds.push(item.roomOrderId);
                            }
                        });
                    }
                    params = {
                        orderType: this.orderDetail.orderType,
                        subOrderIds: JSON.stringify(subOrderIds),
                        operationType,
                        orderId
                    };
                }
                AJAXService.ajaxWithToken('GET', '/order/getOrderPayment', params )
                    .then(res => {
                        if (res.code === 1) {
                            this.orderPayment = res.data;
                            const payMoney = ((this.type === 'cancel' ? 0 : this.orderPayment.payableFee) - (this.orderPayment.paidFee - this.orderPayment.refundFee) + Number(this.penalty)).toFixed(2);
                            if (payMoney != 0) {
                                this.payments.push({fee: Math.abs(payMoney).toFixed(2), payChannelId: undefined, type: this.orderState ? 0 : 2});
                            }
                            if (this.orderPayment.deposit > 0 && this.type !== 'checkIn') {
                                this.showDeposit = true;
                                this.deposit = this.orderPayment.deposit - (this.orderPayment.refundDeposit || 0);
                            }
                        } else {
                            modal.somethingAlert(res.msg);
                        }
                    });
            },
            getData() {
                AJAXService.ajaxWithToken('GET', 'getPaymentMethodAndStateUrl', {})
                        .then(result => {
                            let payChannels = [].concat(result.data.payChannelCustomList);
                            let map = result.data;
                            let walletOpenAndUseStateList = map.walletOpenAndUseStateList;
                            for (let key in walletOpenAndUseStateList) {
                                if (map.onlineCollectionMethod === 1 &&
                                        walletOpenAndUseStateList[key].onlineType === 2
                                        && walletOpenAndUseStateList[key].openState === 1
                                        && walletOpenAndUseStateList[key].useState === 1) {
                                    payChannels.push({
                                        channelId: -11,
                                        name: '支付宝（订单钱包）'
                                    });
                                }
                                if (map.onlineCollectionMethod === 1 &&
                                        walletOpenAndUseStateList[key].onlineType === 4
                                        && walletOpenAndUseStateList[key].openState === 1
                                        && walletOpenAndUseStateList[key].useState === 1) {
                                    payChannels.push({
                                        channelId: -12,
                                        name: '微信支付（订单钱包）'
                                    });
                                }
                            }
                            let enterpriseOpenAndUseStateList = map.enterpriseOpenAndUseStateList;
                            for (let key in enterpriseOpenAndUseStateList) {
                                if (map.onlineCollectionMethod === 2 &&
                                        enterpriseOpenAndUseStateList[key].onlineType === 2
                                        && enterpriseOpenAndUseStateList[key].openState === 1
                                        && enterpriseOpenAndUseStateList[key].useState === 1) {
                                    payChannels.push({
                                        channelId: -6,
                                        name: '支付宝'
                                    });
                                }
                                if (map.onlineCollectionMethod === 2 &&
                                        enterpriseOpenAndUseStateList[key].onlineType === 4
                                        && enterpriseOpenAndUseStateList[key].openState === 1
                                        && enterpriseOpenAndUseStateList[key].useState === 1) {
                                    payChannels.push({
                                        channelId: -7,
                                        name: '微信支付'
                                    });
                                }
                            }
                            payChannels.sort(function(a, b){
                                return a.channelId - b.channelId;
                            });
                            this.payChannels = payChannels;
                            this.depositPayChannels = result.data.payChannelCustomList;
                        });
            },
            hideModal() {
                this.resetData();
                if (this.type === 'register') {
                    let params = {
                        orderId: this.business.orderDetail.orderId,
                        orderType: this.business.orderDetail.orderType
                    }
                    AJAXService.ajaxWithToken('get', '/order/cancel', params)
                        .then(res => {
                            if (res.code !== 1) {
                                modal.somethingAlert(res.msg);
                            } else {
                                this.$emit('hide');
                                $('#Cashier').modal('hide');
                            }
                        });
                } else {
                    this.$emit('hide');
                    $('#Cashier').modal('hide');
                }
            },
            addPayMent() {
                const payMoney = Math.abs(((this.type === 'cancel' ? 0 : this.orderPayment.payableFee) - this.orderPayment.paidFee + this.penalty).toFixed(2));
                let paidMoney = 0;
                if (this.payments.length > 0) {
                    this.payments.forEach(pay => {
                        paidMoney += Number(pay.fee);
                    });
                }
                this.payments.push({fee: Math.abs((payMoney - Number(paidMoney)).toFixed(2)), payChannelId: undefined, type: this.orderState ? 0 : 2 });
            },
            deletePayMent(index) {
                this.payments.splice(index, 1);
            },
            addDeposit() {
                this.showDeposit = true;
            },
            deleteDeposit(e) {
                e.stopPropagation();
                this.deposit = undefined;
                this.depositPayChannel = undefined;
                this.showDeposit = false;
            },
            payMoney() {
                if (this.disabledBtn) {
                    return false;
                }
                this.disabledBtn = true;
                let invalid = false;
                if (this.payments.length > 0) {
                    this.payments.forEach(payment => {
                        if (!payment.payChannelId) {
                            invalid = true;
                        }
                    });
                }
                if (this.deposit && !this.depositPayChannel) {
                    invalid = true;
                }
                if(invalid) {
                    modal.somethingAlert('请选择收款方式！');
                    this.disabledBtn = false;
                    return false;
                }
                const receiveMoney = this.payments.reduce((a,b) => { return a + Number(b.fee) }, 0);
                const shouldPayMoney = Math.abs((this.type === 'cancel' ? 0 : this.orderPayment.payableFee) - this.orderPayment.paidFee + this.penalty).toFixed(2);
                if (receiveMoney.toFixed(2) !== shouldPayMoney) {
                    modal.somethingAlert('订单未结清，无法完成收银！');
                    this.disabledBtn = false;
                    return false;
                }
                const shouldDeposit = this.orderPayment.deposit - (this.orderPayment.refundDeposit || 0);
                if (this.deposit > shouldDeposit && this.type !== 'checkIn' && this.type !== 'register') {
                    modal.somethingAlert('退款押金无法大于已付押金！');
                    this.disabledBtn = false;
                    return false;
                }
                const payments = this.payments.map(payment => {
                    const channel = this.payChannels.find(c => c.channelId === payment.payChannelId);
                    return {
                        ...payment,
                        payChannel: channel.name
                    }
                });

                if (this.deposit) {
                    const channel = this.depositPayChannels.find(c => c.channelId === this.depositPayChannel);

                    payments.push({
                        fee: this.deposit,
                        payChannelId: this.depositPayChannel,
                        payChannel: channel.name,
                        type: (this.orderPayment.deposit > 0 && this.type !== 'checkIn') ? 3 : 1
                    })
                }
                let params = undefined;
                if (this.type === 'register') {
                    params = {
                        orderId: this.business.orderDetail.orderId,
                        orderType: this.business.orderDetail.orderType,
                        payments: JSON.stringify(payments),
                    };
                } else if (this.type === 'cancel') {
                    const businessJson = {
                        functionType: this.business.functionType,
                        orderId: this.business.orderId,
                        orderType: this.business.orderType,
                        payments: [{ fee: this.business.penalty, type: 4 }]
                    };
                    if (this.business.penalty) {
                        payments.push({ fee: this.business.penalty, type: 4, payChannel: '违约金', payChannelId: -5 });
                    }
                    params = {
                        orderId: this.business.orderId,
                        orderType: this.business.orderType,
                        payments: JSON.stringify(payments),
                        businessJson: JSON.stringify(businessJson)
                    }
                }else {
                    params = {
                        orderId: this.orderDetail.orderId,
                        orderType: -1,
                        payments: JSON.stringify(payments),
                        businessJson: JSON.stringify(this.business)
                    };
                    if (this.business.rooms) {
                        let  subOrderIds = [];
                        this.business.rooms.forEach(room => {
                            if (room) {
                                subOrderIds.push(room.roomOrderId);
                            }
                        });
                        params.subOrderIds = JSON.stringify(subOrderIds);
                    }
                    if (this.business.type === 2) {
                        params.operationType = 1;
                    }
                }
                //判断是否进行扫码收款
                let payWithAlipay = 0;
                this.payments.forEach(pay => {
                    let id = pay.payChannelId;
                    if (id === -6 || id === -7 || id === -11 || id === -12) {
                        payWithAlipay += Number(pay.fee);
                    }
                });
                if (payWithAlipay <= 0) {
                    AJAXService.ajaxWithToken('GET', '/order/addOrderPayment', params)
                        .then(result => {
                            if(result.code === 1) {
                                modal.somethingAlert('收银成功');
                                this.resetData();
                                this.$emit('hide');
                                $('#Cashier').modal('hide');
                                let orderId = this.type === 'register' ? this.business.orderDetail.relatedOrderId : this.orderDetail.orderId;
                                this.$emit('refreshView');
                                this.$emit('showOrder', orderId);
                            } else {
                                modal.somethingAlert(result.msg);
                            }
                            this.disabledBtn = false;
                        });
                } else {
                    this.disabledBtn = false;
                    this.resetData();
                    this.$emit('hide');
                    $('#Cashier').modal('hide');
                    this.$emit('showGetMoney', { type: this.type, business: this.business, params, payWithAlipay: Number(payWithAlipay.toFixed(2))});
                }
            }
        },
        components: {
            DdSelect,
            DdOption
        }
    }
</script>

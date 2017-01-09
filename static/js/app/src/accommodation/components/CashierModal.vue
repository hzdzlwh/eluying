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
                            <p class="content-item-title"><span>{{`${orderState ? '订单收款' : '订单付款'}`}}</span></p>
                            <div class="cashier-order-item">
                                <span class="cashier-money-text">订单金额:<span>{{`¥${orderPayment.payableFee}`}}</span></span>
                                <span class="cashier-money-text" v-if="penalty && penalty > 0">违约金:<span>{{`¥${penalty}`}}</span></span>
                                <span class="cashier-money-text">已付金额:<span>{{`¥${orderPayment.paidFee}`}}</span></span>
                                <span class="cashier-money-text">{{orderState ? '需补金额:' : '需退金额:'}}<span>¥{{Math.abs(orderPayment.payableFee - orderPayment.paidFee).toFixed(2)}}</span></span>
                            </div>
                            <div class="cashier-getMoney-container">
                                <div class="cashier-getMoney-channels" v-if="payments.length > 0">
                                    <div class="cashier-getMoney-channel" v-for="(payment, index) in payments">
                                        <span>金额:</span>
                                        <input type="text" class="dd-input" v-model="payment.fee">
                                        <span style="margin-left: 24px">收款方式:</span>
                                        <dd-select v-model="payment.payChannelId" placeholder="请选择收款方式">
                                            <dd-option v-for="payChannel in getPayChannels(index)" :value="payChannel.channelId" :label="payChannel.name">
                                            </dd-option>
                                        </dd-select>
                                        <span class="cashier-delBtn-icon" @click="deletePayMent(index)"></span>
                                    </div>
                                </div>
                                <div class="cashier-addBtn" @click="addPayMent">
                                    <span class="cashier-addBtn-icon"></span>
                                    <span style="cursor: pointer">添加收款</span>
                                </div>
                            </div>
                        </div>
                        <div class="content-item" v-if="!appearDeposit">
                            <p class="content-item-title"><span>押金信息</span></p>
                            <div class="cashier-order-item">
                                <span class="cashier-money-text">已付押金:<span>{{orderPayment.deposit || 0}}</span></span>
                            </div>
                            <div class="cashier-deposit-container">
                                <div class="cashier-deposit-info" v-if="showDeposit">
                                    <span>押金:</span>
                                    <input type="text" class="dd-input" v-model="deposit">
                                    <span style="margin-left: 24px">收款方式:</span>
                                    <dd-select v-model="depositPayChannel" placeholder="请选择收款方式">
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
                            <span class="footer-label">{{orderState ? '需补金额:' : '需退金额:'}}<span class="order-price-num red">¥{{Math.abs(orderPayment.payableFee - orderPayment.paidFee + penalty).toFixed(2)}}</span></span>
                            <span v-if="totalDeposit != 0" class="footer-label">{{totalDeposit > 0 ? '需退押金' : '需补押金'}}:<span class="order-price-num green">¥{{Math.abs(totalDeposit)}}</span></span>
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
            checkInRooms: {
                type: Object,
                default: function(){ return {} }//办理入住收银时的一些参数
            },
            checkOutRooms: {
                type: Object,
                default: function(){ return {} }//办理退房收银时的一些参数
            },
            business: {
                type: Object
            },
            show: {
                type: Boolean
            }
        },
        data(){
            return{
                payments: [],
                showDeposit: false,
                payChannels: [],
                depositPayChannels: [],
                depositPayChannel: undefined,
                deposit: undefined,
                orderPayment: {}
            }
        },
        computed:{
            ...mapState(['orderDetail', 'roomBusinessInfo']),
            orderState() {
                if (this.orderPayment.payableFee) {
                    let income = this.orderPayment.payableFee - this.orderPayment.paidFee;
                    return income > 0;
                }
                return false;
            },
            totalDeposit() {
                return ((this.orderPayment.deposit || 0) - (this.orderPayment.refundDeposit || 0) - (this.deposit || 0)).toFixed(2);
            },
            penalty() {
                return (this.orderPayment.penalty || 0) + ((this.business && this.business.penalty) || 0);
            },
            appearDeposit() {
                return (this.type === 'register' && this.business.cashierType === 'finish');
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
                this.$nextTick(() => {
                    this.payments = [];
                    this.showDeposit = false;
                    this.deposit = undefined;
                    this.depositPayChannel = undefined;
                });
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
                    if (this.type === 'checkIn') {
                        operationType = 3;
                    } else if (this.type === 'checkOut') {
                        operationType = 1;
                        penalty = this.business.penalty;
                    }
                    const orderId = this.orderDetail.orderType === -1 ? this.orderDetail.orderId : this.orderDetail.subOrderId;
                    let subOrderIds = [];
                    if (this.roomBusinessInfo.roomOrderInfoList) {
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
                const payMoney = (this.orderPayment.payableFee - this.orderPayment.paidFee + this.penalty).toFixed(2);
                let paidMoney = 0;
                if (this.payments.length > 0) {
                    this.payments.forEach(pay => {
                        paidMoney += Number(pay.fee);
                    });
                }
                this.payments.push({fee: (payMoney - Number(paidMoney)).toFixed(2), payChannelId: undefined, type: 0});
            },
            deletePayMent(index) {
                this.payments.splice(index, 1);
            },
            addDeposit() {
                this.showDeposit = true;
            },
            deleteDeposit(e) {
                e.stopPropagation();
                this.showDeposit = false;
            },
            payMoney() {
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
                        type: 1
                    })
                }
                let params = undefined;
                if (this.type === 'register') {
                    params = {
                        orderId: this.business.orderDetail.orderId,
                        orderType: this.business.orderDetail.orderType,
                        payments: JSON.stringify(payments),
                    };
                } else {
                    params = {
                        orderId: this.orderDetail.orderId,
                        orderType: -1,
                        payments: JSON.stringify(payments),
                        businessJson: JSON.stringify(this.business)
                    };
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
                                this.hideModal();
                                let orderId = this.type === 'register' ? this.business.orderDetail.relatedOrderId : this.orderDetail.orderId;
                                this.$emit('showOrder', orderId);
                            } else {
                                modal.somethingAlert(result.msg);
                            }
                        });
                } else {
                    this.resetData();
                    this.$emit('hide');
                    $('#Cashier').modal('hide');
                    this.$emit('showGetMoney', { type: this.type, business: this.business, params, payWithAlipay});
                }
            }
        },
        components: {
            DdSelect,
            DdOption
        }
    }
</script>

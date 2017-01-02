<template>
    <div>
        <div class="modal fade roomModals" id="Cashier" role="dialog">
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
                                <span class="cashier-money-text">订单金额:<span>{{`¥${payMents.payableFee}`}}</span></span>
                                <span class="cashier-money-text" v-if="payMents.penalty && payMents.penalty > 0">违约金:<span>{{`¥${payMents.penalty}`}}</span></span>
                                <span class="cashier-money-text">已付金额:<span>{{`¥${payMents.paidFee}`}}</span></span>
                                <span class="cashier-money-text">{{`${orderState ? '需补金额:' : '需退金额:'}`}}<span>{{`¥${(payMents.payableFee - payMents.paidFee).toFixed(2)}`}}</span></span>
                            </div>
                            <div class="cashier-getMoney-container">
                                <div class="cashier-getMoney-channels" v-if="payments.length > 0">
                                    <div class="cashier-getMoney-channel" v-for="(payment, index) in payments">
                                        <span>金额:</span>
                                        <input type="text" class="dd-input" v-model="payment.fee">
                                        <span style="margin-left: 24px">收款方式:</span>
                                        <dd-select v-model="payment.payChannelId" placeholder="请选择收款方式">
                                            <dd-option v-for="payChannel in payChannels" :value="payChannel.channelId" :label="payChannel.name">
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
                        <div class="content-item">
                            <p class="content-item-title"><span>押金信息</span></p>
                            <div class="cashier-order-item">
                                <span class="cashier-money-text">已付押金:<span>¥100</span></span>
                            </div>
                            <div class="cashier-deposit-container">
                                <div class="cashier-deposit-info" v-show="deposit">
                                    <span>押金:</span>
                                    <input type="text" class="dd-input">
                                    <span style="margin-left: 24px">收款方式:</span>
                                    <dd-select v-model="depositPayChannel" placeholder="请选择收款方式">
                                        <dd-option v-for="payChannel in depositPayChannels" :value="payChannel.channelId" :label="payChannel.name">
                                        </dd-option>
                                    </dd-select>
                                    <span class="cashier-delBtn-icon" @click="deleteDeposit"></span>
                                </div>
                                <div class="cashier-addBtn"  @click="addDeposit" v-show="!deposit">
                                    <span class="cashier-addBtn-icon"></span>
                                    <span style="cursor: pointer">添加押金</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div>
                            <span class="footer-label">需补金额:<span class="order-price-num red">{{`¥${(payMents.payableFee - payMents.paidFee).toFixed(2)}`}}</span></span>
                            <span class="footer-label">需退押金:<span class="order-price-num green">¥1200</span></span>
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
    export default{
        props: {
            cashierType: {
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
            payMents: {
                type: Object,
                default: function(){ return {} }//收银时的订单的支付信息
            },
            order: {
                type: Object,
                default: function() { return {} }
            }
        },
        data(){
            return{
                payments: [],
                deposit: false,
                payChannels: [],
                depositPayChannels: [],
                depositPayChannel: undefined
            }
        },
        computed:{
            orderState(){
                if (this.payMents.payableFee) {
                    let income = this.payMents.payableFee - this.payMents.paidFee;
                    return income > 0;
                }
                return false;
            }
        },
        created() {
            this.getData();
        },
        methods: {
            resetData() {
                this.payments = [];
                this.deposit = false;
                this.depositPayChannel = undefined;

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
                $('#Cashier').modal('hide');
            },
            addPayMent() {
                let payMoney = (this.payMents.payableFee - this.payMents.paidFee).toFixed(2)
                if (this.payments.length <= 0) {
                    this.payments.push({fee: payMoney, payChannelId: undefined, type: 0});
                } else {
                    this.payments.push({fee: 0, payChannelId: undefined, type: 0});
                }
            },
            deletePayMent(index) {
                this.payments.splice(index, 1);
            },
            addDeposit() {
                this.deposit = true;
            },
            deleteDeposit() {
                this.deposit = false;
            },
            payMoney() {
                let businessJson = {};
                if (this.cashierType === 'checkIn') {
                    businessJson.functionType = 1;
                    businessJson.orderId = this.order.orderId;
                    businessJson.type = 0;
                    businessJson.rooms = this.checkInRooms.roomOrderInfoList;
                }
                if (this.payments.length > 0) {
                    this.payments.forEach(item => {
                        this.payChannels.forEach(channel => {
                            if (item.payChannelId === channel.channelId) {
                                item.payChannel = channel.name;
                            }
                        });
                    });
                }
                let params = {orderId: this.order.orderId, orderType: -1, payments: JSON.stringify(this.payments), businessJson: JSON.stringify(businessJson)};
                AJAXService.ajaxWithToken('GET', '/order/addOrderPayment', params)
                        .then(result => {
                            if(result.code !== 1) {
                                modal.somethingAlert(result.msg);
                            } else {
                                $("#Cashier").modal("hide");
                            }
                        });
            }
        },
        components: {
            DdSelect,
            DdOption
        }
    }
</script>

<template>
    <div>
        <div class="modal fade roomModals" id="Cashier" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <span class="header-text">收银台</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="roomModals-body">
                        <div class="content-item">
                            <p class="content-item-title"><span>订单收款</span></p>
                            <div class="cashier-order-item">
                                <span class="cashier-money-text">订单金额:<span>{{`¥${payMents.payableFee}`}}</span></span>
                                <span class="cashier-money-text" v-if="payMents.penalty && payMents.penalty > 0">违约金:<span>{{`¥${payMents.penalty}`}}</span></span>
                                <span class="cashier-money-text">已付金额:<span>{{`¥${payMents.paidFee}`}}</span></span>
                                <span class="cashier-money-text">需补金额:<span>{{`¥${(payMents.payableFee - payMents.paidFee).toFixed(2)}`}}</span></span>
                            </div>
                            <div class="cashier-getMoney-container">
                                <div class="cashier-getMoney-channels" v-if="payments.length > 0">
                                    <div class="cashier-getMoney-channel" v-for="(payment, index) in payments">
                                        <span>金额:</span>
                                        <input type="text" class="dd-input" v-model="payment.fee">
                                        <span style="margin-left: 24px">收款方式:</span>
                                        <input type="text" class="dd-input">
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
                                    <input type="text" class="dd-input">
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
                        <div class="dd-btn dd-btn-primary">完成</div>
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
            }
        },
        data(){
            return{
                payments: [],
                deposit: false
            }
        },
        computed:{},
        methods: {
            resetData() {
                this.payments = [];
                this.deposit = false;
            },
            getData() {
                AJAXService.ajaxWithToken('GET', '', {});
            },
            hideModal() {
                this.resetData();
                $('#Cashier').modal('hide');
            },
            addPayMent() {
                let payMoney = (this.payMents.payableFee - this.payMents.paidFee).toFixed(2)
                if (this.payments.length <= 0) {
                    this.payments.push({fee: payMoney, payChannelId: 5, type: 0});
                } else {
                    this.payments.push({fee: 0, payChannelId: 5, type: 0});
                }
            },
            deletePayMent(index) {
                this.payments.splice(index, 1);
            },
            addDeposit() {
                this.deposit = true;
            },
            deleteDeposit(e) {
                e.stopPropagation();
                this.deposit = false;
            }
        },
        components: {
            DdSelect,
            DdOption
        }
    }
</script>

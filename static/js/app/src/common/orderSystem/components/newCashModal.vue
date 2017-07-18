<template>
    <div>
        <div class="modal fade roomModals" id="cashier" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <span class="header-text">收银台</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="roomModals-body" v-if='orderPayment'>
                        <div class="content-item">
                            <p class="content-item-title"><span>订单信息</span></p>
                            <div class="cashier-order-item" v-if='orderPayment.need'>
                                <div>
                                    <span class="cashier-money-text">订单金额:<span>¥{{(type === 'cancel' || !orderPayment.need) ? 0 : orderPayment.need.total}}</span></span>
                                    <span class="cashier-money-text" v-if="orderPayment.need.penalty">违约金:<span>¥{{orderPayment.need.penalty}}</span></span>
                                </div>
                                <div>
                                    <span class="cashier-money-text" v-if='orderPayment.paid.game'>星球币已抵扣:<span>¥{{orderPayment.paid.game}}</span></span>
                                    <span class="cashier-money-text" v-if='orderPayment.paid.balance'>余额已抵扣:<span>¥{{orderPayment.paid.balance}}</span></span>
                                    <span class="cashier-money-text">现金已收:<span>¥{{ orderPayment.paid.normal }}</span></span>
                                </div>
                                <!-- <span class="cashier-money-text">已收金额:<span>¥{{ paiedMoney }}</span></span> -->
                                <!-- <span class="cashier-money-text">{{orderState ? '需补金额:' : '需退金额:'}}<span>¥{{ notPay }}</span></span> -->
                            </div>
                        </div>
                        <div class="content-item" v-if='orderPayment.game'>
                            <p class="content-item-title"><span>星球币抵扣<div>
                                        <span class="company-origin-tipImg"></span>
                                <div class="company-origin-tips">
                                    最多可抵扣¥1000元
                                </div>
                        </div>
                        </span>
                        </p>
                        <div class="cashier-order-item" v-for='ga in orderPayment.game'>
                            <dd-select v-model="ga.type " @change='changeAbeldFee'>
                                <dd-option v-for="way in getOrReturn" :key="way.val" :value="way.val" :label="way.name" :title='way.name'>
                                </dd-option>
                            </dd-select>
                            <span class="cashier-tip-text" v-if='ga.type === 0'>
                                账户共{{ga.lastFee}}个星球币，本次最多可使用{{ga.ableNum}}个
                                </span>
                            <span class="cashier-tip-text" v-if='ga.type === 2'>
                                已收取{{ga.paidNum}}个
                                </span>
                            <span>本次{{ga.type === 0 ? '使用' : '退还'}}： <inputVaild v-model='ga.fee' :max='ga.ableNum' :isInt=true @input='changeAbeldFee' v-if='ga.type === 0'/>
                            <inputVaild v-model='ga.fee' :max='ga.paidNum' :min='ga.paidNum' :isInt=true @input='changeAbeldFee' v-if='ga.type === 2'/>个</span>
                            <span class="cashier-tip-text">
                                抵扣￥{{ga.fee * ga.rate}}
                                </span>
                        </div>
                    </div>
                    <div class="content-item" v-if='orderPayment.company'>
                        <p class="content-item-title"><span>企业余额抵扣<div>
                                        <span class="company-origin-tipImg"></span>
                            <div class="company-origin-tips">
                                最多可抵扣¥1000元
                            </div>
                    </div>
                    </span>
                    </p>
                    <div class="cashier-order-item" v-for='co in orderPayment.company'>
                        <dd-select v-model="co.type" @change='changeAbeldFee'>
                            <dd-option v-for="way in getOrReturn" :key="way.val" :value="way.val" :label="way.name" :title='way.name'>
                            </dd-option>
                        </dd-select>
                        <span v-if='co.type === 0' class="cashier-tip-text">余额¥{{co.lastFee}}，最多可收取¥{{co.ableFee}}</span>
                        <span v-if='co.type === 2' class="cashier-tip-text">已收取¥{{co.paidFee}}</span> 本次{{co.type === 0 ? '收取' : '退还'}}：
                        <inputVaild v-model='co.fee' :max='co.ableFee' @input='changeAbeldFee' v-if='co.type === 0' />
                        <inputVaild v-model='co.fee' :max='co.paidFee' :min='co.paidFee' @input='changeAbeldFee' v-if='co.type === 2' />
                    </div>
                </div>
                <div class="content-item" v-if='orderPayment.member'>
                    <p class="content-item-title"><span>会员余额抵扣<div>
                                        <span class="company-origin-tipImg"></span>
                        <div class="company-origin-tips">
                            最多可抵扣¥1000元
                        </div>
                </div>
                </span>
                </p>
                <div class="cashier-order-item" v-for='me in orderPayment.member'>
                    <dd-select v-model="me.type " @change='changeAbeldFee'>
                        <dd-option v-for="way in getOrReturn" :key="way.val" :value="way.val" :label="way.name" :title='way.name'>
                        </dd-option>
                    </dd-select>
                    <span v-if='me.type === 0' class="cashier-tip-text">余额¥{{me.lastFee}}，最多可收取¥{{me.ableFee}}</span>
                    <span v-if='me.type === 2'>已收取¥{{me.paidFee}}</span> 本次{{me.type === 0 ? '收取' : '退还'}}：
                    <inputVaild @input='changeAbeldFee' v-model='me.fee' :max='me.ableFee' v-if='me.type === 0' />
                    <inputVaild @input='changeAbeldFee' v-model='me.fee' :max='me.paidFee' :min='me.paidFee' v-if='me.type === 2' />
                </div>
            </div>
            <div class="content-item" v-if='orderPayment.card'>
                <p class="content-item-title"><span>会员卡余额抵扣</span></p>
                <div class="reaminder-getMoney-container">
                    <div class="reaminder-getMoney-channels">
                        <div class="cashier-getMoney-channel" v-for="(payment, index) in paycard" :key="payment.accountId">
                            <dd-select v-model="payment.type " @change='changeAbeldFee'>
                                <dd-option v-for="way in getOrReturn" :key="way.val" :value="way.val" :label="way.name" :title='way.name'>
                                </dd-option>
                            </dd-select>
                            <dd-select class='reaminder-mr20' v-model='payment.accountId' @input='changeAbeldFee'>
                                <dd-option v-for="payChannel in getSelect(index)" :key="payChannel.accountId" :value="payChannel.accountId" :label="payChannel.accountName + payChannel.accountId">
                                    <span :title='payChannel.accountId'>{{payChannel.accountName + payChannel.accountId}}</span>
                                </dd-option>
                            </dd-select>
                            <span v-if='payment.type === 0' class="cashier-tip-text">余额¥{{getCardLastFee(payment.accountId)}}，最多可收取¥{{payment.ableFee || 0}}</span>
                            <span v-if='payment.type === 2'>已收取¥{{getCardPaied(payment.accountId)}}</span> 本次{{payment.type === 0 ? '收取' : '退还'}}：
                            <inputVaild v-model="payment.fee" :max='payment.ableFee' @input='changeAbeldFee' v-if='payment.type === 0' />
                            <inputVaild v-model="payment.fee" :min='getCardPaied(payment.accountId)' @input='changeAbeldFee' :max='getCardPaied(payment.accountId)' v-else/>
                            <span class="cashier-delBtn-icon" @click="deleteCard(index)"></span>
                        </div>
                    </div>
                    <div>
                        <div class="cashier-addBtn" @click="addPayCard" v-if='paycard.length < orderPayment.card.length'>
                            <span class="cashier-addBtn-icon"></span>
                            <span style="cursor: pointer">
                            添加会员卡余额抵扣</span>
                        </div>
                        <div class="reaminder-addBtn" v-else>卡已用完</div>
                    </div>
                </div>
            </div>
            <div class="content-item">
                <p class="content-item-title"><span>现金收款</span></p>
                <div class="cashier-getMoney-channels" v-if="payments.length > 0">
                    <div class="cashier-getMoney-channel" v-for="(payment, index) in payments" :key="payment.uniqueId">
                        <dd-select v-model="payment.type">
                            <dd-option v-for="way in getOrReturn" :key="way.val" :value="way.val" :label="way.name" :title='way.name'>
                            </dd-option>
                        </dd-select>
                        <span style="margin-left: 24px">{{orderState ? '收款' : '退款'}}方式:</span>
                        <dd-select v-model="payment.payChannelId">
                            <dd-option v-for="payChannel in getPayChannels(index)" :key="payChannel.channelId" :value="payChannel.channelId" :label="payChannel.name" :title='payChannel.name'>
                            </dd-option>
                        </dd-select>
                        <span>金额:</span>
                        <inputVaild v-model="payment.fee" />
                        <span class="cashier-delBtn-icon" @click="deletePayMent(index)"></span>
                    </div>
                </div>
                <div class="cashier-addBtn" @click="addPayMent">
                    <span class="cashier-addBtn-icon"></span>
                    <span style="cursor: pointer">添加{{orderState ? '收款' : '退款'}}</span>
                </div>
            </div>
            <div class="content-item">
                <div class="cashier-all">
                    <div><span>本次应收:</span><span>¥{{orderPayment.price}}</span></div>
                    <div><span>星球币抵扣:</span><span>¥{{gameTotal}}</span></div>
                    <div><span>会员余额抵扣:</span><span>¥{{memberTotal}}</span></div>
                    <div><span>企业余额抵扣:</span><span>¥{{companyTotal}}</span></div>
                    <div><span>会员卡余额抵扣:</span><span>¥{{cardsTotal}}</span></div>
                    <div><span>现金收款:</span><span>¥{{cashTotal}}</span></div>
                    <div><span>还需收款:</span><span>¥{{needPayed}}</span></div>
                </div>
            </div>
        </div>
        <div class="roomModals-footer">
            <div class="dd-btn dd-btn-primary" @click="back" v-if='remainderDate' style="margin-right:20px;">上一步</div>
            <div @click="returnPreStep" v-else class="btn-back"><img src="/static/image/modal/back.png" alt=""></div>
            <!--                             <span class="footer-label">
                                {{orderState ? '需补金额:' : '需退金额:'}}
                                <span class="order-price-num" :class="orderState ? 'green' : 'red'">
                                    ¥{{ notPay }}
                                </span>
                            </span>
                            <span class="footer-label">
                                {{orderState ? '还需补款:' : '还需退款:'}}
                                <span class="order-price-num red" >
                                    ¥{{ needPayed }}
                                </span>
                            </span> -->
            <div class="dd-btn dd-btn-primary" @click="payMoney">完成</div>
        </div>
    </div>
    </div>
    </div>
    </div>
</template>
<style lang="scss" scoped>
#cashier .modal-dialog {
    width: 820px;
}

.cashier-all {
    width: 210px;
    float: right;
    & > div {
        display: flex;
        justify-content: space-between;
        color: #999;
        &:first-child {
            color: #666;
        }
        &:last-child {
            color: #666;
            font-weigth: bold;
        }
    }
    ;
}

.cashier-tip-text {
    font-size: 14px;
    color: #999999;
    line-height: 14px;
}

.cashier-money-text {
    margin-right: 24px;
}

.cashier-order-item {
    margin-top: 16px;
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

.content-item-title {
    margin-bottom: 0;
    span {
        & > div {
            position: relative;
            display: inline-block;
            .company-origin-tips {
                width: 175px;
                bottom: 20px;
                right: inherit;
            }
        }
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
    background: url("../../../../../../image/modal/room_modal_add.png");
    background-size: contain;
    margin-right: 4px;
    cursor: pointer;
}

.cashier-delBtn-icon {
    width: 16px;
    height: 16px;
    background: url("../../../../../../image/modal/room_modal_min.png");
    background-size: contain;
    margin-left: 8px;
    margin-right: 24px;
    cursor: pointer;
}
</style>
<script>
import {
    DdSelect,
    DdOption
} from 'dd-vue-component';
import http from 'http';
import modal from 'modal';
import {
    mapState
} from 'vuex';
import inputVaild from '../../components/inputVaild.vue';
import bus from '../../eventBus';
import {
    getOrderId
} from '../utils/order';
export default {
    props: {
        type: {
            type: String,
            default: '' // 该界面的跳转来源界面类型
        },
        business: {
            type: Object,
            default: function() {
                return {};
            }
        },
        show: {
            type: Boolean
        }
    },
    data() {
        return {
            // showDeposit: false,
            cashier: [],
            getOrReturn: [{
                val: 0,
                name: '收取'
            }, {
                val: 2,
                name: '退还'
            }],
            payments: [],
            deleteIds: [],
            paylogs: [],
            payChannels: [],
            // depositPayChannels: [],
            // depositPayChannel: undefined,
            // deposit: undefined,
            orderPayment: {},
            uniqueId: 0,
            isCompany: false,
            companyCityLedger: false,
            companyBalance: undefined,
            paiedMoney: 0,
            onePassAmount: 0,
            companyAmount: 0,
            ReaminderParams: {}, // 余额付款传来的参数,
            ramainShow: false,
            remainderDate: undefined,
            companyName: '',
            paycard: [],
            cardList: []

        };
    },
    computed: {
        ...mapState({
            orderDetail: state => state.orderSystem.orderDetail,
            roomBusinessInfo: state => state.orderSystem.roomBusinessInfo
        }),
        orderState() {
            if (this.type === 'collect') {
                return true;
                // 收银就只有收款
            }
            if (this.orderPayment) {
                const income = (this.type === 'cancel' ? 0 : this.orderPayment.payableFee) + this.penalty - Number(this.paiedMoney);
                return income >= 0;
            }
            return false;
        },
        gameTotal() {
            let sum = 0
            if (this.orderPayment && this.orderPayment.game && this.orderPayment.game.length) {
                this.orderPayment.game.forEach(el => {
                    if (el.type == 0) {
                        sum += (el.fee * el.rate || 0)
                    } else {
                        sum -= (el.fee * el.rate || 0)
                    }
                })
            }
            return sum
        },
        memberTotal() {
            let sum = 0
            if (this.orderPayment && this.orderPayment.member && this.orderPayment.member.length) {
                this.orderPayment.member.forEach(el => {
                    if (el.type == 0) {
                        sum += (el.fee || 0)
                    } else {
                        sum -= (el.fee || 0)
                    }
                })
            }
            return sum
        },
        companyTotal() {
            let sum = 0
            if (this.orderPayment && this.orderPayment.company && this.orderPayment.company.length) {
                this.orderPayment.company.forEach(el => {
                    if (el.type == 0) {
                        sum += (el.fee || 0)
                    } else {
                        sum -= (el.fee || 0)
                    }
                })
            }
            return sum
        },
        cardsTotal() {
            let sum = 0
            if (this.paycard && this.paycard.length) {
                this.paycard.forEach(el => {
                    if (el.type == 0) {
                        sum += (el.fee || 0)
                    } else {
                        sum -= (el.fee || 0)
                    }
                })
            }
            return sum
        },
        cashTotal() {
            let sum = 0
            if (this.payments && this.payments.length) {
                this.payments.forEach(el => {
                    if (el.type == 0) {
                        sum += (el.fee || 0)
                    } else {
                        sum -= (el.fee || 0)
                    }
                })
            }
            return sum
        },
        // totalDeposit() {
        //     return Number((this.deposit || 0).toFixed(2));
        // },
        penalty() {
            return (this.orderPayment.penalty || 0);
        },
        // appearDeposit() {
        //     const type = this.type;
        //     const cashierType = this.business.cashierType;
        //     const deposit = this.totalDeposit;
        //     return (type === 'checkIn' || cashierType === 'ing' || deposit !== 0);
        // },
        notPay() { // 需补或或需退金额
            const payMoney = ((this.type === 'cancel' ? 0 : this.orderPayment.payableFee) - Number(this.paiedMoney) + this.penalty).toFixed(2);
            if (this.type === 'collect') {
                return Number(payMoney).toFixed(2);
            }
            return Math.abs(Number(payMoney).toFixed(2));
        },
        needPayed() {
            return this.orderPayment.price - (this.cashTotal || 0) - (this.companyTotal || 0) - (this.memberTotal || 0) - (this.gameTotal || 0) - (this.cardsTotal || 0)
        }
    },
    created() {
        // this.getData();
    },
    watch: {
        show(val) {
            if (val) {
                // this.getRemainder();
                this.cashierShow()
            } else {
                $('#cashier').modal('hide');
            }
        },
    },
    methods: {
        getCardLastFee(id) {
            const selectCard = this.cardList.find(cards => cards.accountId === id);
            if (selectCard) {
                return selectCard.lastFee
            }
            return 0
        },
        getCardPaied(id) {
            const selectCard = this.cardList.find(cards => cards.accountId === id);
            if (selectCard) {
                return selectCard.paidFee
            }
            return 0
        },
        changeAbeldFee() {
            let needPay = this.orderPayment.price;
            // 首先统计出所有要退还的
            if (this.orderPayment && this.orderPayment.game && this.orderPayment.game.length) {
                this.orderPayment.game.forEach(el => {
                    if (el.type === 2 && el.fee) {
                        needPay = needPay + el.fee * el.rate;
                    }
                });
            }
            if (this.orderPayment && this.orderPayment.member && this.orderPayment.member.length) {
                this.orderPayment.member.forEach(el => {
                    if (el.type === 2 && el.fee) {
                        needPay = needPay + el.fee;
                    }
                });
            }
            // 会员余额
            if (this.orderPayment && this.orderPayment.card && this.orderPayment.card.length) {
                this.paycard.length && this.paycard.forEach(card => {
                    if (card.accountId) {
                        if (card.type === 2 && card.fee) {
                            needPay = needPay + card.fee;
                        }
                    }
                });
            }
            // 会员卡
            if (this.orderPayment && this.orderPayment.company && this.orderPayment.company.length) {
                this.orderPayment.company.forEach(el => {
                    if (el.type === 2 && el.fee) {
                        needPay = needPay + el.fee;
                    }
                });
            }
            // 然后去分别俺优先级收取
            if (this.orderPayment && this.orderPayment.game && this.orderPayment.game.length) {
                this.orderPayment.game.forEach(el => {
                    if (el.type === 0) {
                        const abelFee = Math.min(needPay, el.lastFee);
                        const payed = Math.min(abelFee / el.rate, el.fee);
                        el.ableNum = parseInt(abelFee / el.rate);
                        el.fee = parseInt(payed);
                        needPay = needPay - payed * el.rate;
                    }
                });
            }
            // 优先虚拟币
            if (this.orderPayment && this.orderPayment.member && this.orderPayment.member.length) {
                this.orderPayment.member.forEach(el => {
                    if (el.type === 0) {
                        const abelFee = Math.min(needPay, el.lastFee);
                        const payed = Math.min(abelFee, el.fee);
                        el.ableFee = abelFee;
                        el.fee = payed;
                        needPay = needPay - payed;
                    }
                });
            }
            // 会员余额
            if (this.orderPayment && this.orderPayment.card && this.orderPayment.card.length) {
                this.paycard.length && this.paycard.forEach(card => {
                    if (card.accountId) {
                        const selectCard = this.cardList.find(cards => cards.accountId === card.accountId);
                        if (card.type === 0) {
                            const abelFee = Math.min(needPay, selectCard.lastFee);
                            const payed = Math.min(abelFee, card.fee);
                            card.ableFee = abelFee;
                            card.fee = payed;
                            needPay = needPay - payed;
                        }
                    }
                });
            }
            // 会员卡
            if (this.orderPayment && this.orderPayment.company && this.orderPayment.company.length) {
                this.orderPayment.company.forEach(el => {
                    if (el.type === 0) {
                        const abelFee = Math.min(needPay, el.lastFee);
                        const payed = Math.min(abelFee, el.fee);
                        el.ableFee = abelFee;
                        el.fee = payed;
                        needPay = needPay - payed;
                    }
                });
            }
            // 企业余额
            // this.orderPayment.price = needPay
        },
        returnPreStep() {
            this.hideModal();
            bus.$emit('back');
        },
        // getReaminderParams(params) {
        //     if (params) {
        //         this.ReaminderParams = {};
        //         this.ReaminderParams.params = params.paycard;
        //         this.ReaminderParams.type = params.type;
        //         this.ReaminderParams.total = params.payTotal;
        //     } else {
        //         this.ReaminderParams = undefined;
        //     }
        //     this.ramainShow = false;
        //     this.cashierShow();
        // },
        hideReaminder() {
            this.ramainShow = false;
            this.hideModal();
        },
        back() {
            $('#cashier').modal('hide');
            this.ramainShow = true;
        },
        getpParms(flag) {
            let params;
            if (this.type === 'register') {
                params = {
                    orderId: this.business.orderDetail.orderId,
                    orderType: this.business.orderDetail.orderType
                };
            } else {
                let operationType;
                let penalty; // eslint-disable-line
                if (this.type === 'checkOut') {
                    operationType = 1;
                }
                if (this.type === 'cancel') {
                    operationType = 4;
                }
                const orderId = getOrderId(this.orderDetail);
                const subOrderIds = [];
                if (this.roomBusinessInfo.roomOrderInfoList &&
                    this.type !== 'orderDetail' &&
                    this.type !== 'cancel' && this.type !== 'resetOrder' && this.type !== 'collect') {
                    this.roomBusinessInfo.roomOrderInfoList.forEach(item => {
                        if (item.selected) {
                            subOrderIds.push(item.roomOrderId);
                        }
                    });
                }
                params = {
                    // -1-大订单 0-餐饮 1-娱乐 2-商超 3-住宿
                    orderType: this.orderDetail.type,
                    // 住宿业务使用
                    subOrderIds: JSON.stringify(subOrderIds),
                    // required = false 1= 提前退房 2 = 关联订单下单 3=办理入住
                    operationType,
                    orderId
                };
            }
            return params;
        },
        getRemainder() {
            let params = this.getpParms();
            if (this.business.PenaltyFee && this.business.penalty) {
                params.balancePenaltyBtn = true;
                params.penalty = this.business.penalty;
            }
            if (this.business.todayFeeMap) {
                params.todayFeeMap = this.business.todayFeeMap;
            }
            // 今日房费
            if (this.type === 'collect') {
                params.isSettle = false;
                // 收银的时候传false
                this.remainderDate = undefined;
                this.cashierShow();
                return;
            }
            // 如果是结算就只弹出收银台
            http.get('/order/getBalancePayment', params).then(res => {
                if (res.data.balancePay) {
                    // this.getOrderPayment().then(() => {
                    //     this.ramainShow = true;
                    //     this.remainderDate = res.data.balancePay;
                    // });
                    this.ramainShow = true;
                    this.remainderDate = res.data.balancePay;
                } else {
                    this.remainderDate = undefined;
                    this.cashierShow();
                }
            });
        },
        cashierShow() {
            const params = {
                type: 1
            };
            if (this.type === 'register') {
                params.orderId = this.business.orderDetail.orderId;
                params.orderType = this.business.orderDetail.orderType;
            } else {
                params.orderId = getOrderId(this.orderDetail);
                params.orderType = this.orderDetail.type;
                if (this.type === 'collect') {
                    params.origin = 2;
                }
                if (this.type === 'orderDetail') {
                    params.origin = 3;
                }
            }
            Promise.all([this.getOrderPayment(), this.getChannels(params)]).then(() => {
                if (!this.orderState) {
                    this.payChannels = this.payChannels.filter(function(element) {
                        return (element.channelId !== -6 && element.channelId !== -7 && element.channelId !== -11 && element.channelId !== -12);
                    });
                }
                // 退款没有支付宝和微信
                if (this.orderState && this.isCompany && this.companyCityLedger) {
                    this.payChannels = [{
                        channelId: -14,
                        name: `企业挂帐(${this.companyName || ''})`
                    }, {
                        channelId: -15,
                        name: `企业扣款(${this.companyName || ''})`
                    }].concat(this.payChannels);
                } else if (this.orderState && this.isCompany && !this.companyCityLedger) {
                    this.payChannels = [{
                        channelId: -15,
                        name: `企业扣款(${this.companyName || ''})`
                    }].concat(this.payChannels);
                } else if (!this.orderState && this.companyCityLedger) {
                    this.payChannels = [{
                        channelId: -15,
                        name: `退款至企业(${this.companyName || ''})`
                    }].concat(this.payChannels);
                }
                $('#cashier').modal({
                    backdrop: 'static'
                });
            });
        },
        resetData() {
            this.payments = [];
            // this.showDeposit = false;
            // this.deposit = undefined;
            // this.depositPayChannel = undefined;
            this.isCompany = false;
            this.companyCityLedger = false;
            this.companyBalance = undefined;
            this.deleteIds = [];
            this.ReaminderParams = {}; // 余额参数,
            this.ramainShow = false;
            this.remainderDate = undefined;
            // this.business = {};
        },
        getPayChannels(index) {
            // this.type === 'register' && this.business.cashierType === 'finish') 补录
            // if (!this.orderState) {
            //     return this.depositPayChannels;
            // }
            if (this.payments.length <= 1) {
                return this.payChannels;
            } else {
                let own = false; // 判断是否已存在订单钱包的支付方式
                let arr = this.payChannels;
                this.payments.forEach((pay, num) => {
                    const id = pay.payChannelId;
                    if ((id === -6 || id === -7 || id === -11 || id === -12) && (num !== index)) {
                        own = true;
                    }
                });
                if (own) {
                    arr = this.payChannels.filter(item => {
                        const index = item.channelId;
                        return index !== -6 && index !== -7 && index !== -11 && index !== -12;
                    });
                }
                return arr;
            }
        },
        getOrderPayment() {
            const params = this.getpParms();
            // if (this.business.PenaltyFee) {
            params.penalty = this.business.penalty;
            // }
            if (this.business.todayFeeMap) {
                params.todayFeeMap = this.business.todayFeeMap;
            }
            if (this.type === 'collect') {
                params.isSettle = false;
            }
            // 今日房费
            // return http.get('/order/getOrderPayment', params)
            //     .then(res => {
            //         this.orderPayment = res.data;
            //         const paiedFee = this.orderPayment.paid.balance + this.orderPayment.paid.game + this.orderPayment.paid.normal;
            //         this.onePassAmount = res.data.onePassAmount || 0;
            //         this.companyAmount = res.data.companyAmount || 0;
            //         this.paiedMoney = paiedFee.toFixed(2);
            //     });
            return http.get('/room/getTips')
                .then(res => {
                    res.data = {
                        card: [{
                            ableFee: 8900,
                            cards: [{
                                accountId: 123,
                                accountName: '123123',
                                lastFee: 6000,
                                paidFee: 100
                            }],
                            paidFee: 100,
                            type: 0
                        }, {
                            ableFee: 8900,
                            cards: [{
                                accountId: 12323123,
                                accountName: 'ass2123123',
                                lastFee: 5000,
                                paidFee: 0
                            }],
                            paidFee: 0,
                            type: 0
                        }],
                        company: [{
                            ableFee: 8900,
                            accountId: 22222,
                            accountName: '23123',
                            lastFee: 2000,
                            paidFee: 400,
                            type: 2
                        }, {
                            ableFee: 8900,
                            accountId: 33333,
                            accountName: '23123',
                            lastFee: 3000,
                            paidFee: 0,
                            type: 0
                        }],
                        dateTime: new Date().getMilliseconds(),
                        game: [{
                            ableFee: 9000,
                            ableNum: 900,
                            accountId: 22222,
                            accountName: '1231234',
                            lastFee: 9000,
                            paidFee: 0,
                            paidNum: 0,
                            rate: 10,
                            type: 0
                        }],
                        member: [{
                            ableFee: 8900,
                            accountId: 123123,
                            accountName: 'sadasd',
                            lastFee: 2000,
                            paidFee: 0,
                            type: 0
                        }],
                        need: {
                            penalty: 2000,
                            total: 10000
                        },
                        paid: {
                            balance: 1000,
                            game: 1000,
                            normal: 1000
                        },
                        price: 9900
                    };
                    this.orderPayment = res.data;
                    this.orderPayment.game && this.orderPayment.game.forEach(el => {
                        this.$set(el, 'fee', 0);
                    });
                    this.orderPayment.card && this.orderPayment.card.forEach(el => {
                        this.$set(el, 'fee', 0);
                        el.cards.forEach(card => this.$set(card, 'fee', Math.min(card.lastFee, el.ableFee)));
                    });
                    this.orderPayment.company && this.orderPayment.company.forEach(el => {
                        this.$set(el, 'fee', 0);
                    });
                    this.orderPayment.member && this.orderPayment.member.forEach(el => {
                        this.$set(el, 'fee', 0);
                    });
                    const paiedFee = this.orderPayment.paid.balance + this.orderPayment.paid.game + this.orderPayment.paid.normal;
                    this.onePassAmount = res.data.onePassAmount || 0;
                    this.companyAmount = res.data.companyAmount || 0;
                    this.paiedMoney = paiedFee.toFixed(2);
                    const cardHash = {};
                    const cardList = [];
                    res.data.card.forEach(element => {
                        element.cards.forEach(el => {
                            if (!cardHash[el.accountId]) {
                                cardList.push(el);
                                cardHash[el.accountId] = true;
                            }
                        });
                    });
                    this.cardList = cardList;
                });
        },
        getChannels(params) {
            return http.get('/user/getChannels', params)
                .then(res => {
                    const channels = res.data.list;
                    channels.forEach(channel => {
                        channel.channelId = channel.id;
                    });
                    channels.sort((a, b) => {
                        return a.channelId - b.channelId;
                    });
                    this.payChannels = channels;
                    this.companyName = res.data.companyName;
                    // this.depositPayChannels = channels.filter(channel => {
                    //     return channel.channelId > 0;
                    // });
                    this.isCompany = !!res.data.contractCompany;
                    this.companyCityLedger = res.data.contractCompany ? res.data.contractCompany.companyCityLedger : false;
                    this.companyBalance = res.data.contractCompany ? res.data.contractCompany.companyBalance : undefined;
                });
        },
        getSelect(index) {
            // const serialNum = this.paycard[index].serialNum;
            const paycard = this.paycard;
            const selectCards = this.cardList.filter(function(item) {
                return !paycard.filter(function(it) {
                    return it.accountId === item.accountId;
                }).length || item.accountId === paycard[index].accountId;
            });
            return selectCards;
        },
        deletePayMent(index) {
            this.payments.splice(index, 1);
            this.changeAbeldFee();
        },
        deleteCard(index) {
            this.paycard.splice(index, 1);
            this.changeAbeldFee();
        },
        hideModal() {
            this.resetData();
            if (this.type === 'register') {
                const params = {
                    orderId: this.business.orderDetail.orderId,
                    orderType: this.business.orderDetail.orderType
                };
                http.get('/order/cancel', params)
                    .then(res => {
                        this.$emit('hide');
                        bus.$emit('hideCashier');
                        $('#cashier').modal('hide');
                    });
            } else {
                bus.$emit('hideCashier');
                $('#cashier').modal('hide');
            }
        },
        addPayMent() {
            const collectPayMany = ((this.type === 'cancel' ? 0 : this.orderPayment.payableFee) - Number(this.paiedMoney) + this.penalty).toFixed(2);
            const payMoney = Math.abs(collectPayMany);
            let paidMoney = 0;
            if (this.payments.length > 0) {
                this.payments.forEach(pay => {
                    paidMoney += Number(pay.fee);
                });
            }
            this.uniqueId += 1;
            const fee = this.type === 'collect' ? (collectPayMany - Number(paidMoney)).toFixed(2) > 0 ? (collectPayMany - Number(paidMoney)).toFixed(2) : 0 : Math.abs(Number((payMoney - Number(paidMoney)).toFixed(2)))
            this.payments.push({
                fee: fee,
                payChannelId: undefined,
                type: this.orderState ? 0 : 2,
                uniqueId: this.uniqueId
            });
        },
        addPayCard() {
            this.paycard.push({
                type: 0,
                accountId: undefined,
                ableFee: 0,
                paidFee: 0,
                lastFee: 0,
                fee: 0
            });
        },
        deletePayMent(index) {
            this.payments.splice(index, 1);
        },
        deletePayLog(index) {
            const log = this.paylogs[index];
            if (log['payChannelId'] === -15) { // 支付方式为企业挂帐，删除后企业账户余额要变化
                if (log.type === 2 && Number(this.companyAmount) - log.fee < 0) {
                    modal.warn('该企业账户余额不足');
                    return false;
                }
                this.companyAmount = (Number(this.companyAmount) + (log.type === 0 ? Number(log.fee) : Number(-log.fee))).toFixed(2);
                this.companyBalance = (Number(this.companyBalance) + (log.type === 0 ? Number(log.fee) : Number(-log.fee))).toFixed(2);
            }
            if (log['payChannelId'] === -10) { // 支付方式为一码通，删除后一码通余额要变化
                if (log.type === 2 && Number(this.onePassAmount) - log.fee < 0) {
                    modal.warn('该一码通账户余额不足');
                    return false;
                }
                this.onePassAmount = (Number(this.onePassAmount) + (log.type === 0 ? Number(log.fee) : Number(-log.fee))).toFixed(2);
            }
            this.paiedMoney = (Number(this.paiedMoney) + (log['type'] === 2 ? Number(log.fee) : Number(-log.fee))).toFixed(2);
            if (Number(this.paiedMoney) === this.orderPayment.payableFee) {
                this.$nextTick(() => {
                    this.payments = [];
                });
            }
            this.deleteIds.push(log['payId']);
            this.paylogs.splice(index, 1);
        },
        // addDeposit() {
        //     this.showDeposit = true;
        // },
        // deleteDeposit(e) {
        //     e.stopPropagation();
        //     this.deposit = undefined;
        //     this.depositPayChannel = undefined;
        //     this.showDeposit = false;
        // },
        vaild(max) {
            let value = event.target.value;
            if (Number(value) > Number(max)) {
                event.target.value = max;
            }
        },
        payMoney() {
            let invalid = false;
            let numvaild = false;
            if (this.payments.length > 0) {
                this.payments.forEach(payment => {
                    if (payment.fee < 0) {
                        numvaild = true;

                    }
                    if (!payment.payChannelId) {
                        invalid = true;
                    }
                });
            }
            if (numvaild) {
                modal.warn('请输入正确的金额');
                return false;
            }
            // if (this.deposit && !this.depositPayChannel) {
            //     invalid = true;
            // }
            if (invalid) {
                const loss = this.orderState;
                modal.warn(`请选择${loss ? '收款' : '退款'}方式！`);
                return false;
            }
            // 功能一次结清，现在改为允许多次收款
            const receiveMoney = this.payments.reduce((a, b) => {
                return a + Number(b.fee);
            }, 0);
            const shouldPayMoney = Math.abs((this.type === 'cancel' ? 0 : this.orderPayment.payableFee) - Number(this.paiedMoney) + this.penalty).toFixed(2);
            // 订单详情允许多次收银条件
            // const allowGetMoneyTimes = (this.type === 'orderDetail' && this.orderDetail.type !== -1);
            const allowGetMoneyTimes = (this.type === 'collect');
            if (Number(receiveMoney.toFixed(2)) !== Number(shouldPayMoney) && this.type !== 'resetOrder' && !allowGetMoneyTimes) {
                modal.warn('订单未结清，无法完成收银！');
                return false;
            }
            if (this.type === 'resetOrder') {
                this.payments.map(pay => {
                    pay.type = this.orderState ? 0 : 2;
                });
                const newReceiveMoney = this.payments.reduce((a, b) => {
                    return a + (b.type === 0 ? Number(b.fee) : Number(-b.fee));
                }, 0);
                const shouldReceiveMoney = this.orderPayment.payableFee + this.penalty;
                if (Number((Number(this.paiedMoney) + newReceiveMoney).toFixed(2)) !== Number(shouldReceiveMoney.toFixed(2))) {
                    modal.warn('订单未结清!');
                    return false;
                }
            }
            // const shouldDeposit = this.orderPayment.deposit - (this.orderPayment.refundDeposit || 0);
            // if (this.deposit > shouldDeposit && this.type !== 'checkIn' && this.type !== 'register') {
            //     modal.warn('退款押金无法大于已付押金！');
            //     return false;
            // }
            const payments = this.payments.map(payment => {
                const channel = this.payChannels.find(c => c.channelId === payment.payChannelId);
                return {
                    ...payment,
                    payChannel: channel.name
                };
            });

            // if (this.deposit) {
            //     const channel = this.depositPayChannels.find(c => c.channelId === this.depositPayChannel);

            //     payments.push({
            //         fee: this.deposit,
            //         payChannelId: this.depositPayChannel,
            //         payChannel: channel.name,
            //         type: (this.orderPayment.deposit > 0 && this.type !== 'checkIn') ? 3 : 1
            //     });
            // }

            let params;
            if (this.type === 'register') { // 直接入住
                params = {
                    orderId: this.business.orderDetail.orderId,
                    orderType: this.business.orderDetail.orderType,
                    payments: JSON.stringify(payments)
                };
            } else if (this.type === 'cancel') { // 取消订单
                const businessJson = {
                    functionType: this.business.functionType,
                    orderId: this.business.orderId,
                    orderType: this.business.orderType
                };
                if (this.business.subOrderPenaltys) {
                    businessJson.subOrderPenaltys = JSON.parse(this.business.subOrderPenaltys);
                } else if (this.business.penalty) {
                    payments.push({
                        fee: Number(this.business.penalty),
                        payChannelId: -5,
                        payChannel: '违约金',
                        type: 4
                    });
                    businessJson.payments = [{
                        fee: Number(this.business.penalty),
                        type: 4
                    }];
                }

                params = {
                    orderId: this.business.orderId,
                    orderType: this.business.orderType,
                    payments: JSON.stringify(payments),
                    businessJson: JSON.stringify(businessJson)
                };
                if (this.business.PenaltyFee) {
                    params.balancePenaltyBtn = true;
                }
            } else if (this.type === 'resetOrder') { // 反结账
                params = {
                    orderId: getOrderId(this.orderDetail),
                    orderType: this.orderDetail.type,
                    payments: JSON.stringify(payments),
                    deleteIds: JSON.stringify(this.deleteIds)
                };
            } else {
                // 普通结账 办理入住 办理退房
                params = {
                    orderId: getOrderId(this.orderDetail),
                    orderType: this.orderDetail.type,
                    payments: JSON.stringify(payments),
                    businessJson: JSON.stringify(this.business)
                };
                if (this.business.rooms) {
                    const subOrderIds = [];
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
            if (this.type === 'collect') {
                params.isSettle = false;
            }
            // if (this.type === 'orderDetail') {
            //     params.isSettle = true;
            // }
            // 判断是否进行扫码收款
            let payWithAlipay = 0;
            let payWithCompany = 0;
            this.payments.forEach(pay => {
                const id = pay.payChannelId;
                if (id === -6 || id === -7 || id === -11 || id === -12) {
                    payWithAlipay += Number(pay.fee);
                }
                if (id === -15) {
                    payWithCompany += Number(pay.fee);
                }
            });
            if (payWithCompany > 0 && (this.companyBalance ? this.companyBalance : 0) < payWithCompany) {
                const payStr = `企业余额不足（余额¥${this.companyBalance})，请选择其他支付方式`;
                modal.warn(payStr);
                return false;
            }
            if (this.ReaminderParams) {
                params.balancePay = JSON.stringify({
                    cards: this.ReaminderParams.params,
                    type: this.ReaminderParams.type
                });
            }
            if (payWithAlipay <= 0) {
                http.post('/order/addOrderPayment', params)
                    .then(result => {
                        modal.success('收银成功');
                        this.resetData();
                        bus.$emit('hideCashier');
                        $('#cashier').modal('hide');
                        bus.$emit('onShowDetail', {
                            type: params.orderType,
                            orderId: params.orderId
                        });
                        bus.$emit('refreshView');
                    });
            } else {
                this.resetData();
                bus.$emit('hideCashier');
                $('#cashier').modal('hide');
                bus.$emit('showGetMoney', {
                    type: this.type,
                    business: this.business,
                    params,
                    payWithAlipay: Number(payWithAlipay.toFixed(2))
                });
            }
        }
    },
    components: {
        DdSelect,
        DdOption,
        inputVaild
    }
};
</script>

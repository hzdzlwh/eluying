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
                                <span class="cashier-money-text">已付金额:<span>¥{{(orderPayment.paidFee - orderPayment.refundFee).toFixed(2)}}</span></span>
                                <span class="cashier-money-text">{{orderState ? '需补金额:' : '需退金额:'}}<span>¥{{Math.abs((type === 'cancel' ? 0 : orderPayment.payableFee) - (orderPayment.paidFee - orderPayment.refundFee) + penalty).toFixed(2)}}</span></span>
                            </div>
                            <div class="cashier-getMoney-container" v-if="type === 'resetOrder'">
                                <div class="cashier-getMoney-channels" style="padding-bottom: 16px" v-if="paylogs.length > 0">
                                    <div class="cashier-getMoney-channel" v-for="(log, index) in paylogs" :key="log.payId">
                                        <span>金额:</span>
                                        <input type="number" class="dd-input" :value="Math.abs(log.fee)" disabled />
                                        <span style="margin-left: 24px" :class="log.type === 0 ? 'green' : 'red'">{{log.type === 0 ? '收款' : '退款'}}方式:</span>
                                        <input type="text" class="dd-input" :value="log.payChannel" disabled />
                                        <span class="cashier-delBtn-icon" @click="deletePayLog(index)"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="cashier-getMoney-container">
                                <div class="cashier-getMoney-channels" v-if="payments.length > 0">
                                    <div class="cashier-getMoney-channel" v-for="(payment, index) in payments" :key="payment.uniqueId">
                                        <span>金额:</span>
                                        <input type="number" class="dd-input" v-model="payment.fee">
                                        <span style="margin-left: 24px">{{orderState ? '收款' : '退款'}}方式:</span>
                                        <dd-select v-model="payment.payChannelId" :placeholder="`请选择${orderState ? '收款' : '退款'}方式`">
                                            <dd-option v-for="payChannel in getPayChannels(index)" :key="payChannel.channelId" :value="payChannel.channelId" :label="payChannel.name">
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
                                        <dd-option v-for="payChannel in depositPayChannels" :key="payChannel.channelId" :value="payChannel.channelId" :label="payChannel.name">
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
                            <span class="footer-label">
                                {{orderState ? '需补金额:' : '需退金额:'}}
                                <span class="order-price-num" :class="orderState ? 'green' : 'red'">
                                    ¥{{Math.abs((type === 'cancel' ? 0 : orderPayment.payableFee) - (orderPayment.paidFee - orderPayment.refundFee) + penalty).toFixed(2)}}
                                </span>
                            </span>
                            <span v-if="totalDeposit != 0" class="footer-label">
                                {{(totalDeposit > 0 && type !== 'checkIn') ? '需退押金' : '需补押金'}}:
                                <span class="order-price-num" :class="(totalDeposit > 0 && type !== 'checkIn') ? 'red' : 'green'">
                                    ¥{{Math.abs(totalDeposit)}}
                                </span>
                            </span>
                        </div>
                        <div class="dd-btn dd-btn-primary" @click="payMoney">完成</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
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
    import http from 'http';
    import modal from 'modal';
    import { mapState } from 'vuex';
    import bus from '../../common/eventBus';
    import { getOrderId } from '../utils/order';
    export default{
        props: {
            type: {
                type: String,
                default: ''// 该界面的跳转来源界面类型
            },
            business: {
                type: Object,
                default: function() { return {}; }
            },
            show: {
                type: Boolean
            }
        },
        data() {
            return {
                showDeposit: false,
                payments: [],
                deleteIds: [],
                paylogs: [],
                payChannels: [],
                depositPayChannels: [],
                depositPayChannel: undefined,
                deposit: undefined,
                orderPayment: {},
                uniqueId: 0,
                isCompany: false,
                companyCityLedger: false,
                companyBalance: undefined
            };
        },
        computed: {
            ...mapState(['orderDetail', 'roomBusinessInfo']),
            orderState() {
                if (this.orderPayment) {
                    const income = (this.type === 'cancel' ? 0 : this.orderPayment.payableFee) + this.penalty - (this.orderPayment.paidFee - this.orderPayment.refundFee);
                    return income >= 0;
                }
                return false;
            },
            totalDeposit() {
                return Number((this.deposit || 0).toFixed(2));
            },
            penalty() {
                return (this.orderPayment.penalty || 0) + ((this.business && this.business.penalty) || 0);
            },
            appearDeposit() {
                const type = this.type;
                const cashierType = this.business.cashierType;
                const deposit = this.totalDeposit;
                return (type === 'checkIn' || cashierType === 'ing' || deposit !== 0);
            }
        },
        created() {
            // this.getData();
        },
        watch: {
            show(val) {
                if (val) {
                    const params = { type: 1 };
                    if (this.type === 'register') {
                        params.orderId = this.business.orderDetail.orderId;
                        params.orderType = this.business.orderDetail.orderType;
                    } else {
                        params.orderId = this.orderDetail.orderType === -1
                                         ? this.orderDetail.orderId
                                         : this.orderDetail.subOrderId;
                        params.orderType = this.orderDetail.orderType;
                    }
                    Promise.all([this.getOrderPayment(), this.getChannels(params)]).then(() => {
                        if (this.orderState && this.isCompany && this.companyCityLedger) {
                            this.payChannels = [{ channelId: -14, name: '企业挂帐' }, { channelId: -15, name: '企业扣款' }].concat(this.payChannels);
                        } else if (this.orderState && this.isCompany && !this.companyCityLedger) {
                            this.payChannels = [{ channelId: -15, name: '企业扣款' }].concat(this.payChannels);
                        } else if (!this.orderState && this.companyCityLedger) {
                            this.payChannels = [{ channelId: -15, name: '退款至企业' }].concat(this.payChannels);
                        }
                        $('#cashier').modal({ backdrop: 'static' });
                    });
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
                this.isCompany = false;
                this.companyCityLedger = false;
                this.companyBalance = undefined;
            },
            getPayChannels(index) {
                if ((this.type === 'register' && this.business.cashierType === 'finish') || !this.orderState) {
                    return this.depositPayChannels;
                }
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
                let params;
                if (this.type === 'register') {
                    params = { orderId: this.business.orderDetail.orderId, orderType: this.business.orderDetail.orderType };
                } else {
                    let operationType;
                    let penalty; // eslint-disable-line
                    if (this.type === 'checkOut') {
                        operationType = 1;
                        penalty = this.business.penalty;
                    }

                    const orderId = getOrderId(this.orderDetail);

                    const subOrderIds = [];
                    if (this.roomBusinessInfo.roomOrderInfoList &&
                            this.type !== 'orderDetail' &&
                            this.type !== 'cancel') {
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
                return http.get('/order/getOrderPayment', params)
                    .then(res => {
                        if (res.code === 1) {
                            this.orderPayment = res.data;
                            if (res.data.payments && res.data.payments.length > 0) {
                                this.paylogs = res.data.payments.filter(pay => { return pay.payId; });
                            }
                            const payMoney = ((this.type === 'cancel' ? 0 : this.orderPayment.payableFee) - (this.orderPayment.paidFee - this.orderPayment.refundFee) + Number(this.penalty)).toFixed(2);
                            if (Number(payMoney) !== 0) {
                                this.payments.push({ fee: Math.abs(payMoney).toFixed(2), payChannelId: undefined, type: this.orderState ? 0 : 2 });
                            }
                            if ((this.orderPayment.deposit - (this.orderPayment.refundDeposit || 0)) !== 0 && this.type !== 'checkIn') {
                                this.showDeposit = true;
                                this.deposit = this.orderPayment.deposit - (this.orderPayment.refundDeposit || 0);
                            }
                        } else {
                            modal.warn(res.msg);
                        }
                    });
            },
            getChannels(params) {
                http.get('/user/getChannels', params)
                    .then(res => {
                        const channels = res.data.list;
                        channels.forEach(channel => {
                            channel.channelId = channel.id;
                        });
                        channels.sort((a, b) => {
                            return a.channelId - b.channelId;
                        });
                        this.payChannels = channels;
                        this.depositPayChannels = channels.filter(channel => {
                            return channel.channelId > 0;
                        });
                        this.isCompany = !!res.data.contractCompany;
                        this.companyCityLedger = res.data.contractCompany ? res.data.contractCompany.companyCityLedger : false;
                        this.companyBalance = res.data.contractCompany ? res.data.contractCompany.companyBalance : undefined;
                    });
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
                const payMoney = Math.abs(((this.type === 'cancel' ? 0 : this.orderPayment.payableFee) - (this.orderPayment.paidFee - this.orderPayment.refundFee) + this.penalty).toFixed(2));
                let paidMoney = 0;
                if (this.payments.length > 0) {
                    this.payments.forEach(pay => {
                        paidMoney += Number(pay.fee);
                    });
                }
                this.uniqueId += 1;
                this.payments.push({ fee: Math.abs(Number((payMoney - Number(paidMoney)).toFixed(2))), payChannelId: undefined, type: this.orderState ? 0 : 2, uniqueId: this.uniqueId });
            },
            deletePayMent(index) {
                this.payments.splice(index, 1);
            },
            deletePayLog(index) {
                const log = this.paylogs[index];
                this.deleteIds.push(log['payId']);
                if (log['payChannelId'] === -15) { // 支付方式为企业挂帐，删除后企业账户余额要变化
                    this.companyBalance += Number(log['fee']);
                }
                this.paylogs.splice(index, 1);
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
                if (invalid) {
                    const loss = !this.orderState || (this.totalDeposit > 0 && this.type !== 'checkIn');
                    modal.warn(`请选择${loss ? '退款' : '收款'}方式！`);
                    return false;
                }
                const receiveMoney = this.payments.reduce((a, b) => { return a + Number(b.fee); }, 0);
                const shouldPayMoney = Math.abs((this.type === 'cancel' ? 0 : this.orderPayment.payableFee) - (this.orderPayment.paidFee - this.orderPayment.refundFee) + Number(this.penalty)).toFixed(2);
                if (Number(receiveMoney.toFixed(2)) !== Number(shouldPayMoney) && this.type !== 'resetOrder') {
                    modal.warn('订单未结清，无法完成收银！');
                    return false;
                }
                if (this.type === 'resetOrder') {
                    const oldReceiveMoney = this.paylogs.reduce((a, b) => { return a + (b.type === 0 ? Number(b.fee) : -Number(b.fee)); }, 0);
                    const newReceiveMoney = this.payments.reduce((a, b) => { return a + Number(b.fee); }, 0);
                    const shouldReceiveMoney = this.orderPayment.payableFee;
                    if (oldReceiveMoney + newReceiveMoney !== Number(shouldReceiveMoney)) {
                        modal.warn('订单未结清!');
                        return false;
                    }
                }
                const shouldDeposit = this.orderPayment.deposit - (this.orderPayment.refundDeposit || 0);
                if (this.deposit > shouldDeposit && this.type !== 'checkIn' && this.type !== 'register') {
                    modal.warn('退款押金无法大于已付押金！');
                    return false;
                }
                const payments = this.payments.map(payment => {
                    const channel = this.payChannels.find(c => c.channelId === payment.payChannelId);
                    return {
                        ...payment,
                        payChannel: channel.name
                    };
                });

                if (this.deposit) {
                    const channel = this.depositPayChannels.find(c => c.channelId === this.depositPayChannel);

                    payments.push({
                        fee: this.deposit,
                        payChannelId: this.depositPayChannel,
                        payChannel: channel.name,
                        type: (this.orderPayment.deposit > 0 && this.type !== 'checkIn') ? 3 : 1
                    });
                }

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
                    }

                    params = {
                        orderId: this.business.orderId,
                        orderType: this.business.orderType,
                        payments: JSON.stringify(payments),
                        businessJson: JSON.stringify(businessJson)
                    };
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
                // 判断是否进行扫码收款
                let payWithAlipay = 0;
                let payWithCompany = 0;
                this.payments.forEach(pay => {
                    const id = pay.payChannelId;
                    if (id === -6 || id === -7 || id === -11 || id === -12) {
                        payWithAlipay += Number(pay.fee);
                    }
                    if (id === -14 || id === -15) {
                        payWithCompany += Number(pay.fee);
                    }
                });
                if (payWithCompany > 0 && (this.companyBalance ? this.companyBalance : 0) < payWithCompany) {
                    const payStr = `企业余额不足（余额¥${this.companyBalance})，请选择其他支付方式`;
                    modal.warn(payStr);
                    return false;
                }
                if (payWithAlipay <= 0) {
                    http.post('/order/addOrderPayment', params)
                        .then(result => {
                            modal.warn('收银成功');
                            this.resetData();
                            bus.$emit('hideCashier');
                            $('#cashier').modal('hide');
                            bus.$emit('onShowDetail', { type: params.orderType, orderId: params.orderId });
                            bus.$emit('refreshView');
                        });
                } else {
                    this.resetData();
                    bus.$emit('hideCashier');
                    $('#cashier').modal('hide');
                    bus.$emit('showGetMoney', { type: this.type, business: this.business, params, payWithAlipay: Number(payWithAlipay.toFixed(2)) });
                }
            }
        },
        components: {
            DdSelect,
            DdOption
        }
    };
</script>

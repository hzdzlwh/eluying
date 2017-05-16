<template>
    <div>
        <div class="modal fade roomModals" id="reaminder" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <span class="header-text">{{remainder.type === 0  ? '余额收款' : '余额退款'}}</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="roomModals-body" style="overflow: inherit">
                        <div class="content-item">
                            <p class="content-item-title"><span>订单信息</span></p>
                            <div class="reaminder-order-item">
                                <span class="reaminder-money-text">订单金额:<span>¥</span></span>
                                <span class="reaminder-money-text" v-if="penalty && penalty > 0">余额应收:<span>¥{{penalty}}</span></span>
                                <span class="reaminder-money-text">余额已收:<span>¥{{ remainder.needFee }}</span></span>
                            </div>
                        </div>
                        <div class="content-item" v-if="appearDeposit">
                            <p class="content-item-title"><span>{{remainder.type === 0  ? '会员卡收款' : '会员卡退款'}}</span></p>
                            <div class="reaminder-order-item">
                                <span class="reaminder-money-text" style="margin-right:20px">金卡<span>需补:￥{{(remainder.needFee)}}</span></span>
                            </div>
                            <div class="reaminder-getMoney-container">
                                <div class="reaminder-getMoney-channels" v-if="payments.length > 0">
                                    <div class="reaminder-getMoney-channel" v-for="(payment, index) in payments" :key="payment.uniqueId">
                                        <span>{{remainder.type === 0 ? '收款会员卡' : '退款会员卡'}}</span>
                                        <dd-select v-model="payment.payChannelId" :placeholder="`请选择${remainder.type === 0 ? '收款' : '退款'}方式`">
                                            <dd-option v-for="payChannel in getPayChannels(index)" :key="payChannel.channelId" :value="payChannel.channelId" :label="payChannel.name">
                                            </dd-option>
                                        </dd-select>
                                        <input type="number" class="dd-input" v-model="payment.fee">
                                        <span class="reaminder-delBtn-icon" @click="deletePayMent(index)"></span>
                                    </div>
                                </div>
                                <div class="reaminder-addBtn" @click="addPayMent">
                                    <span class="reaminder-addBtn-icon"></span>
                                    <span style="cursor: pointer">添加{{remainder.type === 0  ? '金卡' : '退款'}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div>
                            <span class="footer-label">
                                {{remainder.type === 0  ? '余额收款：' : '需退金额:'}}
                                <span class="order-price-num" :class="orderState ? 'green' : 'red'">
                                    ¥{{ remainder.needFee }}
                                </span>
                            </span>
                            <span v-if="totalDeposit != 0" class="footer-label">
                                {{(totalDeposit > 0 && type !== 'checkIn') ? '余额退款：' : '还需退款：'}}:
                                <span class="order-price-num">
                                    ¥{{ remainder.needFee }}
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
.reaminder-money-text {
    margin-right: 24px;
}

.reaminder-order-item {
    padding-bottom: 15px;
    margin-bottom: 16px;
    border-bottom: 1px dotted #e6e6e6;
}

.reaminder-getMoney-container {
    display: flex;
    align-items: flex-end;
}

.reaminder-deposit-container {
    display: flex;
    align-items: center;
}

.reaminder-getMoney-channels {
    display: flex;
    flex-direction: column;
}

.reaminder-getMoney-channel {
    display: flex;
    align-items: center;
    &:not(:last-child) {
        margin-bottom: 16px;
    }
}

.reaminder-deposit-info {
    display: flex;
    align-items: center;
}

.reaminder-addBtn {
    height: 24px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.reaminder-addBtn-icon {
    width: 16px;
    height: 16px;
    background: url("../../../../../../image/modal/room_modal_add.png");
    background-size: contain;
    margin-right: 4px;
    cursor: pointer;
}

.reaminder-delBtn-icon {
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
import bus from '../../eventBus';
export default {
    data() {
        return {
            remainder: undefined
        };
    },
    computed: {},
    created() {
        bus.$on('showRemainder', this.show);
        // this.getData();
    },
    methods: {
        show(params) {
            http.get('/order/getBalancePayment', params)
                .then(res => {
                    this.remainder = this.data.balancePay;
                });
        }
    },
    components: {
        DdSelect,
        DdOption
    }
};
</script>

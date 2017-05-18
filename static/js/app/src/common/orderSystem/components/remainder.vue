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
                                <span class="reaminder-money-text">订单金额:<span>¥{{remainder.payableFee}}</span></span>
                                <span class="reaminder-money-text">余额应收:<span>¥{{remainder.needFee}}</span></span>
                                <span class="reaminder-money-text">余额已收:<span>¥{{ payed }}</span></span>
                            </div>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>{{remainder.type === 0  ? '会员卡收款' : '会员卡退款'}}</span></p>
                            <div class="reaminder-order-item">
                                <span class="reaminder-money-text" style="margin-right:20px">{{remainder.kindName}}<span style="margin-left:20px;">需补:￥{{needPay}}</span></span>
                            </div>
                            <div class="reaminder-getMoney-container">
                                <div class="reaminder-getMoney-channels">
                                    <div class="reaminder-getMoney-channel" v-for="(payment, index) in paycard" :key="payment.serialNum">
                                        <span>{{remainder.type === 0 ? '收款会员卡' : '退款会员卡'}}</span>
                                        <dd-select v-model='payment.serialNum' @input='changePaycard' :placeholder="`请选择${remainder.kindName}`">
                                            <dd-option v-for="payChannel in getSelect(index)" :key="payChannel.serialNum" :value="payChannel.serialNum" :label="payChannel.cardName">
                                            </dd-option>
                                        </dd-select>
                                        <input type="number" class="dd-input" v-model="fee[index]" disabled=true>
                                        <span class="reaminder-delBtn-icon" @click="deletePayMent(index)"></span>
                                    </div>
                                </div>
                                <div class="reaminder-addBtn" @click="addPayMent" v-if='data.cards && paycard.length < data.cards.length'>
                                    <span class="reaminder-addBtn-icon"></span>
                                    <span style="cursor: pointer">添加{{remainder.kindName}}</span>
                                </div>
                                <div class="reaminder-addBtn" v-else>卡已用完</div>
                            </div>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div>
                            <span class="footer-label">
                                {{remainder.type === 0  ? '余额收款：' : '需退金额:'}}
                                <span class="red"></span>
                            <span class="order-price-num green">
                                    ¥{{ remainder.needFee }}
                                </span>
                            </span>
                            <span class="footer-label">
                                {{remainder.type === 0  ? '还需收款：' : '还需退款：'}}:
                                <span class="order-price-num red" >
                                    ¥{{ needPay}}
                                </span>
                            </span>
                        </div>
                        <div class="dd-btn dd-btn-primary" @click="payMoney(0)">跳过</div>
                        <div class="dd-btn dd-btn-primary" @click="payMoney(1)">完成</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.reaminder-money-text {
    margin-right: 24px;
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
export default {
    props: {
        data: {
            type: Object,
            default: function() {
                return {};
            }
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            remainder: {},
            paycard: [],
            fee: [],
            payed: 0,
            needPay: 0
        };
    },
    watch: {
        show(val) {
            if (val) {
                $('#reaminder').modal({
                    backdrop: 'static'
                });
            } else {
                $('#reaminder').modal('hide');
            }
        },
        data(val) {
            this.remainder = JSON.parse(JSON.stringify(val));
            // Object.assign({}, val);
            this.paycard = [];
            if (this.remainder.cards && this.remainder.cards.length > 0) {
                // const firstCard = this.remainder.cards[0];
                this.$set(this.paycard, 0, this.remainder.cards[0]);
                this.$set(this.fee, 0, Math.min(Number(this.remainder.needFee), Number(this.remainder.cards[0].balanceFee)));
                // this.fee.$set(0, );
                this.payed = this.fee[0];
            }
            this.needPay = (this.remainder.needFee * 100 - this.fee[0] * 100) / 100;
        }
    },
    computed: {},
    created() {
        // bus.$on('showRemainder', this.show);
        // this.getData();
    },
    methods: {
        changePaycard() {
            this.fee = [];
            this.payed = 0;
            // this.remainder.needFee = this.data.needFee;
            this.needPay = 0;
            const _this = this;
            this.paycard.forEach(function(item, index) {
                _this.$set(_this.fee, index, Math.min(Number(_this.remainder.needFee), Number(_this.remainder.cards[0].balanceFee)));
                // _this.remainder.needFee = (_this.remainder.needFee - _this.fee[index]).toFixed(2);
                _this.payed = _this.payed + _this.fee[index];
                _this.needPay = (_this.remainder.needFee * 100 - _this.payed * 100) / 100;
                // 两位数字的精度问题
            });
            // window.console.log(value);
            // this.paycard[index].serialNum = value;
            // this.$set(this.fee, index, Math.min(Number(this.remainder.needFee), Number(this.remainder.cards[index].balanceFee)));
        },
        hideModal() {
            this.$emit('hideReaminder');
            $('#reaminder').modal('hide');
        },
        payMoney(flag) {
            if (flag) {
                const cards = [];
                this.paycard.forEach((item, index) => {
                    cards.push({
                        serialNum: item.serialNum,
                        fee: this.fee[index]
                    });
                });
                this.$emit('getReaminderParams', {
                    paycard: cards,
                    payTotal: this.payed,
                    needMorePay: this.needPay,
                    type: this.remainder.type
                });
            } else {
                this.$emit('getReaminderParams');
            }
            $('#reaminder').modal('hide');
        },
        addPayMent() {
            this.paycard.push({
                serialNum: undefined
            });
        },
        deletePayMent(index) {
            this.paycard.splice(index, 1);
            this.fee.splice(index, 1);
            this.changePaycard();
        },
        getSelect(index) {
            // const serialNum = this.paycard[index].serialNum;
            const paycard = this.paycard;
            const selectCards = this.data.cards.filter(function(item) {
                return !paycard.filter(function(it) {
                    return it.serialNum === item.serialNum;
                }).length || item.serialNum === paycard[index].serialNum;
            });
            return selectCards;
        }
    },
    components: {
        DdSelect,
        DdOption
    }
};
</script>

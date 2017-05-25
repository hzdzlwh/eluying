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
                                <span class="reaminder-money-text">余额已收:<span>¥{{remainder.paidFee}}</span></span>
                            </div>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>{{remainder.type === 0  ? '会员卡收款' : '会员卡退款'}}</span></p>
                            <div class="reaminder-order-item">
                                <span class="reaminder-money-text" style="margin-right:20px">{{remainder.kindName}}<span style="margin-left:20px;">{{remainder.type === 0  ? '需补' : '需退'}}:￥{{remainder.cardFee}}</span></span>
                            </div>
                            <div class="reaminder-getMoney-container">
                                <div class="reaminder-getMoney-channels">
                                    <div class="reaminder-getMoney-channel" v-for="(payment, index) in paycard" :key="payment.serialNum">
                                        <span class="reaminder-mr20">{{remainder.type === 0 ? '收款会员卡' : '退款会员卡'}}</span>
                                        <dd-select class='reaminder-mr20' v-model='payment.serialNum' @input='changePaycard' :placeholder="`请选择${remainder.kindName}`" :disabled='remainder.type === 2'>
                                            <dd-option v-for="payChannel in getSelect(index)" :key="payChannel.serialNum" :value="payChannel.serialNum" :label="payChannel.cardName + payChannel.serialNum">
                                            <span :title='payChannel.serialNum'>{{payChannel.cardName + payChannel.serialNum}}</span>
                                            </dd-option>
                                        </dd-select >
                                        <span class="reaminder-mr20">{{remainder.type === 0  ? '收款' : '退款'}}</span>
                                        <input type="number" class="dd-input reaminder-mr20" v-model="fee[index]" disabled=true>
                                        <span class="reaminder-delBtn-icon" @click="deletePayMent(index)"></span>
                                    </div>
                                </div>
                                <div v-if='remainder.type === 0'>
                                <div class="reaminder-addBtn" @click="addPayMent" v-if='data.cards && paycard.length < data.cards.length'>
                                    <span class="reaminder-addBtn-icon"></span>
                                    <span style="cursor: pointer">添加{{remainder.kindName}}</span>
                                </div>
                                <div class="reaminder-addBtn" v-else>卡已用完</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div>
                            <span class="footer-label">
                                {{remainder.type === 0  ? '余额收款：' : '余额退款:'}}
                                <span class="red"></span>
                            <span class="order-price-num green">
                                    ¥{{ payed }}
                                </span>
                            </span>
                            <span class="footer-label">
                                {{remainder.type === 0  ? '还需收款：' : '还需退款：'}}
                                <span class="order-price-num red" >
                                    ¥{{ needPay}}
                                </span>
                            </span>
                        </div>
                        <div>
                        <div class="dd-btn dd-btn-primary" style="margin-right:20px;" @click="payMoney(0)">跳过</div>
                        <div class="dd-btn dd-btn-primary" @click="payMoney(1)">完成</div>
                        </div>
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
.reaminder-mr20{
    margin-right:20px
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
import bus from '../../eventBus';
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
            this.payed = 0;
            this.paycard = [];
            if (this.remainder.cards && this.remainder.cards.length > 0) {
                // const firstCard = this.remainder.cards[0];
                if (this.remainder.type === 0) {
                    this.$set(this.paycard, 0, JSON.parse(JSON.stringify(this.remainder.cards[0])));
                    this.$set(this.fee, 0, Math.min(Number(this.remainder.cardFee), Number(this.remainder.cards[0].balanceFee)));
                    // this.fee.$set(0, );
                    this.payed = this.fee[0].toFixed(2);
                    this.needPay = (this.remainder.cardFee - this.payed).toFixed(2)

                }
                if (this.remainder.type === 2) {
                    for (let i = 0; i < this.remainder.cards.length; i++) {
                        this.$set(this.paycard, i, JSON.parse(JSON.stringify(this.remainder.cards[i])));
                        this.$set(this.fee, i, Number(this.remainder.cards[i].refundFee));
                        this.payed = this.payed + this.fee[i];
                    }
                    this.payed = this.payed.toFixed(2);
                    this.needPay = (this.remainder.cardFee - this.payed).toFixed(2);
                }
            }
        }
    },
    computed: {},
    created() {
        bus.$on('hideCashier', this.reset);
        // this.getData();
    },
    methods: {
        reset() {
            this.fee = [];
        },
        changePaycard() {
            this.fee = [];
            this.payed = 0;
            // this.remainder.needFee = this.data.needFee;
            // this.needPay = 0;
            let total = Number(this.remainder.cardFee);
            if (this.remainder.type === 2) {
                total = this.remainder.paidFee;
            }
            for (let i = 0; i < this.paycard.length; i++) {
                let minfee = Math.min(Number(total), Number(this.remainder.cards.find((item) => {return item.serialNum === this.paycard[i].serialNum}).balanceFee));
                if (this.remainder.type === 2) {
                    minfee = Number(this.remainder.cards.find((item) => {return item.serialNum === this.paycard[i].serialNum}).refundFee);
                }
                this.$set(this.fee, i, minfee);
                total = (total - minfee).toFixed(2);
                this.payed = this.payed + minfee;
            }
            this.payed = this.payed.toFixed(2);
            // this.paycard.forEach((item, index) => {
            //     this.$set(this.fee, index, );
            //     total = total - Math.min(Number(this.total), Number(this.remainder.cards[index].balanceFee || this.remainder.cards[index].refundFee))
            //     // _this.remainder.needFee = (_this.remainder.needFee - _this.fee[index]).toFixed(2);
            //     this.payed = this.payed + this.fee[index];
            // });
            if (this.remainder.type === 0) {
                this.needPay = (this.remainder.cardFee - this.payed).toFixed(2);
            }
            if (this.remainder.type === 2) {
                this.needPay = (this.remainder.cardFee - this.payed).toFixed(2);
            }
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
                this.$emit('getReaminderParams', {
                    payTotal: this.payed,
                    needMorePay: this.needPay,
                    type: this.remainder.type
                });
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

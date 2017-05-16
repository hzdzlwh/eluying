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
                                <span class="reaminder-money-text">订单金额:<span>¥{{total}}</span></span>
                                <span class="reaminder-money-text" >余额应收:<span>¥{{remainder.needFee}}</span></span>
                                <span class="reaminder-money-text">余额已收:<span>¥{{ remainder.needFee }}</span></span>
                            </div>
                        </div>
                        <div class="content-item" >
                            <p class="content-item-title"><span>{{remainder.type === 0  ? '会员卡收款' : '会员卡退款'}}</span></p>
                            <div class="reaminder-order-item">
                                <span class="reaminder-money-text" style="margin-right:20px">金卡<span style="margin-left:20px;">需补:￥{{(remainder.needFee)}}</span></span>
                            </div>
                            <div class="reaminder-getMoney-container">
                                <div class="reaminder-getMoney-channels" >
                                    <div class="reaminder-getMoney-channel" v-for="(payment, index) in paycard" :key="payment.serialNum">
                                        <span>{{remainder.type === 0 ? '收款会员卡' : '退款会员卡'}}</span>
                                        <dd-select v-model="paycard[index].serialNum" :placeholder="`请选择${remainder.kindName}`">
                                            <dd-option v-for="payChannel in remainder.cards" :key="payChannel.serialNum" :value="payChannel.serialNum" :label="payChannel.cardName">
                                            </dd-option>
                                        </dd-select>
                                        <input type="number" class="dd-input" v-model="paycard[index].fee">
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
                            <span class="footer-label" >
                                {{remainder.type === 0  ? '余额收款：' : '需退金额:'}}
                                <span class="red"></span>
                                <span class="order-price-num green" >
                                    ¥{{ remainder.needFee }}
                                </span>
                            </span>
                            <span  class="footer-label">
                                {{remainder.type === 0  ? '还需收款：' : '还需退款：'}}:
                                <span class="order-price-num red" >
                                    ¥{{ remainder.needFee }}
                                </span>
                            </span>
                        </div>
                       <div class="dd-btn dd-btn-primary" @click="payMoney">跳过</div> <div class="dd-btn dd-btn-primary" @click="payMoney">完成</div>
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
import bus from '../../eventBus';
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
        },
        total: {
            type: Number,
            default: false
        }
    },
    data() {
        return {
            remainder: {},
            paycard: []
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
        	this.remainder = Object.assign({}, val);
        	this.paycard.push(this.remainder.cards[0]);
        	this.paycard[0].fee = this.remainder.balanceFee <= this.remainder.needFee ? this.remainder.balanceFee : this.remainder.needFee;
        }
    },
    computed: {},
    created() {
        bus.$on('showRemainder', this.show);
        // this.getData();
    },
    methods: {
    	hideModal(){
    	},
    	payMoney() {

    	},
    	addPayMent() {

    	}
    },
    components: {
        DdSelect,
        DdOption
    }
};
</script>

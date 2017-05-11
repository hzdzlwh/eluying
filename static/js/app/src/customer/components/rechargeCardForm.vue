<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="rechargeCardModal">
        <div class="modal-dialog cardList-modal-dialog">
            <div class="modal-content cardList-modal-content">
                <div class="cardList-modal-header">
                    <span class="cardList-modal-title">会员卡充值</span>
                    <span class="cardList-modal-close" @click="hideModal"></span>
                </div>
                <div class="cardList-modal-body" v-if="card">
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">会员卡</span>
                        <div class="cardList-body-itemRight repairModal-body-itemRight">
                            {{card.cardType}} {{card.cardNum}}
                        </div>
                    </div>
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">充值金额</span>
                        <div class="cardList-body-itemRight repairModal-body-itemRight">
                            <div class="recharge-type">
                                1000元<span class="giving-money">送200元</span>
                            </div>
                            <div class="recharge-type">
                                2000元<span class="giving-money">送500元</span>
                            </div>
                            <div class="recharge-type">
                                3000元<span class="giving-money">送750元</span>
                            </div>
                        </div>
                    </div>
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">其他</span>
                        <div class="cardList-body-itemRight repairModal-body-itemRight">
                            <span>
                                <input type="number"
                                       class="dd-input"
                                       style="width: 133px"
                                       v-model="rechargeMoney" />
                                元
                            </span>
                            <div>
                                <span class="giving-money">送</span>
                                <input type="number"
                                       style="width: 115px"
                                       v-model="givingMoney"
                                       class="dd-input" />
                                <span class="giving-money">元</span>
                            </div>
                        </div>
                    </div>
                    <div class="cardList-body-item">
                        <span>
                            <strong class="body-bottom-priceTitle">销售价格:</strong>
                            <span><strong class="body-bottom-price">¥30000.00</strong></span>
                        </span>
                    </div>
                </div>
                <div class="cardList-modal-foot">
                    <button class="dd-btn dd-btn-ghost" @click="hideModal">取消</button>
                    <button class="dd-btn dd-btn-primary" @click="rechargeCard">完成</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" type="text/css" rel="stylesheet/scss">
    .giving-money {
        color: #f24949;
    }
</style>
<script>
    export default{
        props: {
            visible: Boolean,
            card: Object
        },
        data() {
            return {
                rechargeMoney: undefined,
                givingMoney: undefined,
                rechargeInfo: {}
            };
        },
        methods: {
            hideModal() {
                $('#rechargeCardModal').modal('hide');
                this.resetData();
                this.$emit('closeModal');
            },
            resetData() {
                this.rechargeMoney = undefined;
                this.givingMoney = undefined;
                this.rechargeInfo = {};
            },
            rechargeCard() {
            }
        },
        watch: {
            visible(newVal) {
                if (newVal) {
                    $('#rechargeCardModal').modal('show');
                }
            }
        }
    };
</script>

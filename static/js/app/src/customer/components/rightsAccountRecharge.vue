<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="rightsAccountRechargeModal">
        <div class="modal-dialog cardList-modal-dialog">
            <div class="modal-content cardList-modal-content">
                <div class="cardList-modal-header">
                    <span class="cardList-modal-title">{{title === '储值账户'? '会员' : title}}充值</span>
                    <span class="cardList-modal-close" @click="hideModal"></span>
                </div>
                <div class="cardList-modal-body" v-if="vip">
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">会员：</span>
                        <div class="cardList-body-itemRight repairModal-body-itemRight">
                            {{vip.name}} 手机号{{vip.phone}}
                        </div>
                    </div>
                    <div class="cardList-body-item" v-if="rechargeTypes && rechargeTypes.length > 0">
                        <span class="cardList-body-itemLeft">充值{{title === '储值账户'? '金额' : '数量'}}</span>
                        <div class="cardList-body-itemRight repairModal-body-itemRight">
                            <div class="recharge-type"
                                 :class="{ 'recharge-type-selected': type.selected }"
                                 @click="selectRechargeType(type)"
                                 v-for="type in rechargeTypes">
                                <span>{{ type.rechargeFee }}元</span>
                                <span class="giving-money">送{{ type.freeFee }}元</span>
                            </div>
                        </div>
                    </div>
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">
                            其他：
                        </span>
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
                            <span>
                                <strong class="body-bottom-price">
                                    ¥{{ sellPrice }}
                                </strong>
                            </span>
                        </span>
                        <div style="display: inline-flex;align-items: center">
                            <span style="margin-right: 4px">收款方式:</span>
                            <div style="width: 130px;">
                                <dd-select v-model="payChannelId" placeholder="请选择收款方式">
                                    <dd-option v-for="payChannel in channels" :key="payChannel.id" :value="payChannel.id" :label="payChannel.name">
                                    </dd-option>
                                </dd-select>
                            </div>
                        </div>
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
    #rightsAccountRechargeModal{
        z-index: 2052;
        .giving-money {
            color: #f24949;
        }
    }
    
</style>
<script>
    import http from '../../common/http';
    import { DdSelect, DdOption } from 'dd-vue-component';

    export default{
        props: {
            visible: Boolean,
            vip: Object,
            channels: Array,
            title: {
                type: String,
                default: '会员'
            }
        },
        data() {
            return {
                rechargeMoney: undefined,
                givingMoney: undefined,
                cardTypes: undefined,
                payChannelId: undefined,
                payChannel: undefined,
                rechargeTypes: undefined,
                rechargeStrategyId: undefined,
                rechargeInfo: {}
            };
        },
        computed: {
            sellPrice() {
                return this.rechargeStrategyId ? this.rechargeInfo.rechargeFee : (this.rechargeMoney ? this.rechargeMoney : 0);
            }
        },
        methods: {
            hideModal() {
                $('#rightsAccountRechargeModal').modal('hide');
                this.resetData();
                this.$emit('closeModal');
            },
            resetData() {
                this.rechargeMoney = undefined;
                this.givingMoney = undefined;
                this.payChannelId = undefined;
                this.payChannel = undefined;
                this.rechargeStrategyId = undefined;
                this.rechargeInfo = {};
                if (this.rechargeTypes && this.rechargeTypes.length > 0) {
                    this.rechargeTypes.map(type => {
                        type.selected = false;
                    });
                }
            },
            getRechargeTypes() {
                http.get('/vipUser/getVipRechargeStrategyItems', { vipLevelId: this.vip.vipLevelId })
                    .then(res => {
                        if (res.code === 1) {
                            this.rechargeTypes = res.data.list;
                            this.rechargeTypes.map(type => {
                                this.$set(type, 'selected', false);
                            });
                        }
                    });
            },
            selectRechargeType(item) {
                this.rechargeTypes.map(type => {
                    if (type.id === item.id) {
                        type.selected = !type.selected;
                    } else {
                        type.selected = type.id === item.id;
                    }
                });
                if (item.selected) {
                    this.rechargeInfo = item;
                    this.rechargeStrategyId = item.id;
                    this.rechargeMoney = undefined;
                    this.givingMoney = undefined;
                } else {
                    this.rechargeInfo = undefined;
                    this.rechargeStrategyId = undefined;
                }
            },
            rechargeCard() {
                const params = {
                    vipCardId: this.card.id,
                    payChannel: this.payChannel,
                    payChannelId: this.payChannelId
                };
                if (this.rechargeStrategyId) {
                    params.rechargeStrategyId = this.rechargeStrategyId;
                    params.rechargeFee = this.rechargeInfo.rechargeFee;
                    params.freeFee = this.rechargeInfo.freeFee;
                } else {
                    params.rechargeFee = this.rechargeMoney;
                    params.freeFee = this.givingMoney;
                }
                const id = this.payChannelId;
                if (id === -6 || id === -7 || id === -11 || id === -12) {
                    params.totalPrice = this.sellPrice;
                    this.$emit('changeParams', { params, url: '/vipCard/rechargeVipCard' });
                } else {
                    http.get('/vipCard/rechargeVipCard', params)
                        .then(res => {
                            if (res.code === 1) {
                                this.hideModal();
                                this.$emit('refreshView');
                            }
                        });
                }
            }
        },
        watch: {
            visible(newVal) {
                if (newVal) {
                    this.resetData();
                    $('#rightsAccountRechargeModal').modal('show');
                    if (this.vip.vipLevelId) {
                        this.getRechargeTypes();
                    }
                } else {
                    $('#rightsAccountRechargeModal').modal('hide');
                }
            },
            payChannelId(newVal) {
                this.channels.map(channel => {
                    if (channel.id === newVal) {
                        this.payChannel = channel.name;
                    }
                });
            },
            rechargeMoney(newVal) {
                if (newVal) {
                    this.rechargeTypes.map(type => {
                        type.selected = false;
                    });
                    this.rechargeInfo = undefined;
                    this.rechargeStrategyId = undefined;
                }
            }
        },
        components: {
            DdSelect,
            DdOption
        }
    };
</script>

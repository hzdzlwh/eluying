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
                                <span>{{title === '储值账户'? type.rechargeFee : type.rechargeNum }}<span v-if="title === '储值账户'">元</span><span v-else>个</span></span>
                                <span class="giving-money">送{{title === '储值账户'? type.freeFee : type.freeNum}}<span v-if="title === '储值账户'">元</span><span v-else>个</span></span>
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
                                <span v-if="title === '储值账户'">元</span><span v-else>个</span>
                            </span>
                            <div>
                                <span class="giving-money">送</span>
                                <input type="number"
                                       style="width: 115px"
                                       v-model="givingMoney"
                                       class="dd-input" />
                                <span class="giving-money" v-if="title === '储值账户'">元</span><span class="giving-money" v-else>个</span>
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
                rechargeInfo: {},
                virtualCurrencyRate: undefined
            };
        },
        computed: {
            sellPrice() {
                if (this.title === '储值账户') {
                    return this.rechargeStrategyId ? this.rechargeInfo.rechargeFee : (this.rechargeMoney ? this.rechargeMoney : 0);
                } else {
                    return this.rechargeStrategyId ? (this.rechargeInfo.rechargeNum / this.virtualCurrencyRate).toFixed(2) : (this.rechargeMoney ? (this.rechargeMoney / this.virtualCurrencyRate).toFixed(2) : 0);
                }
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
                this.virtualCurrencyRate = undefined;
                this.rechargeInfo = {};
                if (this.rechargeTypes && this.rechargeTypes.length > 0) {
                    this.rechargeTypes.map(type => {
                        type.selected = false;
                    });
                }
            },
            getRechargeTypes() {
                var url = '';
                if (this.title === '储值账户') {
                    url = '/vipUser/getVipRechargeStrategyItems';
                } else {
                    url = '/virCurrency/getVirCurrencyRechargeStrategyItems';
                }
                http.get(url, { vipLevelId: this.vip.vipLevelId })
                    .then(res => {
                        if (res.code === 1) {
                            if (this.title === '储值账户') {
                                this.rechargeTypes = res.data.list;
                            } else {
                                this.rechargeTypes = res.data.rechargeStrategyItems;
                                this.virtualCurrencyRate = res.data.rate;
                            }
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
                const params = { vipId: this.vip.vipUserId };
                if (this.title === '储值账户') {
                    // 储值账户充值请求参数
                    params.freeFee = this.rechargeStrategyId ? this.rechargeInfo.freeFee : this.givingMoney;
                    params.payChannel = this.payChannel;
                    params.payChannelId = this.payChannelId;
                    params.rechargeFee = this.rechargeStrategyId ? this.rechargeInfo.rechargeFee : this.rechargeMoney;
                    if (this.rechargeStrategyId) {
                        params.rechargeStrategyId = this.rechargeStrategyId;
                    }
                } else {
                    // 星球币充值请求参数
                    params.freeNum = this.rechargeStrategyId ? this.rechargeInfo.freeNum : this.givingMoney;
                    params.payChannel = this.payChannel;
                    params.payChannelId = this.payChannelId;
                    params.rechargeNum = this.rechargeStrategyId ? this.rechargeInfo.rechargeNum : this.rechargeMoney;
                    params.salePrice = this.sellPrice;
                    if (this.rechargeStrategyId) {
                        params.rechargeStrategyId = this.rechargeStrategyId;
                    }
                }
                const id = this.payChannelId;
                const url = this.title === '储值账户' ? '/vipUser/rechargeVip' : 'virCurrency/rechargeVirCurrency';
                if (id === -6 || id === -7 || id === -11 || id === -12) {
                    // -6: 支付宝  -7：微信
                    params.totalPrice = this.sellPrice;
                    this.$emit('changeParams', { params, url: url });
                } else {
                    http.get(url, params)
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

<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="repairCardModal">
        <div class="modal-dialog cardList-modal-dialog">
            <div class="modal-content cardList-modal-content">
                <div class="cardList-modal-header">
                    <span class="cardList-modal-title">会员卡补办</span>
                    <span class="cardList-modal-close" @click="hideModal"></span>
                </div>
                <div class="cardList-modal-body" v-if="card">
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">手机号</span>
                        <div class="cardList-body-itemRight repairModal-body-itemRight">
                            {{card.phone}}
                        </div>
                    </div>
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">原卡</span>
                        <div class="cardList-body-itemRight repairModal-body-itemRight">
                            {{card.cardType}} {{card.vipCardNum}}
                        </div>
                    </div>
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">新卡卡号</span>
                        <div class="cardList-body-itemRight repairModal-body-itemRight">
                            <input
                                    type="text"
                                    class="dd-input"
                                    maxlength="20"
                                    placeholder="请输入会员卡卡号"
                                    v-model="cardNum" />
                        </div>
                    </div>
                    <div class="cardList-body-item">
                            <span>
                                <strong class="body-bottom-priceTitle">补办费用:</strong>
                                <span><strong class="body-bottom-price">¥{{card.reapplyFee}}</strong></span>
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
                    <button class="dd-btn dd-btn-primary" @click="repairCard">完成</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" type="text/css" rel="stylesheet/scss">
    .repairModal-body-itemRight {
        width: 316px !important;
        min-height: 24px;
    }
</style>
<script>
    import http from '../../common/http';
    import { DdSelect, DdOption } from 'dd-vue-component';

    export default{
        props: {
            visible: Boolean,
            card: Object,
            channels: Array
        },
        data() {
            return {
                cardNum: '',
                payChannelId: undefined,
                payChannel: undefined
            };
        },
        methods: {
            hideModal() {
                $('#repairCardModal').modal('hide');
                this.resetData();
                this.$emit('closeModal');
            },
            resetData() {
                this.cardNum = '';
                this.payChannelId = undefined;
                this.payChannel = undefined;
            },
            repairCard() {
                const params = {
                    vipCardId: this.card.id,
                    vipCardNum: this.cardNum,
                    payChannel: this.payChannel,
                    payChannelId: this.payChannelId
                };
                const id = this.payChannelId;
                if (id === -6 || id === -7 || id === -11 || id === -12) {
                    params.totalPrice = this.card.reapplyFee;
                    this.$emit('changeParams', { params, url: '/vipCard/reapplyVipCard' });
                } else {
                    http.get('/vipCard/reapplyVipCard', params)
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
                    $('#repairCardModal').modal('show');
                }
            },
            payChannelId(newVal) {
                this.channels.map(channel => {
                    if (channel.id === newVal) {
                        this.payChannel = channel.name;
                    }
                });
            }
        },
        components: {
            DdSelect,
            DdOption
        }
    };
</script>

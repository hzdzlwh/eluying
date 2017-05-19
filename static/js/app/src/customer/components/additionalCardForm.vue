<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="additionalCardModal">
        <div class="modal-dialog cardList-modal-dialog">
            <div class="modal-content cardList-modal-content">
                <div class="cardList-modal-header">
                    <span class="cardList-modal-title">副卡办理</span>
                    <span class="cardList-modal-close" @click="hideModal"></span>
                </div>
                <div class="cardList-modal-body" v-if="card">
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">主卡手机号</span>
                        <div class="cardList-body-itemRight additionalModal-body-itemRight">
                            {{card.phone}}
                        </div>
                    </div>
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">主会员卡</span>
                        <div class="cardList-body-itemRight additionalModal-body-itemRight">
                            {{`${card.categoryName} ${card.vipCardNum}`}}
                        </div>
                    </div>
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">副卡手机号</span>
                        <div class="cardList-body-itemRight additionalModal-body-itemRight">
                            <input type="text"
                                   class="dd-input normal-input"
                                   maxlength="11"
                                   placeholder="请输入手机号"
                                   :disabled='disableNameInput'
                                   v-model="phone" />
                            <span class="error-phone-tip" v-show="!phoneValid">
                                    <span style="vertical-align: text-bottom">&uarr;</span>
                                    {{phoneErrorTip}}
                                </span>
                            <div>
                                <span style="margin-right: 8px;">姓名</span>
                                <input type="text"
                                       class="dd-input normal-input"
                                       maxlength="16"
                                       placeholder="请输入姓名"
                                       :disabled='disableNameInput'
                                       v-model="name" />
                            </div>
                        </div>
                    </div>
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">副卡卡号</span>
                        <div class="cardList-body-itemRight additionalModal-body-itemRight">
                            <input
                                    type="text"
                                    class="dd-input"
                                    maxlength="18"
                                    placeholder="请输入会员卡卡号"
                                    v-model="cardNum" />
                        </div>
                    </div>
                    <div class="cardList-body-item">
                            <span>
                                <strong class="body-bottom-priceTitle">办理费用:</strong>
                                <span><strong class="body-bottom-price">¥{{card.viceApplyFee}}</strong></span>
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
                    <button class="dd-btn dd-btn-primary" @click="createAdditionalCard">完成</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" type="text/css" rel="stylesheet/scss">
    .additionalModal-body-itemRight {
        width: 300px !important;
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
                phone: undefined,
                name: '',
                cardNum: '',
                phoneValid: true,
                disableNameInput: false,
                phoneErrorTip: '',
                payChannelId: undefined,
                payChannel: undefined
            };
        },
        methods: {
            hideModal() {
                $('#additionalCardModal').modal('hide');
                this.resetData();
                this.$emit('closeModal');
            },
            resetData() {
                this.phone = '';
                this.name = '';
                this.cardNum = '';
                this.phoneValid = true;
                this.disableNameInput = false;
                this.phoneErrorTip = '';
                this.payChannelId = undefined;
                this.payChannel = undefined;
            },
            getPhoneInfo() {
                http.get('/vipCard/checkPhoneBeforeApplyVipCard', { phone: this.phone })
                    .then(res => {
                        if (res.code === 1) {
                            this.name = res.data.name;
                            this.disableNameInput = !!res.data.name;
                        }
                    });
            },
            checkPhone() {
                const phoneReg = /^1[34578]\d{9}$/;
                this.phoneValid = phoneReg.test(this.phone);
                this.phoneErrorTip = '格式有误';
            },
            createAdditionalCard() {
                this.checkPhone();
                if (this.phone.length === 0) {
                    this.phoneErrorTip = '必填字段';
                }
                if (!this.phoneValid) {
                    return false;
                }
                const params = {
                    vipCardId: this.card.id,
                    name: this.name,
                    phone: this.phone,
                    payChannel: this.payChannel,
                    payChannelId: this.payChannelId,
                    vipCardNum: this.cardNum
                };
                const id = this.payChannelId;
                if (id === -6 || id === -7 || id === -11 || id === -12) {
                    params.totalPrice = this.card.viceApplyFee;
                    this.$emit('changeParams', { params, url: '/vipCard/registViceVipCard' });
                } else {
                    http.get('/vipCard/registViceVipCard', params)
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
                    $('#additionalCardModal').modal('show');
                } else {
                    $('#additionalCardModal').modal('hide');
                }
            },
            payChannelId(newVal) {
                this.channels.map(channel => {
                    if (channel.id === newVal) {
                        this.payChannel = channel.name;
                    }
                });
            },
            phone(newVal) {
                if (newVal.length > 0) {
                    this.phoneErrorTip = '格式有误';
                }
                if (newVal.length === 0) {
                    this.phoneValid = false;
                    this.phoneErrorTip = '必填字段';
                }
                if (newVal.length === 11) {
                    this.checkPhone();
                    if (this.phoneValid) {
                        this.getPhoneInfo();
                    }
                }
            }
        },
        components: {
            DdSelect,
            DdOption
        }
    };
</script>

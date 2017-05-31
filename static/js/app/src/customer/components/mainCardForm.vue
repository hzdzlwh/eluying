<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="mainCardModal">
        <div class="modal-dialog cardList-modal-dialog">
            <div class="modal-content cardList-modal-content">
                <div class="cardList-modal-header">
                    <span class="cardList-modal-title">会员卡办理</span>
                    <span class="cardList-modal-close" @click="hideModal"></span>
                </div>
                <div class="cardList-modal-body">
                    <div class="cardList-body-item">
                            <span class="cardList-body-itemLeft">
                                <b style="color: #f24949;vertical-align: sub">*</b>
                                手机号
                            </span>
                            <div class="cardList-body-itemRight">
                                <input type="text"
                                       class="dd-input normal-input"
                                       maxlength="11"
                                       placeholder="请输入手机号"
                                       :disabled="editable"
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
                                           :disabled='disableNameInput || editable'
                                           v-model="name" />
                                </div>
                            </div>
                    </div>
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">卡号</span>
                        <div class="cardList-body-itemRight">
                            <input
                                    type="text"
                                    class="dd-input"
                                    maxlength="18"
                                    placeholder="请输入会员卡卡号"
                                    v-model="cardNum" />
                        </div>
                    </div>
                    <div class="cardList-body-item" v-if="cardTypes">
                        <span class="cardList-body-itemLeft">会员卡</span>
                        <div class="cardList-body-itemRight" style="justify-content: flex-start">
                            <div class="card-type"
                                 v-for="type in cardTypes"
                                 :key="type.id"
                                 :class="{ 'card-type-selected': type.selected }"
                                 :title="type.name"
                                 :style="{ color: type.status === 0 ? '#ccc' : '',cursor: type.status === 0 ? 'auto' : 'pointer'}"
                                 @click="selectCardType(type)">
                                {{ type.name }}
                            </div>
                        </div>
                    </div>
                    <div class="cardList-body-item" style="background: #e1effa;height: 50px" >
                        <span>卡费:<span>{{ selectedCard.cardFee }}</span>元</span>
                        <span style="margin-left: 16px">充值:<span>{{ selectedCard.rechargeFee }}</span>元</span>
                        <span style="margin-left: 16px">赠送:<span>{{ selectedCard.freeFee }}</span>元</span>
                    </div>
                    <div class="cardList-body-item">
                            <span>
                                <strong class="body-bottom-priceTitle">销售价格:</strong>
                                <span>
                                    <strong class="body-bottom-price">
                                        ¥{{ (selectedCard.cardFee + selectedCard.rechargeFee).toFixed(2) }}
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
                    <button class="dd-btn dd-btn-primary" @click="createMainCard">完成</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" type="text/css" rel="stylesheet/scss">
    #mainCardModal{
        z-index: 2052;
    }
</style>
<script>
    import http from '../../common/http';
    import modal from 'modal';
    import { DdSelect, DdOption } from 'dd-vue-component';

    export default{
        props: {
            visible: Boolean,
            oldPhone: {
                type: String,
                default: ''
            },
            oldName: {
                type: String,
                default: ''
            },
            channels: Array
        },
        data() {
            return {
                phone: '',
                name: '',
                cardNum: '',
                phoneValid: true,
                disableNameInput: false,
                phoneErrorTip: '',
                editable: false,
                cardTypes: undefined,
                payChannelId: undefined,
                payChannel: undefined,
                selectedCard: {
                    cardFee: 0,
                    rechargeFee: 0,
                    freeFee: 0
                }
            };
        },
        created() {
            this.getCardTypes();
        },
        methods: {
            resetData() {
                this.cardTypes.map(type => {
                    type.selected = false;
                });
                this.phone = this.oldPhone;
                this.name = this.oldName;
                this.cardNum = '';
                this.disableNameInput = false;
                this.phoneValid = true;
                this.phoneErrorTip = '';
                this.payChannelId = undefined;
                this.payChannel = undefined;
                this.selectedCard = {
                    cardFee: 0,
                    rechargeFee: 0,
                    freeFee: 0
                };
            },
            getCardTypes() {
                http.get('/vipCard/getApplyVipCardCategoryList', {})
                    .then(res => {
                        if (res.code === 1) {
                            this.cardTypes = res.data.list;
                            this.cardTypes.map(card => {
                                card.id = card.categoryId;
                                this.$set(card, 'selected', false);
                            });
                        }
                    });
            },
            hideModal() {
                $('#mainCardModal').modal('hide');
                this.resetData();
                this.$emit('closeModal');
                this.editable = false;
            },
            selectCardType(item) {
                if (item.status === 0) {
                    return false;
                }
                this.cardTypes.map(type => {
                    if (type.id === item.id && type.status === 1) {
                        type.selected = !type.selected;
                    } else {
                        type.selected = false;
                    }
                });
                if (item.selected) {
                    this.selectedCard = item;
                } else {
                    this.selectedCard = {
                        cardFee: 0,
                        rechargeFee: 0,
                        freeFee: 0
                    };
                }
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
            createMainCard() {
                this.checkPhone();
                if (this.phone.length === 0) {
                    this.phoneErrorTip = '必填字段';
                }
                if (!this.phoneValid) {
                    return false;
                }
                const params = {
                    categoryId: this.selectedCard.categoryId,
                    name: this.name,
                    phone: this.phone,
                    vipCardNum: this.cardNum,
                    payChannel: this.payChannel,
                    payChannelId: this.payChannelId
                };
                if (!params.categoryId) {
                    modal.warn('请选择会员卡！');
                    return false;
                }
                const id = this.payChannelId;
                if (id === -6 || id === -7 || id === -11 || id === -12) {
                    params.totalPrice = (this.selectedCard.cardFee + this.selectedCard.rechargeFee).toFixed(2);
                    this.$emit('changeParams', { params, url: '/vipCard/registVipCard' });
                } else {
                    http.get('/vipCard/registVipCard', params)
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
            },
            payChannelId(newVal) {
                this.channels.map(channel => {
                    if (channel.id === newVal) {
                        this.payChannel = channel.name;
                    }
                });
            },
            visible(newVal) {
                if (newVal) {
                    this.resetData();
                    $('#mainCardModal').modal('show');
                } else {
                    $('#mainCardModal').modal('hide');
                }
            },
            oldPhone(newVal) {
                this.phone = newVal;
                this.editable = true;
            },
            oldName(newVal) {
                this.name = newVal;
            }
        },
        components: {
            DdSelect,
            DdOption
        }
    };
</script>

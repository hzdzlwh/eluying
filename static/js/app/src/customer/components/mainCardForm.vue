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
                                    maxlength="20"
                                    placeholder="请输入会员卡卡号"
                                    v-model="cardNum" />
                        </div>
                    </div>
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">会员卡</span>
                        <div class="cardList-body-itemRight">
                            <div class="card-type"
                                 v-for="type in cardTypes"
                                 :key="type.id"
                                 :class="{ 'card-type-selected': type.selected }"
                                 @click="selectCardType(type)">
                                {{ type.name }}
                            </div>
                        </div>
                    </div>
                    <div class="cardList-body-item" style="background: #e1effa;height: 50px">
                        <span>卡费:<span>10000</span>元</span>
                        <span style="margin-left: 16px">充值:<span>20000</span>元</span>
                        <span style="margin-left: 16px">赠送:<span>30000</span>元</span>
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
                    <button class="dd-btn dd-btn-primary" @click="createMainCard">完成</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" type="text/css" rel="stylesheet/scss">
</style>
<script>
    export default{
        props: {
            visible: Boolean,
            oldPhone: ''
        },
        data() {
            return {
                phone: '',
                name: '',
                cardNum: '',
                phoneValid: true,
                phoneErrorTip: '',
                editable: false,
                cardTypes: [
                    {
                        selected: false,
                        name: '钻石卡',
                        id: '0'
                    },
                    {
                        selected: false,
                        name: '金卡',
                        id: '1'
                    },
                    {
                        selected: false,
                        name: '银卡',
                        id: '2'
                    },
                    {
                        selected: false,
                        name: '铜卡',
                        id: '3'
                    }
                ]
            };
        },
        methods: {
            resetData() {
                this.cardTypes.map(type => {
                    type.selected = false;
                });
                this.phone = '';
                this.name = '';
                this.cardNum = '';
                this.phoneValid = true;
                this.phoneErrorTip = '';
            },
            hideModal() {
                $('#mainCardModal').modal('hide');
                this.resetData();
                this.$emit('closeModal');
                this.editable = false;
            },
            selectCardType(item) {
                this.cardTypes.map(type => {
                    type.selected = type.id === item.id;
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
                }
            },
            visible(newVal) {
                if (newVal) {
                    $('#mainCardModal').modal('show');
                }
            },
            oldPhone(newVal) {
                this.phone = newVal;
                this.editable = true;
            }
        }
    };
</script>

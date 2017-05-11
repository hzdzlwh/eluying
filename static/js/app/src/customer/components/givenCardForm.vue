<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="givenCardModal">
        <div class="modal-dialog cardList-modal-dialog">
            <div class="modal-content cardList-modal-content">
                <div class="cardList-modal-header">
                    <span class="cardList-modal-title">会员卡转赠</span>
                    <span class="cardList-modal-close" @click="hideModal"></span>
                </div>
                <div class="cardList-modal-body" v-if="card">
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">原手机号</span>
                        <div class="cardList-body-itemRight repairModal-body-itemRight">
                            {{card.phone}}
                        </div>
                    </div>
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">会员卡</span>
                        <div class="cardList-body-itemRight repairModal-body-itemRight">
                            {{card.cardType}} {{card.cardNum}}
                        </div>
                    </div>
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">新手机号</span>
                        <div class="cardList-body-itemRight repairModal-body-itemRight">
                            <input type="text"
                                   class="dd-input normal-input"
                                   maxlength="11"
                                   placeholder="请输入手机号"
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
                        <div class="cardList-body-itemSpecial">
                            <input type="checkbox"
                                   class="dd-checkbox"
                                   v-model="checked"
                                   style="margin: 0" />
                            <span style="font-size: 12px;color: #999999">将所有副卡都失效</span>
                        </div>
                    </div>
                    <div class="cardList-body-item">
                            <span>
                                <strong class="body-bottom-priceTitle">转赠费用:</strong>
                                <span><strong class="body-bottom-price">¥30000.00</strong></span>
                            </span>
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
    .cardList-body-itemSpecial {
        display: flex;
        align-items: center;
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
                phone: '',
                name: '',
                phoneValid: true,
                phoneErrorTip: '',
                checked: true
            };
        },
        methods: {
            hideModal() {
                $('#givenCardModal').modal('hide');
                this.resetData();
                this.$emit('closeModal');
            },
            resetData() {
                this.phone = '';
                this.name = '';
                this.checked = true;
                this.phoneValid = true;
                this.phoneErrorTip = '';
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
            }
        },
        watch: {
            visible(newVal) {
                if (newVal) {
                    $('#givenCardModal').modal('show');
                }
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
                }
            }
        }
    };
</script>

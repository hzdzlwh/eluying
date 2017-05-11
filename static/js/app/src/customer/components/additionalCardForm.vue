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
                            {{card.cardType}} {{card.cardNum}}
                        </div>
                    </div>
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">副卡手机号</span>
                        <div class="cardList-body-itemRight additionalModal-body-itemRight">
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
                        <span class="cardList-body-itemLeft">副卡卡号</span>
                        <div class="cardList-body-itemRight additionalModal-body-itemRight">
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
                                <strong class="body-bottom-priceTitle">办理费用:</strong>
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
    .additionalModal-body-itemRight {
        width: 300px !important;
        min-height: 24px;
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
                cardNum: '',
                phoneValid: true,
                phoneErrorTip: ''
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
                    $('#additionalCardModal').modal('show');
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

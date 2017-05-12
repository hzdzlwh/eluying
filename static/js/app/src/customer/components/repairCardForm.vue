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
                            {{card.cardType}} {{card.cardNum}}
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

    export default{
        props: {
            visible: Boolean,
            card: Object
        },
        data() {
            return {
                cardNum: ''
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
            },
            repairCard() {
                const params = {
                    vipCardId: this.card.id,
                    vipCardNum: this.cardNum
                };
                http.get('/vipCard/reapplyVipCard', params)
                    .then(res => {
                        if (res.code === 1) {
                            this.hideModal();
                        }
                    });
            }
        },
        watch: {
            visible(newVal) {
                if (newVal) {
                    $('#repairCardModal').modal('show');
                }
            }
        }
    };
</script>

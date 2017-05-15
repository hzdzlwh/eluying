<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="simpleCardModal">
        <div class="modal-dialog cardList-modal-dialog">
            <div class="modal-content cardList-modal-content">
                <div class="cardList-modal-header" v-if="type">
                    <span class="cardList-modal-title">{{modalTitle}}</span>
                    <span class="cardList-modal-close" @click="hideModal"></span>
                </div>
                <div class="cardList-modal-body" v-if="card">
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">手机号</span>
                        <div class="cardList-body-itemRight">
                            {{card.phone}}
                        </div>
                    </div>
                    <div class="cardList-body-item">
                        <span class="cardList-body-itemLeft">原卡</span>
                        <div class="cardList-body-itemRight">
                            {{card.cardType}} {{card.vipCardNum}}
                        </div>
                    </div>
                </div>
                <div class="cardList-modal-foot">
                    <button class="dd-btn dd-btn-ghost" @click="hideModal">取消</button>
                    <button class="dd-btn dd-btn-primary" @click="operateCard">完成</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" type="text/css" rel="stylesheet/scss">
</style>
<script>
    import http from '../../common/http';

    export default{
        props: {
            visible: Boolean,
            card: Object,
            type: String
        },
        data() {
            return {
            };
        },
        computed: {
            modalTitle() {
                let str = '';
                if (this.type === 'lose') {
                    str = '挂失';
                }
                if (this.type === 'recover') {
                    str = '恢复';
                }
                if (this.type === 'useless') {
                    str = '失效';
                }
                return `会员卡${str}`;
            }
        },
        methods: {
            hideModal() {
                $('#simpleCardModal').modal('hide');
                this.$emit('closeModal');
            },
            operateCard() {
                const params = {
                    status: this.card.status,
                    vipCardId: this.card.id
                };
                if (this.type === 'lose') {
                    params.type = 5;
                }
                if (this.type === 'recover') {
                    params.type = 6;
                }
                if (this.type === 'useless') {
                    params.type = 7;
                }
                http.get('/vipCard/modifyVipCardState', params)
                    .then(res => {
                        if (res.code === 1) {
                            this.hideModal();
                            this.$emit('refreshView');
                        }
                    });
            }
        },
        watch: {
            visible(newVal) {
                if (newVal) {
                    $('#simpleCardModal').modal('show');
                }
            }
        }
    };
</script>

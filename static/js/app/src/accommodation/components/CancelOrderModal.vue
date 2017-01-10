<template>
    <div>
        <div class="modal fade roomModals" id="cancelOrder" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <span class="header-text">取消订单</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="roomModals-body">
                        <div class="content-item">
                            <p class="content-item-title"><span>订单总结</span></p>
                            <span>取消金额:<span>¥{{cancelFee}}</span></span>
                            <span v-if="oldPenalty">违约金:<span>¥{{oldPenalty}}</span></span>
                            <span style="margin-left: 24px">已付金额:<span>¥{{paid}}</span></span>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>违约信息</span></p>
                            <span>违约金：</span>
                            <input v-model="penalty" type="text" class="dd-input" placeholder="请输入违约金">
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div>
                            <span class="footer-label">需退金额:<span class="order-price-num green">¥{{need - (penalty || 0)}}</span></span>
                        </div>
                        <div class="dd-btn dd-btn-primary" @click="cancel">确认取消</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
</style>
<script>
    import AJAXService from '../../common/AJAXService';
    import modal from '../../common/modal';
    export default{
        props: {
            show: Boolean,
            orderId: Number
        },
        data() {
            return {
                cancelFee: 0,
                paid: 0,
                penalty: undefined,
                oldPenalty: undefined
            }
        },
        watch: {
            show(val) {
                if (val) {
                    this.getCancelOrder();
                    $('#cancelOrder').modal({backdrop: 'static'});
                } else {
                    $('#cancelOrder').modal('hide');
                }
            }
        },
        methods:{
            hideModal() {
                this.$emit('hideCancelOrder');
            },
            getCancelOrder() {
                AJAXService.ajaxWithToken('get', '/order/refund4AllOrder', { orderId: this.orderId, orderType: -1 })
                    .then(res => {
                        if (res.code === 1) {
                            this.cancelFee = res.data.payments.find(p => p.type === 11);
                            this.paid = res.data.payments.find(p => p.type === 16).fee;
                            this.need = res.data.payments.find(p => p.type === 15).fee;
                            this.oldPenalty = res.data.payments.find(p => p.type === 14).fee;
                        }
                    })
            },
            cancel() {
                const business = {
                    orderId: this.orderId,
                    orderType: -1
                };
                if (this.need - (this.penalty || 0) === 0) {
                    AJAXService.ajaxWithToken('get', '/order/cancel', business)
                        .then(res => {
                            if (res.code === 1) {
                                this.hideModal();
                                modal.somethingAlert('取消成功');
                                this.$emit('refreshView');
                                this.$emit('showOrder', this.orderId);
                            } else {
                                modal.somethingAlert(res.msg);
                            }
                        })
                } else {
                    this.hideModal();
                    business.penalty = Number(this.penalty);
                    business.functionType = 0;
                    this.$emit('showCashier', { type: 'cancel', business });
                }
            }
        },
        components:{}
    }
</script>

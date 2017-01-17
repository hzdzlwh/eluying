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
                            <span class="footer-label">{{need > 0 ? '需退' : '需补'}}金额:<span class="order-price-num green">¥{{Math.abs(need.toFixed(2))}}</span></span>
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
        computed: {
            need() {
                return this.paid - (this.oldPenalty || 0) - (this.penalty || 0);
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
                this.penalty = undefined;
                this.$emit('hideCancelOrder');
            },
            getCancelOrder() {
                AJAXService.ajaxWithToken('get', '/order/refund4AllOrder', { orderId: this.orderId, orderType: -1 })
                    .then(res => {
                        if (res.code === 1) {
                            this.cancelFee = res.data.payments.find(p => p.type === 13).fee;
                            this.paid = res.data.payments.find(p => p.type === 14).fee;
                            this.oldPenalty = res.data.payments.find(p => p.type === 4) ? (res.data.payments.find(p => p.type === 4).fee || 0) : 0;
                        }
                    })
            },
            cancel() {
                const business = {
                    orderId: this.orderId,
                    orderType: -1,
                };
                if (this.need - (this.penalty || 0) === 0) {
                    if (this.penalty) {
                        payments: JSON.stringify([{fee: this.penalty, type: 4}])
                    }
                    AJAXService.ajaxWithToken('get', '/order/cancel', business)
                        .then(res => {
                            if (res.code === 1) {
                                modal.somethingAlert('取消成功');
                                this.hideModal();
                                this.$emit('refreshView');
                                this.$emit('showOrder', this.orderId);
                            } else {
                                modal.somethingAlert(res.msg);
                            }
                        })
                } else {
                    business.penalty = Number(this.penalty);
                    business.functionType = 0;
                    this.hideModal();
                    this.$emit('showCashier', { type: 'cancel', business });
                }
            }
        },
        components:{}
    }
</script>

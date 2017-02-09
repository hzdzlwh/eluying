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
                            <div v-if="order && order.orderType !== -1" >
                                <span>违约金：</span>
                                <input v-model="penalty" type="text" class="dd-input" placeholder="请输入违约金">
                            </div>
                            <div v-if="order && order.orderType === -1">
                                <div class="cashier-getMoney-channels" v-if="subOrderPenaltys.length > 0">
                                    <div class="cashier-getMoney-channel" v-for="(subOrderPenalty, index) in subOrderPenaltys">
                                        <dd-select v-model="subOrderPenalty.nodeId">
                                            <dd-option v-for="subOrder in subOrders" :value="subOrder.nodeId" :label="`${subOrder.nodeName}(¥${subOrder.totalPrice})`">
                                            </dd-option>
                                        </dd-select>
                                        <input type="number" class="dd-input" v-model="subOrderPenalty.penalty" style="margin-left: 12px" placeholder="请输入违约金">
                                        <span class="cashier-delBtn-icon" @click="deletePenalty(index)"></span>
                                    </div>
                                </div>
                                <span class="cashier-addBtn" @click="addPenalty" style="display: inline-flex;">
                                    <span class="cashier-addBtn-icon"></span>
                                    <span style="cursor: pointer">添加违约金</span>
                                </span>
                            </div>
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
    import { mapState } from 'vuex';
    import { DdSelect, DdOption } from 'dd-vue-component';
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
                subOrderPenaltys: [],
                oldPenalty: undefined,
                subOrders: []
            }
        },
        computed: {
            ...mapState({order: 'orderDetail'}),
            need() {
                let penalty = this.subOrderPenaltys.reduce((a, b) => { return a + (Number(b.penalty) || 0) }, 0);
                return this.paid - (this.oldPenalty || 0) - (this.penalty || 0) - penalty;
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
                this.subOrderPenaltys = [];
                this.$emit('hideCancelOrder');
            },
            addPenalty() {
                if (this.subOrderPenaltys.length >= this.subOrders.length) {
                    modal.somethingAlert('已选择所有违约项目');
                    return false;
                }
                this.subOrderPenaltys.push({ nodeId: this.subOrders[0].nodeId, penalty: undefined });
            },
            deletePenalty(index) {
                this.subOrderPenaltys.splice(index, 1);
            },
            getCancelOrder() {
                AJAXService.ajaxWithToken('get', '/order/refund4AllOrder', { orderId: this.orderId, orderType: -1 })
                    .then(res => {
                        if (res.code === 1) {
                            this.cancelFee = res.data.payments.find(p => p.type === 13).fee;
                            this.paid = res.data.payments.find(p => p.type === 14).fee;
                            this.oldPenalty = res.data.payments.find(p => p.type === 4) ? (res.data.payments.find(p => p.type === 4).fee || 0) : 0;
                            this.subOrders = res.data.subOrdersTotalPriceList;
                        }
                    })
            },
            cancel() {
                let totalPenalty = this.penalty || 0;
                const business = {
                    orderId: this.orderId,
                    orderType: -1,
                };
                let valid = true;
                if (this.subOrderPenaltys.length > 0) {
                    totalPenalty = this.subOrderPenaltys.reduce((a, b) => { return Number(a) + Number(b.penalty); }, totalPenalty);
                    valid = this.subOrderPenaltys.every(subOrderPenalty => { return subOrderPenalty.penalty >= 0 && subOrderPenalty.penalty !== '' });
                }
                if (!valid) {
                    modal.somethingAlert('违约信息填写有误，请核对！');
                    return false;
                }
                if (this.penalty && this.order.orderType !== -1) {
                    this.subOrderPenaltys[0] = {};
                    this.subOrderPenaltys[0].nodeId = this.subOrders[0].nodeId;
                    this.subOrderPenaltys[0].nodeName = this.subOrders[0].nodeName;
                    this.subOrderPenaltys[0].subOrderType = this.subOrders[0].subOrderType;
                    this.subOrderPenaltys[0].penalty = this.penalty;
                    business.subOrderPenaltys = JSON.stringify(this.subOrderPenaltys);
                } else if (this.subOrderPenaltys.length > 0 && this.order.orderType === -1) {
                    this.subOrderPenaltys.forEach(subOrderPenalty => {
                        this.subOrders.forEach(subOrder => {
                            if (subOrderPenalty.nodeId === subOrder.nodeId) {
                                subOrderPenalty.nodeName = subOrder.nodeName;
                                subOrderPenalty.subOrderType = subOrder.subOrderType;
                            }
                        });
                    });

                    business.subOrderPenaltys = JSON.stringify(this.subOrderPenaltys);
                }
                if (this.need - Number(totalPenalty) === 0) {
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
                    business.penalty = Number(totalPenalty);
                    business.functionType = 0;
                    this.hideModal();
                    this.$emit('showCashier', { type: 'cancel', business });
                }
            }
        },
        components:{
            DdSelect,
            DdOption
        }
    }
</script>

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
                            <span style="margin-left: 24px">已收金额:<span>¥{{paid}}</span></span>
                        </div>
                        <div class="content-item" v-if="order && order.type !== 2">
                            <p class="content-item-title"><span>违约信息</span></p>
                            <div v-if="order && order.type !== -1" >
                                <span>违约金：</span>
                                <inputVaild v-model="penalty"  :placeholder="'请输入违约金'"/>
                            </div>
                            <div v-if="order && order.type === -1">
                                <div class="cashier-getMoney-channels" v-if="subOrderPenaltys.length > 0">
                                    <div class="cashier-getMoney-channel" v-for="(subOrderPenalty, index) in subOrderPenaltys">
                                        <dd-select v-model="subOrderPenalty.nodeId">
                                            <dd-option :key="subOrder.nodeId" v-for="subOrder in subOrders" :value="subOrder.nodeId" :label="`${subOrder.nodeName}(¥${subOrder.totalPrice})`">
                                            </dd-option>
                                        </dd-select>
                                        <inputVaild  v-model="subOrderPenalty.penalty" style="margin-left: 12px" :placeholder="'请输入违约金'"/>
                                        <span class="cashier-delBtn-icon" @click="deletePenalty(index)"></span>
                                    </div>
                                </div>
                                <span class="cashier-addBtn" @click="addPenalty" style="display: inline-flex;">
                                    <span class="cashier-addBtn-icon"></span>
                                    <span style="cursor: pointer">添加违约金</span>
                                     
                                </span>
                            </div>
                      <!--       <div style="margin-top:10px"><label>用余额收取<input type="checkbox" class="dd-checkbox" v-model="PenaltyFee" value="1" style="margin-left:10px" /></label></div> -->
                        </div>
                    </div>
                    <div class="roomModals-footer">
                     <div @click="returnPreStep" class="btn-back"><img src="/static/image/modal/back.png" alt=""></div>
                        <div>
                            <span class="footer-label">{{need > 0 ? '需退' : '需补'}}金额:<span class="order-price-num green">¥{{Math.abs(need.toFixed(2))}}</span></span>
                        <div class="dd-btn dd-btn-primary" @click="cancel">确认取消</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.btn-back{
    cursor: pointer;
}
</style>
<script>
    import http from '../../http';
    import modal from '../../modal';
    import bus from '../../eventBus';
    import { getOrderId } from '../utils/order';
    import { mapState } from 'vuex';
    import { DdSelect, DdOption } from 'dd-vue-component';
    import inputVaild from '../../components/inputVaild.vue';
    export default{
        props: {
            show: Boolean
        },
        data() {
            return {
                cancelFee: 0,
                paid: 0,
                penalty: undefined,
                subOrderPenaltys: [],
                oldPenalty: undefined,
                subOrders: [],
                PenaltyFee: true,
                backPenalty: undefined,
                backSubOrderPenaltys: []
            };
        },
        computed: {
            ...mapState({ order: state => state.orderSystem.orderDetail }),
            need() {
                const penalty = this.subOrderPenaltys.reduce((a, b) => { return a + (Number(b.penalty) || 0); }, 0);
                return this.paid - (this.oldPenalty || 0) - (this.penalty || 0) - penalty;
            }
        },
        watch: {
            show(val) {
                if (val) {
                    this.getCancelOrder();
                    $('#cancelOrder').modal({ backdrop: 'static' });
                } else {
                    $('#cancelOrder').modal('hide');
                }
            }
        },
        methods: {
            showModal() {
                this.penalty = this.backPenalty;
                this.subOrderPenaltys = this.backSubOrderPenaltys.slice(0);
                bus.$emit('showCancelOrder');
            },
            returnPreStep() {
                this.hideModal();
                bus.$emit('back');
            },
            hideModal() {
                this.penalty = undefined;
                this.subOrderPenaltys = [];
                bus.$emit('hideCancelOrder');
            },
            addPenalty() {
                if (this.subOrderPenaltys.length >= this.subOrders.length) {
                    modal.warn('已选择所有违约项目');
                    return false;
                }
                this.subOrderPenaltys.push({ nodeId: this.subOrders[0].nodeId, penalty: undefined });
            },
            deletePenalty(index) {
                this.subOrderPenaltys.splice(index, 1);
            },
            getCancelOrder() {
                http.get('/order/refund4AllOrder', { orderId: getOrderId(this.order), orderType: this.order.type })
                    .then(res => {
                        this.cancelFee = res.data.payments.find(p => p.type === 13).fee;
                        this.paid = res.data.payments.find(p => p.type === 14).fee;
                        this.oldPenalty = res.data.payments.find(p => p.type === 4) ? (res.data.payments.find(p => p.type === 4).fee || 0) : 0;
                        this.subOrders = res.data.subOrdersTotalPriceList;
                    });
            },
            cancel() {
                let totalPenalty = this.penalty || 0;
                const business = {
                    orderId: getOrderId(this.order),
                    orderType: this.order.type
                };
                let valid = true;
                if (this.subOrderPenaltys.length > 0) {
                    totalPenalty = this.subOrderPenaltys.reduce((a, b) => { return Number(a) + Number(b.penalty); }, totalPenalty);
                    valid = this.subOrderPenaltys.every(subOrderPenalty => { return subOrderPenalty.penalty >= 0 && subOrderPenalty.penalty !== ''; });
                }
                if (!valid) {
                    modal.warn('请输入违约金！');
                    return false;
                }
                if (this.subOrderPenaltys.length > 0 && this.order.type === -1) {
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
                this.backPenalty = this.penalty;
                this.backSubOrderPenaltys = this.subOrderPenaltys.slice(0);
                if (Number(this.need) === 0 && !this.PenaltyFee) {
                    http.get('/order/cancel', business)
                        .then(res => {
                            modal.success('取消成功');
                            this.hideModal();
                            bus.$emit('refreshView');
                            bus.$emit('showOrder', this.orderId);
                        });
                } else {
                    bus.$emit('changeBack', this.showModal);
                    business.penalty = Number(totalPenalty);
                    business.functionType = 0;
                    if (this.PenaltyFee) {
                        business.PenaltyFee = Number(totalPenalty);
                    }
                    this.PenaltyFee = true;
                    this.hideModal();
                    bus.$emit('showCashier', { type: 'cancel', business });
                }
            }
        },
        components: {
            DdSelect,
            DdOption,
            inputVaild
        }
    };
</script>

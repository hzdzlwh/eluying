<template>
    <div class="acc-container">
        <div class="acc-header">
            <span class="acc-header-link">
                <router-link to="/calendar">前台录入</router-link>
            </span>
            <span class="acc-header-link">
               <router-link to="/orders">住宿订单</router-link>
            </span>
        </div>
        <router-view></router-view>
        <order-editor
                :registerRooms="registerRooms"
                :order-editor-visible="orderEditorVisible"
                :check-state="checkState"
                :categories="roomCategory"
        ></order-editor>
        <order-detail
                :id="detailId"
                :type="detailType"
                :visible="detailVisible"
        ></order-detail>
        <Check-Out-Modal
        ></Check-Out-Modal>
        <Check-In-Modal
        ></Check-In-Modal>
        <Cashier-Modal
                :show="cashierShow"
                :type="cashierType"
                :business="cashierBusiness"
        ></Cashier-Modal>
        <Cancel-Order-Modal
                :show="cancelOrderShow"
        ></Cancel-Order-Modal>
        <Get-Money-With-Code
                :show="getMoneyShow"
                :type="getMoneyType"
                :business="getMoneyBusiness"
                :params="getMoneyParams"
                :total-price="payWithAlipay"
        ></Get-Money-With-Code>
    </div>
</template>
<style lang="scss">
    .acc-container {
        position: absolute;
        top: 68px;
        bottom: 0;
        left: 0;
        zoom: 1;
        width: 100%;
        min-width: 1200px;
    }
    .acc-header {
        height: 45px;
        box-shadow: 0 2px 2px 0 #dadada;
        padding-left: 405px;
    }
    .acc-header-link {
        height: 100%;
        display: inline-block;
        line-height: 45px;
        margin-right: 20px;
        a {
            color: #999;
            height: 100%;
            display: inline-block;
            text-decoration: none;
            &.active {
                color: #178ce6;
                border-bottom: 2px solid #178ce6;
            }
        }
    }
</style>
<script>
    import bus from '../common/eventBus';
    import OrderDetail from '../ordersManage/components/Detail/OrderDetail.vue';
    import OrderEditor from '../ordersManage/components/OrderEditor/OrderEditor.vue';
    import CheckInModal from '../ordersManage/components/CheckInModal.vue';
    import CheckOutModal from '../ordersManage/components/CheckOutModal.vue';
    import CancelOrderModal from '../ordersManage/components/CancelOrderModal.vue';
    import CashierModal from '../ordersManage/components/CashierModal.vue';
    import GetMoneyWithCode from '../ordersManage/components/GetMoneyWithCode.vue';
    import http from 'http';
    import { mapMutations } from 'vuex';
    import types from '../ordersManage/store/types';

    export default{
        created() {
            bus.$on('onClose', this.hideDetail);
            bus.$on('onShowDetail', this.showOrderDetail);
            bus.$on('editOrder', this.editOrder);
            bus.$on('hideOrderEditor', this.hideOrderEditor);
            bus.$on('showCashier', this.showCashier);
            bus.$on('hideCashier', this.hideCashier);
            bus.$on('showGetMoney', this.showGetMoney);
            bus.$on('hideGetMoney', this.hideGetMoney);
            bus.$on('hideCancelOrder', this.hideCancelOrder);
            bus.$on('showCancelOrder', this.showCancelOrder);
            bus.$on('changeCheckState', this.changeCheckState);
            this.getRoomsList();
        },
        beforeDestroy() {
            bus.$off('onClose', this.hideDetail);
            bus.$off('onShowDetail', this.showOrderDetail);
            bus.$off('editOrder', this.editOrder);
            bus.$off('hideOrderEditor', this.hideOrderEditor);
            bus.$off('showCashier', this.showCashier);
            bus.$off('hideCashier', this.hideCashier);
            bus.$off('showGetMoney', this.showGetMoney);
            bus.$off('hideGetMoney', this.hideGetMoney);
            bus.$off('hideCancelOrder', this.hideCancelOrder);
            bus.$off('showCancelOrder', this.showCancelOrder);
            bus.$off('changeCheckState', this.changeCheckState);
        },
        data() {
            return {
                orderDetailShow: false,
                orderEditorVisible: false,
                orderId: undefined,
                orderDetail: {},
                checkState: undefined,
                registerRooms: [],
                cashierType: '',
                cashierShow: false,
                cancelOrderShow: false,
                getMoneyShow: false,
                getMoneyType: '',
                getMoneyBusiness: {},
                getMoneyParams: {},
                payWithAlipay: 0,
                cashierBusiness: {},
                detailType: undefined,
                detailId: undefined,
                detailVisible: false,
                roomCategory: [] // 订单编辑中使用
            };
        },
        methods: {
            ...mapMutations([types.SET_ORDER_DETAIL]),
            getRoomsList() {
                return http.get('/room/getRoomsList', {})
                    .then(res => {
                        this.roomCategory = res.data.list;
                    });
            },
            showOrderDetail(order) {
                this.detailType = order.type;
                this.detailId = order.orderId;
                this.detailVisible = true;
            },
            hideDetail() {
                this.detailId = undefined;
                this.detailVisible = false;
            },
            changeCheckState(type, rooms) {
                this[types.SET_ORDER_DETAIL]({ orderDetail: {} });
                this.checkState = type;
                this.registerRooms = rooms;
                this.orderEditorVisible = true;
                bus.$emit('register', rooms);
            },
            editOrder(type, order) {
                this.checkState = type;
                this.orderEditorVisible = true;
                this.orderDetail = order;
            },
            showCashier({ type, business }) {
                this.cashierType = type;
                this.cashierBusiness = business;
                this.cashierShow = true;
            },
            hideCashier() {
                this.cashierShow = false;
            },
            showGetMoney({ type, business, params, payWithAlipay }) {
                this.getMoneyType = type;
                this.getMoneyBusiness = business;
                this.getMoneyParams = params;
                this.payWithAlipay = payWithAlipay;
                this.getMoneyShow = true;
            },
            hideGetMoney() {
                this.getMoneyShow = false;
            },
            showCancelOrder() {
                this.cancelOrderShow = true;
            },
            hideCancelOrder() {
                this.cancelOrderShow = false;
            },
            hideOrderEditor() {
                this.orderEditorVisible = false;
            }
        },
        components: {
            OrderEditor,
            OrderDetail,
            CheckOutModal,
            CheckInModal,
            CashierModal,
            CancelOrderModal,
            GetMoneyWithCode
        }
    };
</script>

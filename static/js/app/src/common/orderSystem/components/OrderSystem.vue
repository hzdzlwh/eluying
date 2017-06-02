<template>
    <div>
        <OBJECT ID="ieIdc"
                CLASSID="clsid:63CAB467-5BB8-4CB2-8C87-C8F3B66040C0"
                WIDTH="0" HEIGHT="0" style="float:left;width:0px; height:0px; padding:0px; margin:0px"
        >
            <embed id="myIdc"
                   TYPE="application/x-itst-activex"
                   style="float:left;width:20px; height:20px; visibility: hidden"
                   clsid="{63CAB467-5BB8-4CB2-8C87-C8F3B66040C0}"
                   event_OnStatus="onStatus"
                   event_OnMessage="onMessage"
            >
        </OBJECT>
        <order-editor
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
<style>
    .js-order-num {
        color: #178ce6;
        cursor: pointer;
    }
</style>
<script>
    import OrderDetail from './Detail/OrderDetail.vue';
    import OrderEditor from './OrderEditor/OrderEditor.vue';
    import CheckInModal from './CheckInModal.vue';
    import CheckOutModal from './CheckOutModal.vue';
    import CancelOrderModal from './CancelOrderModal.vue';
    import CashierModal from './CashierModal.vue';
    import GetMoneyWithCode from './GetMoneyWithCode.vue';
    import bus from '../../eventBus';
    import http from '../../http';
    import { mapMutations } from 'vuex';
    import types from '../store/types';

    export default {
        components: {
            OrderDetail,
            OrderEditor,
            CheckInModal,
            CheckOutModal,
            CancelOrderModal,
            CashierModal,
            GetMoneyWithCode
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
                roomCategory: [], // 订单编辑中使用
                bacnHandel: []
            };
        },
        created() {
            bus.$on('changeBack', this.changeBack);
            bus.$on('back', this.back);
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
            document.addEventListener('click', this.handleOrderNumClick);
        },
        beforeDestroy: function() {
            bus.$off('changeBack', this.changeBack);
            bus.$off('back', this.back);
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
            document.removeEventListener('click', this.handleOrderNumClick);
        },
        methods: {
            ...mapMutations([types.SET_ORDER_DETAIL]),
            changeBack(handel, that) {
                this.bacnHandel.unshift(handel);
                if (this.bacnHandel.length > 10) {
                    this.bacnHandel.splice(10, 1);
                }
            },
            back() {
                this.bacnHandel.shift()();
            },
            handleOrderNumClick(ev) {
                const el = ev.target;
                if (!el.classList.contains('js-order-num')) {
                    return;
                }
                http.get('/order/getOrderTypeAndId', { serialNum: el.innerHTML })
                    .then(res => {
                        bus.$emit('onShowDetail', {
                            type: res.data.orderType,
                            orderId: res.data.orderId
                        });
                    });
            },
            getRoomsList() {
                return http.get('/room/getRoomsList', {})
                    .then(res => {
                        this.roomCategory = res.data.list;
                    });
            },
            showOrderDetail(order) {
                if (order) {
                    this.detailType = order.type;
                    this.detailId = order.orderId;
                    this.detailVisible = true;
                } else {
                    this.detailVisible = true;
                }
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
        }
    };
</script>

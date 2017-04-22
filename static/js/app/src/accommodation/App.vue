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
    import Calendar from './components/Calendar.vue';
    import ShopCart from './components/ShopCart.vue';
    import Search from './components/Search.vue';
    import OrderDetail from '../ordersManage/components/Detail/OrderDetail.vue';
    import OrderEditor from '../ordersManage/components/OrderEditor/OrderEditor.vue';
    import CheckInModal from '../ordersManage/components/CheckInModal.vue';
    import CheckOutModal from '../ordersManage/components/CheckOutModal.vue';
    import CancelOrderModal from '../ordersManage/components/CancelOrderModal.vue';
    import CashierModal from '../ordersManage/components/CashierModal.vue';
    import GetMoneyWithCode from '../ordersManage/components/GetMoneyWithCode.vue';
    import http from 'http';
    import util from 'util';
    import { mapMutations } from 'vuex';
    import types from '../ordersManage/store/types';
    export default{
        created() {
            bus.$on('onClose', this.hideDetail);
            bus.$on('onShowDetail', this.showOrderDetail);
            bus.$on('editOrder', this.editOrder);
            bus.$on('hideOrderEditor', this.hideOrderEditor);
            bus.$on('refreshView', this.refreshView);
            bus.$on('showCashier', this.showCashier);
            bus.$on('hideCashier', this.hideCashier);
            bus.$on('showGetMoney', this.showGetMoney);
            bus.$on('hideGetMoney', this.hideGetMoney);
            bus.$on('hideCancelOrder', this.hideCancelOrder);
            bus.$on('showCancelOrder', this.showCancelOrder);
            bus.$on('changeCheckState', this.changeCheckState);
            this.getRoomsList();
        },
        beforeDestroy: function() {
            bus.$off('onClose', this.hideDetail);
            bus.$off('onShowDetail', this.showOrderDetail);
            bus.$off('editOrder', this.editOrder);
            bus.$off('hideOrderEditor', this.hideOrderEditor);
            bus.$off('refreshView', this.refreshView);
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
                categories: [],
                holidays: [],
                roomStatus: [],
                orderList: [],
                startDate: util.diffDate(new Date(), -2),
                DAYS: 30,
                dateRange: [],
                leftMap: {},
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
        computed: {
            startDateStr() {
                return util.dateFormat(this.startDate);
            },
            selectedEntries() {
                const temp = [];
                this.roomStatus.map(r => {
                    const category = this.categories.find(category => category.cId === r.ti);
                    r.st.map(s => {
                        // ShopCart 组件使用
                        if (s.selected) {
                            s.id = r.i;
                            s.cName = category.cName;
                            s.rName = r.sn;
                            s.cId = r.cId;
                            temp.push(s);
                        }
                    });
                });
                return temp;
            }
        },
        methods: {
            ...mapMutations([types.SET_ORDER_DETAIL]),
            getRoomAndStatus() {
                return http.get('/room/getRoomsAndStaus', {
                    date: this.startDateStr,
                    days: this.DAYS,
                    sub: true
                })
                    .then(res => {
                        const { holidays, orderList, rs } = res.data;
                        this.holidays = holidays;
                        this.orderList = orderList;
                        this.leftMap = {};
                        rs.map((r, i) => {
                            r.st.map((s, index) => {
                                s.date = util.diffDate(this.startDate, index);
                                s.dateStr = util.dateFormat(s.date);

                                // 计算库存，不把left放在computed中是为了优化性能
                                // leftMap的结构为{ 房型id: [某天的库存] }
                                if (!this.leftMap[r.ti]) {
                                    this.$set(this.leftMap, r.ti, []);
                                }

                                if (!this.leftMap[r.ti][index]) {
                                    this.leftMap[r.ti][index] = 0;
                                }

                                if (s.s === -1) {
                                    this.leftMap[r.ti][index] ++; // eslint-disable-line
                                }
                            });

                            // 判断是否是该房型的最后一间房，用来折叠房间
                            if (i === rs.length - 1 || r.ti !== rs[i + 1].ti) {
                                r.isLast = true;
                            }
                        });
                        this.roomStatus = rs;
                    });
            },
            getRoomsList() {
                return http.get('/room/getRoomsList', {})
                    .then(res => {
                        this.roomCategory = res.data.list;
                    });
            },
            mapRoomsToCategory() {
                this.categories.map(c => this.$set(c, 'rooms', []));
                this.roomStatus.map(room => {
                    // 将房间加入房型中
                    const category = this.categories.find(category => category.cId === room.ti);
                    room.cId = category.cId;
                    category.rooms.push(room);
                });
            },
            getCategories() {
                return http.get('/room/getRoomCategories', {})
                    .then(res => {
                        this.categories = res.data.list;
                    });
            },
            handleDateChange(date) {
                if (util.isSameDay(util.stringToDate(date), this.startDate)) {
                    return;
                }

                this.startDate = util.stringToDate(date);
                this.getRoomAndStatus();
            },
            refreshView() {
                this.getRoomAndStatus()
                    .then(() => { this.mapRoomsToCategory(); });
            },
            handleRoomFilter(data) {
                this.categories = data;
            },
            handleFold(id) {
                const category = this.categories.find(category => category.cId === id);
                category.folded = !category.folded;
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
            changeRegisterInfoShow(value) {
                this.registerInfoShow = value;
            },
            changeCheckState(type, rooms) {
                this[types.SET_ORDER_DETAIL]({ orderDetail: {}});
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
            changePayMents(obj) {
                this.payMents = obj;
            },
            getDateDiff(date1, date2) {
                const dateStart = new Date(date1);
                const dateEnd = new Date(date2);
                const duration = util.DateDiff(dateStart, dateEnd);
                return duration + 1;
            },
            hideCancelOrder() {
                this.cancelOrderShow = false;
            },
            hideOrderEditor() {
                this.orderEditorVisible = false;
            }
        },
        components: {
            Calendar,
            ShopCart,
            Search,
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

<template>
    <div class="acc-container">
    <SelectGoods :show='show'
            :goodsDate='goodsdate'
            @selectProjectDate='selectProjectDate'
            @Modalclose='goosdClose'
            ></SelectGoods>
            <SelectProject 
            :show=false
            :selectDate='selectDate'
            @close='ProjectClose'
            @selectProjectDate='selectProjectDate'
            ></SelectProject>
            <a @click='show = true'>aaaaa</a>
        <Search @showOrder="showOrder" />
        <Calendar
            @dateChange="handleDateChange"
            @roomFilterChange="handleRoomFilter"
            @fold="handleFold"
            @showOrder="showOrder"
            :categories="categories"
            :holidays="holidays"
            :roomStatus="roomStatus"
            :defaultStartDate="startDateStr"
            :orderList="orderList"
            :startDate="startDate"
            :dateRange="dateRange"
            :leftMap="leftMap"
            :DAYS="DAYS"
        />
        <ShopCart
            :selectedEntries="selectedEntries"
            @changeCheckState="changeCheckState"
        />
        <RegisterInfoModal
            :roomsItems="registerRooms"
            :categories="categories"
            :checkState="checkState"
            :registerInfoShow="registerInfoShow"
            :order="orderDetail"
            @changeRegisterInfoShow="changeRegisterInfoShow"
            @refreshView="refreshView"
            @showOrder="showOrder"
            @showCashier="showCashier"
        />
        <OrderDetailModal
            :orderId="orderId"
            :orderDetailShow="orderDetailShow"
            :order="orderDetail"
            @showCancelOrder="showCancelOrder"
            @hideOrderDetail="hideOrderDetail"
            @showCashier="showCashier"
            @editOrder="editOrder"
        />
        <CheckOutModal
            @refreshView="refreshView"
            @showOrder="showOrder"
            @showCashier="showCashier"
        />
        <CheckInModal
            @showCashier="showCashier"
        />
        <CashierModal
            :show="cashierShow"
            :type="cashierType"
            :business="cashierBusiness"
            @hide="hideCashier"
            @refreshView="refreshView"
            @showOrder="showOrder"
            @showGetMoney="showGetMoney"
        />
        <CancelOrderModal
            :orderId="orderId"
            :show="cancelOrderShow"
            @refreshView="refreshView"
            @showOrder="showOrder"
            @hideCancelOrder="hideCancelOrder"
            @showCashier="showCashier"
        />
        <GetMoneyWithCode
            :show="getMoneyShow"
            :type="getMoneyType"
            :business="getMoneyBusiness"
            :params="getMoneyParams"
            :totalPrice="payWithAlipay"
            @refreshView="refreshView"
            @hide="hideGetMoney"
            @showCashier="showCashier"
            @showOrder="showOrder"
        />
    </div>
</template>
<style>
.acc-container {
    position: absolute;
    top: 68px;
    bottom: 0;
    left: 0;
    zoom: 1;
    width: 100%;
    min-width: 1200px;
}
</style>
<script>
    import SelectGoods from './components/selectGoods.vue';
    import SelectProject from './components/selectProject.vue';
    import Calendar from './components/Calendar.vue';
    import ShopCart from './components/ShopCart.vue';
    import Search from './components/Search.vue';
    import RegisterInfoModal from './components/RegisterInfoModal.vue';
    import OrderDetailModal from './components/OrderDetailModal.vue';
    import CheckOutModal from './components/CheckOutModal.vue';
    import CheckInModal from './components/CheckInModal.vue';
    import CashierModal from './components/CashierModal.vue';
    import CancelOrderModal from './components/CancelOrderModal.vue';
    import GetMoneyWithCode from './components/GetMoneyWithCode.vue';
    import AJAXService from 'AJAXService';
    import util from 'util';
    export default{
        created() {
            Promise.all([
                this.getRoomAndStatus(),
                this.getCategories()
            ])
                .then(() => {
                    this.mapRoomsToCategory();
                    // 去除没有房间的房型
                    this.categories = this.categories.filter(c => c.rooms && c.rooms.length > 0);
                    // 筛选房型标志
                    this.categories.map(c => {
                        this.$set(c, 'selected', true);
                        this.$set(c, 'folded', false);
                    });
                })
        },
        data() {
            return {
                show:false,
                goodsdate:[{
                    cName: '酒水最多十六个字最多就三行十六字',
                    gList:[{
                        i:11,
                        n:11,
                        p:11,
                    },
                    {
                        i:111,
                        n:111,
                        p:111,
                    },
                    {
                        i:1111,
                        n:1111,
                        p:1111,
                    }
                    ]
                },
                {
                    cName: '2',
                    gList:[{
                        i:22,
                        n:22,
                        p:22,
                    },
                    {
                        i:222,
                        n:222,
                        p:222,
                    },
                    {
                        i:2222,
                        n:2222,
                        p:2222,
                    }
                    ]
                }
                ],
                selectDate:[{
                    entertainmentName:'水上最多十六 个字最多就三 行十六字',
                    entertainmentId:1,
                    entertainmentCategoryList:[
                    {
                        entertainmentCategoryName: '水上最多十六 个字最多就三 行十六字',
                        entertainmentId:11
                    },
                    {
                        entertainmentCategoryName: '水上最多十六 个字最多就三 行十六字',
                        entertainmentId:12
                    },
                    {
                        entertainmentCategoryName: '水上最多十六 个字最多就三 行十六字',
                        entertainmentId:13
                    }
                    ]
                },
                {
                    entertainmentName:'水上最多',
                    entertainmentId:2,
                    entertainmentCategoryList:[
                    {
                        entertainmentCategoryName: '水上',
                        entertainmentId:11
                    },
                    {
                        entertainmentCategoryName: '水上',
                        entertainmentId:12
                    },
                    {
                        entertainmentCategoryName: '水上最多十六 个字最多就三 行十六字',
                        entertainmentId:13
                    }
                    ]
                }
                ],
                categories: [],
                holidays: [],
                roomStatus: [],
                orderList: [],
                startDate: util.diffDate(new Date(), -2),
                DAYS: 30,
                dateRange: [],
                leftMap: {},
                orderDetailShow: false,
                registerInfoShow: false,
                orderId: undefined,
                orderDetail: {},
                checkState: undefined,
                registerRooms: [],
                checkOutRooms: {},
                checkInRooms: {},
                cashier: {},
                cashierType: '',
                cashierShow: false,
                cancelOrderShow: false,
                getMoneyShow: false,
                getMoneyType: '',
                getMoneyBusiness: {},
                getMoneyParams: {},
                payWithAlipay: 0,
                cashierBusiness: {}
            }
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
                            s.rName= r.sn;
                            temp.push(s);
                        }
                    })
                });
                return temp;
            }
        },
        methods: {
            selectProjectDate(data) {
                // this.data = data
            },
            selectProjectDate(data) {
                // this.data = data
            },
            ProjectClose(){
                this.show = false
            },
            goosdClose(){
                this.show = false
            },
            getRoomAndStatus() {
                return AJAXService.ajaxWithToken('get', '/room/getRoomsAndStaus', {
                    date: this.startDateStr,
                    days: this.DAYS,
                    sub: true,
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
                                    this.leftMap[r.ti][index] ++;
                                }
                            });

                            // 判断是否是该房型的最后一间房，用来折叠房间
                            if (i === rs.length - 1 || r.ti !== rs[i + 1].ti) {
                                r.isLast = true;
                            }
                        });
                        this.roomStatus = rs;
                    })
            },
            mapRoomsToCategory() {
                this.categories.map(c => this.$set(c, 'rooms', []));
                this.roomStatus.map(room => {
                    // 将房间加入房型中
                    const category = this.categories.find(category => category.cId === room.ti);
                    category.rooms.push(room);
                });
            },
            getCategories() {
                return AJAXService.ajaxWithToken('get', '/room/getRoomCategories', {})
                    .then(res => {
                        this.categories = res.data.list;
                    });
            },
            handleDateChange(date) {
                if (util.isSameDay(util.stringToDate(date), this.startDate)) {
                    return
                }

                this.startDate = util.stringToDate(date);
                this.getRoomAndStatus();
            },
            refreshView() {
                Promise.all([this.getRoomAndStatus()]).then(() => { this.mapRoomsToCategory(); });
            },
            handleRoomFilter(data) {
                this.categories = data;
            },
            handleFold(id) {
                const category = this.categories.find(category => category.cId === id);
                category.folded = !category.folded;
            },
            showOrder(id) {
                this.orderDetailShow = true;
                this.orderId = id;
            },
            hideOrderDetail() {
                this.orderDetailShow = false;
            },
            changeRegisterInfoShow(value){
                this.registerInfoShow = value;
            },
            changeCheckState(type, arr) {
                this.checkState = type;
                this.registerRooms = arr;
                this.registerInfoShow = true;
            },
            editOrder(type, obj) {
              this.checkState = type;
              this.registerInfoShow = true;
              this.orderDetail = obj;
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
                let dateStart = new Date(date1);
                let dateEnd = new Date(date2);
                let duration = util.DateDiff(dateStart, dateEnd);
                return duration + 1;
            },
            hideCancelOrder() {
                this.cancelOrderShow = false;
            }
        },
        components: {
            Calendar,
            ShopCart,
            Search,
            RegisterInfoModal,
            OrderDetailModal,
            CheckOutModal,
            CheckInModal,
            CashierModal,
            CancelOrderModal,
            GetMoneyWithCode,
            SelectProject,
            SelectGoods
        }
    }
</script>

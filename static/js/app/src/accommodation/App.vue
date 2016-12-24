<template>
    <div class="acc-container">
        <Search />
        <Calendar
            @dateChange="handleDateChange"
            @roomFilterChange="handleRoomFilter"
            @fold="handleFold"
            @pullOrder="pullOrderDetail"
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
        />
        <RegisterInfoModal />
        <OrderDetailModal :order="orderDetail"/>
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
    import Calendar from './components/Calendar.vue';
    import ShopCart from './components/ShopCart.vue';
    import Search from './components/Search.vue';
    import RegisterInfoModal from './components/RegisterInfoModal.vue';
    import OrderDetailModal from './components/OrderDetailModal.vue';
    import AJAXService from 'AJAXService';
    import util from 'util';
    export default{
        created() {
            Promise.all([
                this.getRoomAndStatus(),
                this.getCategories()
            ])
                .then(() => {
                    this.roomStatus.map(room => {
                        // 将房间加入房型中
                        const category = this.categories.find(category => category.cId === room.ti);
                        if (!category.rooms) {
                            category.rooms = [];
                        }

                        category.rooms.push(room);
                    });
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
                categories: [],
                holidays: [],
                roomStatus: [],
                orderList: [],
                startDate: util.diffDate(new Date(), -2),
                DAYS: 30,
                dateRange: [],
                leftMap: {},
                orderDetail: {}
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
                            temp.push({ ...s, id: r.i, cName: category.cName, rName: r.sn });
                        }
                    })
                });
                return temp;
            }
        },
        methods: {
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
            handleRoomFilter(data) {
                this.categories = data;
            },
            handleFold(id) {
                const category = this.categories.find(category => category.cId === id);
                category.folded = !category.folded;
            },
            pullOrderDetail(id) {
                return AJAXService.ajaxWithToken('get', '/order/getOrderDetail', { orderId: id })
                        .then(res => {
                            this.orderDetail = res.data;
                            $('#orderDetail').modal('show');
                        });
            }
        },
        components: {
            Calendar,
            ShopCart,
            Search,
            RegisterInfoModal,
            OrderDetailModal
        }
    }
</script>

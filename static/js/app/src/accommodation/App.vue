<template>
    <div class="acc-container">
        <Calendar
            @dateChange="handleDateChange"
            @roomFilterChange="handleRoomFilter"
            @fold="handleFold"
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
    import RegisterInfoModal from './components/RegisterInfoModal.vue';
    import AJAXService from 'AJAXService';
    import util from 'util';
    export default{
        created() {
            Promise.all([
                this.getRoomAndStatus(),
                this.getCategories()
            ])
                .then(() => {
                    // 将房间加入房型中
                    this.roomStatus.map(room => {
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
                leftMap: {}
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
                        rs.map(r => {
                            r.st.map((s, index) => {
                                s.date = util.diffDate(this.startDate, index);

                                // 计算库存，不把left放在computed中是为了优化性能
                                // leftMap的结构为{ 房型id: [某天的库存] }
                                if (s.s === -1) {
                                    if (!this.leftMap[r.ti]) {
                                        this.leftMap[r.ti] = [];
                                    }

                                    if (!this.leftMap[r.ti][index]) {
                                        this.leftMap[r.ti][index] = 1;
                                    } else {
                                        this.leftMap[r.ti][index] ++;
                                    }
                                }
                            });
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
            }
        },
        components: {
            Calendar,
            ShopCart,
            RegisterInfoModal
        }
    }
</script>

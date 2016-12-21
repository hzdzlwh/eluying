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
            :DAYS="DAYS"
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
    import Calendar from './components/Calendar.vue';
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
            }
        },
        computed: {
            startDateStr() {
                return util.dateFormat(this.startDate);
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
            Calendar
        }
    }
</script>

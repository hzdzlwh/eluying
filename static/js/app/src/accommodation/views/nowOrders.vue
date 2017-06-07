<template>
    <div>
        <!-- <Search /> -->
        <Calendar
                :roomStatus="roomStatus"
        />
        <ShopCart
                :selectedEntries="selectedEntries"
        />
    </div>
</template>
<style>

</style>
<script>
    import Search from '../components/Search.vue';
    import Calendar from '../components/dayOrder.vue';
    import ShopCart from '../components/ShopCart.vue';
    import util from '../../common/util';
    import http from 'http';
    import bus from '../../common/eventBus';
    export default {
        data() {
            return {
                categories: [],
                holidays: [],
                roomStatus: [],
                orderList: [],
                startDate: new Date(),
                DAYS: 30,
                dateRange: [],
                leftMap: {}
            };
        },
        created() {
            bus.$on('refreshView', this.refreshView);
            this.getRoomAndStatus();
        },
        beforeDestroy() {
            bus.$off('refreshView', this.refreshView);
        },
        computed: {
            startDateStr() {
                return util.dateFormat(this.startDate);
            },
            selectedEntries() {
                // const temp = [];
                // this.roomStatus.map(r => {
                //     const category = this.categories.find(category => category.cId === r.ti);
                //     r.st.map(s => {
                //         // ShopCart 组件使用
                //         if (s.selected) {
                //             s.id = r.i;
                //             s.cName = category.cName;
                //             s.rName = r.sn;
                //             s.cId = r.cId;
                //             temp.push(s);
                //         }
                //     });
                // });
                // return temp;
                return this.roomStatus;
            }
        },
        methods: {
            getRoomAndStatus() {
                return http.get('/room/getDailyRoomStatus', {
                    date: this.startDateStr
                })
                    .then(res => {
                        this.roomStatus = res.data.list;
                    });
            },
            refreshView() {
                this.getRoomAndStatus();
            }
        },
        components: {
            Search,
            Calendar,
            ShopCart
        }
    };
</script>

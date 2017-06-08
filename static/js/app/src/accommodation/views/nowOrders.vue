<template>
    <div>
        <!-- <Search /> -->
        <Calendar :roomStatus="roomStatus" @changeEnter='changeEnter' :categories='categories' />
        <ShopCart :selectedEntries="selectedEntries" />
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
            leftMap: {},
            selectedEntries: []
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
        }
    },
    methods: {
        getCategories() {
            return http.get('/room/getRoomCategories', {})
                .then(res => {
                    this.categories = res.data.list;
                });
        },
        changeEnter(enter) {
            this.selectedEntries = enter;
        },
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

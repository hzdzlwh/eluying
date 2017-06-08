<template>
    <div>
        <!-- <Search /> -->
        <Calendar :roomStatus="roomStatus" @changeEnter='changeEnter' :categories='categories' :customList='customList' :areaList='areaList' />
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
            selectedEntries: [],
            customList: [],
            areaList: [],
            parms: undefined
        };
    },
    created() {
        bus.$on('refreshView', this.refreshView);
        this.getRoomAndStatus();
        this.getCategories();
        this.getChannels();
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
                        const date = res.data.list;
                        const tamp = {};
                        const list = [];
                        date.forEach(function(element, index) {
                            if (!tamp[element.cName]) {
                                tamp[element.cName] = true;
                                list.push({
                                    name: element.cName,
                                    id: element.cId
                                });
                            }
                        });
                        this.categories = list;
                    });
        },
        getChannels() {
            return http.get('/user/getChannels', {
                isAll: true,
                type: 2
            })
                    .then(res => {
                        const date = res.data.list;
                        const list = [];
                        date.forEach(function(element, index) {
                            list.push({
                                name: element.name,
                                id: element.id
                            });
                            // element.companyList.forEach( function(el, index) {
                            //     list.push({
                            //     name: el.companyName,
                            //     id: el.id
                            // });
                        });
                        this.customList = list;
                    });
        },
        changeEnter(enter) {
            this.selectedEntries = enter;
        },
        getRoomAndStatus() {
            let parms;
            if (this.parms) {
                parms = Object.assign({
                    date: this.startDateStr
                }, this.parms);
            } else {
                parms = {
                    date: this.startDateStr
                };
            }
            return http.get('/room/getDailyRoomStatus', {
                date: this.startDateStr,
                ...this.parms
            })
                    .then(res => {
                        this.roomStatus = res.data.list;
                        if (!parms) {
                            const areaList = this.areaList;
                            res.data.list.forEach(function(element, index) {
                                areaList.push({
                                    id: element.zoneId,
                                    name: element.zoneName
                                });
                            });
                        }
                    });
        },
        refreshView(parms) {
            if (parms) {
                this.parms = parms;
            }
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

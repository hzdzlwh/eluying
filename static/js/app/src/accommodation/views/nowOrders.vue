<template>
    <div>
        <Search style='    position: fixed;
    top: 80px;
    right: 54px;' />
        <Calendar :roomStatus="roomStatus" @changeEnter='changeEnter' @changeDate='changeDate' :categories='categories' :customList='customList' :areaList='areaList' :roomTypeCount='roomTypeCount' />
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
            parms: undefined,
            roomTypeCount: undefined
        };
    },
    created() {
        bus.$on('refreshView', this.refreshView);
            // this.getRoomAndStatus();
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
        changeDate(date) {
            this.startDate = date;
            this.getRoomAndStatus();
        },
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
            let parms; // eslint-disable-line
            if (this.parms) {
                parms = Object.assign({
                    date: this.startDateStr
                }, this.parms);
            } else {
                parms = {
                    date: this.startDateStr
                };
            }
            const areaList = this.areaList;
            http.get('/room/getDailyRoomStatus', {
                date: this.startDateStr,
                ...this.parms
            })
                    .then(res => {
                        this.roomTypeCount = res.data.tag;
                        this.roomStatus = res.data.list;
                        if (!areaList.length) {
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

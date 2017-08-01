<template>
    <div>
        <component v-bind:is="currentView"></component>
    </div>
</template>
<style lang="scss" scoped>
</style>
<script>
    import http from 'http';
    import noCollect from './noCollect.vue';
    import morrowArrive from '../accommodation/morrowArrive.vue';
    import todayArrive from '../accommodation/todayArrive.vue';
    import todayLeave from '../accommodation/todayLeave.vue';
    import morrowLeave from '../accommodation/morrowLeave.vue';
    import todayRoom from '../accommodation/todayRoom.vue';
    import todayGuest from '../accommodation/todayGuest.vue';
    import historyGuest from '../accommodation/historyGuest.vue';
    import businessRoom from '../accommodation/businessRoom.vue';
    import forecastRoom from '../accommodation/forecastRoom.vue';
    import dishesPresent from '../catering/dishesPresent.vue';
    import dishesStatistics from '../catering/dishesStatistics.vue';
    import receiptDetails from '../finance/receiptDetails.vue';
    import receiptGather from '../finance/receiptGather.vue';
    import rechargeDetails from '../finance/rechargeDetails.vue';
    import transferDetails from '../finance/transferDetails.vue';
    import ARGather from '../finance/ARGather.vue';
    import dailyReport from '../manage/dailyReport.vue';
    import saleCollect from '../member/saleCollect.vue';
    import saleDetail from '../member/saleDetail.vue';
    import saleMoney from '../performance/saleMoney.vue';
    import orderNumber from '../performance/orderNumber.vue';
    import performanceDetail from '../performance/performanceDetail.vue';
    import collectList from '../../../collectList.js';
    export default {
        data() {
            return {
                collectList,
                componentName: this.$route.params.id,
                currentView: ''
            };
        },
        created() {
            http.get('/stat/getCollection', {})
                .then(res => {
                    if (res.code === 1) {
                        const centerList = res.data.list;
                        if (centerList.length) {
                            this.currentView = collectList[centerList[0]].component;
                        }
                    } else {
                        window.alert('请求失败');
                    }
                });
        },
        components: {
            noCollect,
            morrowArrive,
            todayArrive,
            todayLeave,
            morrowLeave,
            todayRoom,
            todayGuest,
            historyGuest,
            businessRoom,
            forecastRoom,
            dishesPresent,
            dishesStatistics,
            receiptDetails,
            receiptGather,
            rechargeDetails,
            transferDetails,
            ARGather,
            dailyReport,
            saleCollect,
            saleDetail,
            saleMoney,
            orderNumber,
            performanceDetail
        },
        watch: {
            '$route.path'() {
                if (this.$route.params.id) {
                    this.currentView = collectList[this.$route.params.id].component;
                } else {
                    this.currentView = 'noCollect';
                }
            }
        }
    };
</script>

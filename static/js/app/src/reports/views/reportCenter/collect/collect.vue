<template>
    <div>
        <component v-bind:is="currentView"></component>
    </div>
</template>
<style lang="scss" scoped>
</style>
<script>
    import http from 'http';
    import { mapActions } from 'vuex';
    import bus from '../../../bus.js';
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
    import collectList from '../../../collectList.js';
    export default {
        data() {
            return {
                collectList,
                componentName: this.$route.params.id,
                currentView: 'noCollect'
            };
        },
        created() {
            http.get('/stat/getCollection', {})
                .then(res => {
                    if (res.code === 1) {
                        const centerList = res.data.list;
                        if (centerList.length) {
<<<<<<< HEAD
=======
                            this.currentView = collectList[centerList[0]].component;
>>>>>>> d194fbf766fa8e3ef101d3eb55694ead62ec0f2a
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
            dailyReport
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

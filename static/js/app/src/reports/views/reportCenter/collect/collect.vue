<template>
    <div>
        <component v-bind:is="currentView"></component>
        <!--<morrowArrive :is='componentName === "23"'></morrowArrive>-->
        <!--<todayArrive :is='componentName === "22"'></todayArrive>-->
        <!--<todayLeave :is='componentName === "20"'></todayLeave>-->
        <!--<morrowLeave :is='componentName === "21"'></morrowLeave>-->
        <!--<todayRoom :is='componentName === "301"'></todayRoom>-->
        <!--<todayGuest :is='componentName === "302"'></todayGuest>-->
        <!--<historyGuest :is='componentName === "303"'></historyGuest>-->
        <!--<businessRoom :is='componentName === "19"'></businessRoom>-->
        <!--<forecastRoom :is='componentName === "304"'></forecastRoom>-->
        <!--<dishesPresent :is='componentName === "501"'></dishesPresent>-->
        <!--<dishesStatistics :is='componentName === "502"'></dishesStatistics>-->
        <!--<receiptDetails :is='componentName === "401"'></receiptDetails>-->
        <!--<receiptGather :is='componentName === "402"'></receiptGather>-->
        <!--<transferDetails :is='componentName === "403"'></transferDetails>-->
        <!--<rechargeDetails :is='componentName === "305"'></rechargeDetails>-->
        <!--<ARGather :is='componentName === "405"'></ARGather>-->
        <!--<dailyReport :is='componentName === "18"'></dailyReport>-->
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
            console.log(this.collectList);
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
        // beforeRouteUpdate(to, from, next) {
        //     this.componentName = this.$routes.params.id;
        //     next();
        // }
    };
</script>

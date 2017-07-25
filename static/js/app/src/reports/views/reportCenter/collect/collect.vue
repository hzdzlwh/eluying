<template>
    <div>
        <morrowArrive v-if='componentName === "23"'></morrowArrive>
        <todayArrive v-if='componentName === "22"'></todayArrive>
        <todayLeave v-if='componentName === "20"'></todayLeave>
        <morrowLeave v-if='componentName === "21"'></morrowLeave>
        <todayRoom v-if='componentName === "301"'></todayRoom>
        <todayGuest v-if='componentName === "302"'></todayGuest>
        <historyGuest v-if='componentName === "303"'></historyGuest>
        <businessRoom v-if='componentName === "19"'></businessRoom>
        <forecastRoom v-if='componentName === "304"'></forecastRoom>
        <dishesPresent v-if='componentName === "501"'></dishesPresent>
        <dishesStatistics v-if='componentName === "502"'></dishesStatistics>
        <receiptDetails v-if='componentName === "401"'></receiptDetails>
        <!--<receiptGather v-if='componentName === "302"'></receiptGather>-->
        <transferDetails v-if='componentName === "403"'></transferDetails>
        <rechargeDetails v-if='componentName === "305"'></rechargeDetails>
        <ARDetails v-if='componentName === "404"'></ARDetails>
        <dailyReport v-if='componentName === "18"'></dailyReport>
    </div>
</template>
<style lang="scss" scoped>
</style>
<script>
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
//    import receiptGather from '../finance/receiptGather.vue';
    import rechargeDetails from '../finance/rechargeDetails.vue';
    import transferDetails from '../finance/transferDetails.vue';
    import ARDetails from '../finance/ARDetails.vue';
    import dailyReport from '../manage/dailyReport.vue';
//    import recordedDetails from '../recordedDetails.vue';
    import collectList from '../../../collectList.js';
    export default {
        data() {
            return {
                collectList,
                componentName: this.$route.params.id
            };
        },
        components: {
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
            rechargeDetails,
            transferDetails,
            ARDetails,
            dailyReport
        },
        // beforeRouteUpdate(to, from, next) {
        //     this.componentName = this.$routes.params.id;
        //     next();
        // }
    };
</script>

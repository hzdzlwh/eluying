<template>
    <div class="reports">
        <DataReportMenu></DataReportMenu>
        <router-view></router-view>
        <OrderSystem></OrderSystem>
    </div>
</template>
<style lang="scss" scoped>
    @import "~dd-common-css/src/variables";
    .reports {
        padding-top: 68px;
        position: relative;
    }
</style>
<script>
    import DataReportMenu from './components/DataReportMenu.vue';
    import { OrderSystem } from './../common/orderSystem';
    export default{
        components: {
            DataReportMenu,
            OrderSystem
        }
    };
</script>

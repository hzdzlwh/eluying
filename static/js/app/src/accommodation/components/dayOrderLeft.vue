<template>
    <div :class="{ movedown: $route.path !== '/nowOrders/houseMap'}">
        <slot name="timePicker"></slot>
        <ul>
            <li>
                <router-link to="/nowOrders/houseMap">房态图</router-link>
                <slot name="filterCondition"></slot>
            </li>
            <li>
                <router-link to="/nowOrders/preManage">预定管理</router-link>
            </li>
            <li>
                <router-link to="/nowOrders/houseTable">房态表</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
    };
</script>

<style scoped>
    .movedown{
        position: relative;
        top: 48px;
    }
</style>


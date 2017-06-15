<template>
    <div class="acc-container">
        <div class="acc-header">
            <span class="acc-header-link">
                <router-link to="/calendar">日历房态</router-link>
            </span>
            <span class="acc-header-link">
               <router-link to="/nowOrders">单日房态</router-link>
            </span>
             <span class="acc-header-link">
               <router-link to="/orders">住宿订单</router-link>
            </span>
        </div>
        <router-view></router-view>
        <OrderSystem></OrderSystem>
    </div>
</template>
<style lang="scss">
    .acc-container {
        position: absolute;
        top: 68px;
        bottom: 0;
        left: 0;
        zoom: 1;
        width: 100%;
        min-width: 1200px;
    }
    .acc-header {
        height: 45px;
        box-shadow: 0 2px 2px 0 #dadada;
        padding-left: 405px;
        position: fixed;
        width: 100%;
        z-index: 9;
        background: #fff;
    }
    .acc-header-link {
        height: 100%;
        display: inline-block;
        line-height: 45px;
        margin-right: 20px;
        a {
            color: #999;
            height: 100%;
            display: inline-block;
            text-decoration: none;
            &.active {
                color: #178ce6;
                border-bottom: 2px solid #178ce6;
            }
        }
    }
</style>
<script>
    import { OrderSystem } from '../common/orderSystem';

    export default{
        created() {

        },
        beforeDestroy() {

        },
        data() {
            return {
            };
        },
        methods: {
        },
        components: {
            OrderSystem
        }
    };
</script>

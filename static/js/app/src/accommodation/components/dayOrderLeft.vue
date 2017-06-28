<template>
    <div class="day-order-left" :class="{ movedown: $route.path !== '/nowOrders/houseMap'}">
        <slot name="timePicker"></slot>
        <ul style="min-height: 826px;">
            <li :class="{active: $route.path === '/nowOrders/houseMap'}">
                <span :class="[$route.path === '/nowOrders/houseMap' ? 'map-icon-active' : 'map-icon', ]"></span>
                <router-link to="/nowOrders/houseMap">房态图</router-link>
            </li>
            <slot name="filterCondition"></slot>
            <li :class="{active: $route.path === '/nowOrders/preManage'}">
                <span :class="[$route.path === '/nowOrders/preManage' ? 'manage-icon-active' : 'manage-icon']"></span>
                <router-link to="/nowOrders/preManage">预订管理</router-link>
            </li>
            <li :class="{active: $route.path === '/nowOrders/houseTable'}">
                <span :class="[$route.path === '/nowOrders/houseTable' ? 'table-icon-active' : 'table-icon']"></span>
                <router-link to="/nowOrders/houseTable">房态表</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
    };
</script>

<style lang="scss" scoped>
    .movedown{
        position: relative;
        top: 48px;
    }
    .day-order-left{
        width: 185px;
        background: #f4f4f4;
        box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.15);
        ul{
            li{
                height: 58px;
                line-height: 58px;
                a{
                    margin-left: 4px;
                    color: #666666;
                    font-size: 14px;
                }
                a.active{
                    color: #178ce6;
                }
                span{
                    position: relative;
                    top: 3px;
                    margin-left: 16px;
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                }
                .map-icon{
                    background: url('/static/image/icon/ico6.png');
                }
                .map-icon-active{
                    background: url('/static/image/icon/ico7.png');
                }
                .manage-icon{
                    background: url('/static/image/icon/ico8.png');
                }
                .manage-icon-active{
                    background: url('/static/image/icon/ico9.png');
                }
                .table-icon{
                    background: url('/static/image/icon/ico10.png');
                }
                .table-icon-active{
                    background: url('/static/image/icon/ico11.png');
                }
            }
            li.active{
                border-right: 2px solid #178ce6;
            }
        }
    }
</style>


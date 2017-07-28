<template>
<div class="customer-container">
    <div class="restaurant-top-menu">
        <span>林宝坚尼西餐厅<img src="//static.dingdandao.com/673741C9-0BE5-4670-970E-37383302412F@1x.png" alt=""></span>
        <span>桌位点餐</span>
        <span>餐饮订单</span>
        <span>预订沽清</span>
    </div>
    <ul class='leftMenu'>
        <li v-if="!route.meta.invisible" v-for="route in $router.options.routes" class="leftMenu-item">
            <router-link :to="route.path">{{route.meta.name}}</router-link>
            <ul v-if="route.children && $route.path.indexOf(route.path) > -1" id="leftMenu-children" class="customer-leftMenu-children">
                <li v-for="child in route.children">
                    <router-link :to="child.path">{{child.meta.name}}</router-link>
                </li>
            </ul>
        </li>
    </ul>
    <div class="view-container">
        <router-view></router-view>
    </div>
</div>
</template>
<style lang="scss">
    
</style>
<script>
    export default {
    };
</script>

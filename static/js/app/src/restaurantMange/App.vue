<template>
<div class="restaurant-mange">
    <div class="restaurant-top-menu">
        <span class="restmange-list-menu"><span class="restmange-list-select">林宝坚尼西餐厅</span><img src="//static.dingdandao.com/673741C9-0BE5-4670-970E-37383302412F@1x.png" alt=""></span>
        <div class="dividor">
        </div>
        <router-link to='/view/restaurantMange/order' class='restmange-link'>桌位点餐</router-link>
        <router-link to='/view/restaurantMange/orderList' class='restmange-link'>餐饮订单</router-link>
        <router-link to='/view/restaurantMange/book' class='restmange-link'>预订沽清</router-link>
    </div>
    <div class="restaurant-container">
        <ul class='leftMenu' v-if='$route.meta.invisible'>
            <li v-if="route.meta.invisible" v-for="route in $router.options.routes" class="leftMenu-item">
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
</div>
</template>
<style lang="scss">
.restaurant-mange{
    padding-top: 68px;
    position: relative;
    .leftMenu{
        top:118px;
    }
    .restaurant-top-menu{
        z-index:1;
        position: fixed;
        width: 100%;
        height: 50px;
        z-index: 1500;
        background: #fbfbfb;
        border-bottom: 1px solid #ccc;
        box-shadow: 0px 1px 3px #dadada;
        padding-left:200px;
        .restmange-list-menu{
            width: 168px;
            display: inline-block;
            text-align: right;
            .restmange-list-select{
               
            }
            img{
                position: absolute;
                right: 17px;
                top: 31px;
            }
        }
        .dividor{
               height: 30px;
    width: 1px;
    background: #666666;
    margin-left: 184px;
    margin-top: 12px;
    float: left;
        }
        .restmange-link{
            font-size: 16px;
            color: #999;
            margin-left: 16px;
            letter-spacing: 0;
            height: 68px;
            line-height: 68px;
            text-align: left;
            float: left;
            cursor: pointer;
        }
    }
    .restaurant-container{

    }
}

</style>
<script>
    export default {
    };
</script>

<template>
<div class="restaurant-mange">
    <div class="restaurant-top-menu">
    <div class='restmange-list-menu'>
        <dd-select v-model='restId' placeholder="请选择入住类型" >
            <dd-option v-for="rest in restaurantList" :value="rest.restId" :key="rest.restId" :label="rest.restName">
            </dd-option>
        </dd-select>
        </div>
        <router-link to='/order' class='restmange-link'>桌位点餐</router-link>
        <router-link to='/orderList' class='restmange-link'>餐饮订单</router-link>
        <router-link to='/book' class='restmange-link'>预订沽清</router-link>
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
        z-index: 1;
        background: #fbfbfb;
        border-bottom: 1px solid #ccc;
        box-shadow: 0px 1px 3px #dadada;
        padding-left:200px;
        .restmange-list-menu{
            width: 168px;
            display: inline-block;
            float: left;
            position: relative;
            margin-top: 12px;
            border-right: 1px black solid;
            height: 27px;
            padding-right: 10px;
        }     
        .restmange-list-select{
           
        }
        img{
            position: absolute;
            right: 17px;
            top: 31px;
        }
        .restmange-link{
            font-size: 16px;
            color: #999;
            margin-left: 16px;
            letter-spacing: 0;
            height: 49px;
            line-height: 49px;
            text-align: left;
            float: left;
            cursor: pointer;
        }
    }
    .restaurant-container{
        margin-top:50px;
    }
}

</style>
<script>
import { mapState, mapMutations } from 'vuex';
import http from '../common/http.js';
import {
    DdSelect,
    DdOption
} from 'dd-vue-component';
export default {
    data() {
        return {
            restId: 0,
            restaurantList: []
        };
    },
    computed: mapState({
        RestState: state => state.restId
    }),
    watch: {
        restId(val) {
            this.setRest({ restId: val });
        }
    },
    methods: {
        ...mapMutations([
            'setRest'
        ]),
        getRestList() {
            http.get('/restaurant/listSimple').then(res => {
                this.restaurantList = res.data.list;
                const initId = res.data.list[0].restId;
                if (!this.RestState) {
                    this.setRest({ restId: initId });
                }
                this.restId = this.RestState;
            });
        }
    },
    components: {
        DdSelect,
        DdOption
    },
    created() {
        this.getRestList();
    }
};
</script>

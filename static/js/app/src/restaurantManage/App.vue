<template>
<div class="restaurant-mange">
    <div class="restaurant-top-menu">
    <div class='restmange-list-menu'>
        <div class="restmange-list-select" @click='changeMenu'  v-clickoutside='closeMenu' :title='getName(restId)'>{{getName(restId)}}<img src="//static.dingdandao.com/673741C9-0BE5-4670-970E-37383302412F@1x.png" class="upload">
        <div class="restmange-menu-containe" ref='restmangeMenuContaine' :style='{maxHeight: menuHeight,visibility : menuHeight !== "0" ? "visible": "hidden"}'>
            <div class="restmange-menu-item" v-for='item in restaurantList' :key='item.restId' @click='setRestId(item.restId)' :title='item.restName'>
                {{item.restName}}
            </div>
        </div>
        </div>
        </div>
        <router-link to='/order' class='restmange-link'>桌位点餐</router-link>
        <router-link to='/orderList' class='restmange-link'>餐饮订单</router-link>
        <router-link to='/book' class='restmange-link'>预订沽清</router-link>
    </div>
    <div class="restaurant-mange-container">
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
    <OrderSystem/>
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
        z-index:1070;
        position: fixed;
        width: 100%;
        height: 50px;
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
            border-right: 1px #d3dce5 solid;
            height: 27px;
            padding-right: 10px;
            .restmange-list-select{
                cursor:pointer;
                text-align: right;
                padding-right: 23px;
                line-height: 26px;
                color: #999;
                 max-width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
            }
            .restmange-menu-containe{
                cursor:pointer;
                background:#ffffff;
                border:1px solid #d3dce6;
                box-shadow:0 2px 4px 0 rgba(0,0,0,0.12), 0 0 6px 0 rgba(0,0,0,0.04);
                border-radius:2px;
                height:190px;
                overflow-y: scroll;
                font-size: 14px;
                font-weight: normal;
                text-align:left;
                margin-left: 45px;
                width:106px;
                transition: max-height 0.3s linear;
                .restmange-menu-item{
                    padding:10px;
                    font-size:14px;
                    color:#475669;
                    max-width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }     
        .restmange-list-select{
           
        }
        img{
            position: absolute;
            right: 17px;
            top: 10px;
        }
        .restmange-link{
            text-decoration: none;
            font-size: 16px;
            color: #999;
            margin-left: 16px;
            letter-spacing: 0;
            height: 49px;
            line-height: 49px;
            text-align: left;
            float: left;
            cursor: pointer;
            position: relative;
            &:hover{
                color:#178ce6;
            }
        }
        .active{
            // &:after{
            // content: '';
            // position: absolute;
            // bottom: 0;
            // right: 50%;
            // width: 0;
            // height: 0;
            // border-left: 5px solid transparent;
            // border-right: 5px solid transparent;
            // border-bottom: 6px solid #323422;
            // }
            color:#178ce6;
            border-bottom: 3px solid #178ce6;
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
import Clickoutside from 'dd-vue-component/src/utils/clickoutside';
import restBus from './event.js';
import {
    DdSelect,
    DdOption
} from 'dd-vue-component';
export default {
    data() {
        return {
            restId: 0,
            restaurantList: [],
            menuHeight: '0'
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
        setRestId(id) {
            this.restId = id;
            restBus.$emit('changeRestId');
        },
        changeMenu() {
            if (this.menuHeight === '400px') {
                this.menuHeight = '0';
            } else {
                this.$refs.restmangeMenuContaine.scrollTop = 0;
                this.menuHeight = '400px';
            }
        },
        closeMenu() {
            this.menuHeight = '0';
        },
        getName(restId) {
            if (restId) {
                const selected = this.restaurantList.find(item => item.restId === restId);
                return selected.restName;
            }
        },
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
    directives: {
        Clickoutside
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

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
        <div class="roomOutTip" v-if='roomTipStatus && roomTipStatus.show && ($route.path === "/nowOrders/houseMap" || $route.path === "/calendar")'>{{roomTipStatus.tips}}<span class="close-icon" @click='closeTip'>+</span></div>
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

.roomOutTip {
    color:#fff;
    background: #178ce6;
    width: 100%;
    height: 24px;
    text-align: center;
    position: absolute;
    top: 46px;
    z-index: 2;
    line-height:24px;
    .close-icon{
    cursor: pointer;
    transform: rotate(45deg);
    font-size: 30px;
    position: absolute;
    right: 10px;
    }
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
import {
    OrderSystem
} from '../common/orderSystem';
import {
    mapMutations,
    mapActions
} from 'vuex';
import type from '../common/orderSystem/store/types';
export default {
    created() {
        this[type.LOAD_ROOMTIP]();
    },
    beforeDestroy() {

    },
    computed: {
        roomTipStatus() {
            return this.$store.state.orderSystem.roomTipStatus;
        },
        clostTipsShow() {
            return window.sessionStorage.getItem('clostTipsShow') === '1';
        }
    },
    data() {
        return {};
    },
    methods: {
        ...mapMutations([
            type.SET_TIPSSHOW
        ]),
        ...mapActions([type.LOAD_ROOMTIP]),
        closeTip() {
            this[type.SET_TIPSSHOW](false);
        }
    },
    components: {
        OrderSystem
    }
};
</script>

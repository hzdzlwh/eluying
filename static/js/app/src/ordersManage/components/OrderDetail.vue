<template>
    <order-container :type="type" :order="order">
        <AccommodationOrder :order="order" v-if="(order.rooms && order.rooms.length > 0) || order.roomInfo" :showMoadl='order.roomInfo ? false : true' />
        <CateOrder :order="order" v-if="showCateOrderComponent" />
        <EntertainmentOrder :order="order" v-if="order.playItems && order.playItems.length > 0" />
        <EntertainmentOrderDetail :order="order" v-if="order.enterItems && order.enterItems.length > 0" />
        <ShopOrder :order="order" v-if="showShopOrderComponent" />
    </order-container>
</template>
<style>
</style>
<script>
    import OrderContainer from './OrderContainer.vue';
    import { ORDER_TYPE } from '../constant';
    import { mapActions, mapState } from 'vuex';
    import types from '../store/types';
    import CateOrder from './CateOrder.vue';
    import ShopOrder from './ShopOrder.vue';
    import EntertainmentOrder from './EntertainmentOrder.vue';
    import EntertainmentOrderDetail from './EntertainmentOrderDetail.vue';
    import AccommodationOrder from './AccommodationOrder.vue';

    export default{
        data() {
            return {
                ORDER_TYPE
            };
        },
        components: {
            OrderContainer,
            CateOrder,
            ShopOrder,
            EntertainmentOrder,
            AccommodationOrder,
            EntertainmentOrderDetail
        },
        props: {
            type: Number,
            visible: Boolean,
            id: Number
        },
        watch: {
            visible(val) {
                if (val) {
                    $('#orderDetail').modal('show');
                } else {
                    $('#orderDetail').modal('hide');
                }
            },
            id(orderId) {
                this[types.GET_ORDER_DETAIL]({ orderId, orderType: this.type });
            }
        },
        computed: {
            ...mapState({order: 'orderDetail'}),
            showShopOrderComponent() {
                const combineShow = this.order.pcGoodsItems && this.order.pcGoodsItems.length > 0;
                const singleShow = this.order.itemList && this.order.itemList.length > 0;
                return combineShow || singleShow;
            },
            showCateOrderComponent() {
                const combineShow = this.order.foodItems && this.order.foodItems.length > 0;
                const singleShow = this.order.itemsMap && this.order.itemsMap.length > 0;
                return combineShow || singleShow;
            }
        },
        methods: {
            ...mapActions([
                types.GET_ORDER_DETAIL,
                types.LOAD_ROOM_BUSINESS_INFO
            ])
        }
    };
</script>

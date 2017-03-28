<template>
    <order-container :type="type" :order="order">
        <AccommodationOrder />
        <EntertainmentOrder />
    </order-container>
</template>
<style>
</style>
<script>
    import CombinationOrder from './CombinationOrder.vue';
    import { ORDER_TYPE } from '../constant';
    import { mapActions, mapState } from 'vuex';
    import types from '../store/types';
    import caterOrder from './caterOrder.vue';
    import shopOrder from './shopOrder.vue';
    import EntertainmentOrder from './EntertainmentOrder.vue';
    import AccommodationOrder from './AccommodationOrder.vue';

    export default{
        data() {
            return {
                ORDER_TYPE
            };
        },
        components: {
            CombinationOrder
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
        },
        methods: {
            ...mapActions([
                types.GET_ORDER_DETAIL,
                types.LOAD_ROOM_BUSINESS_INFO
            ])
        }
    };
</script>

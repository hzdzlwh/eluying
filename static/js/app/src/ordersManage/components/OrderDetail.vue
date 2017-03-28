<template>
    <div class="modal fade roomModals" id="orderDetail" role="dialog" data-backdrop="static">
        <combination-order v-if="type === ORDER_TYPE.COMBINATION" :order="order" />
    </div>
</template>
<style>
</style>
<script>
    import CombinationOrder from './CombinationOrder.vue';
    import { ORDER_TYPE } from '../constant';
    import { mapActions, mapState } from 'vuex';
    import types from '../store/types';

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
            ]),
        }
    };
</script>

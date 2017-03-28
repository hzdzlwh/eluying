<template>
    <div>
        <CombinationOrder v-if="type === ORDER_TYPE.COMBINATION" :order="order" />
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
        props: {
            type: Number,
            order: {
                Object
            },
            visible: Boolean,
            readOnly: {
                type: Boolean,
                default: true
            },
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
            id(orderID) {
                this[types.GET_ORDER_DETAIL]({ orderID, orderType: this.type });
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

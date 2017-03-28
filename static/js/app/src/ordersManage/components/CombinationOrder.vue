<template>
    <OrderContanier :type="type">
        <solt>

        </solt>
    </OrderContanier>
</template>
<style>
</style>
<script>
    import OrderContanier from './OrderContanier.vue';
    import { ORDER_TYPE } from '../constant';
    export default{
        components: {
            OrderDetail
        },
        props: {
            visible: Boolean
        },
        data() {
            return {
                type: ORDER_TYPE.COMBINATION
            };
        },
        watch: {
            visible(val) {
                if (val) {
                    $(`#${this.type}`).modal('show');
                } else {
                    $(`#${this.type}`).modal('hide');
                }
            }
        },
        methods: {}
    };
</script>

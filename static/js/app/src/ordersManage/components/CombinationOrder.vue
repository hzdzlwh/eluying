<template>
    <order-container :type="type" :order="order">
        <div>hellow</div>
    </order-container>
</template>
<style>
</style>
<script>
    import OrderContainer from './OrderContainer.vue';
    import { ORDER_TYPE } from '../constant';
    export default{
        components: {
            OrderContainer
        },
        props: {
            visible: Boolean,
            order: Object
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
        methods: {
            hi() {
                console.log('qwe')
            }
        }
    };
</script>

<template>
    <div>
        <CombinationOrder v-if="" :order="order" />

    </div>
</template>
<style>
</style>
<script>
    import CombinationOrder from './CombinationOrder.vue';
    export default{
        data() {
            return {};
        },
        props: {
            type: Number,
            order: {
                Object
            },
            visible: Boolean
        },
        watch: {
            visible(val) {

            }
        },
        methods: {}
    };
</script>

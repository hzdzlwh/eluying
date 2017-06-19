<template>
    <div>
        <dayOrderLeft>
            <DateSelect slot="timePicker" :defaultDate="defaultStartDate" @change='changeDate' :width='185' :disabledDate='true' />
        </dayOrderLeft>
    </div>
</template>

<script>
    import dayOrderLeft from '../components/dayOrderLeft.vue';
    import DateSelect from '../components/DateSelect.vue';
    export default {
        data() {
            return {
                defaultStartDate: undefined
            };
        },
        components: {
            dayOrderLeft,
            DateSelect
        },
        methods: {
            changeDate() {
            }
        }
    };
</script>

<style>
    
</style>

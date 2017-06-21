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
    import http from '../../common/http';

    export default {
        data() {
            return {
                defaultStartDate: undefined,
                date: new Date()
            };
        },
        components: {
            dayOrderLeft,
            DateSelect
        },
        methods: {
            changeDate(date) {
                this.date = date;
            },
            getLists() {
                http.get('/room/getBookListByDate', { date: this.date }).then(res => {
                    if (res.code === 1) {
                    }
                });
            }
        },
        watch: {
            date() {
                this.getLists();
            }
        }
    };
</script>

<style>
    
</style>

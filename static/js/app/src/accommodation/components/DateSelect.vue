<template>
    <span class="calendar-date-select">
        <span @click="handleClick">{{dateStr}}</span>
        <DdDatepicker v-model="date" ref="datepicker"/>
    </span>
</template>
<style>
    .calendar-date-select .dd-datepicker-input {
        display: none;
    }
</style>
<script>
    import { DdDatepicker } from 'dd-vue-component';
    import { dateFormat, stringToDate, dateFormatWithoutYear } from '../../common/util';
    export default{
        props: {
            defaultDate: {
                type: String,
                default: dateFormat(new Date()),
            },
            onChange: Function,
        },
        data(){
            return{
                date: undefined,
            }
        },
        created() {
            this.date = this.defaultDate;
        },
        computed: {
            dateStr() {
                return dateFormatWithoutYear(stringToDate(this.date));
            }
        },
        methods: {
            handleClick(ev) {
                ev.stopPropagation();
                this.$refs.datepicker.toggleCalendar();
            }
        },
        components: {
            DdDatepicker,
        }
    }
</script>

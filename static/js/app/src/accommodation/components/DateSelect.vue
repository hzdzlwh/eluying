<template>
    <div class="calendar-date-select">
        <div @click="handleClick">
            <span class="calendar-date-label" style="cursor: pointer">{{dateStr}}</span>
        </div>
        <DdDatepicker v-model="date" ref="datepicker"/>
    </div>
</template>
<style>
    .calendar-date-select .dd-datepicker-input {
        display: none;
    }
    .calendar-date-select {
        width: 140px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        background: #f8f9fc;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
        cursor: pointer;
    }
    .calendar-date-label::after {
        display: inline-block;
        content: '';
        width: 16px;
        margin-left: 10px;
        vertical-align: text-top;
        height: 16px;
        background: url(../../../../../image/calendar.png);
    }
    .calendar-date-select .dd-datepicker-calendar {
        position: relative !important;
        top: 0 !important;
    }
</style>
<script>
    import { DdDatepicker } from 'dd-vue-component';
    import { dateFormat, stringToDate, dateFormatWithoutYear } from '../../common/util';
    export default{
        props: {
            defaultDate: {
                type: String,
                default: dateFormat(new Date())
            },
            onChange: Function
        },
        data() {
            return {
                date: undefined
            };
        },
        watch: {
            date(v) {
                this.$emit('change', v);
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
            DdDatepicker
        }
    };
</script>

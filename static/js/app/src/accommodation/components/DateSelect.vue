<template>
    <div class="calendar-date-select" :style='{width: width ? width + "px" : "140px "}'>
        <div @click="handleClick" :style='{width: width ? width + "px" : "140px "}'>
            <span class="calendar-date-label" style="cursor: pointer">{{dateStr}}</span>
        </div>
        <DdDatepicker v-model="date" ref="datepicker" :disabled-date="disabledEndDate(new Date())" v-if='disabledDate' />
        <DdDatepicker v-model="date" ref="datepicker" v-else />
    </div>
</template>
<style>
.calendar-date-select .dd-datepicker-input {
    display: none;
}

.calendar-date-select {
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
import {
    DdDatepicker
} from 'dd-vue-component';
import {
    dateFormat,
    stringToDate,
    dateFormatWithoutYear,
    isSameDay
} from '../../common/util';
export default {
    props: {
        defaultDate: {
            type: String,
            default: dateFormat(new Date())
        },
        disabledDate: {
            type: Boolean,
            default: false
        },
        onChange: Function,
        width: Number
    },
    data() {
        return {
            date: undefined
        };
    },
    watch: {
        date(n, o) {
            this.$emit('change', n);
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
        disabledEndDate(startDate) {
            if (isSameDay(new Date(startDate), new Date())) {
                const str1 = dateFormat(new Date());
                const arr1 = str1.split('-');
                return (date) => {
                    return (date.valueOf() < (new Date(arr1[0], arr1[1] - 1, arr1[2])).valueOf());
                };
            } else {
                const str = dateFormat(new Date(startDate));
                const arr = str.split('-');
                const str1 = dateFormat(new Date());
                const arr1 = str1.split('-');
                return (date) => {
                    return (date.valueOf() > (new Date(arr[0], arr[1] - 1, arr[2])).valueOf()) || (date.valueOf() > (new Date(arr1[0], arr1[1] - 1, arr1[2])).valueOf());
                };
            }
        },
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

<template>
    <div class="calendar">
        <div class="calendar-header">
            <div class="calendar-header-picker">
                <DateSelect />
                <RoomFilter />
            </div>
            <div class="calendar-header-timeline">
                <table class="calendar-header-table">
                    <tbody>
                    <tr>
                        <th class="calendar-header-item" v-for="d in dateRange">
                            <div class="calendar-header-date"
                                 :class="{'today':d.isToday, 'weekend': d.weekday == '周五' || d.weekday == '周六'}"
                            >
                                <div class="calendar-header-day">
                                    {{d.dateStr}}
                                    <div class="eluyun_rest_outer spriteImg isHoliday" v-if="d.isHoliday">
                                        <div class="eluyun_rest"></div>
                                    </div>
                                </div>
                                <div class="calendar-header-desc">{{d.weekday}}</div>
                            </div>
                            <div class="calendar-header-left">剩</div>
                        </th>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="calendar-body">
            <div class="calendar-leftHeader">
                <div class="calendar-category" v-for="c in categories">
                    <div class="calendar-category-name">
                        <span class="calendar-category-name-text">{{c.cName}}</span>
                    </div>
                    <div class="calendar-category-list">
                        <div class="calendar-category-room" v-for="r in c.rooms">{{r.sn}}</div>
                    </div>
                </div>
            </div>
            <div class="calendar-status-list">
                <table class="calendar-status-table">
                    <tbody>
                        <tr class="calendar-status-row" v-for="room in roomStatus">
                            <td class="calendar-status" v-for="status in room.st">
                                <div class="calendar-status-inner">
                                    <div class="calendar-status-date">{{status.date}}</div>
                                    <div class="calendar-status-price">￥{{status.p}}</div>
                                    <div class="calendar-status-name">{{room.sn}}</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<style lang="sass">
    @import "~dd-common-css/src/variables";
    .calendar {
       height: 100%;
        width: 100%;
    }
    .calendar-header-picker {
        width: 140px;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 2;
    }
    .calendar-leftHeader {
        border-right: solid thin #e6e6e6;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        background: #f8f9fc;
        width: 140px;
        overflow-x: scroll;
        overflow-y: hidden;
    }
    .calendar-category {
        width: 100%;
        height: auto;
        position: relative;
    }
    .calendar-category-name {
        width: 74px;
        top: 0;
        bottom: 0;
        left: 0;
        position: absolute;
        border-right: solid thin #e6e6e6;
        border-bottom: solid thin #e6e6e6;
    }
    .calendar-category-name-text {
        width: 42px;
        height: 40px;
        margin-left: -21px;
        margin-top: -20px;
        position: absolute;
        left: 50%;
        top: 50%;
    }
    .calendar-category-list {
        display: inline-block;
        vertical-align: top;
        width: 66px;
        margin-left: 74px;
        height: auto;
    }
    .calendar-category-room {
        width: 100%;
        line-height: 48px;
        text-align: center;
        border-bottom: solid thin #e6e6e6;
        height: 48px;
    }
    .calendar-header {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        z-index: 1;
        height: 80px;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .calendar-header-timeline {
        position: absolute;
        left: 140px;
    }
    .calendar-header-table {
        width: 100%;
        table-layout: fixed;
    }
    .calendar-header-item {
        width: 100px;
    }
    .calendar-header-date {
        width: 100%;
        height: 48px;
        text-align: center;
        background: #f8f9fc;
        border-bottom: solid thin #e6e6e6;
        border-right: solid thin #e6e6e6;
        position: relative;
    }
    .calendar-header-day {
        width: 100%;
        height: 25px;
        line-height: 25px;
    }
    .calendar-header-desc {
        width: 100%;
        height: 25px;
        line-height: 25px;
    }
    .calendar-header-left {
        width: 100%;
        height: 32px;
        background: #f8f9fc;
        text-align: center;
        line-height: 32px;
        border-bottom: solid thin #e6e6e6;
        border-right: solid thin #e6e6e6;
    }
    .calendar-body {
        position: absolute;
        top: 80px;
        bottom: 0;
        width: 100%;
    }
    .calendar-status-list {
        will-change: transform;
        transform: translateZ(0);
        position: absolute;
        margin-top: -1px;
        left: 140px;
        right: 0;
        top: 0;
        bottom: 0;
        overflow: scroll;
    }
    .calendar-status-table {
        width: 100%;
        table-layout: fixed;
    }
    .calendar-status-row {
        display: table-row;
    }
    .calendar-status {
        width: 100px;
        height: 48px;
        background: white;
        border-right: solid thin #e6e6e6;
        border-bottom: solid thin #e6e6e6;
    }
    .calendar-status-inner {
        width: 100%;
        height: 100%;
        margin: auto;
        margin-top: 2px;
        font-size: 12px;
        position: relative;
        line-height: 48px;
        text-align: center;
    }
    .calendar-status-date {
        width: 45px;
        height: 17px;
        position: absolute;
        left: 3px;
        top: 5px;
        line-height: 17px;
        text-align: left;
    }
    .calendar-status-price {
        width: 49px;
        height: 17px;
        position: absolute;
        right: 3px;
        top: 5px;
        line-height: 17px;
        text-align: right;
    }
    .calendar-status-name {
        width: 92px;
        height: 17px;
        position: absolute;
        left: 1px;
        bottom: 5px;
        line-height: 17px;
        text-overflow: ellipsis;
        text-align: center;
    }
</style>
<script>
    import DateSelect from './DateSelect.vue';
    import RoomFilter from './RoomFilter.vue';
    export default{
        props: {
            categories: Array,
            dateRange: Array,
            holidays: Array,
            roomStatus: Array,
        },
        components: {
            DateSelect,
            RoomFilter,
        }
    }
</script>

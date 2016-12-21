<template>
    <div class="calendar">
        <div class="calendar-picker">
            <DateSelect @change="handleDateChange" :defaultDate="defaultStartDate"/>
            <RoomFilter @change="handleRoomFilter" :categories="categories" />
        </div>
        <div ref="calendarHeader" class="calendar-header">
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
                        <div class="calendar-header-left">剩{{d.left}}间</div>
                    </th>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="calendar-body">
            <div ref="calendarLeftHeader" class="calendar-leftHeader">
                <div class="calendar-category" v-for="c in categories" v-if="c.selected">
                    <div class="calendar-category-name" @click="fold(c)">
                        <span class="calendar-category-name-text">{{c.cName}}</span>
                    </div>
                    <div class="calendar-category-list">
                        <div class="calendar-category-room" v-if="!c.folded" v-for="r in c.rooms">{{r.sn}}</div>
                    </div>
                </div>
            </div>
            <div class="calendar-status-list" @scroll="handleStatusScroll">
                <table class="calendar-status-table">
                    <tbody>
                        <tr class="calendar-status-row" v-for="room in finalRoomStatus" v-if="room.selected">
                            <td class="calendar-status" v-for="(status, index) in room.st">
                                <div v-if="status.s === -1" class="calendar-status-inner" :class="{'selected': status.selected}" @click="selectStatus(status)">
                                    <div class="calendar-status-info">
                                        <div class="calendar-status-date">{{dateRange[index].dateStr}}</div>
                                        <div class="calendar-status-price">￥{{status.p}}</div>
                                        <div class="calendar-status-name">{{room.sn}}({{room.cName}})</div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="calendar-glyph"
                     :class="{'glyph-start': g.seeStart, 'glyph-book': g.roomState === 0, 'glyph-ing': g.roomState === 1, 'glyph-finish': g.roomState === 2}"
                     v-for="g in glyphs"
                     :style="{left: `${g.left}px`, width: `${g.width}px`, top: `${g.top}px`}">
                    <b class="calendar-glyph-name">{{g.customerName}}</b>
                    <div class="calendar-glyph-info">
                        <span class="calendar-glyph-channel">{{g.channelName}}</span>
                        <img class="" src="//static.dingdandao.com/book.png" v-if="g.roomState === 0">
                        <img class="" src="//static.dingdandao.com/ing.png" v-if="g.roomState === 1">
                        <img class="" src="//static.dingdandao.com/finish.png" v-if="g.roomState === 2">
                    </div>
                </div>
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
        will-change: transform;
        transform: translateZ(0);
        border-right: solid thin #ccc;
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
        left: 140px;
        z-index: 1;
        height: 80px;
        margin-left: 1px;
        overflow-x: hidden;
        overflow-y: scroll;
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
        position: relative;
        width: 100px;
        height: 48px;
        background: white;
        border-right: solid thin #e6e6e6;
        border-bottom: solid thin #e6e6e6;
    }
    .calendar-status:hover {
        .calendar-status-inner {
            display: block;
        }
        .calendar-status-inner.selected::after {
            display: none;
        }
        .calendar-status-info {
            display: block !important;
        }
    }
    .calendar-status-inner {
        width: 96px;
        height: 44px;
        margin: auto;
        margin-top: 2px;
        font-size: 12px;
        position: relative;
        line-height: 48px;
        text-align: center;
        display: none;
        border: 1px solid $blue;
        &.selected {
             background: #e6f1ff;
             display: block;
             border: solid thin $blue;
            .calendar-status-info {
                display: none;
            }
            &::after {
                content: '';
                position: absolute;
                 top: 1px;
                 left: 40px;
                 width: 16px;
                 height: 32px;
                 border: 1px solid $blue;
                 border-top-width: 0;
                 border-left-width: 0;
                 transform: rotate(45deg);
            }
        }
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
    .calendar-glyph {
        position: absolute;
        height: 44px;
        color: white;
        padding-left: 8px;
    }
    .glyph-book {
        background: #ffba75;
        &.glyph-start {
             border-left: 6px solid #f27c05;
        }
    }
    .glyph-ing {
        background: #82beff;
        &.glyph-start {
             border-left: 6px solid $blue;
        }
    }
    .glyph-finish {
        background: #bfbfbf;
        &.glyph-start {
             border-left: 6px solid #8c8c8c;
        }
    }
    .calendar-glyph-name, .calendar-glyph-info {
        height: 22px;
        line-height: 22px;
        display: block;
        width: 90%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .calendar-glyph-channel {
        max-width: 55%;
        font-size: 12px;
        margin-right: 6px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
</style>
<script>
    import DateSelect from './DateSelect.vue';
    import RoomFilter from './RoomFilter.vue';
    import util from 'util';
    export default{
        props: {
            categories: Array,
            holidays: Array,
            roomStatus: Array,
            defaultStartDate: String,
            orderList: Array,
            startDate: Date,
            leftMap: Object,
            DAYS: Number
        },
        components: {
            DateSelect,
            RoomFilter,
        },
        computed: {
            dateRange() {
                const arr = [];
                const startDate = this.startDate;
                for (let i = 0; i < this.DAYS; i ++) {
                    const date = util.diffDate(startDate, i);
                    const holiday = this.holidays.find(d => d.date === util.dateFormat(date));
                    const isToday = util.isSameDay(date, new Date());
                    const isHoliday = holiday && holiday.type === 0;

                    let left = 0;
                    this.categories.map(c => {
                        if (!this.leftMap[c.cId] || !c.selected) {
                            return
                        }

                        left += this.leftMap[c.cId][i];
                    });

                    arr.push({
                        date,
                        isToday,
                        isHoliday,
                        left,
                        dateStr: isHoliday ? holiday.holiday : (isToday ? '今天' : util.dateFormatWithoutYear(date)),
                        weekday: util.getWeek(date)
                    });
                }

                return arr;
            },
            finalRoomStatus() {
                return this.roomStatus.map(room => {
                    const category = this.categories.find(category => category.cId === room.ti);
                    room.selected = category.selected;
                    room.cName = category.cName;
                    return room;
                });
            },
            roomIndexMap() {
                // 房间的顺序，用于计算订单图元的位置
                const map = {};
                let index = 0;
                this.categories.map(c => {
                    // 过滤未选中的房间
                    if (!c.rooms || !c.selected) {
                        return
                    }

                    //  折叠的房间占一行
                    if (c.folded) {
                        index ++;
                        return
                    }

                    c.rooms.map(r => {
                        map[r.i] = index ++;
                    })
                });
                return map;
            },
            glyphs() {
                //生成订单图元
                const glyphs = [];
                const GRID_WIDTH = 100;
                const GRID_HEIGHT = 48;
                const startDate = this.startDate;
                this.orderList.map(order => {
                    // 过滤未选中的房型
                    const category = this.categories.find(category => category.cId === order.id);
                    if (!category.selected) {
                        return
                    }

                    // seeStart用于标志订单开始时间是否在查看日期范围内
                    let checkInDate = new Date(order.checkInDate);
                    let seeStart = true;
                    if (checkInDate < startDate && !util.isSameDay(checkInDate, startDate)) {
                        checkInDate = startDate;
                        seeStart = false;
                    }

                    let checkOutDate = new Date(order.checkOutDate);
                    if (checkOutDate > util.diffDate(startDate, 29)) {
                        checkOutDate = util.diffDate(startDate, 29);
                    }

                    let diff = util.DateDiff(checkInDate, checkOutDate);
                    if (diff === 0) {
                        diff = 1;
                    }

                    const startDiff = util.DateDiff(startDate, checkInDate);
                    const room = this.roomIndexMap[order.accommodationId];
                    const top = GRID_HEIGHT * room + 2;
                    const left = GRID_WIDTH * startDiff + 2;
                    const width = GRID_WIDTH * diff - 4;
                    const glyph = { ...order };
                    glyph.top = top;
                    glyph.left = left;
                    glyph.width = width;
                    glyph.checkInDateShort = order.checkInDate.substr(5, 5);
                    glyph.checkOutDateShort = order.checkOutDate.substr(5, 5);
                    glyph.seeStart = seeStart;
                    glyphs.push(glyph);
                });
                return glyphs;
            }
        },
        methods: {
            handleStatusScroll(ev) {
                this.$refs.calendarLeftHeader.scrollTop = ev.target.scrollTop;
                this.$refs.calendarHeader.scrollLeft = ev.target.scrollLeft;
            },
            handleDateChange(date) {
                this.$emit('dateChange', date);
            },
            handleRoomFilter(data) {
                this.$emit('roomFilterChange', data);
            },
            fold(c) {
                this.$emit('fold', c.cId);
            },
            selectStatus(status) {
                this.$set(status, 'selected', !status.selected);
            }
        }
    }
</script>

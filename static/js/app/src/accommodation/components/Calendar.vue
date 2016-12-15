<template>
    <div>
        <div class="calendar-leftHeader">
            <div class="category-item" v-for="c in categories">
                <div class="category-name">
                    <span class="stext">{{c.cName}}</span>
                </div>
                <div class="category-list">
                    <div class="room-item" v-for="r in c.rooms">{{r.sn}}</div>
                </div>
            </div>
        </div>
        <div class="sheader">
            <div class="sheader-item" v-for="d in dateRange">
                <div class="date-item"
                     :class="{'today':d.isToday, 'weekend': d.weekday == '周五' || d.weekday == '周六'}"
                >
                    <div class="date">
                        {{d.dateStr}}
                        <div class="eluyun_rest_outer spriteImg isHoliday" v-if="d.isHoliday">
                            <div class="eluyun_rest"></div>
                        </div>
                    </div>
                    <div class="desc">{{d.weekday}}</div>
                </div>
                <div class="left">剩{{}}</div>
            </div>
        </div>
        <div class="calendor-container">
            <div class="entryList">
                <div class="srow" v-for="room in roomStatus">
                    <div v-for="status in room.st">
                        <div class="eluyun_tick_outer spriteImg">
                            <div class="eluyun_tick"></div>
                        </div>
                        <div class="date">{{status.date}}</div>
                        <div class="price">￥{{status.p}}</div>
                        <div class="name">{{room.sn}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="sass">
   @import "~dd-common-css/src/variables";

</style>
<script>
    export default{
        props: {
            categories: Array,
            dateRange: Array,
            holidays: Array,
            roomStatus: Array,
        }
    }
</script>

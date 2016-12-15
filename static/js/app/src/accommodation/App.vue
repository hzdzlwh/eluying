<template>
    <div>
        <Calendar :categories="categories" :dateRange="dateRange" :holidays="holidays" :roomStatus="roomStatus" />
    </div>
</template>
<style>

</style>
<script>
    import Calendar from './components/Calendar.vue';
    import AJAXService from 'AJAXService';
    import util from 'util';
    export default{
        created() {
            Promise.all([
                AJAXService.ajaxWithToken('get', '/room/getRoomCategories', {}),
                AJAXService.ajaxWithToken('get', '/room/getRoomsAndStaus', {
                    date: util.dateFormat(this.startDate),
                    days: this.days,
                    sub: true,
                }),
            ]).then(res => {
                    this.categories = res[0].data.list;
                    const { holidays, orderList, rs } = res[1].data;
                    this.holidays = holidays;
                    this.orderList = orderList;
                    this.roomStatus = rs;
                    this.roomStatus.map(room => {
                        const category = this.categories.find(category => category.cId === room.ti);
                        if (!category.rooms) {
                            category.rooms = [];
                        }

                        category.rooms.push(room);
                    })
                });
        },
        data() {
            return {
                categories: [],
                holidays: [],
                roomStatus: [],
                startDate: new Date(),
                days: 30,
            }
        },
        computed: {
            dateRange() {
                const arr = [];
                const startDate = this.startDate;
                for (let i = 0; i < this.days; i ++) {
                    const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
                    const holiday = this.holidays.find(d => d.date === util.dateFormat(date));
                    const isToday = util.isSameDay(date, new Date());
                    const isHoliday = holiday && holiday.type === 0;
                    arr.push({
                        date,
                        isToday,
                        isHoliday,
                        dateStr: isHoliday ? holiday.holiday : (isToday ? '今天' : util.dateFormatWithoutYear(date)),
                        weekday: util.getWeek(date),
                    })
                }

                return arr;
            }
        },
        methods: {

        },
        components: {
            Calendar
        }
    }
</script>

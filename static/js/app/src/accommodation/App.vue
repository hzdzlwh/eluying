<template>
    <div>
        <Calendar />
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
                    date: util.dateFormat(new Date()),
                    days: 30,
                    sub: true,
                }),
            ])
                .then(res => {
                    console.log(res);
                    const pRooms = res[0].data.list;
                    const { holidays } = res[1].data
                })
        },
        methods: {

        },
        components: {
            Calendar
        }
    }
</script>

<template>
    <div>
        <div>
            <DdDatepicker placeholder="开始时间" v-model="startTime" :disabled-date="disableStartDate"/>
            <span style="color:#999;font-size:14px;">～</span>
            <DdDatepicker placeholder="结束时间" v-model="endTime" :disabled-date="disableEndDate" />
        </div>
    </div>
</template>
<style>
    
</style>
<script>
    import { DdDatepicker } from 'dd-vue-component';
    import http from 'http';
    export default {
        data() {
            return {
                vips: [],
                vip: {},
                pages: 0,
                count: 0,
                totalMany: 0,
                pageNo: 1,
                startTime: '',
                endTime: ''
            };
        },
        components: {
            DdDatepicker
        },
        method: {
            endTime() {
                this.pageNo = 1;
                if (this.flag) {
                    this.fetchDate();
                }
            },
            startTime() {
                this.pageNo = 1;
                if (this.flag) {
                    this.fetchDate();
                }
            },
            disableEndDate(date) {
                if (this.startTime !== '') {
                    const arr = this.startTime.split('-');
                    return date && date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                } else {
                    return false;
                }
            },
            disableStartDate(date) {
                if (this.endDate !== '') {
                    const arr = this.endTime.split('-');
                    return date && date.valueOf() > (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                } else {
                    return false;
                }
            },
            getDate() {
                http.get('/stat/getPredictionStat', { startDate: this.startTime, endDate: this.endTime }).then((res) => {
                    if (res.code === 1) {
                        console.log(res);
                    }
                });
            }
        }
    };
</script>
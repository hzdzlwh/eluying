<template>
    <div>
        <div>
            <DdDatepicker placeholder="开始时间" v-model="startTime" :disabled-date="disableStartDate"/>
            <span style="color:#999;font-size:14px;">～</span>
            <DdDatepicker placeholder="结束时间" v-model="endTime" :disabled-date="disableEndDate" />
            <!-- <div>
                <dd-dropdown text="导出明细" trigger="click">
                    <dd-dropdown-item><span><a :href="exportUrl(1)" download>导出PDF</a></span></dd-dropdown-item>
                    <dd-dropdown-item><span><a :href="exportUrl(0)" download>导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
            </div> -->
        </div>
        <div class="report-forecastRoom-title">
            {{$route.meta.name}}
        </div>
        <div class="report-forecastRoom-date">
            {{startTime}} ~ {{endTime}}
        </div>
        <table class="report-forecastRoom-table" border="1">
            <thead>
                <tr>
                    <th rowspan="2">营业日期</th>
                    <th colspan="3">在住</th>
                    <th colspan="3">预抵</th>
                    <th colspan="2">预离</th>
                    <th rowspan="2">停用维修</th>
                    <th rowspan="2">房间存量</th>
                </tr>
                <tr>
                    <th>房间</th>
                    <th>客人</th>
                    <th>当日房费</th>
                    <th>房间</th>
                    <th>客人</th>
                    <th>当日房费</th>
                    <th>房间</th>
                    <th>客人</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in vips">
                    <td>{{item.date}}</td>
                    <td>{{item.usingRoom}}</td>
                    <td>{{item.usingResident}}</td>
                    <td>{{item.usingPrice}}</td>
                    <td>{{item.preOrderedRoom}}</td>
                    <td>{{item.preOrderedResident}}</td>
                    <td>{{item.preOrderedPrice}}</td>
                    <td>{{item.leavingRoom}}</td>
                    <td>{{item.leavingResident}}</td>
                    <td>{{item.repairingRoom}}</td>
                    <td>{{item.stock}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<style lang="scss" scoped>
    .report-forecastRoom-title{
        font-family:MicrosoftYaHei-Bold;
        font-size:24px;
        color:#178ce6;
        text-align:center;
    }
    .report-forecastRoom-table{
        width: 100%;
        font-size: 12px;
        border: 1px solid #CCCCCC;
        thead{
            tr{
                background: #99CCFF;
                font-size: 12px;
                line-height: 28px;
                font-family:MicrosoftYaHei;
                color:#666666;
                th{
                    text-align: center;
                    padding: 0 10px;
                }
            }
        }
        tbody{
            tr{
                td:first-child{
                    padding-left: 34px;
                }
                td:not(:first-child){
                    text-align: right;
                    padding-right: 20px;
                }
            }
            .mark-tr{
                font-weight: bold;
                color: #666666;
                background: #b2dbff;
                td:first-child{
                    padding-left: 20px;
                }
            }
            .word-bold{
                font-weight: bold;
                color: #666666;
                padding-left: 34px;
            }
        }
        tfoot{
            tr{
               background: #61758c;
                color: #fff;
                td:first-child{
                    padding-left: 20px;
                }
                td:not(:first-child){
                    text-align: right;
                    padding-right: 20px;
                }
            }
        }
    }
</style>
<script>
    import { DdDatepicker } from 'dd-vue-component';
    import http from 'http';
    import util from 'util';
    export default {
        data() {
            return {
                vips: [],
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
        created() {
            const startTime = new Date();
            this.startTime = util.dateFormat(startTime);
            this.endTime = util.dateFormat(util.diffDate(startTime, 30));
            this.getData();
        },
        watch: {
            endTime() {
                this.pageNo = 1;
                this.getData();
            },
            startTime() {
                this.pageNo = 1;
                this.getData();
            }
        },
        methods: {
            // exportUrl(type) {
            //     const originParam = {
            //         startDate: this.startTime,
            //         toDate: this.endTime
            //     };
            //     const paramsObj = {
            //         exportType: type,
            //         reportType: 304,
            //         params: JSON.stringify(originParam)
            //     };
            //     const host = http.getUrl('/stat/exportReport');
            //     const pa = http.getDataWithToken(paramsObj);
            //     pa.params = JSON.parse(pa.params);
            //     const params = http.paramsToString(pa);
            //     return `${host}?${params}`;
            // },
            disableStartDate(date) {
                if (this.startDate !== '') {
                    const arr1 = util.dateFormat(new Date()).split('-');
                    const arr2 = this.endTime.split('-');
                    return date.valueOf() < (new Date(arr1[0], arr1[1] - 1, arr1[2])).valueOf() || date.valueOf() > (new Date(arr2[0], arr2[1] - 1, arr2[2]));
                } else {
                    return true;
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
            getData() {
                http.get('/stat/getPredictionStat', { startDate: this.startTime, toDate: this.endTime }).then((res) => {
                    if (res.code === 1) {
                        this.vips = res.data.entityList;
                    };
                });
            }
        }
    };
</script>
<template>
    <div>
        <div>
            <DdDatepicker placeholder="开始时间" v-model="startTime" :disabled-date="disableStartDate"/>
            <span style="color:#999;font-size:14px;">～</span>
            <DdDatepicker placeholder="结束时间" v-model="endTime" :disabled-date="disableEndDate" />
            <div :class="collectClass" @click="collectUrl(collectNum)" style="float:right;">
                {{collectName}}
            </div>
        </div>
        <p class="report-title">
            房间预测报表
        </p>
        <div class="report-forecastRoom-date" style="line-height:24px;">
            {{startTime}} ~ {{endTime}}
        </div>
        <table class="report-forecastRoom-table" border="1" style="margin:10px 0;">
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
        <dd-pagination @currentchange="handlePageChange" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" style="float:right;margin-top:20px;"/>
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
    .report-collect {
        float: left;
        margin-left:20px;
        height: 24px;
        width: 100px;
        border-radius:2px;
        text-align: center;
        line-height:24px;
        cursor:pointer;
        font-family:MicrosoftYaHei;
        font-size:14px;
        color:#ffffff;
        text-align:center;
    }
    .report-collect-add {
        background:#178ce6;
    }
    .report-collect-dis {
        background:#f39c30;
    }
</style>
<script>
    import { DdDatepicker, DdPagination } from 'dd-vue-component';
    import http from 'http';
    import util from 'util';
    import { collect } from '../mixin/collect';
    import pagination from '../mixin/pagination';
    export default {
        mixins: [collect, pagination],
        data() {
            return {
                vips: [],
                count: 0,
                totalMany: 0,
                startTime: '',
                endTime: ''
            };
        },
        components: {
            DdDatepicker,
            DdPagination
        },
        beforeRouteEnter(to, from, next) {
            http.get('/stat/getCollection')
                .then(res => {
                    if (res.code === 1) {
                        next(vm => {
                            const collectList = res.data.list;
                            for (let i = 0; i < collectList.length; i ++) {
                                if (collectList[i] === 304) {
                                    vm.collectNum = 1;
                                    vm.collectName = '已收藏';
                                }
                            }
                        });
                    }
                });
        },
        created() {
            const startTime = new Date();
            this.startTime = util.dateFormat(startTime);
            this.endTime = util.dateFormat(util.diffDate(startTime, 30));
            this.getData();
            this.collectStat();
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
            collectUrl(num) {
                if (num === 0) {
                    http.get('/stat/addToCollect', { statValue: 304 }).then(res => {
                        this.collectNum = 1;
                        this.collectName = '已收藏';
                    });
                } else if (num === 1) {
                    http.get('/stat/removeFromCollection', { statValue: 304 }).then(res => {
                        this.collectNum = 0;
                        this.collectName = '加入收藏';
                        let removeIndex = null;
                        this.$router.options.routes[2].children[0].children.map((item, index) => {
                            if (item.meta.id === 304) {
                                removeIndex = index;
                            }
                        });
                        this.$router.options.routes[2].children[0].children.splice(removeIndex, 1);
                        if (this.$router.options.routes[2].children[0].children.length > 1) {
                            if (this.$route.params.id) {
                                this.$router.push('/reportCenter/collect/' + this.$router.options.routes[2].children[0].children[1].meta.id);
                            }
                        } else {
                            if (this.$route.params.id) {
                                this.$router.push('/reportCenter/collect/');
                            }
                        }
                    });
                }
            },
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
                const obj = {
                    pageNum: this.pageNo,
                    startDate: this.startTime,
                    toDate: this.endTime
                };
                if (this.type !== -1) {
                    obj.type = this.type;
                };
                // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                http.get('/stat/getPredictionStat', obj).then((res) => {
                    if (res.code === 1) {
                        this.vips = res.data.entityList;
                        this.pages = Math.ceil(res.data.total / 30);
                    };
                });
            }
        }
    };
</script>

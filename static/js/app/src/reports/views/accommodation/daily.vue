<template>
    <div>
        <div style="display: flex;justify-content: space-between">
            <div><span style="margin-right: 4px">报表日期</span><dd-datepicker :disabledDate="disabledDate" v-model="date"></dd-datepicker></div>
            <div>
                <dd-dropdown text="导出明细" trigger="click">
                    <dd-dropdown-item><span><a :href="exportUrl(1)" download>导出PDF</a></span></dd-dropdown-item>
                    <dd-dropdown-item><span><a :href="exportUrl(0)" download>导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
            </div>
        </div>
        <p style="font-weight: bold;font-size:24px;color:#178ce6;text-align:center;margin: 20px 0 26px">
            客房营业统计表
            <span class="ic">i
                <div class="i">
                    报表说明： <br>
                    1、房费不包含其他消费；<br>
                    2、有效客房数不包含维修房、停用房；<br>
                    3、出租率=间夜量/(总客房数-维修房数-停用房数)；<br>
                    4、平均房价=房费/间夜数；<br>
                    5、合计数据中是否包含自用房、免费房，将根据系统设置进行统计；<br>
                    6、钟点房间夜量按系统设置计算（默认0.5）。
                </div>
            </span>
        </p>
        <div style="display: flex">
            <table style="width: 98px" class="l">
                <thead>
                <tr>
                    <th>分类</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>入住类型</td>
                </tr>
                <tr v-for="r in checkTypeDayStat" :class="{b: r.name === '合计'}">
                    <td class="ellipsis">
                        {{r.name}}
                    </td>
                </tr>
                <tr><td></td></tr>
                <tr><td>房间类型</td></tr>
                <tr v-for="r in roomTypeDayStat" :class="{b: r.name === '合计'}">
                    <td class="ellipsis">{{r.name}}</td>
                </tr>
                </tbody>
            </table>
            <div style="flex: 1;">
                <table style="width: 100%" class="c">
                    <colgroup>
                        <col width="25%">
                        <col width="25%">
                        <col width="25%">
                        <col width="25%">
                    </colgroup>
                    <thead>
                    <tr>
                        <th colspan="4">本日</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>间夜量</td>
                        <td>房费</td>
                        <td>平均房价</td>
                        <td>出租率</td>
                    </tr>
                    <tr v-for="r in checkTypeDayStat" :class="{b: r.name === '合计'}">
                        <td>{{r.night}}</td>
                        <td>{{r.fee}}</td>
                        <td>{{r.avg}}</td>
                        <td>{{r.rate}}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>间夜量</td>
                        <td>房费</td>
                        <td>平均房价</td>
                        <td>出租率</td>
                    </tr>
                    <tr v-for="r in roomTypeDayStat" :class="{b: r.name === '合计'}">
                        <td>{{r.night}}</td>
                        <td>{{r.fee}}</td>
                        <td>{{r.avg}}</td>
                        <td>{{r.rate}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div style="flex: 1">
                <table style="width: 100%" class="r">
                    <colgroup>
                        <col width="25%">
                        <col width="25%">
                        <col width="25%">
                        <col width="25%">
                    </colgroup>
                    <thead>
                    <tr>
                        <th colspan="4">本月</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>间夜量</td>
                        <td>房费</td>
                        <td>平均房价</td>
                        <td>出租率</td>
                    </tr>
                    <tr v-for="r in checkTypeMonStat" :class="{b: r.name === '合计'}">
                        <td>{{r.night}}</td>
                        <td>{{r.fee}}</td>
                        <td>{{r.avg}}</td>
                        <td>{{r.rate}}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>间夜量</td>
                        <td>房费</td>
                        <td>平均房价</td>
                        <td>出租率</td>
                    </tr>
                    <tr v-for="r in roomTypeMonStat" :class="{b: r.name === '合计'}">
                        <td>{{r.night}}</td>
                        <td>{{r.fee}}</td>
                        <td>{{r.avg}}</td>
                        <td>{{r.rate}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</template>
<style scoped lang="scss">
    th {
        background:#60758d;
        color: #fff;
    }
    th, td {
        height:32px;
        border:1px solid #e6e6e6;
    }
    .l {
        td, th {
            padding-left: 14px;
            max-width: 98px;
        }
    }
    .c, .r {
        td, th {
            text-align: center;
        }
    }
    .ic {
        line-height: 14px;
        border:1px solid #178ce6;
        border-radius:2px;
        width:14px;
        height:14px;
        display: inline-block;
        font-size: 12px;
        position: relative;
    }
    .i {
        display: none;
        position: absolute;
        top: 18px;
        left: 0;
        font-size:12px;
        color:#666666;
        line-height:18px;
        background:#fafafa;
        box-shadow:0 0 5px 0 rgba(0,0,0,0.15);
        width:384px;
        text-align: left;
        padding: 8px;
        font-weight: normal;
    }
    .ic:hover .i {
        display: block;
    }
    .b {
        font-weight: bold;
    }
</style>
<script>
    import { DdDatepicker, DdDropdown, DdDropdownItem } from 'dd-vue-component';
    import http from 'http';
    import util from 'util';
    export default {
        data() {
            return {
                checkTypeDayStat: [],
                checkTypeMonStat: [],
                roomTypeDayStat: [],
                roomTypeMonStat: [],
                date: new Date()
            };
        },
        components: {
            DdDatepicker,
            DdDropdown,
            DdDropdownItem
        },
        beforeRouteEnter(to, from, next) {
            next(() => {
                $('.date-select-container').hide();
            });
        },
        beforeRouteLeave(to, from, next) {
            $('.date-select-container').show();
            next();
        },
        watch: {
            date() {
                this.getData();
            }
        },
        methods: {
            getData() {
                http.get('/stat/getRoomDailyStat', { date: this.date })
                    .then(res => {
                        this.checkTypeDayStat = res.data.checkTypeDayStat;
                        this.checkTypeMonStat = res.data.checkTypeMonStat;
                        this.roomTypeDayStat = res.data.roomTypeDayStat;
                        this.roomTypeMonStat = res.data.roomTypeMonStat;
                    });
            },
            exportUrl(type) {
                const originParam = {
                    date: this.date
                };
                const paramsObj = {
                    exportType: type,
                    reportType: 19,
                    params: JSON.stringify(originParam)
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            },
            disabledDate(date) {
                return util.DateDiff(date, new Date()) < 0;
            }
        }
    };
</script>

<template>
    <div>
        <p style="margin-bottom: 22px">订单金额拆分到每日订单，统计每日产生的消费金额</p>
        <div style="display: flex">
            <div class="card"
                 style="width: 204px;height: 420px; margin-right: 20px; display: flex;justify-content: space-around;flex-direction: column">
                <div>
                    <p>
                        <small><i>房费</i></small>
                    </p>
                    <h4>¥{{roomFee}}</h4>
                    <p>
                        <small><i>消费金额：¥{{consumeAmount}}</i></small>
                    </p>
                    <p>
                        <small><i>违约金：¥{{penalty}}</i></small>
                    </p>
                </div>
                <div>
                    <p>
                        <small>间夜量</small>
                    </p>
                    <h4>{{roomNights}}</h4>
                </div>
                <div>
                    <p>
                        <small>平均房价</small>
                    </p>
                    <h4>¥{{avgPrice}}</h4>
                </div>
                <div>
                    <p>
                        <small>平均入住率</small>
                    </p>
                    <h4 v-if="occupancyRate !== 'undefined'">{{occupancyRate * 100}}%</h4>
                </div>
            </div>
            <div class="card" style="flex: 1">
                <h5 class="card-title"><b>住宿运营分析</b></h5>
                <div id="line" style="width: 100%;height:352px"></div>
            </div>
        </div>
        <div style="margin: 20px 0 10px;display: flex;justify-content: space-between">
            <p>房间消费明细
                <small><i>({{date.startDate}}~{{date.endDate}})</i></small>
                <a :href="exportUrl" download><button class="dd-btn dd-btn-primary">导出Excel</button></a>
            </p>
        </div>
        <div>
            <dd-Table :columns="columns" :data-source="dataSource" :bordered="true" size="small"></dd-Table>
        </div>
    </div>
</template>
<style>
</style>
<script>
    import echarts from 'echarts';
    import {mapState} from 'vuex';
    import AJAXService from '../../common/AJAXService';
    import util from '../../common/util';
    import { DdTable } from 'dd-vue-component';
    export default{
        data() {
            return {
                avgPrice: undefined,
                occupancyRate: undefined,
                penalty: undefined,
                roomFee: undefined,
                roomNights: undefined,
                consumeAmount: undefined,
                columns: [],
                dataSource: []
            }
        },
        components: {
            DdTable
        },
        computed: {
            ...mapState(['date']),
            exportUrl () {
                const paramsObj = {
                    exportType: 0,
                    reportType: 2,
                    params: {
                        startDate: this.date.startDate,
                        endDate: this.date.endDate
                    }
                };
                const host = AJAXService.getUrl2('/stat/exportReport');
                const pa = AJAXService.getDataWithToken(paramsObj);
                const params = AJAXService.paramsToString(pa);
                return `${host}?${params}`;
            }
        },
        watch: {
            date() {
                this.getRoomStatistics();
            }
        },
        created() {
            this.getRoomStatistics();
        },
        methods: {
            getRoomStatistics() {
                AJAXService.ajaxWithToken('get', '/stat/getRoomStatistics', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate
                }).then(res => {
                    if (res.code === 1) {
                        this.setLine(res.data);
                        this.avgPrice = res.data.summary.avgPrice;
                        this.occupancyRate = res.data.summary.occupancyRate;
                        this.penalty = res.data.summary.penalty;
                        this.roomFee = res.data.summary.roomFee;
                        this.consumeAmount = res.data.summary.consumeAmount;
                        this.roomNights = res.data.summary.roomNights;
                        this.setTable(res.data.roomFeeDetail);
                    }
                })
            },
            setTable(list) {
                const width = 1000 / 9;
                this.columns = [
                    {
                        title: '房间名称',
                        fixed: true,
                        dataIndex: 'name',
                        width: width
                    },
                    {
                        title: '合计',
                        fixed: true,
                        dataIndex: 'total',
                        width: width,
                        className: 'text-right'
                    }
                ];
                const startDate = new Date(this.date.startDate);
                const endDate = new Date(this.date.endDate);

                const dates = util.getDateBetween(startDate, endDate);
                dates.map(date => {
                    this.columns.push({
                        title: util.dateFormatWithoutYear(date),
                        dataIndex: util.dateFormat(date),
                        width: width,
                        className: 'text-right'
                    });
                });

                list.push({
                    name: '综合合计',
                    dateValues: dates.map((d, i) => {
                        const value = list.reduce((a, b) => {
                            return a + b.dateValues[i].value
                        }, 0);

                        return {
                            date: util.dateFormat(d),
                            value: value.toFixed(2) == value ? value : Number(value.toFixed(2))
                        };
                    })
                });

                const format = (list) => (
                    list.map(i => {
                        const data = {
                            name: i.name
                        };
                        const total = i.dateValues.reduce((a, b) => {
                            data[b.date] = b.value;
                            return a + b.value;
                        }, 0);
                        data.total = total.toFixed(2) == total ? total : total.toFixed(2);
                        if (i.children && i.children.length > 0) {
                            data.children = format(i.children);
                        }

                        return data;
                    })
                );


                this.dataSource = format(list);

                this.dataSource[this.dataSource.length - 1].foot = true;
            },
            setLine(data) {
                const chart = echarts.init(document.getElementById('line'));
                chart.setOption({
                    dataZoom: [
                        {
                            type: 'slider',
                            filterMode: 'filter'
                        }
                    ],
                    legend: {
                        selectedMode: 'single',
                        data: ['房费', '间夜量', '入住率', '平均房价']
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a}{b}: {c}"
                    },
                    xAxis: {
                        boundaryGap: false,
                        type: 'category',
                        data: data.avgPrice.map(i => i.date.substr(5, 5))
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '房费',
                            type: 'line',
                            data: data.roomFee.map(i => i.value)
                        },
                        {
                            name: '间夜量',
                            type: 'line',
                            data: data.roomNights.map(i => i.value)
                        },
                        {
                            name: '入住率',
                            type: 'line',
                            data: data.occupancyRate.map(i => i.value)
                        },
                        {
                            name: '平均房价',
                            type: 'line',
                            data: data.avgPrice.map(i => i.value)
                        }
                    ]
                });
            }
        }
    }
</script>

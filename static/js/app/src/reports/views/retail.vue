<template>
    <div>
        <p style="margin-bottom: 22px"><i>订单金额按下单时间统计</i></p>
        <div style="display: flex">
            <div class="card"
                 style="width: 204px;height: 420px; margin-right: 20px; display: flex;justify-content: space-around;flex-direction: column">
                <div>
                    <p>
                        <small><i>订单金额</i></small>
                    </p>
                    <h4>¥{{orderPrice || 0}}</h4>
                </div>
                <div>
                    <p>
                        <small><i>订单数</i></small>
                    </p>
                    <h4>{{orderNum}}</h4>
                </div>
            </div>
            <div class="card" style="flex: 1">
                <h5 class="card-title"><b>商超运营分析</b></h5>
                <div id="line" style="width: 100%;height:352px"></div>
            </div>
        </div>
        <div style="margin: 20px 0 10px;display: flex;justify-content: space-between">
            <p>商品消费明细
                <small><i>({{date.startDate}}~{{date.endDate}})</i></small>
            </p>
            <a :href="exportUrl" download>
                <button class="dd-btn dd-btn-primary">导出Excel</button>
            </a>
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
    import {DdTable} from 'dd-vue-component';
    import {setLine} from '../utils/chartHelper';

    export default{
        data() {
            return {
                orderNum: undefined,
                orderPrice: undefined,
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
                    reportType: 7,
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
                AJAXService.ajaxWithToken('get', '/stat/getGoodsStat', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate
                }).then(res => {
                    if (res.code === 1) {
                        const data = res.data;
                        setLine([
                                {
                                    name: '订单金额(元)',
                                    type: 'line',
                                    data: data.orderPriceList.map(i => i.value)
                                },
                                {
                                    name: '订单数(个)',
                                    type: 'line',
                                    data: data.orderNumList.map(i => i.orderNum)
                                }
                            ],
                            data.orderPriceList.map(i => i.date.substr(5, 5)),
                            '',
                            'line',
                            'single');
                        this.orderNum = res.data.orderNum;
                        this.orderPrice = res.data.orderPrice;
                        this.setTable(res.data.detailOrderNumList);
                    }
                })
            },
            setTable(list) {
                const width = 1000 / 9;
                this.columns = [
                    {
                        title: '商品名称',
                        fixed: true,
                        dataIndex: 'name',
                        width: width
                    },
                    {
                        title: '数量合计',
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
            },
            setLine(data) {
                const chart = echarts.init(document.getElementById('line'));
                chart.setOption({
                    dataZoom: [
                        {
                            type: 'slider',
                            filterMode: 'filter'
                        },
                    ],
                    legend: {
                        selectedMode: 'single',
                        data: ['订单金额(元)', '订单数(个)']
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}{a}: {c}"
                    },
                    xAxis: {
                        boundaryGap: false,
                        type: 'category',
                        data: data.orderPriceList.map(i => i.date.substr(5, 5))
                    },
                    yAxis: {
                        type: 'value',
                        splitArea: {
                            show: true
                        },
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        }
                    },
                    series: [
                        {
                            name: '订单金额(元)',
                            type: 'line',
                            data: data.orderPriceList.map(i => i.value)
                        },
                        {
                            name: '订单数(个)',
                            type: 'line',
                            data: data.orderNumList.map(i => i.orderNum)
                        }
                    ]
                });
            }
        }
    }
</script>

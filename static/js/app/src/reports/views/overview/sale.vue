<template>
    <div>
        <p style="margin-bottom: 22px">按订单的生成时间统计</p>
        <div class="card">
            <h5 class="card-title"><b>销售统计</b></h5>
            <div id="bar" style="width: 100%; height: 300px">
            </div>
        </div>
        <div style="margin: 20px 0 10px;display: flex;justify-content: space-between">
            <p>销售记录<i>（{{date.startDate}}~{{date.endDate}}）</i></p>
            <dd-dropdown text="导出明细" trigger="click">
                <dd-dropdown-item><span><a :href="exportUrl(1)" download>导出PDF</a></span></dd-dropdown-item>
                <dd-dropdown-item><span><a :href="exportUrl(0)" download>导出Excel</a></span></dd-dropdown-item>
            </dd-dropdown>
        </div>
        <div>
            <dd-table :columns="columns" :dataSource="dataSource" :bordered="true" />
        </div>
        <div style="display: flex;justify-content: space-between;margin-top: 20px">
            <span>共计{{orderSize}}个订单 销售金额¥{{totalPrice}}</span>
            <dd-pagination @currentchange="getSalesRecordList" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="page" />
        </div>
    </div>
</template>
<style>

</style>
<script>
    import echarts from 'echarts';
    import { mapState } from 'vuex';
    import AJAXService from '../../../common/AJAXService';
    import { DdTable, DdPagination, DdDropdown, DdDropdownItem } from 'dd-vue-component';
    import { setBar } from '../../utils/chartHelper';
    export default{
        data() {
            return {
                columns: [
                    {
                        title: '订单号/创建时间',
                        width: 216,
                        render: (h, row) => (<span><span>{row.serialNum}</span><br /><small><i>{row.creationTime}</i></small></span>),
                    },
                    {
                        title: '创建人',
                        dataIndex: 'creater'
                    },
                    {
                        title: '客源渠道',
                        dataIndex: 'origin'
                    },
                    {
                        title: '销售金额',
                        className: 'text-right',
                        dataIndex: 'salesTotalPrice'
                    },
                    {
                        title: '客户姓名',
                        dataIndex: 'customerName'
                    },
                    {
                        title: '手机号',
                        width: 150,
                        dataIndex: 'customerPhone'
                    }
                ],
                dataSource: [],
                page: 1,
                pages: undefined,
                totalPrice: undefined,
                orderSize: undefined
            }
        },
        computed: {
            ...mapState(['date'])
        },
        created() {
            this.getSaleStatistics();
            this.getSalesRecordList();
        },
        watch: {
            date() {
                this.page = 1;
                this.getSaleStatistics();
                this.getSalesRecordList();
            }
        },
        components: {
            DdTable,
            DdPagination,
            DdDropdown,
            DdDropdownItem
        },
        methods: {
            getSaleStatistics() {
                AJAXService.ajaxWithToken('get', '/stat/getStatisticsByType', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    statTypes: JSON.stringify([1])
                })
                    .then(res => {
                        if (res.code === 1) {
                            const salesStat = res.data.salesStat;
                            setBar(salesStat.items.map(i => i.value), '金额（元）', salesStat.items.map(i => i.date.substr(5, 5)));
                        }
                    })
            },
            getSalesRecordList(page) {
                this.page = page ? page : this.page;

                AJAXService.ajaxWithToken('get', '/stat/getSalesRecordList', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    page: this.page
                })
                    .then(res => {
                        if (res.code === 1) {
                            this.dataSource = res.data.statSalesList;
                            this.totalPrice = res.data.totalPrice;
                            this.orderSize = res.data.orderSize;
                            this.pages = Math.ceil(this.orderSize / 30);
                        }
                    });
            },
            exportUrl(type) {
                const paramsObj = {
                    exportType: type,
                    reportType: 1,
                    params: {
                        startDate: this.date.startDate,
                        endDate: this.date.endDate
                    }
                };
                const host = AJAXService.getUrl2('/stat/exportReport');
                const pa = AJAXService.getDataWithToken(paramsObj);
                const params = AJAXService.paramsToString(pa);
                return `${host}?${params}`;
            },
            setBar(salesStat) {
                const chart = echarts.init(document.getElementById('bar'));
                chart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c}'
                    },
                    dataZoom: [{
                        type: 'slider',
                        filterMode: 'filter'
                    },],
                    xAxis: {
                        type: 'category',
                        data: salesStat.items.map(i => i.date.substr(5, 5))
                    },
                    yAxis: {
                        type: 'value',
                        name: '金额（元）'
                    },
                    series: [{
                        type: 'bar',
                        data: salesStat.items.map(i => i.value),
                        itemStyle: {
                            normal: {
                                color: '#82beff',
                                barBorderRadius: 2
                            }
                        },
                        barWidth: 16,
                        label: {
                            normal: {
                                formatter: '{c}',
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: '#000'
                                }
                            }
                        }
                    }]
                });
            }
        }
    }
</script>

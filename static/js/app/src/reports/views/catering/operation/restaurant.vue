<template>
    <div>
        <p style="margin: 20px 0 10px"><i>订单金额拆分到每日订单，统计每日产生的消费金额</i></p>
        <div style="display: flex">
            <div class="card"
                 style="width: 204px;height: 420px; margin-right: 20px; display: flex;justify-content: space-around;flex-direction: column">
                <div>
                    <p>
                        <small><i>餐费</i></small>
                    </p>
                    <h4>¥{{caterFee}}</h4>
                    <p>
                        <small><i>消费金额：¥{{consumeAmount}}</i></small>
                    </p>
                    <p>
                        <small><i>违约金：¥{{penalty}}</i></small>
                    </p>
                </div>
                <div>
                    <p>
                        <small><i>订单数</i></small>
                    </p>
                    <h4>{{orderCount}}</h4>
                </div>
                <div>
                    <p>
                        <small><i>就餐人次</i></small>
                    </p>
                    <h4>{{peopleCount}}</h4>
                </div>
                <div>
                    <p>
                        <small><i>人均消费</i></small>
                    </p>
                    <h4>¥{{peopleAvgConsume}}</h4>
                </div>
            </div>
            <div class="card" style="flex: 1">
                <h5 class="card-title"><b>餐饮运营分析</b></h5>
                <div id="line" style="width: 100%;height:352px"></div>
            </div>
        </div>
        <div style="margin: 20px 0 10px;display: flex;justify-content: space-between">
            <p>餐饮消费统计
                <small><i>({{date.startDate}}~{{date.endDate}})</i></small>
            </p>
            <a :href="exportUrl" download><button class="dd-btn dd-btn-primary">导出Excel</button></a>
        </div>
        <div>
            <dd-Table :columns="columns" :data-source="dataSource" :bordered="true" size="small"></dd-Table>
        </div>
    </div>
</template>
<style>
</style>
<script>
    import { mapState } from 'vuex';
    import http from '../../../../common/http';
    import { getTableData } from '../../../utils/tableHelper';
    import { DdTable } from 'dd-vue-component';
    import { setLine } from '../../../utils/chartHelper';

    export default{
        data() {
            return {
                caterFee: undefined,
                consumeAmount: undefined,
                orderCount: undefined,
                penalty: undefined,
                peopleAvgConsume: undefined,
                peopleCount: undefined,
                columns: [],
                dataSource: []
            };
        },
        components: {
            DdTable
        },
        computed: {
            ...mapState(['date']),
            exportUrl() {
                const paramsObj = {
                    exportType: 0,
                    reportType: 3,
                    params: JSON.stringify({
                        startDate: this.date.startDate,
                        endDate: this.date.endDate
                    })
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            }
        },
        watch: {
            date() {
                this.getCaterStatistics();
            }
        },
        created() {
            this.getCaterStatistics();
        },
        methods: {
            getCaterStatistics() {
                http.get('/stat/getCaterStatistics', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate
                }).then(res => {
                    if (res.code === 1) {
                        const data = res.data;
                        setLine([
                            {
                                name: '餐费(元)',
                                type: 'line',
                                data: data.caterFee.map(i => i.value)
                            },
                            {
                                name: '订单数(个)',
                                type: 'line',
                                data: data.orderCount.map(i => i.value)
                            },
                            {
                                name: '就餐人次(人)',
                                type: 'line',
                                data: data.peopleCount.map(i => i.value)
                            },
                            {
                                name: '人均消费(元)',
                                type: 'line',
                                data: data.peopleAvgConsume.map(i => i.value)
                            }
                        ],
                            data.caterFee.map(i => i.date.substr(5, 5)),
                            '',
                            'line',
                            'single'
                        );
                        this.caterFee = res.data.summary.caterFee;
                        this.consumeAmount = res.data.summary.consumeAmount;
                        this.orderCount = res.data.summary.orderCount;
                        this.penalty = res.data.summary.penalty;
                        this.peopleAvgConsume = res.data.summary.peopleAvgConsume;
                        this.peopleCount = res.data.summary.peopleCount;
                        const tableData = getTableData({
                            list: res.data.caterFeeDetail,
                            firstTitle: '餐厅名称',
                            secondTitle: '合计',
                            foot: true
                        });
                        this.dataSource = tableData.dataSource;
                        this.columns = tableData.columns;
                    }
                });
            }
        }
    };
</script>

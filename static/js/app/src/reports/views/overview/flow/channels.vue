<template>
    <div>
        <p style="margin: 20px 0 10px"><i>统计每日的实际收款金额</i></p>
        <div class="card">
            <div class="card-title" style="display: flex;">
                <h5><strong>总流水 ¥ {{totalFlow}}</strong></h5>
                <i style="margin-left: 56px">总收入：¥ {{totalIncome}}</i>
                <i style="margin-left: 32px">总支出：¥ {{totalExpense}}</i>
            </div>
            <div style="display: flex;height: 500px">
                <div id="collect" style="width: 50%;height: 100%"></div>
                <div id="refund" style="width: 50%;height: 100%"></div>
            </div>
        </div>
        <div style="margin: 20px 0 10px;display: flex;justify-content: space-between">
            <p>收款方式明细<i>（{{date.startDate}}~{{date.endDate}}）</i></p>
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
    import { DdTable } from 'dd-vue-component';
    import http from '../../../../common/http';
    import util from '../../../../common/util';
    import { getTableData } from '../../../utils/tableHelper';
    import { setPie } from '../../../utils/chartHelper';
    export default{
        computed: {
            ...mapState(['date']),
            exportUrl () {
                const paramsObj = {
                    exportType: 0,
                    reportType: 8,
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
                this.getFlowStatsByChannel();
            }
        },
        created() {
            this.getFlowStatsByChannel();
        },
        data() {
            return {
                totalFlow: undefined,
                totalIncome: undefined,
                totalExpense: undefined,
                columns: [],
                dataSource: []
            }
        },
        components: {
            DdTable
        },
        methods: {
            getFlowStatsByChannel() {
                http.get('/stat/getFlowStatsByChannel', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                })
                    .then(res => {
                        if (res.code === 1) {
                            const { refundList, collectList, listByChannels } = res.data;
                            this.totalFlow = res.data.totalFlow;
                            this.totalIncome = res.data.totalIncome;
                            this.totalExpense = res.data.totalExpense;
                            setPie(collectList, '总收入',  'collect');
                            setPie(refundList, '总支出', 'refund');
                            listByChannels.forEach(channel => {
                                channel.name = channel.channelName;
                                channel.dateValues = channel.list;
                            });
                            const tableData = getTableData({
                                list: listByChannels,
                                firstTitle: '收款方式',
                                secondTitle: '合计',
                                foot: true
                            });
                            this.dataSource = tableData.dataSource;
                            this.columns = tableData.columns;
                        }
                    })
            }
        }
    }
</script>

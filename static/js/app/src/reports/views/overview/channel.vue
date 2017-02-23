<template>
    <div>
        <p style="margin-bottom: 22px">订单金额拆分到每日订单，统计每日订单消费金额的渠道来源</p>
        <div class="card">
            <h5 class="card-title"><b>渠道来源分析</b></h5>
            <div style="display: flex">
                <div id="pie" style="width: 40%; height: 336px"></div>
                <div id="line" style="width: 60%; height: 336px"></div>
            </div>
        </div>
        <div style="margin: 20px 0 10px;display: flex;justify-content: space-between">
            <p>渠道来源明细
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
    import AJAXService from '../../../common/AJAXService';
    import { setPie, setLine } from '../../utils/chartHelper';
    import { getTableData } from '../../utils/tableHelper';
    import { DdTable } from 'dd-vue-component';
    import util from '../../../common/util';
    export default{
        computed: {
            ...mapState(['date']),
            exportUrl() {
                const paramsObj = {
                    exportType: 0,
                    reportType: 11,
                    params: JSON.stringify({
                        startDate: this.date.startDate,
                        endDate: this.date.endDate
                    })
                };
                const host = AJAXService.getUrl2('/stat/exportReport');
                const pa = AJAXService.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = AJAXService.paramsToString(pa);
                return `${host}?${params}`;
            }
        },
        watch: {
            date() {
                this.getChannelStatistics();
            }
        },
        created() {
            this.getChannelStatistics();
        },
        data() {
            return {
                columns: [],
                dataSource: []
            }
        },
        components: {
            DdTable
        },
        methods: {
            getChannelStatistics() {
                AJAXService.ajaxWithToken('get', '/stat/getStatisticsByType', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    statTypes: JSON.stringify([7])
                })
                .then(res => {
                    if (res.code === 1) {
                        const startDate = util.stringToDate(this.date.startDate);
                        const endDate = util.stringToDate(this.date.endDate);

                        const days = util.getDateBetween(startDate, endDate);
                        const { channelIncome, channelsStatByDate } = res.data;
                        setPie(channelIncome.items);
                        setLine(channelsStatByDate.map(i => ({
                            name: i.name,
                            type: 'line',
                            data: i.channelsStatByDate.map(i => i.value)
                        })),
                            days.map(d => util.dateFormatWithoutYear(d)),
                            '金额（元）')
                        const tableData = getTableData({
                            list: channelsStatByDate.map(i => ({ ...i, dateValues: i.channelsStatByDate })),
                            firstTitle: '客源渠道',
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

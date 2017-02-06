<template>
    <div>
        <p style="margin: 20px 0 10px">统计每日的实际收款金额</p>
        <div class="card">
            <p class="card-title">
                <span>总流水 ¥{{totalFlow}}</span>
                <span>总收入：¥{{totalIncome}}</span>
                <span>总支出：¥{{totalExpense}}</span>
            </p>
            <div style="display: flex;height: 500px">
                <div id="collect" style="width: 50%;height: 100%"></div>
                <div id="refund" style="width: 50%;height: 100%"></div>
            </div>
        </div>
        <p style="margin: 20px 0 10px">收款方式明细（{{date.startDate}}~{{date.endDate}}）</p>
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
    import AJAXService from '../../../../common/AJAXService';
    import util from '../../../../common/util';
    import echarts from 'echarts';
    export default{
        computed: {
            ...mapState(['date'])
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
                AJAXService.ajaxWithToken('get', '/stat/getFlowStatsByChannel', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                })
                    .then(res => {
                        if (res.code === 1) {
                            const { refundList, collectList, listByChannels } = res.data;
                            this.totalFlow = res.data.totalFlow;
                            this.totalIncome = res.data.totalIncome;
                            this.totalExpense = res.data.totalExpense;
                            this.setPie('collect', collectList);
                            this.setPie('refund', refundList);
                            this.setTable(listByChannels);
                        }
                    })
            },
            setTable(list) {
                const width = 1000 / 9;
                this.columns = [
                    {
                        title: '收款方式',
                        fixed: true,
                        dataIndex: 'channelName',
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
                    channelName: '总和合计',
                    list: dates.map((d, i) => {
                        const value = list.reduce((a, b) => {
                            return a + b.list[i].value
                        }, 0);

                        return {
                            date: util.dateFormat(d),
                            value: value.toFixed(2) == value ? value : Number(value.toFixed(2))
                        };
                    })
                });

                this.dataSource = list.map(i => {
                    const data = {
                        channelName: i.channelName
                    };
                    const total = i.list.reduce((a, b) => {
                        data[b.date] = b.value;
                        return a + b.value;
                    }, 0);
                    data.total = total.toFixed(2) == total ? total : total.toFixed(2);
                    return data;
                });

                this.dataSource[this.dataSource.length - 1].foot = true;
            },
            setPie(id , data) {
                const chart = echarts.init(document.getElementById(id));
                chart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)"
                    },
                    legend: {
                        bottom: 0,
                        data: data.map(i => i.name)
                    },
                    series: [{
                        type: 'pie',
                        radius: ['50%', '70%'],
                        data: data
                    }],
                });
            }
        }
    }
</script>

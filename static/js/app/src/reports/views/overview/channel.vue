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
    </div>
</template>
<style>

</style>
<script>
    import { mapState } from 'vuex';
    import AJAXService from '../../../common/AJAXService';
    import echarts from 'echarts';
    export default{
        computed: {
            ...mapState(['date'])
        },
        watch: {
            date() {
                this.getChannelStatistics();
            }
        },
        created() {
            this.getChannelStatistics();
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
                        const { channelIncome, channelsStatByDate } = res.data;
                        this.setPie(channelIncome);
                        this.setLine(channelsStatByDate)
                    }
                })
            },
            setPie(channelIncome) {
                const chart = echarts.init(document.getElementById('pie'));
                chart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)"
                    },
                    legend: {
                        bottom: 0,
                        data: channelIncome.items.map(i => i.name)
                    },
                    series: [{
                        type: 'pie',
                        radius: ['50%', '70%'],
                        data: channelIncome.items
                    }],
                });
            },
            setLine(channelsStatByDate) {
                const chart = echarts.init(document.getElementById('line'));
                chart.setOption({
                    dataZoom: [{
                        type: 'slider',
                        filterMode: 'filter'
                    },],
                    legend: {
                        bottom: 0,
                        data: channelsStatByDate.map(i => i.name)
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a}{b}: {c}"
                    },
                    xAxis: {
                        boundaryGap: false,
                        type: 'category',
                        data: channelsStatByDate[0].channelsStatByDate.map(i => i.date.substr(5, 5))
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series:
                        channelsStatByDate.map(i => ({
                            name: i.name,
                            type: 'line',
                            data: i.channelsStatByDate.map(i => i.value)
                        }))
                });
            }
        }
    }
</script>

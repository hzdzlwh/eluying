<template>
    <div>
        <p>统计每日的实际收款金额</p>
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

    </div>
</template>
<style>
</style>
<script>
    import { mapState } from 'vuex';
    import AJAXService from '../../../../common/AJAXService';
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
                totalExpense: undefined
            }
        },
        methods: {
            getFlowStatsByChannel() {
                AJAXService.ajaxWithToken('get', '/stat/getFlowStatsByChannel', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                })
                    .then(res => {
                        if (res.code === 1) {
                            const { refundList, collectList } = res.data;
                            this.totalFlow = res.data.totalFlow;
                            this.totalIncome = res.data.totalIncome;
                            this.totalExpense = res.data.totalExpense;
                            this.setPie('collect', collectList);
                            this.setPie('refund', refundList);
                        }
                    })
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

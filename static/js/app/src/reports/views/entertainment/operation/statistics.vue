<template>
    <div>
        <p>订单金额拆分到每日订单，统计每日产生的消费金额</p>
        <div style="display: flex">
            <div class="card"
                 style="width: 204px;height: 420px; margin-right: 20px; display: flex;justify-content: space-around;flex-direction: column">
                <div>
                    <p>订单金额</p>
                    <h4>¥{{caterFee}}</h4>
                    <p>消费金额：¥{{consumeAmount}}</p>
                    <p>违约金：¥{{penalty}}</p>
                </div>
                <div>
                    <p>订单数</p>
                    <h4>{{orderCount}}</h4>
                </div>
                <div>
                    <p>消费人次</p>
                    <h4>{{peopleCount}}</h4>
                </div>
                <div>
                    <p>均次消费</p>
                    <h4>¥{{peopleAvgConsume}}</h4>
                </div>
            </div>
            <div class="card" style="flex: 1">
                <h5 class="card-title"><b>餐饮运营分析</b></h5>
                <div id="line" style="width: 100%;height:352px"></div>
            </div>
        </div>
    </div>
</template>
<style>
</style>
<script>
    import echarts from 'echarts';
    import { mapState } from 'vuex';
    import AJAXService from '../../../../common/AJAXService';
    export default{
        data() {
            return {
               
            }
        },
        computed: {
            ...mapState(['date'])
        },
        watch: {
            date() {
                this.getEntertainmentStatistics();
            }
        },
        created() {
            this.getEntertainmentStatistics();
        },
        methods: {
            getEntertainmentStatistics() {
                AJAXService.ajaxWithToken('get', '/stat/getEntertainmentStatistics', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate
                }).then(res => {
                    if (res.code === 1) {
                        this.setLine(res.data);
                        this.caterFee = res.data.summary.caterFee;
                        this.consumeAmount = res.data.summary.consumeAmount;
                        this.orderCount = res.data.summary.orderCount;
                        this.penalty = res.data.summary.penalty;
                        this.peopleAvgConsume = res.data.summary.peopleAvgConsume;
                        this.peopleCount = res.data.summary.peopleCount;
                    }
                })
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
                        data: ['订单金额', '订单数', '消费次数', '均次消费']
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a}{b}: {c}"
                    },
                    xAxis: {
                        boundaryGap: false,
                        type: 'category',
                        data: data.caterFee.map(i => i.date.substr(5, 5))
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '订单金额',
                            type: 'line',
                            data: data.caterFee.map(i => i.value)
                        },
                        {
                            name: '订单数',
                            type: 'line',
                            data: data.orderCount.map(i => i.value)
                        },
                        {
                            name: '消费次数',
                            type: 'line',
                            data: data.peopleCount.map(i => i.value)
                        },
                        {
                            name: '均次消费',
                            type: 'line',
                            data: data.peopleAvgConsume.map(i => i.value)
                        }
                    ]
                });
            }
        }
    }
</script>

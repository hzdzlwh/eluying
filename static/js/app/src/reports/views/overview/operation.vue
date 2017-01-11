<template>
    <div>
        <p>订单金额拆分到每日订单，统计每日产生的消费金额，</p>
        <p>包括已预订、进行中、已结束、已取消的订单</p>
        <div class="card" style="display: flex;justify-content: space-around;margin-bottom: 20px">
            <div>
                <p>总消费金额</p>
                <h4><b>¥{{allTotalAmount}}</b></h4>
            </div>
            <div>
                <p>住宿</p>
                <h4>¥{{roomTotalAmount}}</h4>
            </div>
            <div>
                <p>餐饮</p>
                <h4>¥{{caterTotalAmount}}</h4>
            </div>
            <div>
                <p>娱乐</p>
                <h4>¥{{playTotalAmount}}</h4>
            </div>
            <div>
                <p>商超</p>
                <h4>¥{{goodsTotalAmount}}</h4>
            </div>
        </div>
        <div class="card">
            <h5 class="card-title"><em>业态来源分析</em></h5>
            <div style="display: flex">
                <div id="pie" style="width: 50%; height: 336px">
                </div>
                <div id="line" style="width: 50%; height: 336px">
                </div>
            </div>
        </div>
    </div>
</template>
<style>
</style>
<script>
    import echarts from 'echarts';
    import { mapState } from 'vuex';
    import AJAXService from '../../../common/AJAXService';
    export default{
        props: {
            startDate: String,
            endDate: String
        },
        data() {
            return {
                roomTotalAmount: undefined,
                caterTotalAmount: undefined,
                playTotalAmount: undefined,
                goodsTotalAmount: undefined,
                allTotalAmount: undefined
            }
        },
        computed: {
            ...mapState(['date'])
        },
        watch: {
            date() {
                this.getOperationStatistics();
            }
        },
        created() {
            this.getOperationStatistics();
        },
        methods: {
            getOperationStatistics() {
                AJAXService.ajaxWithToken('get', '/stat/getOperationStatisticsPc', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    orderType: -1
                })
                    .then(res => {
                        if (res.code === 1) {
                            const operationStat = res.data.operationStat;
                            this.roomTotalAmount = operationStat.roomStat.totalAmount;
                            this.caterTotalAmount = operationStat.caterStat.totalAmount;
                            this.playTotalAmount = operationStat.playStat.totalAmount;
                            this.goodsTotalAmount = operationStat.goodsStat.totalAmount;
                            this.allTotalAmount = operationStat.allStat.totalAmount;
                            this.setPie(operationStat);
                            this.setLine(operationStat);
                        }
                    })
            },
            setPie(operationStat) {
                const chart = echarts.init(document.getElementById('pie'));
                chart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)"
                    },
                    legend: {
                        bottom: 0,
                        data:['住宿','餐饮','娱乐','商超']
                    },
                    series: [{
                        type: 'pie',
                        radius: ['50%', '70%'],
                        data:[
                            {value: operationStat.roomStat.totalAmount, name:'住宿'},
                            {value: operationStat.caterStat.totalAmount, name:'餐饮'},
                            {value: operationStat.playStat.totalAmount, name:'娱乐'},
                            {value: operationStat.goodsStat.totalAmount, name:'商超'},
                        ]
                    }],
                });
            },
            setLine(operationStat) {
                const chart = echarts.init(document.getElementById('line'));
                chart.setOption({
                    dataZoom: [{
                        type: 'slider',
                        filterMode: 'filter'
                    },],
                    legend: {
                        bottom: 0,
                        data:['总消费金额', '住宿','餐饮','娱乐','商超']
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a}{b}: {c}"
                    },
                    xAxis: {
                        boundaryGap: false,
                        type: 'category',
                        data: operationStat.roomStat.items.map(i => i.date.substr(5, 5))
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series:[
                        {
                            name: '总消费金额',
                            type: 'line',
                            data: operationStat.allStat.items.map(i => i.value)
                        },
                        {
                            name: '住宿',
                            type: 'line',
                            data: operationStat.roomStat.items.map(i => i.value)
                        },
                        {
                            name: '餐饮',
                            type: 'line',
                            data: operationStat.caterStat.items.map(i => i.value)
                        },
                        {
                            name: '娱乐',
                            type: 'line',
                            data: operationStat.playStat.items.map(i => i.value)
                        },
                        {
                            name: '商超',
                            type: 'line',
                            data: operationStat.goodsStat.items.map(i => i.value)
                        }
                    ]
                });
            }
        }
    }
</script>

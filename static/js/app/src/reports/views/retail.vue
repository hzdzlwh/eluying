<template>
    <div>
        <p>订单金额拆分到每日订单，统计每日产生的消费金额</p>
        <div style="display: flex">
            <div class="card" style="width: 204px;height: 420px; margin-right: 20px; display: flex;justify-content: space-around;flex-direction: column">
                <div>
                    <p><small><i>订单金额</i></small></p>
                    <h4>¥{{orderPrice}}</h4>
                </div>
                <div>
                    <p><small>订单数</small></p>
                    <h4>{{orderNum}}</h4>
                </div>
            </div>
            <div class="card" style="flex: 1">
                <h5 class="card-title"><b>商超运营分析</b></h5>
                <div id="line" style="width: 100%;height:352px"></div>
            </div>
        </div>
        <p>房间消费明细<small><i>({{date.startDate}}~{{date.endDate}})</i></small></p>
    </div>
</template>
<style>
</style>
<script>
    import echarts from 'echarts';
    import { mapState } from 'vuex';
    import AJAXService from '../../common/AJAXService';
    export default{
        data() {
            return{
                orderNum: undefined,
                orderPrice: undefined,
            }
        },
        computed: {
            ...mapState(['date'])
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
                        this.setLine(res.data);
                        this.orderNum = res.data.orderNum;
                        this.orderPrice = res.data.orderPrice;
                    }
                })
            },
            setLine(data) {
                const chart = echarts.init(document.getElementById('line'));
                chart.setOption({
                    dataZoom: [{
                        type: 'slider',
                        filterMode: 'filter'
                    },],
                    legend: {
                        selectedMode: 'single',
                        data:['订单金额', '订单数']
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a}{b}: {c}"
                    },
                    xAxis: {
                        boundaryGap: false,
                        type: 'category',
                        data: data.orderPriceList.map(i => i.date.substr(5, 5))
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series:[
                        {
                            name: '订单金额',
                            type: 'line',
                            data: data.orderPriceList.map(i => i.value)
                        },
                        {
                            name: '订单数',
                            type: 'line',
                            data: data.orderNumList.map(i => i.orderNum)
                        }
                    ]
                });
            }
        }
    }
</script>

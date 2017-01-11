<template>
    <div>
        <p>订单金额拆分到每日订单，统计每日产生的消费金额</p>
        <div style="display: flex">
            <div class="card" style="width: 204px;height: 420px; margin-right: 20px; display: flex;justify-content: space-around;flex-direction: column">
                <div>
                    <p>房费</p>
                    <h4>¥{{roomFee}}</h4>
                    <p>消费金额：¥{{}}</p>
                    <p>违约金：¥{{penalty}}</p>
                </div>
                <div>
                    <p>间夜量</p>
                    <h4>{{roomNights}}</h4>
                </div>
                <div>
                    <p>平均房价</p>
                    <h4>¥{{avgPrice}}</h4>
                </div>
                <div>
                    <p>平均入住率</p>
                    <h4 v-if="occupancyRate !== 'undefined'">{{occupancyRate * 100}}%</h4>
                </div>
            </div>
            <div class="card" style="flex: 1">
                <h5 class="card-title"><b>住宿运营分析</b></h5>
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
    import AJAXService from '../../common/AJAXService';
    export default{
        data() {
            return{
                avgPrice: undefined,
                occupancyRate: undefined,
                penalty: undefined,
                roomFee: undefined,
                roomNights: undefined
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
                AJAXService.ajaxWithToken('get', '/stat/getRoomStatistics', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate
                }).then(res => {
                    if (res.code === 1) {
                        this.setLine(res.data);
                        this.avgPrice = res.data.summary.avgPrice;
                        this.occupancyRate = res.data.summary.occupancyRate;
                        this.penalty = res.data.summary.penalty;
                        this.roomFee = res.data.summary.roomFee;
                        this.roomNights = res.data.summary.roomNights;
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
                        data:[/*'房费',*/ '间夜量', '入住率', '平均房价']
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a}{b}: {c}"
                    },
                    xAxis: {
                        boundaryGap: false,
                        type: 'category',
                        data: data.avgPrice.map(i => i.date.substr(5, 5))
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series:[
                        /*{
                            name: '房费',
                            type: 'line',
                            data: data.roomFee.dateValues.map(i => i.value)
                        },*/
                        {
                            name: '间夜量',
                            type: 'line',
                            data: data.roomNights.map(i => i.value)
                        },
                        {
                            name: '入住率',
                            type: 'line',
                            data: data.occupancyRate.map(i => i.value)
                        },
                        {
                            name: '平均房价',
                            type: 'line',
                            data: data.avgPrice.map(i => i.value)
                        }
                    ]
                });
            }
        }
    }
</script>

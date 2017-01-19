<template>
    <div>
        <p>按订单的生成时间统计</p>
        <div class="card">
            <h5 class="card-title"><b>销售统计</b></h5>
            <div id="bar" style="width: 100%; height: 300px">

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
        data() {
            return{
                msg: 'hello vue'
            }
        },
        computed: {
            ...mapState(['date'])
        },
        created() {
            this.getSaleStatistics();
        },
        watch: {
            date() {
                this.getSaleStatistics();
            }
        },
        methods: {
            getSaleStatistics() {
                AJAXService.ajaxWithToken('get', '/stat/getStatisticsByType', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    statTypes: JSON.stringify([1])
                })
                .then(res => {
                    if (res.code === 1) {
                        const salesStat = res.data.salesStat;
                        this.setBar(salesStat);
                    }
                })
            },
            setBar(salesStat) {
                const chart = echarts.init(document.getElementById('bar'));
                chart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c}'
                    },
                    dataZoom: [{
                        type: 'slider',
                        filterMode: 'filter'
                    },],
                    xAxis: {
                        type: 'category',
                        data: salesStat.items.map(i => i.date.substr(5, 5))
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        type: 'bar',
                        data: salesStat.items.map(i => i.value),
                        itemStyle: {
                            normal: {
                                color: '#82beff',
                                barBorderRadius: 2
                            }
                        },
                        barWidth: 16,
                        label: {
                            normal: {
                                formatter: '{c}',
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: '#000'
                                }
                            }
                        }
                    }]
                });
            }
        }
    }
</script>

<template>
    <div>
        <div style="margin-bottom: 20px">
            <p><i>订单金额拆分到每日订单，统计每日产生的消费金额，</i></p>
            <p><i>包括已预订、进行中、已结束、已取消的订单</i></p>
        </div>
        <div class="card" style="display: flex;justify-content: space-around;margin-bottom: 20px">
            <div>
                <p><i><small>总消费金额</small></i></p>
                <h4><b>¥ {{allTotalAmount}}</b></h4>
            </div>
            <div>
                <p><i><small>住宿</small></i></p>
                <h4>¥ {{roomTotalAmount}}</h4>
            </div>
            <div>
                <p><i><small>餐饮</small></i></p>
                <h4>¥ {{caterTotalAmount}}</h4>
            </div>
            <div>
                <p><i><small>娱乐</small></i></p>
                <h4>¥ {{playTotalAmount}}</h4>
            </div>
            <div>
                <p><i><small>商超</small></i></p>
                <h4>¥ {{goodsTotalAmount}}</h4>
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
    import { setPie, setLine } from '../../utils/chartHelper';
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
                            setPie([
                                {value: operationStat.roomStat.totalAmount, name:'住宿'},
                                {value: operationStat.caterStat.totalAmount, name:'餐饮'},
                                {value: operationStat.playStat.totalAmount, name:'娱乐'},
                                {value: operationStat.goodsStat.totalAmount, name:'商超'},
                            ]);
                            setLine([
                                {
                                    name: '住宿',
                                    data: operationStat.roomStat.items.map(i => i.value)
                                },
                                {
                                    name: '餐饮',
                                    data: operationStat.caterStat.items.map(i => i.value)
                                },
                                {
                                    name: '娱乐',
                                    data: operationStat.playStat.items.map(i => i.value)
                                },
                                {
                                    name: '商超',
                                    data: operationStat.goodsStat.items.map(i => i.value)
                                },
                                {
                                    name: '总消费金额',
                                    data: operationStat.allStat.items.map(i => i.value)
                                },
                            ],
                                operationStat.roomStat.items.map(i => i.date.substr(5, 5)),
                                '金额（元）'
                            );
                        }
                    })
            },
        }
    }
</script>

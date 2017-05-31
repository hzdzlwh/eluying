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
            <div>
                <p><i><small>会员卡费</small></i></p>
                <h4>¥ {{vipCardFeeAmount}}</h4>
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
        <div style="margin: 20px 0 10px;display: flex;justify-content: space-between">
            <p>运营明细
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
    import http from '../../../common/http';
    import { setPie, setLine } from '../../utils/chartHelper';
    import { getTableData } from '../../utils/tableHelper';
    import { DdTable } from 'dd-vue-component';
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
                allTotalAmount: undefined,
                vipCardFeeAmount: undefined,
                columns: [],
                dataSource: []
            };
        },
        components: {
            DdTable
        },
        computed: {
            ...mapState(['date']),
            exportUrl() {
                const paramsObj = {
                    exportType: 0,
                    reportType: 10,
                    params: JSON.stringify({
                        startDate: this.date.startDate,
                        endDate: this.date.endDate
                    })
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            }
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
                http.get('/stat/getOperationStatisticsPc', {
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
                            this.vipCardFeeAmount = operationStat.vipCardFeeStat.totalAmount;
                            this.allTotalAmount = operationStat.allStat.totalAmount;
                            setPie([
                                { value: operationStat.roomStat.totalAmount, name: '住宿' },
                                { value: operationStat.caterStat.totalAmount, name: '餐饮' },
                                { value: operationStat.playStat.totalAmount, name: '娱乐' },
                                { value: operationStat.goodsStat.totalAmount, name: '商超' },
                                { value: operationStat.vipCardFeeStat.totalAmount, name: '会员卡费' }
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
                                    name: '会员卡费',
                                    data: operationStat.vipCardFeeStat.items.map(i => i.value)
                                },
                                {
                                    name: '总消费金额',
                                    data: operationStat.allStat.items.map(i => i.value)
                                }
                            ],
                                operationStat.roomStat.items.map(i => i.date.substr(5, 5)),
                                '金额（元）'
                            );
                            const tableData = getTableData({
                                list: [
                                    {
                                        name: '住宿',
                                        dateValues: operationStat.roomStat.items
                                    },
                                    {
                                        name: '餐饮',
                                        dateValues: operationStat.caterStat.items
                                    },
                                    {
                                        name: '娱乐',
                                        dateValues: operationStat.playStat.items
                                    },
                                    {
                                        name: '商超',
                                        dateValues: operationStat.goodsStat.items
                                    },
                                    {
                                        name: '会员卡费',
                                        dateValues: operationStat.vipCardFeeStat.items
                                    }
                                ],
                                firstTitle: '',
                                secondTitle: '合计',
                                foot: true
                            });
                            this.dataSource = tableData.dataSource;
                            this.columns = tableData.columns;
                        }
                    });
            }
        }
    };
</script>

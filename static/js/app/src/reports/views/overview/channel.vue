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
    import { setPie, setLine } from '../../utils/chartHelper';
    import util from '../../../common/util';
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
                        const startDate = util.stringToDate(this.date.startDate);
                        const endDate = util.stringToDate(this.date.endDate);

                        const days = util.getDateBetween(startDate, endDate);
                        const { channelIncome, channelsStatByDate } = res.data;
                        setPie(channelIncome.items);
                        setLine(channelsStatByDate.map(i => ({
                            name: i.name,
                            type: 'line',
                            data: i.channelsStatByDate.map(i => i.value)
                        })),
                            days.map(d => util.dateFormatWithoutYear(d)),
                            '金额（元）')
                    }
                })
            }
        }
    }
</script>

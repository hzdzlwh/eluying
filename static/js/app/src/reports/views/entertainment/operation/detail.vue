<template>
    <div>
        <div style="margin: 20px 0 10px;display: flex;justify-content: space-between">
            <div>娱乐消费明细
                <small><i>({{date.startDate}}~{{date.endDate}})</i></small>
                <div v-if="entertainmentList.length > 0" class="reports-component-container">
                    <dd-select v-model="entertainmentId">
                        <dd-option v-for="enter in entertainmentList" :value="enter.entertainmentId" :label="enter.entertainmentName"></dd-option>
                    </dd-select>
                </div>
            </div>
            <a :href="exportUrl" download><button class="dd-btn dd-btn-primary">导出Excel</button></a>
        </div>
        <div>
            <dd-Table :columns="columns" :data-source="dataSource" :bordered="true" size="small"></dd-Table>
        </div>
    </div>
</template>
<style lang="sass" rel="stylesheet/scss" type="text/css">
    .reports-component-container {
        display: inline-block;
        .dd-input {
            width: 120px;
        }
        .dd-select-option {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
</style>
<script>
    import {mapState} from 'vuex';
    import AJAXService from '../../../../common/AJAXService';
    import util from '../../../../common/util';
    import { DdTable, DdSelect, DdOption } from 'dd-vue-component';
    import { getTableData } from '../../../utils/tableHelper';

    export default{
        data() {
            return{
                columns: [],
                dataSource: [],
                entertainmentList: [],
                entertainmentId: undefined
            }
        },
        components: {
            DdTable,
            DdSelect,
            DdOption
        },
        watch: {
            date() {
                this.getEnterConsumeDetail();
            },
            entertainmentId() {
                this.getEnterConsumeDetail();
            }
        },
        created() {
            this.getEntertainmentList();
        },
        computed: {
            ...mapState(['date']),
            exportUrl () {
                const paramsObj = {
                    exportType: 0,
                    reportType: 6,
                    params: {
                        startDate: this.date.startDate,
                        endDate: this.date.endDate,
                    }
                };
                if (this.entertainmentId !== -1) {
                    paramsObj.params.nodeId = this.entertainmentId;
                }
                paramsObj.params = JSON.stringify(paramsObj.params);
                const host = AJAXService.getUrl2('/stat/exportReport');
                const pa = AJAXService.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = AJAXService.paramsToString(pa);
                return `${host}?${params}`;
            }
        },
        methods: {
            getEntertainmentList() {
                AJAXService.ajaxWithToken('get', '/stat/getAllEntertainment', {})
                    .then(res => {
                        if (res.code === 1) {
                            this.entertainmentList = res.data.entertainmentList;
                            this.entertainmentList.unshift({ entertainmentId: -1, entertainmentName: '全部项目' });
                            this.entertainmentId = res.data.entertainmentList[0].entertainmentId;
                        }
                    })
                    .then(() => {
                        this.getEnterConsumeDetail();
                    })
            },
            getEnterConsumeDetail() {
                const params = this.entertainmentId === -1 ? { ...this.date } : { ...this.date, nodeId: this.entertainmentId };
                AJAXService.ajaxWithToken('get', '/stat/getEnterConsumeDetail', params)
                    .then(res => {
                        if (res.code === 1) {
                            const tableData = getTableData({
                                list: res.data.classifyList,
                                firstTitle: '娱乐项目',
                                secondTitle: '合计',
                                foot: true
                            });
                            this.dataSource = tableData.dataSource;
                            this.columns = tableData.columns;
                        }
                    });
            },
        }
    }
</script>

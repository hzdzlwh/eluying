<template>
    <div>
        <div style="margin: 20px 0 10px;display: flex;justify-content: space-between">
            <div>菜品消费明细
                <small><i>({{date.startDate}}~{{date.endDate}})</i></small>
                <div v-if="restaurantList.length > 0" class="reports-component-container">
                    <dd-select v-model="restaurantId">
                        <dd-option v-for="rest in restaurantList" :value="rest.restId" :label="rest.restName"></dd-option>
                    </dd-select>
                </div>
                <small><i>菜品统计包含套餐里面的菜品</i></small>
            </div>
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
    import {mapState} from 'vuex';
    import AJAXService from '../../../../common/AJAXService';
    import util from '../../../../common/util';
    import { getTableData } from '../../../utils/tableHelper';
    import { DdTable, DdSelect, DdOption } from 'dd-vue-component';

    export default{
        data() {
            return{
                columns: [],
                dataSource: [],
                restaurantList: [],
                restaurantId: undefined
            }
        },
        components: {
            DdTable,
            DdSelect,
            DdOption
        },
        watch: {
            date() {
                this.getFoodConsumeDetail();
            },
            restaurantId() {
                this.getFoodConsumeDetail();
            }
        },
        created() {
            this.getRestaurantList();
        },
        computed: {
            ...mapState(['date']),
            exportUrl () {
                const paramsObj = {
                    exportType: 0,
                    reportType: 4,
                    params: {
                        startDate: this.date.startDate,
                        endDate: this.date.endDate,
                        nodeId: this.restaurantId
                    }
                };
                const host = AJAXService.getUrl2('/stat/exportReport');
                const pa = AJAXService.getDataWithToken(paramsObj);
                const params = AJAXService.paramsToString(pa);
                return `${host}?${params}`;
            }
        },
        methods: {
            getRestaurantList() {
                AJAXService.ajaxWithToken('get', '/restaurant/list', {})
                    .then(res => {
                        if (res.code === 1) {
                            this.restaurantList = res.data.list;
                            this.restaurantId = res.data.list[0].restId;
                        }
                    })
                    .then(() => {
                        this.getFoodConsumeDetail();
                    })
            },
            getFoodConsumeDetail() {
                AJAXService.ajaxWithToken('get', '/stat/getFoodConsumeDetail', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    nodeId: this.restaurantId
                }).then(res => {
                    if (res.code === 1) {
                        const tableData = getTableData({
                            list: res.data.classifyList,
                            firstTitle: '菜品名称',
                            secondTitle: '合计',
                            foot: false
                        });
                        this.dataSource = tableData.dataSource;
                        this.columns = tableData.columns;
                    }
                })
            },
        }
    }
</script>

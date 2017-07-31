<template>
    <div>
        <div class="report-reportCenter-date">
            <div :class="collectClass" @click="collectUrl(collectNum)" style="float:right;margin-top:-20px;margin-left:20px;">
                {{collectName}}
            </div>
            <div class="export" style="float:right;margin-left:20px;margin-top:-20px;">
                <dd-dropdown text="导出明细" trigger="click" style="width:100px;">
                    <!-- <dd-dropdown-item><span><a :href="exportUrl(1)">导出PDF</a></span></dd-dropdown-item> -->
                    <dd-dropdown-item><span><a :href="exportUrl(0)">导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
            </div>
        </div>
        <p class="report-title">
            菜品赠送明细表
        </p>
        <div class="report-select-top">
            <div class="date">日期 : <i>{{date.startDate}} ~ {{date.endDate}}</i></div>
            <div class="select-box">
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="restType" >
                        <dd-option :key="item.id" v-for="item in restTypeAll" :value="item.restType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="name" >
                        <dd-option :key="item.id" v-for="item in dishTypeAll" :value="item.name" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="operatorId" >
                        <dd-option :key="item.employeeId" v-for="item in employeeList" :value="item.employeeId" :label="item.realName"></dd-option>
                    </dd-select>
                </div>
            </div>
        </div>
        <dd-table :columns="col" :data-source="vips" :bordered="true" style="margin:20px 0 10px;"></dd-table>
        <div class="foot footfix">
            <div style="float:left;">
                <p style="font-size:16px;"><small style='width:16px;'>总赠送数量 : </small> {{receiptNum}}</p>
                <p style="font-size:16px;"><small style='width:16px;'>总赠送金额 : </small> {{receiptFree}}</p>
            </div>
            <dd-pagination @currentchange="handlePageChange" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" style="float:right;margin-top:20px;"/>
        </div>
    </div>
</template>
<style lang='scss' scoped>
</style>
<script>
    import { DdTable, DdPagination, DdDropdown, DdDropdownItem, DdSelect, DdOption, DdGroupOption } from 'dd-vue-component';
    import http from 'http';
    import { mapState } from 'vuex';
    import { getRestType, getDishType, getEmployeeType } from '../mixin/selectType';
    import { collect } from '../mixin/collect';
    import pagination from '../mixin/pagination';
    export default {
        mixins: [ getRestType, collect, pagination, getDishType, getEmployeeType ],
        props: {
            startDate: String,
            endDate: String
        },
        data() {
            return {
                vips: [],
                receiptNum: 0,
                receiptFree: 0,
                col: [
                    {
                        title: '订单号',
                        dataIndex: 'orderNum',
                        width: 160
                    },
                    {
                        title: '餐厅名称',
                        dataIndex: 'restName',
                        width: 100
                    },
                    {
                        title: '桌位',
                        dataIndex: 'boardName',
                        width: 80
                    },
                    {
                        title: '菜品分类',
                        dataIndex: 'dishType',
                        width: 100
                    },
                    {
                        title: '菜名',
                        dataIndex: 'dishName',
                        width: 100
                    },
                    {
                        title: '单价',
                        dataIndex: 'price',
                        width: 100
                    },
    
                    {
                        title: '数量',
                        dataIndex: 'bookNum',
                        width: 80
                    },
                    {
                        title: '总价',
                        dataIndex: 'totalPrice',
                        width: 120
                    },
                    {
                        title: '操作时间',
                        dataIndex: 'operationDate',
                        width: 120
                    },
                    {
                        title: '操作人',
                        dataIndex: 'operatorName',
                        width: 100
                    }
                ]
            };
        },
        beforeRouteEnter (to, from, next) {
            http.get('/stat/getCollection')
                .then(res => {
                    if(res.code === 1) {
                        next(vm => {
                            const collectList = res.data.list;
                            for(let i=0;i<collectList.length;i++){
                                if (collectList[i] === 501) {
                                    vm.collectNum = 1;
                                    vm.collectName = '已收藏';
                                }
                            }
                        })
                    }
                })
        },
        created() {
            this.getData();
            this.getRestType();
            this.getEmployeeList();
            this.getDishType();
            this.collectStat();
        },
        components: {
            DdTable,
            DdPagination,
            DdDropdown,
            DdDropdownItem,
            DdSelect,
            DdOption,
            DdGroupOption
        },
        watch: {
            date() {
                this.pageNo = 1;
                this.getData();
            }
        },
        computed: {
            ...mapState(['date'])
        },
        methods: {
            collectUrl(num) {
                if (num === 0) {
                    http.get('/stat/addToCollect',{statValue: 501}).then(res => {
                        this.collectNum = 1;
                        this.collectName = '已收藏';
                    });
                } else if (num === 1) {
                    http.get('/stat/removeFromCollection',{statValue: 501}).then(res => {
                        this.collectNum = 0;
                        this.collectName = '加入收藏';
                        let removeIndex = null;
                        this.$router.options.routes[2].children[0].children.map((item, index) => {
                            if (item.meta.id === 501) {
                                removeIndex = index;
                            }
                        });
                        this.$router.options.routes[2].children[0].children.splice(removeIndex , 1);
                        if (this.$router.options.routes[2].children[0].children.length > 1) {
                            if (this.$route.params.id) {
                                this.$router.push('/reportCenter/collect/' + this.$router.options.routes[2].children[0].children[1].meta.id);
                            }
                        } else {
                            if (this.$route.params.id) {
                                this.$router.push('/reportCenter/collect/');
                            }
                        }
                    });
                }
            },
            exportUrl(type) {
                const obj = {
                    pageNo: this.pageNo,
                    restId: this.restType.split('~')[1],
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    showPackageDish: 0
                };
                if (this.name !== '全部菜品分类') {
                    obj.dishType = this.name;
                };
                if (this.operatorId !== 'ALL') {
                    obj.operatorId = this.operatorId;
                };
                 // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                };
                const paramsObj = {
                    exportType: type,
                    reportType: 501,
                    params: JSON.stringify(obj)
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            },
            getData() {
                const obj = {
                    pageNo: this.pageNo,
                    restId: this.restType.split('~')[1],
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    showPackageDish: 0
                };
                if (this.name !== '全部菜品分类') {
                    obj.dishType = this.name;
                };
                if (this.operatorId !== 'ALL') {
                    obj.operatorId = this.operatorId;
                };
                 // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                };
                http.post('/stat/getDishSendDetail', obj).then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.list || [];
                        this.receiptNum = res.data.count;
                        this.receiptFree = res.data.totalPrice;
                        this.pages = Math.ceil(res.data.count / 30);
                    }
                    this.flag = true;
                });
            }
        }
    };
</script>

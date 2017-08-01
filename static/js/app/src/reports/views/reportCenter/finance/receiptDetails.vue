<template>
    <div>
        <p class="report-title">
            收款明细表
        </p>
        <div class="report-select-top">
            <div class="date">日期 : <i>{{date.startDate}} ~ {{date.endDate}}</i></div>
            <div class="select-box">
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="orderType" >
                        <dd-option :key="item.id" v-for="item in orderTypeAll" :value="item.orderType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="channelId" >
                        <dd-option :key="item.id" v-for="item in channels" :value="item.id" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="operatorId" >
                        <dd-option :key="item.employeeId" v-for="item in employeeList" :value="item.employeeId" :label="item.realName"></dd-option>
                    </dd-select>
                </div>
            </div>
            <div class="export">
                <dd-dropdown text="导出明细" trigger="click" style="width:100px;">
                  <!-- <dd-dropdown-item><span><a :href="exportUrl(1)">导出PDF</a></span></dd-dropdown-item> -->
                  <dd-dropdown-item><span><a :href="exportUrl(0)">导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
            </div>
            <div :class="collectClass" @click="collectUrl(collectNum)">
                {{collectName}}
            </div>
        </div>
        <dd-table :columns="col" :data-source="vips" :bordered="true" style="margin: 20px 0 10px;"></dd-table>
        <div class="foot footfix">
            <div style="float:left;">
                <p style="font-size:16px;"><small style='width:16px;'>总收款笔数 : </small> {{receiptNum}}</p>
                <p style="font-size:16px;"><small style='width:16px;'>总收款金额 : </small> {{receiptFree}}</p>
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
    import { collect } from '../mixin/collect';
    import pagination from '../mixin/pagination';
    import { getEmployeeType, getChannelType, getOrderType } from '../mixin/selectType';
    export default {
        mixins: [collect, pagination, getEmployeeType, getChannelType, getOrderType],
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
                        width: 140
                    },
                    {
                        title: '订单类型',
                        dataIndex: 'orderType',
                        width: 60
                    },
                    {
                        title: '订单内容',
                        dataIndex: 'orderContent',
                        width: 120
                    },
                    {
                        title: '联系人',
                        dataIndex: 'customerName',
                        width: 80
                    },
                    {
                        title: '手机号',
                        dataIndex: 'customerPhone',
                        width: 100
                    },
                    {
                        title: '下单时间',
                        dataIndex: 'creationTime',
                        width: 120
                    },
                    {
                        title: '收款金额',
                        dataIndex: 'amount',
                        width: 100
                    },
    
                    {
                        title: '收款时间',
                        dataIndex: 'payTime',
                        width: 120
                    },
                    {
                        title: '收款方式',
                        dataIndex: 'payChannel',
                        width: 80
                    },
                    {
                        title: '操作人',
                        dataIndex: 'operator',
                        width: 80
                    }
                ]
            };
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
        beforeRouteEnter(to, from, next) {
            http.get('/stat/getCollection')
                .then(res => {
                    if (res.code === 1) {
                        next(vm => {
                            const collectList = res.data.list;
                            for (let i = 0; i < collectList.length; i ++) {
                                if (collectList[i] === 401) {
                                    vm.collectNum = 1;
                                    vm.collectName = '已收藏';
                                }
                            }
                        });
                    }
                });
        },
        created() {
            this.getData();
            this.getEmployeeList();
            this.getChannels();
            this.collectStat();
        },
        computed: {
            ...mapState(['date'])
        },
        watch: {
            date() {
                this.pageNo = 1;
                this.getData();
            }
        },
        methods: {
            collectUrl(num) {
                if (num === 0) {
                    http.get('/stat/addToCollect', { statValue: 401 }).then(res => {
                        this.collectNum = 1;
                        this.collectName = '已收藏';
                    });
                } else if (num === 1) {
                    http.get('/stat/removeFromCollection', { statValue: 401 }).then(res => {
                        this.collectNum = 0;
                        this.collectName = '加入收藏';
                        let removeIndex = null;
                        this.$router.options.routes[2].children[0].children.map((item, index) => {
                            if (item.meta.id === 401) {
                                removeIndex = index;
                            }
                        });
                        this.$router.options.routes[2].children[0].children.splice(removeIndex, 1);
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
                    page: this.pageNo,
                    startDate: this.date.startDate,
                    endDate: this.date.endDate
                };
                if (this.orderType !== -2) {
                    obj.orderType = this.orderType;
                }
                if (this.channelId !== 'ALL') {
                    obj.channelId = this.channelId;
                };
                if (this.operatorId !== 'ALL') {
                    obj.operatorId = this.operatorId;
                };
                // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                const paramsObj = {
                    exportType: type,
                    reportType: 401,
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
                    page: this.pageNo,
                    startDate: this.date.startDate,
                    endDate: this.date.endDate
                };
                if (this.orderType !== -2) {
                    obj.orderType = this.orderType;
                }
                if (this.channelId !== 'ALL') {
                    obj.channelId = this.channelId;
                };
                if (this.operatorId !== 'ALL') {
                    obj.operatorId = this.operatorId;
                };
                // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                http.get('/stat/getPaymentList', obj).then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.items || [];
                        this.receiptNum = res.data.totalCount;
                        this.receiptFree = res.data.totalAmount;
                        this.pages = Math.ceil(res.data.totalCount / 30);
                    }
                    this.flag = true;
                });
            }
        }
    };
</script>

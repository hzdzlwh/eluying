<template>
    <div>
        <div class="report-reportCenter-date">
            <div :class="collectClass" @click="collectUrl(collectNum)" style="float:right;margin-top:-20px;margin-left:20px;">
                {{collectName}}
            </div>
            <div class="export" style="float:right;margin-left:20px;margin-top:-20px;">
                <dd-dropdown text="导出明细" trigger="click" style="width:100px;">
                    <dd-dropdown-item><span><a :href="exportUrl(0)">导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
            </div>
        </div>
        <p class="report-title">
            详细日报表
        </p>
        <div class="report-select-top">
            <div class="date">日期 : <i>{{date.startDate}} ~ {{date.endDate}}</i></div>
            <div class="select-box">
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="restType" >
                        <dd-option :key="item.id" v-for="item in restTypeAll" :value="item.restType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
            </div>
        </div>
        <dd-table :columns="col" :data-source="vips" :bordered="true" style="margin:20px 0 10px;"></dd-table>
        <div class="foot footfix" style="overflow:hidden;">
            <div style="float:left;">
                <p style="font-size:16px;"><small style="width:16px;">订单总数</small>{{orderNum}}</p>
                <p style="font-size:16px;"><small style='width:16px;'>应收金额 :￥ </small> {{receiptNum}}</p>
                <p style="font-size:16px;"><small style='width:16px;'>实收金额 : ￥</small> {{receiptFree}}</p>
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
    import { getRestType } from '../mixin/selectType';
    import { collect } from '../mixin/collect';
    import pagination from '../mixin/pagination';
    export default {
        mixins: [getRestType, collect, pagination],
        props: {
            startDate: String,
            endDate: String
        },
        data() {
            return {
                vips: [],
                orderNum: 0,
                receiptNum: 0,
                receiptFree: 0,
                col: [
                    {
                        title: '餐厅名称',
                        dataIndex: 'restaurantName',
                        width: 100
                    },
                    {
                        title: '订单号',
                        dataIndex: 'orderNo',
                        width: 160
                    },
                    {
                        title: '用餐时间',
                        dataIndex: 'caterTime',
                        width: 100
                    },
                    {
                        title: '桌号',
                        dataIndex: 'tableNo',
                        width: 80
                    },
                    {
                        title: '人数',
                        dataIndex: 'peopleNum',
                        width: 60
                    },
                    {
                        title: '订单状态',
                        dataIndex: 'statusString',
                        width: 60
                    },
                    {
                        title: '总金额',
                        dataIndex: 'originTotalPrice',
                        width: 60
                    },
                    {
                        title: '折扣金额',
                        dataIndex: 'vipDiscount',
                        width: 60
                    },
                    {
                        title: '整单优惠',
                        dataIndex: 'discount',
                        width: 60
                    },
                    {
                        title: '零头处理',
                        dataIndex: 'odd',
                        width: 60
                    },
                    {
                        title: '应收金额',
                        dataIndex: 'totalPrice',
                        width: 60
                    },
                    {
                        title: '违约金',
                        dataIndex: 'penalty',
                        width: 60
                    },
                    {
                        title: '实收金额',
                        dataIndex: 'payment',
                        width: 60
                    },
                    {
                        title: '收款明细',
                        dataIndex: 'channelPrice',
                        width: 100
                    },
                    {
                        title: '收银员',
                        dataIndex: 'cashier',
                        width: 100
                    },
                    {
                        title: '操作人',
                        dataIndex: 'operator',
                        width: 100
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'creationTime',
                        width: 120
                    }
                ]
            };
        },
        beforeRouteEnter(to, from, next) {
            http.get('/stat/getCollection')
                .then(res => {
                    if (res.code === 1) {
                        next(vm => {
                            const collectList = res.data.list;
                            for (let i = 0; i < collectList.length; i ++) {
                                if (collectList[i] === 310) {
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
            this.getRestType();
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
                    http.get('/stat/addToCollect', { statValue: 310 }).then(res => {
                        this.collectNum = 1;
                        this.collectName = '已收藏';
                    });
                } else if (num === 1) {
                    http.get('/stat/removeFromCollection', { statValue: 310 }).then(res => {
                        this.collectNum = 0;
                        this.collectName = '加入收藏';
                        let removeIndex = null;
                        this.$router.options.routes[2].children[0].children.map((item, index) => {
                            if (item.meta.id === 1) {
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
                    pageNo: this.pageNo,
                    restId: this.restType.split('~')[1],
                    startDate: this.date.startDate,
                    toDate: this.date.endDate
                };
                // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                };
                const paramsObj = {
                    exportType: type,
                    reportType: 310,
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
                    toDate: this.date.endDate
                };
                // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                };
                http.get('/stat/getDailyCaterOrderReport', obj).then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.entityList || [];
                        this.orderNum = res.data.total;
                        this.receiptNum = res.data.totalPrice;
                        this.receiptFree = res.data.payment;
                        this.pages = Math.ceil(res.data.total / 30);
                    }
                });
            }
        }
    };
</script>

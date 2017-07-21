<template>
    <div>
        <DateSelect/>
        <h2 class="title">{{$route.meta.name}}</h2>
        <div class="top">
            <div class="date">日期 : <i>{{date.startDate}} ~ {{date.endDate}}</i></div>
            <div class="select-box">
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="orderType" >
                        <dd-option :key="item.id" v-for="item in orderTypeAll" :value="item.orderType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 140px;" class="fr check" >
                    <dd-select v-model="operatorType" >
                        <dd-option :key="item.id" v-for="item in operatorTypeAll" :value="item.operatorType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
            </div>
            <div class="export">
                <dd-dropdown text="导出明细" trigger="click" style="width:100px;">
                  <!-- <dd-dropdown-item><span><a :href="exportUrl(1)">导出PDF</a></span></dd-dropdown-item> -->
                  <dd-dropdown-item><span><a :href="exportUrl(0)">导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
            </div>
        </div>
        <dd-table :columns="col" :data-source="vips" :bordered="true" id="table"></dd-table>
        <div class="foot footfix">
            <p style="font-size:16px;"><small style='width:16px;'>总入账次数 : </small> {{receiptNum}}</p>
            <p style="font-size:16px;"><small style='width:16px;'>总订单金额 : </small> {{orderFree}}</p>
            <p style="font-size:16px;"><small style='width:16px;'>总入账金额 : </small> {{receiptFree}}</p>
            <dd-pagination @currentchange="handlePageChange" :visible-pager-count="6" :show-one-page="false" :age-count="pages" :current-page="pageNo" />
        </div>
    </div>
</template>
<style lang='scss' scoped>
  .title {
    width: 100%;
    line-height: 56px;
    font-size: 1.5em;
    color: #746D66;
    text-align: center;
    font-family: border;
  }
  .top {
    width: 100%;
    height: 32px;
    padding: 5px 0;
    .date {
      float: left;
      line-height: 25.44px;
    }
    .select-box {
      float: left;
      .fr {
        float: left;
        margin-left: 20px;
      }
    }
    .export {
      float: left;
      margin-left:20px;
    }
  }
  #table {
    margin-top: 20px;
    max-height: 400px;
    padding-bottom: 12px;
  }
</style>
<script>
    import { DdTable, DdPagination, DdDropdown, DdDropdownItem, DdSelect, DdOption, DdGroupOption } from 'dd-vue-component';
    import http from 'http';
    import { mapState } from 'vuex';
    import DateSelect from '../../../components/DateSelect.vue';
    export default {
        props: {
            startDate: String,
            endDate: String
        },
        data() {
            return {
                orderTypeAll: [{
                    id: -2,
                    name: '全部订单类型',
                    orderType: -2
                }, {
                    id: -1,
                    name: '组合订单',
                    orderType: -1
                }, {
                    id: 0,
                    name: '餐饮',
                    orderType: 0
                }, {
                    id: 1,
                    name: '娱乐',
                    orderType: 1
                }, {
                    id: 2,
                    name: '商超',
                    orderType: 2
                }, {
                    id: 3,
                    name: '住宿',
                    orderType: 3
                }],
                orderType: -2,
                operatorTypeAll: [{
                    id: -1,
                    name: '全部操作人',
                    operatorType: '-1~'
                }],
                operatorType: '-1~',
                vips: [],
                vip: {},
                pages: 0,
                receiptNum: 0,
                orderFree: 0,
                receiptFree: 0,
                pageNo: 1,
                col: [
                    {
                        title: '订单号',
                        dataIndex: 'orderNum',
                        width: 180
                    },
                    {
                        title: '订单类型',
                        dataIndex: 'orderType',
                        width: 80
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
                        width: 80
                    },
                    {
                        title: '入账金额',
                        dataIndex: 'incomeAmount',
                        width: 100
                    },
    
                    {
                        title: '入账时间',
                        dataIndex: 'incomeTime',
                        width: 80
                    },
                    {
                        title: '操作人',
                        dataIndex: 'operator',
                        width: 120
                    }
                ],
                flag: true
            };
        },
        components: {
            DdTable,
            DdPagination,
            DdDropdown,
            DdDropdownItem,
            DdSelect,
            DdOption,
            DdGroupOption,
            DateSelect
        },
        watch: {
            date() {
                this.pageNo = 1;
                if (this.flag) {
                    this.fetchDate();
                }
            },
            pageNo() {
                if (this.flag) {
                    this.fetchDate();
                }
            },
            orderType() {
                this.pageNo = 1;
                if (this.flag) {
                    this.fetchDate();
                }
            }
        },
        created() {
            this.getData();
        },
        computed: {
            ...mapState(['date'])
        },
        methods: {
            exportUrl(type) {
                const obj = {
                    pageNo: this.pageNo,
                    operatorId: this.operatorType.split('~')[1],
                    startDate: this.date.startDate,
                    endDate: this.date.endDate
                };
                if (this.orderType !== -2) {
                    obj.orderType = this.orderType;
                }
                 // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                const paramsObj = {
                    exportType: type,
                    reportType: 403,
                    params: JSON.stringify(obj)
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            },
            getData() {
                http.get('/stat/getTransferReceivable', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate
                })
                .then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.items;
                        this.receiptNum = res.data.totalCount;
                        this.orderFree = res.data.totalOrderAmount;
                        this.receiptFree = res.data.totalIncomeAmount;
                        this.pages = Math.ceil(res.data.orderAmount / 30);
                    }
                    this.flag = true;
                });
            },
            fetchDate() {
                const obj = {
                    pageNo: this.pageNo,
                    operatorId: this.operatorType.split('~')[1],
                    startDate: this.date.startDate,
                    endDate: this.date.endDate
                };
                if (this.orderType !== -2) {
                    obj.orderType = this.orderType;
                }
                 // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                http.get('/stat/getTransferReceivable', obj).then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.items;
                        this.receiptNum = res.data.totalCount;
                        this.orderFree = res.data.totalOrderAmount;
                        this.receiptFree = res.data.totalIncomeAmount;
                        this.pages = Math.ceil(res.data.orderAmount / 30);
                    }
                    this.flag = true;
                });
            },
            handlePageChange(internalCurrentPage) {
                this.pageNo = internalCurrentPage;
                this.fetchDate();
            }
        }
    };
</script>

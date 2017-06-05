<template>
    <div>
        <div style="margin: 20px 0 10px;display: flex;justify-content: space-between;">
            <div style="display: flex">
                <span style="display: flex;align-items: center">应收账款明细（{{date.startDate}}~{{date.endDate}}）</span>
                <div style="width: 120px;margin-right: 10px">
                    <dd-select v-model="allEnterprise">
                        <dd-option v-for="enterprise in enterprises" :key="enterprise.id" :value="enterprise.id" :label="enterprise.companyName"></dd-option>
                    </dd-select>
                </div>
                <div style="width: 120px;margin-right: 10px">
                    <dd-select v-model="allType">
                        <dd-option v-for="type in types" :key="type.id" :value="type.id" :label="type.name"></dd-option>
                    </dd-select>
                </div>
            </div>
            <div style="display: flex;position: relative;">
                <input class="dd-input"
                       type="text"
                       placeholder="搜索客户名称／手机号／账户编号"
                       @keyup.enter="getReceivableList()"
                       v-model="keyword"
                       style="width: 246px; margin-right: 10px"/>
                <span class="reports-search-icon" @click="getReceivableList()">
                    <img src="//static.dingdandao.com/order_manage_search_grey.png" />
                </span>
                <dd-dropdown text="导出明细" trigger="click">
                    <dd-dropdown-item><span><a :href="exportUrl">导出PDF</a></span></dd-dropdown-item>
                    <dd-dropdown-item><span><a :href="exportUrl">导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
            </div>
        </div>
        <dd-table :columns="columns" :data-source="dataSource" :bordered="true"></dd-table>
        <div style="display: flex;justify-content: space-between;margin-top: 20px">
            <span>共计{{totalCount}}笔记录 累计金额¥ {{totalAmount}}</span>
            <dd-pagination @currentchange="getReceivableList" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="page" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { DdTable, DdPagination, DdDropdown, DdDropdownItem, DdSelect, DdOption } from 'dd-vue-component';
    import http from '../../../../common/http';

    export default {
        data() {
            return {
                allEnterprise: null,
                allType: null,
                keyword: '',
                enterprises: [],
                types: [
                    {
                        id: null,
                        name: '全部类型'
                    },
                    {
                        id: 0,
                        name: '结算'
                    },
                    {
                        id: 1,
                        name: '消费'
                    }
                ],
                columns: [
                    {
                        title: '订单号/操作时间',
                        render: (h, row) => (<span><span class="js-order-num">{row.seriaNum}</span><br /><small><i>{row.operationTime}</i></small></span>),
                        width: 188
                    },
                    {
                        title: '客户姓名',
                        dataIndex: 'customerName'
                    },
                    {
                        title: '手机号',
                        dataIndex: 'customerPhone'
                    },
                    {
                        title: '企业名称',
                        dataIndex: 'companyName'
                    },
                    {
                        title: '类型',
                        dataIndex: 'receivableType'
                    },
                    {
                        title: '金额',
                        dataIndex: 'amount'
                    },
                    {
                        title: '支付方式',
                        dataIndex: 'payChannel'
                    },
                    {
                        title: '交易号',
                        dataIndex: 'tradeNo'
                    },
                    {
                        title: '操作人',
                        dataIndex: 'operator'
                    }

                ],
                dataSource: [],
                totalCount: undefined,
                totalAmount: undefined,
                pages: undefined,
                page: 1
            };
        },
        created() {
            this.getEnterprises();
            this.getReceivableList();
        },
        computed: {
            ...mapState(['date'])
        },
        methods: {
            exportUrl() {
                return '';
            },
            getReceivableList(page) {
                this.page = page || this.page;
                http.get('/stat/getReceivablePayments', { startDate: this.date.startDate, endDate: this.date.endDate, keyword: this.keyword, page: this.page, companyId: this.allEnterprise, receivableType: this.allType }).then(res => {
                    if (res.code === 1) {
                        this.dataSource = res.data.items;
                        this.pages = Math.ceil(res.data.totalCount / 30);
                        this.totalCount = res.data.totalCount;
                        this.totalAmount = res.data.totalAmount;
                    }
                });
            },
            getEnterprises() {
                http.get('/contractCompany/getList4Stat', {}).then(res => {
                    if (res.code === 1) {
                        this.enterprises = res.data.list;
                        this.enterprises.unshift({ id: null, companyName: '全部企业' });
                    }
                });
            }
        },
        watch: {
            date() {
                this.page = 1;
                this.getReceivableList();
            },
            allEnterprise() {
                this.page = 1;
                this.getReceivableList();
            },
            allType() {
                this.page = 1;
                this.getReceivableList();
            }
        },
        components: {
            DdSelect,
            DdOption,
            DdTable,
            DdPagination,
            DdDropdown,
            DdDropdownItem
        }
    };
</script>

<style>
    
</style>

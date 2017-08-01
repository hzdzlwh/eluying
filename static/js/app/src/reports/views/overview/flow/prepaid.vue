<template>
    <div>
        <div style="margin: 20px 0 10px;display: flex;justify-content: space-between;">
            <div style="display: flex">
                <span style="display: flex;align-items: center">预收款记录<i>（{{date.startDate}}~{{date.endDate}}）</i></span>
                <div style="width: 120px;margin-right: 10px">
                    <dd-select v-model="accountId">
                        <dd-option v-for="account in accountList" :key="account.id" :value="account.id" :label="account.name"></dd-option>
                    </dd-select>
                </div>
                <div style="width: 120px;margin-right: 10px;">
                    <dd-select v-model="operationId">
                        <dd-option v-for="operation in operationList" :key="operation.id" :value="operation.id" :label="operation.name"></dd-option>
                    </dd-select>
                </div>
                <div style="width: 120px;">
                    <dd-select v-model="channelId">
                        <dd-option v-for="channel in channelList" :key="channel.id" :value="channel.id" :label="channel.name"></dd-option>
                    </dd-select>
                </div>
            </div>
            <div style="display: flex;position: relative;">
                <input class="dd-input"
                       type="text"
                       placeholder="搜索客户名称／手机号／账户编号"
                       @keyup.enter="queryPrepaidInfo()"
                       v-model="keyword"
                       style="width: 246px; margin-right: 10px"/>
                <span class="reports-search-icon" @click="queryPrepaidInfo()">
                    <img src="//static.dingdandao.com/order_manage_search_grey.png" />
                </span>
                <dd-dropdown text="导出明细" trigger="click">
                    <dd-dropdown-item><span><a :href="exportUrl(1)" download>导出PDF</a></span></dd-dropdown-item>
                    <dd-dropdown-item><span><a :href="exportUrl(0)" download>导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
            </div>
        </div>
        <dd-table :columns="columns" :data-source="dataSource" :bordered="true"></dd-table>
        <div style="display: flex;justify-content: space-between;margin-top: 20px">
            <span>共计{{totalCount}}笔收款记录 收款金额¥ {{totalAmount}}</span>
            <dd-pagination @currentchange="queryPrepaidInfo" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="page" />
        </div>
    </div>
</template>
<style lang="scss" type="text/css" rel="stylesheet/scss">
    .reports-search-icon {
        position: absolute;
        top: 2px;
        left: 225px;
        cursor: pointer;
    }
</style>
<script>
    import { mapState } from 'vuex';
    import { DdTable, DdPagination, DdDropdown, DdDropdownItem, DdSelect, DdOption } from 'dd-vue-component';
    import http from '../../../../common/http';
    export default{
        data() {
            return {
                page: 1,
                keyword: undefined,
                totalCount: undefined,
                totalAmount: undefined,
                pages: undefined,
                accountId: -1,
                accountList: [
                    {
                        id: -1,
                        name: '全部账户类型'
                    },
                    {
                        id: 0,
                        name: '企业客户'
                    },
                    {
                        id: 2,
                        name: '会员卡'
                    },
                    {
                        id: 1,
                        name: '一码通'
                    },
                    {
                        id: 3,
                        name: '会员'
                    },
                    {
                        id: 4,
                        name: '虚拟币'
                    }
                ],
                operationId: -1,
                operationList: [
                    {
                        id: -1,
                        name: '全部操作类型'
                    },
                    {
                        id: 0,
                        name: '充值'
                    },
                    {
                        id: 1,
                        name: '退款'
                    }
                ],
                channelId: -1,
                channelList: [
                    {
                        id: -1,
                        name: '全部渠道'
                    },
                    {
                        id: 0,
                        name: '门店'
                    },
                    {
                        id: 1,
                        name: '自助'
                    }
                ],
                dataSource: [],
                columns: [
                    {
                        title: '操作时间',
                        dataIndex: 'operationTime',
                        width: 180
                    },
                    {
                        title: '客户名称',
                        dataIndex: 'customerName',
                        width: 90
                    },
                    {
                        title: '手机号',
                        dataIndex: 'customerPhone',
                        width: 122
                    },
                    {
                        title: '账户类型',
                        dataIndex: 'accountType',
                        width: 115
                    },
                    {
                        title: '账户编号',
                        dataIndex: 'accountSerialNum',
                        width: 103
                    },
                    {
                        title: '操作类型',
                        dataIndex: 'operationType',
                        width: 115
                    },
                    {
                        title: '金额',
                        dataIndex: 'amount',
                        width: 103,
                        className: 'text-right'
                    },
                    {
                        title: '渠道',
                        dataIndex: 'channelType',
                        width: 115
                    },
                    {
                        title: '支付方式',
                        dataIndex: 'payChannel',
                        width: 115
                    },
                    {
                        title: '交易号',
                        dataIndex: 'tradeNo',
                        width: 190
                    },
                    {
                        title: '操作人',
                        dataIndex: 'operator',
                        width: 103
                    }
                ]
            };
        },
        computed: {
            ...mapState(['date'])
        },
        watch: {
            date() {
                this.page = 1;
                this.queryPrepaidInfo();
            },
            accountId() {
                this.page = 1;
                this.queryPrepaidInfo();
            },
            operationId() {
                this.page = 1;
                this.queryPrepaidInfo();
            },
            channelId() {
                this.page = 1;
                this.queryPrepaidInfo();
            }
        },
        created() {
            this.queryPrepaidInfo();
        },
        methods: {
            queryPrepaidInfo(page) {
                if (!this.date.startDate) {
                    return false;
                }

                this.page = page || this.page;
                const accountType = this.accountId === -1 ? undefined : this.accountId;
                const channelType = this.channelId === -1 ? undefined : this.channelId;
                const operationType = this.operationId === -1 ? undefined : this.operationId;
                const keyword = this.keyword || undefined;

                http.get('/stat/getAdvancePayments', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    page: this.page,
                    accountType,
                    channelType,
                    operationType,
                    keyword
                })
                    .then(res => {
                        if (res.code === 1) {
                            this.dataSource = res.data.items;
                            this.totalCount = res.data.totalCount;
                            this.totalAmount = res.data.totalAmount;
                            this.pages = Math.ceil(res.data.totalCount / 30);
                        }
                    });
            },
            exportUrl(type) {
                const originParam = {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate
                };
                if (this.accountId !== -1) {
                    originParam.accountType = this.accountId;
                }
                if (this.channelId !== -1) {
                    originParam.channelType = this.channelId;
                }
                if (this.operationId !== -1) {
                    originParam.operationType = this.operationId;
                }
                if (this.keyword) {
                    originParam.keyword = this.keyword;
                }
                const paramsObj = {
                    exportType: type,
                    reportType: 13,
                    params: JSON.stringify(originParam)
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            }
        },
        components: {
            DdTable,
            DdPagination,
            DdDropdown,
            DdDropdownItem,
            DdSelect,
            DdOption
        }
    };
</script>

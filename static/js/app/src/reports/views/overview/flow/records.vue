<template>
    <div>
        <div style="margin: 20px 0 10px;display: flex;justify-content: space-between;">
            <div style="display: flex">
                <span style="display: flex;align-items: center">收款记录<i>（{{date.startDate}}~{{date.endDate}}）</i></span>
                <div style="width: 120px;margin-right: 10px">
                    <dd-select v-model="operatorId">
                        <dd-option v-for="employee in employeeList" :key="employee.employeeId" :value="employee.employeeId" :label="employee.realName"></dd-option>
                    </dd-select>
                </div>
                <div style="width: 120px;margin-right: 10px">
                    <dd-select v-model="channelId">
                        <dd-option v-for="channel in channels" :key="channel.id" :value="channel.id" :label="channel.name"></dd-option>
                    </dd-select>
                </div>
                <div style="width: 120px">
                    <dd-select v-model="cashierId">
                        <dd-option v-for="cashier in cashierList" :key="cashier.id" :value="cashier.id" :label="cashier.name"></dd-option>
                    </dd-select>
                </div>
            </div>
            <dd-dropdown text="导出明细" trigger="click">
                <dd-dropdown-item><span><a :href="exportUrl(1)" download>导出PDF</a></span></dd-dropdown-item>
                <dd-dropdown-item><span><a :href="exportUrl(0)" download>导出Excel</a></span></dd-dropdown-item>
            </dd-dropdown>
        </div>
        <dd-Table :columns="columns" :data-source="dataSource" :bordered="true"></dd-Table>
        <div style="display: flex;justify-content: space-between;margin-top: 20px">
            <span>共计{{num}}笔收款记录 收款金额¥ {{totalPrice}}</span>
            <dd-pagination @currentchange="queryCashierInfo" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="page" />
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex';
    import { DdTable, DdPagination, DdDropdown, DdDropdownItem, DdSelect, DdOption } from 'dd-vue-component';
    import http from '../../../../common/http';
    export default{
        computed: {
            ...mapState(['date'])
        },
        watch: {
            date() {
                this.page = 1;
                this.queryCashierInfo();
            },
            channelId() {
                this.page = 1;
                this.queryCashierInfo();
            },
            operatorId() {
                this.page = 1;
                this.queryCashierInfo();
            },
            cashierId() {
                this.page = 1;
                this.queryCashierInfo();
            }
        },
        created() {
            this.queryCashierInfo();
            this.getEmployeeList();
            this.getChannels();
        },
        components: {
            DdTable,
            DdPagination,
            DdDropdown,
            DdDropdownItem,
            DdSelect,
            DdOption
        },
        data() {
            return {
                page: 1,
                columns: [
                    {
                        title: '订单号／操作时间',
                        render: (h, row) => (<span><span>{row.serialNum}</span><br /><small><i>{row.creationTime}</i></small></span>),
                        width: 188
                    },
                    {
                        title: '操作人',
                        dataIndex: 'opetator',
                        width: 103
                    },
                    {
                        title: '收银类型',
                        dataIndex: 'type',
                        width: 115
                    },
                    {
                        title: '收款方式',
                        dataIndex: 'channel',
                        width: 139
                    },
                    {
                        title: '金额',
                        dataIndex: 'price',
                        width: 103,
                        className: 'text-right'
                    },
                    {
                        title: '客户姓名',
                        dataIndex: 'customerName',
                        width: 91
                    },
                    {
                        title: '手机号',
                        dataIndex: 'customerPhone',
                        width: 122
                    },
                    {
                        title: '支付账号',
                        dataIndex: 'payAccount',
                        width: 122
                    },
                    {
                        title: '交易号',
                        dataIndex: 'payNum',
                        width: 191
                    }
                ],
                dataSource: [],
                num: undefined,
                totalPrice: undefined,
                pages: undefined,
                employeeList: [
                    {
                        realName: '全部操作人',
                        employeeId: 'ALL'
                    },
                    /* {
                        realName: '一码通自助充值',
                        employeeId: 'ONE'
                    }, */
                    {
                        realName: '游客线上付款',
                        employeeId: 'VISITOR'
                    },
                    {
                        realName: '全部员工',
                        employeeId: 'EMPLOYEE'
                    }
                ],
                operatorId: 'ALL',
                channels: [{ id: 'ALL', name: '全部收款方式' }],
                channelId: 'ALL',
                cashierList: [
                    {
                        id: -1,
                        name: '全部收银类型'
                    },
                    {
                        id: 0,
                        name: '订单收款'
                    },
                    {
                        id: 2,
                        name: '订单退款'
                    },
                    {
                        id: 1,
                        name: '押金收款'
                    },
                    {
                        id: 3,
                        name: '押金退款'
                    },
                    {
                        id: 10,
                        name: '卡费收款'
                    }
                ],
                cashierId: -1
            };
        },
        methods: {
            queryCashierInfo(page) {
                if (!this.date.startDate) {
                    return false;
                }

                this.page = page || this.page;

                let cashierType, operatorId, operateType;
                if (this.cashierId !== -1) {
                    operateType = this.cashierId;
                }
                switch (this.operatorId) {
                    case 'ALL':
                        break;
                    case 'ONE':
                        cashierType = 1;
                        break;
                    case 'VISITOR':
                        cashierType = 3;
                        break;
                    case 'EMPLOYEE':
                        operatorId = -1;
                        break;
                    default:
                        operatorId = this.operatorId;
                        break;
                }

                http.get('/stat/queryCashierInfoPC', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    page: this.page,
                    channelId: this.channelId === 'ALL' ? '' : this.channelId,
                    operaterId: operatorId,
                    cashierType,
                    operateType
                })
                    .then(res => {
                        if (res.code === 1) {
                            this.dataSource = res.data.list;
                            this.num = res.data.num;
                            this.totalPrice = res.data.totalPrice;
                            this.pages = Math.ceil(res.data.num / 30);
                        }
                    });
            },
            getEmployeeList() {
                http.get('/user/getEmployeeList', {})
                    .then(res => {
                        if (res.code === 1) {
                            this.employeeList = [...this.employeeList, ...res.data.list];
                        }
                    });
            },
            getChannels() {
                http.get('/user/getChannels', { type: 1, isAll: true })
                    .then(res => {
                        if (res.code === 1) {
                            this.channels = [...this.channels, ...res.data.list];
                        }
                    });
            },
            exportUrl(type) {
                const paramsObj = {
                    exportType: type,
                    reportType: 9,
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
        }
    };
</script>

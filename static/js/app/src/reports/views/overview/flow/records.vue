<template>
    <div>
        <div style="margin: 20px 0 10px;display: flex;justify-content: space-between;">
            <p>收款记录<i>（{{date.startDate}}~{{date.endDate}}）</i></p>
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
    import { DdTable, DdPagination, DdDropdown, DdDropdownItem } from 'dd-vue-component';
    import AJAXService from '../../../../common/AJAXService';
    import util from '../../../../common/util';
    export default{
        computed: {
            ...mapState(['date'])
        },
        watch: {
            date() {
                this.page = 1;
                this.queryCashierInfo();
            }
        },
        created() {
            this.queryCashierInfo();
        },
        components: {
            DdTable,
            DdPagination,
            DdDropdown,
            DdDropdownItem
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
                        title: '支付宝账号',
                        dataIndex: 'payAccount',
                        width: 122
                    },
                    {
                        title: '交易号',
                        dataIndex: 'payNum',
                        width: 191
                    },
                ],
                dataSource: [],
                num: undefined,
                totalPrice: undefined,
                pages: undefined
            }
        },
        methods: {
            queryCashierInfo(page) {
                if (!this.date.startDate) {
                    return false;
                }

                this.page = page ? page : this.page;

                AJAXService.ajaxWithToken('get', '/stat/queryCashierInfoPC', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    page: this.page
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
            exportUrl(type) {
                const paramsObj = {
                    exportType: type,
                    reportType: 9,
                    params: {
                        startDate: this.date.startDate,
                        endDate: this.date.endDate
                    }
                };
                const host = AJAXService.getUrl2('/stat/exportReport');
                const pa = AJAXService.getDataWithToken(paramsObj);
                const params = AJAXService.paramsToString(pa);
                return `${host}?${params}`;
            }
        }
    }
</script>

<template>
    <div>
        <div style="margin: 20px 0 10px;display: flex;justify-content: space-between;">
            <div style="display: flex">
                <span style="display: flex;align-items: center">应收账款明细（{{date.startDate}}~{{date.endDate}}）</span>
                <div style="width: 120px;margin-right: 10px">
                    <dd-select v-model="allEnterprise">
                        <dd-option v-for="enterprise in enterprises" :key="enterprise.id" :value="enterprise.id" :label="enterprise.name"></dd-option>
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
                       @keyup.enter=""
                       v-model="keyword"
                       style="width: 246px; margin-right: 10px"/>
                <span class="reports-search-icon" @click="">
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
            <span>共计{{num}}笔记录 累计金额¥ {{totalPrice}}</span>
            <dd-pagination @currentchange="" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="page" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { DdTable, DdPagination, DdDropdown, DdDropdownItem, DdSelect, DdOption } from 'dd-vue-component';

    export default {
        data() {
            return {
                allEnterprise: -1,
                allType: -1,
                keyword: '',
                enterprises: [
                    {
                        id: -1,
                        name: '全部企业'
                    },
                    {
                        id: 0,
                        name: '阿里巴巴'
                    },
                    {
                        id: 1,
                        name: '腾讯网络'
                    }
                ],
                types: [
                    {
                        id: -1,
                        name: '全部类型'
                    },
                    {
                        id: 0,
                        name: '消费'
                    },
                    {
                        id: 1,
                        name: '结算'
                    }
                ],
                columns: [
                    {
                        title: '订单号/操作时间',
                        render: (h, row) => (<span><span class="js-order-num">{row.a}</span><br /><small><i>{row.creationTime}</i></small></span>),
                        width: 188
                    },
                    {
                        title: '客户姓名',
                        dataIndex: 'b'
                    },
                    {
                        title: '手机号',
                        dataIndex: 'c'
                    },
                    {
                        title: '企业名称',
                        dataIndex: 'd'
                    },
                    {
                        title: '类型',
                        dataIndex: 'e'
                    },
                    {
                        title: '金额',
                        dataIndex: 'f'
                    },
                    {
                        title: '支付方式',
                        dataIndex: 'g'
                    },
                    {
                        title: '交易号',
                        dataIndex: 'h'
                    },
                    {
                        title: '操作人',
                        dataIndex: 'i'
                    }

                ],
                dataSource: [
                    {
                        a: '1112323422421242',
                        creationTime: '2017-05-27',
                        b: '张三',
                        c: 15888888888,
                        d: '阿里巴吧',
                        e: '消费',
                        f: 500,
                        g: '企业挂账',
                        h: '3838884736257477',
                        i: '李四'
                    }
                ],
                num: undefined,
                totalPrice: undefined,
                pages: 3,
                page: 1
            };
        },
        computed: {
            ...mapState(['date'])
        },
        methods: {
            exportUrl() {
                return '';
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

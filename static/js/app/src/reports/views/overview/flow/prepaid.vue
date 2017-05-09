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
                <input class="dd-input" type="text" placeholder="搜索客户名称／手机号／账户编号" style="width: 246px; margin-right: 10px"/>
                <span class="reports-search-icon"><img src="//static.dingdandao.com/order_manage_search_grey.png" /></span>
                <dd-dropdown text="导出明细" trigger="click">
                    <dd-dropdown-item><span><a download>导出PDF</a></span></dd-dropdown-item>
                    <dd-dropdown-item><span><a download>导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
            </div>
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
    import util from '../../../../common/util';
    export default{
        data() {
            return {
                accountId: -1,
                accountList: [
                    {
                        id: -1,
                        name: '全部账户类型'
                    },
                    {
                        id: 1,
                        name: '企业客户'
                    },
                    {
                        id: 2,
                        name: '会员卡'
                    },
                    {
                        id: 3,
                        name: '一码通'
                    }
                ],
                operationId: -1,
                operationList: [
                    {
                        id: -1,
                        name: '全部操作类型'
                    },
                    {
                        id: 1,
                        name: '充值'
                    },
                    {
                        id: 2,
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
                        id: 1,
                        name: '门店'
                    },
                    {
                        id: 2,
                        name: '自助'
                    }
                ]
            };
        },
        computed: {
            ...mapState(['date'])
        },
        methods: {},
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

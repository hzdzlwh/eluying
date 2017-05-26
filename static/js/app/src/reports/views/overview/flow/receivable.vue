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
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { DdTable, DdPagination, DdDropdown, DdDropdownItem, DdSelect, DdOption } from 'dd-vue-component';

    export default {
        data() {
            return {
                allEnterprise: '',
                allType: '',
                keyword: '',
                enterprises: [
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
                        id: 0,
                        name: '消费'
                    },
                    {
                        id: 1,
                        name: '结算'
                    }
                ]
            };
        },
        computed: {
            ...mapState(['date'])
        },
        methods: {
            exportUrl() {
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

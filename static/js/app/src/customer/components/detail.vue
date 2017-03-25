<template>
    <div id="detailModal" role="dialog">
        <div class="modal-dialog" style="width: 400px">
            <div class="modal-content">
                <div class="detail-header">
                    <div>
                        <h4>{{user.name}}</h4>
                        <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                    </div>
                    <div>
                        <ul class="restaurant-head-nav">
                            <li>
                                <router-link to="/vip/list">会员列表</router-link>
                            </li>
                            <li>
                                <router-link to="/vip/setting">会员设置</router-link>
                            </li>
                        </ul>
                        <div>
                            <button class="dd-btn dd-btn-primary" @click="onDelete(id)">删除</button>
                            <button class="dd-btn dd-btn-primary" @click="onEdit(id)">编辑</button>
                        </div>
                    </div>
                </div>
                <div class="detail-content">
                    <div>
                        <slot></slot>
                    </div>
                    <div>
                        <div>
                            <dd-select>
                                <dd-option></dd-option>
                            </dd-select>
                            <span>使用时间：</span>
                            <dd-datepicker></dd-datepicker>
                            <span>～</span>
                            <dd-datepicker></dd-datepicker>
                            <input type="text" class="dd-input">
                            <dd-dropdown text="导出明细" trigger="click">
                                <dd-dropdown-item><span><a :href="outPutText(1)" download>导出PDF</a></span></dd-dropdown-item>
                                <dd-dropdown-item><span><a :href="outPutText(0)" download>导出Excel</a></span></dd-dropdown-item>
                            </dd-dropdown>
                        </div>
                        <div>
                            <dd-table :columns="col" :dataSource=""></dd-table>
                        </div>
                        <div>
                            <span>
                                <span>共计个订单</span>
                                <span>订单金额</span>
                                <span>挂账金额</span>
                            </span>
                            <span>
                                <dd-pagination></dd-pagination>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
    #detailModal {
        width: 942px;
        border-top: 3px solid #178ce6;
    }
</style>
<script>
    import {
        DdTable,
        DdPagination,
        DdSelect,
        DdDropdown,
        DdDropdownItem } from 'dd-vue-component';
    import http from '../../common/AJAXService';

    const vipCol = [
        {
            title: '订单号',
            dateIndex: 'orderNum'
        },
        {
            title: '订单业态',
            dateIndex: 'orderTypes'
        },
        {
            title: '订单金额￥',
            dateIndex: 'totalPrice'
        },
        {
            title: '使用时间',
            dateIndex: 'startTime'
        },
        {
            title: '操作人',
            dateIndex: 'operator'
        },
        {
            title: '订单状态',
            dateIndex: 'state'
        }
    ];
    const companyCol = [
        {
            title: '订单号',
            dateIndex: 'orderNum'
        },
        {
            title: '订单业态',
            dateIndex: 'orderTypes'
        },
        {
            title: '联系人',
            dateIndex: 'name'
        },
        {
            title: '联系号码',
            dateIndex: 'phone'
        },
        {
            title: '订单金额￥',
            dateIndex: 'orderNum'
        },
        {
            title: '挂账金额￥',
            dateIndex: 'totalPrice'
        },
        {
            title: '使用时间',
            dateIndex: 'startTime'
        },
        {
            title: '收银方式',
            dateIndex: 'payTypes'
        }
    ];
    const getOrdersUrls = {
        vip: '/vipUser/getVipUserOrders',
        company: '/contractCompany/getCompanyOrderList',
        nonvip: '/customer/getCustomerList'
    };

    export default{
        props: {
            type: String, // vip, company, nonvip
            id: Number,
            tab: Number, // 1-detail, 2-orders
            onDelete: Function,
            onEdit: Function
        },
        data() {
            return {};
        },
        computed: {
            col() {
                return this.type === 'company' ? companyCol : vipCol;
            }
        },
        components: {
            DdTable,
            DdPagination,
            DdSelect,
            DdDropdown,
            DdDropdownItem
        },
        methods: {
            getList() {
                http.get(getOrdersUrls[this.type]);
            }
        }
    };
</script>

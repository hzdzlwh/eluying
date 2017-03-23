<template>
    <div id="detailModal" role="dialog" id="categorySelectModal">
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
                            <dd-table></dd-table>
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
    const vipCol = [
        {
            title: '订单号'
        },
        {
            title: '订单业态'
        },
        {
            title: '订单金额￥'
        },
        {
            title: '使用时间'
        },
        {
            title: '操作人'
        },
        {
            title: '订单状态'
        }
    ];
    const companyCol = [
        {
            title: '订单号'
        },
        {
            title: '订单业态'
        },
        {
            title: '联系人'
        },
        {
            title: '联系号码'
        },
        {
            title: '订单金额￥'
        },
        {
            title: '挂账金额￥'
        },
        {
            title: '使用时间'
        },
        {
            title: '收银方式'
        }
    ];
    export default{
        props: {
            type: String,
            id: Number,
            onDelete: Function,
            onEdit: Function
        },
        data() {
            return {};
        },
        components: {
            DdTable,
            DdPagination,
            DdSelect,
            DdDropdown,
            DdDropdownItem
        },
        methods: {}
    };
</script>

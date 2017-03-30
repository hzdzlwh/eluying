<template>
    <div class="listbox">
    <div>
                <div class="vip-search">
                <div class="vip-search-container">
                    <input type="text" placeholder="搜索客户姓名/手机号/订单号" class="order-search dd-input">
                    <span class="vip-search-icon"><img src="//static.dingdandao.com/order_manage_search_grey.png" alt=""></span>
                </div>
            </div>
            </div>
        <div class="box-head">
            <div class="add-button">
                <div class="dd-dropdown">
                    <DdDropdown text="导出明细" trigger="click">
                        <dd-dropdown-item>
                            <span><a :href="outPutText(1)" download>导出PDF</a></span>
                        </dd-dropdown-item>
                        <dd-dropdown-item>
                            <span><a :href="outPutText(0)" download>导出Excel</a></span>
                        </dd-dropdown-item>
                    </DdDropdown>
                </div>
            </div>
        </div>
        <div class="footer-container">
            <span class="orders-total">共计<b>11111个会员</b></span>
            <div class="dd-pagination-container">
                <DdPagination @currentchange="handlePageChange" :visible-pager-count="5" :show-one-page="false" :current-page="currentPage" :page-count="5">
                </DdPagination>
            </div>
        </div>
    </div>
</template>
<style scoped>
.box-head{
    clear: right;
    padding-top: 20px;
}
.footer-container{
    width: 100%;
    height: 45px;
    line-height: 45px;
    background: #fafafa;
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.15);
    padding: 0 30px;
    margin-bottom: 16px;
    clear: both;
}
.orders-total{
        display: inline-block;
    height: 17px;
    line-height: 17px;
    font-size: 12px;
    color: #999;
    margin-right: 15px;
    padding-right: 16px;
    border-right: 1px solid #e6e6e6;
}
.orders-total b{
        color: #666;
    font-size: 14px;
    font-weight: normal;
    margin-left: 4px;
}
.dd-pagination-container{
        display: inline-block;
    line-height: initial;
    margin-top: 10px;
    float: right;
}
.vip-search-container {
    position: relative;
    min-width: 216px;
}

.vip-search-icon {
    position: absolute;
    top: 3px;
    right: 6px;
    cursor: pointer;
}

.vip-select {
    width: 120px;
    position: relative;
    display: inline-block;
}

.vip-search,
.add-button {
    float: right;
    display: inline-block;
    margin-left: 15px;
}

.listbox {
    padding: 20px 0 0 40px;
    width: 1200px;
}
</style>
<script>
import {
    DdDatepicker,
    DdPagination,
    DdSelect,
    DdDropdown,
    DdDropdownItem
} from 'dd-vue-component'
export default {
    data() {
            return {
                type: 1,
                selettype: '全部客户',
                currentPage: 1
            }
        },
    methods: {
        handlePageChange: function(argument) {
            return
        },
        outPutText: function() {
            return
        }
    },
    components: {
        DdDatepicker,
        DdPagination,
        DdSelect,
        DdDropdown,
        "dd-dropdown-item": DdDropdownItem
    }
}
</script>

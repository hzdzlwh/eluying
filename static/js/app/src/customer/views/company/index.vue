<template>
    <div class="listbox">
        <div class="box-head">
            <div class="vip-select">
                <DdSelect v-model="CustomerStatus">
                    <DdOption v-for="option in optionsCustomer" :value="option.value" :label="option.name">
                    </DdOption>
                </DdSelect>
            </div>
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
            <div class="dd-btn-primary dd-btn add-button" data-toggle="modal" data-target="#add">添加协议单位</div>
            <div class="vip-search">
                <div class="vip-search-container">
                    <input type="text" v-model='search' placeholder="搜索客户姓名/手机号/订单号" class="order-search dd-input">
                    <span class="vip-search-icon"><img src="//static.dingdandao.com/order_manage_search_grey.png" alt=""></span>
                </div>
            </div>
        </div>
        <div class="tableContain">
            <DdTable :columns="col" :data-source="datalist"></DdTable>
        </div>
        <div class="footer-container">
            <span class="orders-total">共计<b>{{count}}个企业</b></span>
            <span class="orders-total">充值金额<b>¥{{totalRechargeFee}}</b></span>
            <span class="orders-total">挂帐金额<b>¥{{totalLedgerFee}}</b></span>
            <div class="dd-pagination-container">
                <DdPagination @currentchange="handlePageChange" :current-page="currentPage">
                </DdPagination>
            </div>
        </div>
        <!--add new customer Modal -->
        <div class="modal fade" id="add" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">添加企业客户／编辑企业客户</h4>
                    </div>
                    <div class="modal-body modal-line">
                        <p>
                            <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png">企业名称：</span>
                            <input type="text" maxlength="16">
                        </p>
                        <p>
                            <span class="addCus">
                                   协议编号：</span>
                            <input type="text" maxlength="16">
                        </p>
                        <p>
                            <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png">手机号：</span>
                            <input type="text" maxlength="16">
                        </p>
                        <p>
                            <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png">联系人：</span>
                            <input type="text" maxlength="16">
                        </p>
                        <p>
                            <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png">联系号码：</span>
                            <input type="text" maxlength="16">
                        </p>
                        <p>
                            <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png"/>企业类型：
                            </span>
                           
                                <DdSelect v-model="CustomerStatus" class="addCustype">
                                <DdOption v-for="option in optionsCustomer" :value="option.value" :label="option.name">
                                </DdOption>
                            </DdSelect>
                           
                        </p>
                    </div>
                    <div class="modal-body">
                                                <p>
                            <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png"/>优惠折扣：
                            </span>
                           <span class="selectBox">
                               <div>
                                   <span>住宿</span>
                                   <input type="text">折<span class="delete-icon"></span>
                               </div>
                           </span>
                 
                           
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.tableContain tbody tr td:last-child {
    color: #178ce6;
    cursor: pointer;
}
</style>
<style scoped>
.addCustype{
    width: 120px;
    display: inline-block;
}
#add .modal-body p input {
    width: 210px;
    height: 24px;
}

#add .modal-body p {
    margin: 0 auto 16px;
}
#add .modal-line  {
  border: 1px solid #e6e6e6
}
#add .addCus {
    width: 100px;
    display: inline-block;
    text-align: right;
    color: #666;
}

#add .modal-title {
    font-size: 16px;
    color: #178ce6;
    text-align: left;
    margin-bottom: 8px;
}

#add .modal-content {
    background: #fafafa;
    border-radius: 2px;
    border-top: 4px solid #178ce6;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
    padding: 0;
}

#add .modal-dialog {
    width: 480px;
}

.tableContain {
    width: 100%;
    overflow: auto;
    position: relative;
}

.footer-container {
    width: 100%;
    height: 45px;
    line-height: 45px;
    background: #fafafa;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.15);
    padding: 0 30px;
    margin-bottom: 16px;
    clear: both;
}

.orders-total {
    display: inline-block;
    height: 17px;
    line-height: 17px;
    font-size: 12px;
    color: #999;
    margin-right: 15px;
    padding-right: 16px;
    border-right: 1px solid #e6e6e6;
}

.orders-total b {
    color: #666;
    font-size: 14px;
    font-weight: normal;
    margin-left: 4px;
}

.dd-pagination-container {
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


/*.listbox {
    padding: 20px 0 0 40px;
    width: 1200px;
}*/
</style>
<script>
import {
    DdDatepicker,
    DdPagination,
    DdSelect,
    DdDropdown,
    DdDropdownItem,
    DdOption,
    DdTable
} from 'dd-vue-component'
import http from '../../../common/AJAXService'
export default {
    data() {
        return {
            col: [{
                title: '企业名称',
                dataIndex: 'companyName'
            }, {
                title: '协议编号',
                dataIndex: 'contractNum'
            }, {
                title: '联系人',
                dataIndex: 'contactName'
            }, {
                title: '联系号码',
                dataIndex: 'contactPhone'
            }, {
                title: '企业类型',
                render: (h, row) => < span > {
                    row.companyType ? '可挂账' : '不可挂账'
                } < /span>
            }, {
                title: '折扣',
                render: (h, row) => < span title = {
                    row.discounts.map(function(item) {
                        return item.nodeType + "-" + item.discount + "折"
                    }).join("&#10;")
                } > {
                    row.discounts.length ? row.discounts[0].nodeType + '-' + row.discounts[0].discount + "折" + (row.discounts.length === 1 ? '' : '...') : '无'
                } < /span>
            }, {
                title: '充值余额',
                dataIndex: 'rechargeFee'
            }, {
                title: '挂账金额',
                dataIndex: 'ledgerFee'
            }, {
                title: '消费金额',
                dataIndex: 'consumeFee'
            }, {
                title: '创建时间',
                render: (h, row) => < span > {
                    row.creationTime.split(' ')[0]
                } < /span>
            }, {
                title: '操作',
                render: (h, row) => < span > 查单 / 结算 < /span>
            }],
            datalist: [],
            count: 0,
            totalLedgerFee: 0,
            totalRechargeFee: 0,
            search: '',
            type: 1,
            currentPage: 1,
            selecttype: 2,
            CustomerStatus: 2,
            isConsumeFeeDesc: 1,
            isCreationTimeDesc: 1,
            isLedgerFeeDesc: 1,
            isRechargeFeeDesc: 1,
            optionsCustomer: [{
                name: "全部企业客户",
                value: 2
            }, {
                name: "可挂帐",
                value: 0
            }, {
                name: "不可挂帐",
                value: 1
            }]
        }
    },
    methods: {
        handlePageChange: function(internalCurrentPage) {
            this.currentPage = internalCurrentPage
            this.fetchDate()
        },
        outPutText: function() {
            return
        },
        changetype: function(value) {
            this.selecttype = value
        },
        fetchDate: function(argument) {
            const dataObject = {
                isConsumeFeeDesc: this.isConsumeFeeDesc,
                isCreationTimeDesc: this.isCreationTimeDesc,
                isLedgerFeeDesc: this.isLedgerFeeDesc,
                isRechargeFeeDesc: this.isRechargeFeeDesc,
                keyword: this.search,
                page: this.currentPage
            }
            if (this.CustomerStatus !== 2) {
                dataobject.companyType = this.companyType
            }
            http.get('/contractCompany/getList', ).then(res => {
                if (res.code === 1) {
                    this.datalist = res.data.list
                    this.count = res.data.count
                    this.totalLedgerFee = res.data.totalLedgerFee
                    this.totalRechargeFee = res.data.totalLedgerFee
                }
            })
        }
    },
    created() {
        this.fetchDate();
    },
    components: {
        DdDatepicker,
        DdPagination,
        DdSelect,
        DdDropdown,
        "dd-dropdown-item": DdDropdownItem,
        DdOption,
        DdTable
    }
}
</script>

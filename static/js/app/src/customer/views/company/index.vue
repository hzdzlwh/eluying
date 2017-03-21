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
                <DdPagination @currentchange="handlePageChange" :current-page="currentPage" :page-count="count">
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
                            <input v-model='cusDate.companyName' type="text" maxlength="20" class="dd-input">
                        </p>
                        <p>
                            <span class="addCus">
                                   协议编号：</span>
                            <input v-model='cusDate.contractNum' type="text" class="dd-input" maxlength="20" placeholder="-请输入数字或字母-">
                        </p>
                        <p>
                            <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png">联系人：</span>
                            <input v-model='cusDate.contactName' class="dd-input" type="text" maxlength="20">
                        </p>
                        <p>
                            <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png">联系号码：</span>
                            <input v-model='cusDate.contactPhone' class="dd-input" type="text" maxlength="12">
                        </p>
                        <p>
                            <span class="addCus">
                                    <img src="//static.dingdandao.com/start.png"/>企业类型：
                            </span>
                            <DdSelect v-model="cusDate.companyType" class="addCustype">
                                <DdOption v-for="option in formCustomerType" :value="option.value" :label="option.name">
                                </DdOption>
                            </DdSelect>
                        </p>
                    </div>
                    <div class="modal-body">
                        <p class="preferential">
                            <span class="addCus">
                                    优惠折扣：
                            </span>
                            <span class="selectBox">
                        <div>
                            <span class="preName">住宿</span>
                            <input class="dd-input" type="text">折<span class="delete-icon"></span>
                    </div>
                    <div>
                        <span class="preName">住宿</span>
                        <input  class="dd-input" type="text">折<span class="delete-icon"></span>
                    </div>
                    <div style="display:flex">
                        <span class="preName addpre">选择项目</span>
                        <span class="preRequest">请输入0.1-9.9之间的数字</span>
                    </div>
                    </span>
                    </p>
                    <p>
                        <span class="addCus">
                                   地址：</span>
                        <input v-model='cusDate.companyAddress' type="text" class="dd-input addAdress" maxlength="16">
                    </p>
                    <p>
                        <span class="addCus">
                                   备注：</span>
                        <textarea v-model='cusDate.remark' cols="7" class="addOthor dd-input" placeholder="-请填写描述-"></textarea>
                    </p>
                    <p>
                        <span class="addCus">
                                   </span>
                        <span class="dd-btn-primary dd-btn" style="margin-right:10px;min-width: 30px;" @click='customerDate'>确定</span>
                        <span class="dd-btn-ghost dd-btn" style="min-width: 30px;" data-dismiss="modal">取消</span>
                    </p>
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

.delete-icon {
    margin-left: 16px;
    width: 16px;
    height: 16px;
    background: url('../../../../../../image/modal/room_modal_delete.png');
    background-size: contain;
    cursor: pointer;
    display: inline-block;
}

.preName {
    width: 100px;
    overflow-x: hidden;
    display: inline-block;
}

.preRequest {
    display: inline-block;
}

.preferential {
    display: flex;
}

.preferential .addCus {
    display: inline-block;
}

.selectBox > div {
    margin-bottom: 5px;
}

.selectBox input {
    width: 56px!important;
}

.selectBox {
    max-height: 300px;
    display: inline-block;
    overflow-y: scroll;
}
</style>
<style scoped>
.addpre {
    color: #178ce6;
    cursor: pointer;
}

.addOthor {
    height: 65px;
}

.addAdress,
.addOthor {
    width: 330px!important;
    resize: none;
}

.addCustype {
    width: 120px;
    display: inline-block;
}

#add .modal-body p input {
    width: 210px;
    height: 24px;
}

#add .modal-body p {
    margin: 0 auto 16px;
    display: flex;
}

#add .modal-line {
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
import modal from '../../../common/modal'
export default {
    data() {
            return {
                pages: 0,
                cusDate: {
                    companyAddress: '',
                    companyName: '',
                    companyType: 0,
                    contactName: '',
                    contactPhone: '',
                    contractNum: '',
                    discounts: [],
                    remark: ''

                },
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
                formCustomerType: [{
                    name: "可挂帐",
                    value: 0
                }, {
                    name: "不可挂帐",
                    value: 1
                }],
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
                http.get('/contractCompany/getList', dataObject).then(res => {
                    if (res.code === 1) {
                        this.datalist = res.data.list
                        this.count = res.data.count
                        this.totalLedgerFee = res.data.totalLedgerFee
                        this.totalRechargeFee = res.data.totalLedgerFee
                    }
                })
            },
            customerDate: function(id) {
                if (!this.cusDate.companyName) {
                    modal.somethingAlert('请输入公司名');
                    return
                }
                if (!this.cusDate.contactName) {
                    modal.somethingAlert('请输入联系人');
                    return
                }
                if (!this.cusDate.contactPhone) {
                    modal.somethingAlert('请输入联系号码');
                    return
                }
                const data = this.cusDate
                if (id) {
                    data.id = id
                }
                http.get('/contractCompany/addEditContractCompany', data).then(res => {
                    if (res.code === 1) {
                        modal.somethingAlert('添加成功')
                        this.cusDate = {
                            companyAddress: '',
                            companyName: '',
                            companyType: 0,
                            contactName: '',
                            contactPhone: '',
                            contractNum: '',
                            discounts: [],
                            remark: ''

                        }
                    } else {
                        modal.somethingAlert(res.msg)
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

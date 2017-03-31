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
                    <span class="vip-search-icon" @click='fetchDate'><img src="//static.dingdandao.com/order_manage_search_grey.png" alt=""></span>
                </div>
            </div>
        </div>
        <div class="cusTableContain">
            <DdTable :columns="col" :data-source="datalist" :sortField='sort.sortField' :sortType='sort.sortType' :onChange='changeSort'></DdTable>
        </div>
        <div class="footer-container">
            <span class="orders-total">共计<b>{{count}}个企业</b></span>
            <span class="orders-total">充值金额<b>¥{{totalRechargeFee}}</b></span>
            <span class="orders-total">挂帐金额<b>¥{{totalLedgerFee}}</b></span>
            <div class="dd-pagination-container">
                <DdPagination @currentchange="handlePageChange" :current-page="currentPage" :page-count="pages">
                </DdPagination>
            </div>
        </div>
        <!--add new customer Modal -->
        <company> </company>
<div>        <checkFromDio :visible="check.show" 
                :type="check.type"
                :checkType = "check.chekcType"
                @close='checkFormClose'
        ></checkFromDio></div>
    </div>
</template>
<style>
.cusTableContain tbody td:last-child {
    color: #178ce6;
    cursor: pointer;
}
</style>
<style scoped>
.cusTableContain {
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

.box-head {
    margin-bottom: 8px;
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
    DdPagination,
    DdSelect,
    DdDropdown,
    DdDropdownItem,
    DdOption,
    DdTable
} from 'dd-vue-component'
import http from '../../../common/AJAXService'
import company from '../../components/companyForm.vue'
import check from '../../components/check.vue'
export default {
    data() {
            return {
                sort: {},
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
                    } < /span>,
                    width: '80px'
                }, {
                    title: '折扣',
                    render: (h, row) => < span title = {
                        row.discounts.map(function(item) {
                            return item.nodeName + '-' + item.discount + '折'
                        }).join('\n')
                    } > {
                        row.discounts.length ? row.discounts[0].nodeName + '-' + row.discounts[0].discount + '折' + (row.discounts.length === 1 ? '' : '...') : '无'
                    } < /span>
                }, {
                    title: '充值余额',
                    dataIndex: 'rechargeFee',
                    sorter: true
                }, {
                    title: '挂账金额',
                    dataIndex: 'ledgerFee',
                    sorter: true
                }, {
                    title: '消费金额',
                    dataIndex: 'consumeFee',
                    sorter: true
                }, {
                    title: '创建时间',
                    render: (h, row) => < span > {
                        row.creationTime.split(' ')[0]
                    } < /span>,
                    dataIndex: 'creationTime',
                    sorter: true
                }, {
                    title: '操作',
                    render: (h, row) =>
                        < span >
                        < span onClick = {
                            () => this.openDetailDialog(row, 0)
                        } > 查单 < /span> / < span onClick = {
                            () => this.openDetailDialog(row, 1)
                        } > 结算 < /span> < /span >
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
                // isConsumeFeeDesc: 1,
                // isCreationTimeDesc: 1,
                // isLedgerFeeDesc: 1,
                // isRechargeFeeDesc: 1,
                formCustomerType: [{
                    name: "可挂帐",
                    value: 1
                }, {
                    name: "不可挂帐",
                    value: 0
                }],
                optionsCustomer: [{
                    name: "全部企业客户",
                    value: 2
                }, {
                    name: "可挂帐",
                    value: 1
                }, {
                    name: "不可挂帐",
                    value: 0
                }],
                check: {
                    type: 0,
                    chekcType: [],
                    show: false
                }
            }
        },
        methods: {
            checkFormClose: function () {
                this.check.show = false
            },
            openDetailDialog: function(date, type) {
                if (type) {
                    let dataobject = {
                        isAll: true,
                        orderType: -1,
                        type: 1
                    }

                    http.get('/user/getChannels', dataobject).then(res => {
                        if (res.code === 1) {
                            this.check.chekcType = res.data.list
                            this.check.show = true
                        } else {
                            // modal.somethingAlert(res.msg)
                        }
                    })
                    // this.check.show = true
                    // this.check.chekcType = [{
                    //     id:3,
                    //     name: "111"
                    //         },{
                    //     id:32,
                    //     name: "1121"
                    //         },{
                    //     id:34,
                    //     name: "1141"
                    //         }]
                }
            },
            changeSort: function(value) {
                this.sort = value
            },
            handlePageChange: function(internalCurrentPage) {
                this.currentPage = internalCurrentPage
                this.fetchDate()
            },
            outPutText(num) {
                const paramsObj = this.getParams();
                paramsObj.exportType = num;
                const host = http.getUrl2('/contractCompany/exportCompanyList');
                const pa = http.getDataWithToken(paramsObj);
                // pa.map = JSON.parse(pa.map);
                let params = http.paramsToString(pa);
                return `${host}?${params}`;
            },
            getParams() {
                let obj = {
                    keyword: this.search
                };
                if (this.CustomerStatus !== 2) {
                    obj.companyType = this.CustomerStatus
                }
                return obj
            },
            changetype: function(value) {
                this.selecttype = value
            },
            fetchDate: function() {
                let dataObject = {
                    isConsumeFeeDesc: this.isConsumeFeeDesc,
                    isCreationTimeDesc: this.isCreationTimeDesc,
                    isLedgerFeeDesc: this.isLedgerFeeDesc,
                    isRechargeFeeDesc: this.isRechargeFeeDesc,
                    keyword: this.search,
                    page: this.currentPage,
                    companyType: this.CustomerStatus
                }
                if (this.CustomerStatus === 2) {
                    dataObject.companyType = undefined
                }
                Object.assign(dataObject, this.sort)
                http.get('/contractCompany/getList', dataObject).then(res => {
                    if (res.code === 1) {
                        this.pages = Math.ceil(res.data.count / 30);
                        this.datalist = res.data.list
                        this.count = res.data.count
                        this.totalLedgerFee = res.data.totalLedgerFee
                        this.totalRechargeFee = res.data.totalLedgerFee
                    }
                })
            }
        },
        created() {
            this.fetchDate()
        },
        watch: {
            CustomerStatus: function() {
                this.fetchDate()
            },
            sort: function() {
                window.console.log('change')
                this.fetchDate()
            }
        },
        components: {
            DdPagination,
            DdSelect,
            DdDropdown,
            "dd-dropdown-item": DdDropdownItem,
            DdOption,
            DdTable,
            company,
            "checkFromDio": check
        }
}
</script>

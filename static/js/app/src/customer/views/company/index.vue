<template>
    <div class="listbox">
        <div class="box-head">
            <div class="vip-select">
                <DdSelect v-model="CustomerStatus">
                    <DdOption v-for="option in optionsCustomer" :key='option' :value="option.value" :label="option.name">
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
            <div class="dd-btn-primary dd-btn add-button" @click='addForm' v-if='contral && contral.COMPANY_EDIT_ID'>添加企业客户</div>
            <div class="vip-search">
                <div class="vip-search-container">
                    <input type="text" v-model='search' placeholder="搜索企业编号/企业名称/联系人/联系号码" class="order-search dd-input">
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
            <span class="orders-total">挂账金额<b>¥{{totalLedgerFee}}</b></span>
            <div class="dd-pagination-container">
                <DdPagination @currentchange="handlePageChange" :current-page="currentPage" :page-count="pages">
                </DdPagination>
            </div>
        </div>
        <!--add new customer Modal -->
        <checklist :id='detailid' :checkListType='checkListType' :visible='checkListVisible' @close='checkListVisible = false'></checklist>
        <company @add='fetchDate' :data='formdata' @close='formclose' :visible='formvisible'> </company>
        <checkFromDio :visible="check.show" :type="check.type" :checkType="check.chekcType" :data='check.data' @close='checkFormClose'></checkFromDio>
        <detail :visible='detailVisible' :type='"company"' :id='detailid' :tab='detailtab' :title='detailTitle' :onClose='detailClose' :onDelete='detailDelete' :onEdit='detailEdit'>
            <companyDetail :data='detailData' :contral='contral'></companyDetail>
        </detail>
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
    /*overflow: auto;*/
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
    min-width: 316px;
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
</style>
<script>
import {
    DdPagination,
    DdSelect,
    DdDropdown,
    DdDropdownItem,
    DdOption,
    DdTable
} from 'dd-vue-component';
import http from '../../../common/AJAXService';
import company from '../../components/companyForm.vue';
import check from '../../components/check.vue';
import detail from '../../components/detail.vue';
import companyDetail from '../../components/companyDetail.vue';
import checklist from '../../components/checklist.vue';
import modal from '../../../common/modal';
import event from '../../event.js';
import auth from '../../../common/auth';
export default {
    data() {
        return {
            contral: {
                // COMPANY_VIEW_ID : auth.checkModule(auth.COMPANY,auth.COMPANY_VIEW_ID),
                // COMPANY_EDIT_ID  : auth.checkModule(auth.COMPANY,auth.COMPANY_EDIT_ID),
                // COMPANY_CHARGE_ID : auth.checkModule(auth.COMPANY,auth.COMPANY_CHARGE_ID)
                COMPANY_VIEW_ID: false,
                COMPANY_EDIT_ID: false,
                COMPANY_CHARGE_ID: false
            },
            checkListVisible: false,
            checkListType: 0,
            // formddata
            formvisible: false,
            formdata: {},
            // detaildata
            detailData: {},
            detailVisible: false,
            detailTitle: '',
            detailtab: 0,
            detailid: 0,
            // indexdata
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
                title: '企业编号',
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
                        row.discount &&
                        row.discounts.map(function(item) {
                            return item.nodeName + '-' + item.discount + '折';
                        }).join('\n')
                    } > {
                        row.discounts &&
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
                    <span>
                    <span onClick = {
                        () => this.openDetailDialog(row, 0, 1)
                    } > 详情 </span> / < span onClick = {
                        () => this.openDetailDialog(row, 0, 2)
                    } > 查单 </span> {
                    (row.ledgerFee !== 0 && this.contral.COMPANY_CHARGE_ID) ? <span onClick = {
                        () => this.openDetailDialog(row, 1, 2)
                    }> / 结算 </span> : ''
            } < /span >,
                width: '140px'
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
            formCustomerType: [{
                name: '可挂账',
                value: 1
            }, {
                name: '不可挂账',
                value: 0
            }],
            optionsCustomer: [{
                name: '全部企业客户',
                value: 2
            }, {
                name: '可挂账',
                value: 1
            }, {
                name: '不可挂账',
                value: 0
            }],
            check: {
                type: 0,
                chekcType: [],
                show: false,
                data: {}
            }
        };
    },
    methods: {
        detailEdit: function() {
            this.detailClose();
            this.formdata = {
                id: this.detailData.cid,
                companyAddress: this.detailData.companyAddress,
                companyName: this.detailData.companyName,
                companyType: this.detailData.companyType,
                contactName: this.detailData.contactName,
                contactPhone: this.detailData.contactPhone,
                contractNum: this.detailData.contractNum,
                discounts: this.detailData.discounts || [],
                remark: this.detailData.remark
            };

            this.formvisible = true;
        },
        detailDelete: function(id) {
            modal.confirmDialog({
                message: '您将会删除该企业客户信息，删除后信息不可恢复，且不能对该企业客户挂账进行结算，确认删除么？'
            }, () => {
                const that = this;
                http.get('/contractCompany/removeCompany', {
                    cid: id
                }).then(res => {
                    if (res.code === 1) {
                        modal.alert('删除成功');
                        that.fetchDate();
                        that.detailClose();
                    } else {
                        if (res.code === 10) {
                            modal.somethingAlert('您还有进行中的订单，暂不能删除，请将订单结束后再试！');
                        } else {
                            modal.alert(res.msg);
                        }
                    }
                });
            });
        },
        detailClose: function() {
            this.detailVisible = false;
        },
        checkFormClose: function() {
            this.check.show = false;
        },
        openDetailDialog: function(date, type, checkType) {
            if (type) {
                const dataobject = {
                    orderType: - 1,
                    type: 1,
                    origin: 1,
                    originRelatedId: date.cid
                };
                http.get('/user/getChannels', dataobject).then(res => {
                    if (res.code === 1) {
                        this.check.type = checkType;
                        const moreChannel = [];
                        if (checkType === 0) {
                            // if (res.data.contractCompany.companyPay) {
                            //     moreChannel.push({
                            //         id: - 15,
                            //         name: '企业扣费'
                            //     });
                            // }
                        }
                        if (checkType === 1) {
                            // if (res.data.contractCompany.companyPay) {
                            //     moreChannel = [{
                            //         id: - 15,
                            //         name: '退款至企业'
                            //     }];
                            // }
                            this.check.chekcType = moreChannel.concat(res.data.list.filter(function(element) {
                                const id = element.id;
                                return !(id === - 6 || id === - 7 || id === - 11 || id === - 12);
                            }));
                        }
                        if (checkType === 2) {
                            if (date.ledgerFee < 0) {
                                date.ledgerFee = - date.ledgerFee;
                                this.check.type = 3;
                                moreChannel.push({
                                    id: - 15,
                                    name: '退款至企业'
                                });
                            } else {
                                if (res.data.contractCompany && res.data.contractCompany.companyPay) {
                                    moreChannel.push({
                                        id: - 15,
                                        name: '企业扣款'
                                    });
                                }
                            }
                        }
                        this.check.chekcType = moreChannel.concat(res.data.list);
                        this.check.show = true;
                        this.check.data = {
                            rechargeFee: date.rechargeFee,
                            ledgerFee: date.ledgerFee,
                            cid: date.cid,
                            name: date.companyName
                        };
                    } else {
                        modal.alert(res.msg);
                    }
                });
            } else {
                this.detailid = date.cid;
                this.detailtab = checkType;
                this.detailTitle = date.companyName;
                this.detailVisible = true;
                http.get('/contractCompany/getDetail', {
                    cid: date.cid
                }).then(res => {
                    if (res.code === 1) {
                        this.detailData = res.data;
                    } else {
                        modal.alert(res.msg);
                    }
                });
            }
        },
        changeSort: function(value) {
            this.sort = value;
        },
        handlePageChange: function(internalCurrentPage) {
            this.currentPage = internalCurrentPage;
            this.fetchDate();
        },
        outPutText(num) {
            const paramsObj = this.getParams();
            paramsObj.exportType = num;
            const host = http.getUrl2('/contractCompany/exportCompanyList');
            const pa = http.getDataWithToken(paramsObj);
            // pa.map = JSON.parse(pa.map);
            const params = http.paramsToString(pa);
            return `${host}?${params}`;
        },
        getParams() {
            const obj = {
                keyword: this.search
            };
            if (this.CustomerStatus !== 2) {
                obj.companyType = this.CustomerStatus;
            }
            return obj;
        },
        changetype: function(value) {
            this.selecttype = value;
        },
        addForm: function() {
            this.formdata = {
                id: 0,
                companyAddress: '',
                companyName: '',
                companyType: 0,
                contactName: '',
                contactPhone: '',
                contractNum: '',
                discounts: [],
                remark: ''
            };
            this.formvisible = true;
        },
        formclose: function() {
            this.formvisible = false;
        },
        fetchDate: function() {
            const dataObject = {
                keyword: this.search,
                page: this.currentPage,
                companyType: this.CustomerStatus
            };
            if (this.CustomerStatus === 2) {
                dataObject.companyType = undefined;
            }
            Object.assign(dataObject, this.sort);
            http.get('/contractCompany/getList', dataObject).then(res => {
                if (res.code === 1) {
                    this.pages = Math.ceil(res.data.count / 30);
                    this.datalist = res.data.list;
                    this.count = res.data.count;
                    this.totalLedgerFee = res.data.totalLedgerFee;
                    this.totalRechargeFee = res.data.totalRechargeFee;
                }
            });
        }
    },
    created() {
        this.contral.COMPANY_EDIT_ID = auth.checkModule(auth.COMPANY_ID, auth.COMPANY_EDIT_ID);
        this.contral.COMPANY_CHARGE_ID = auth.checkModule(auth.COMPANY_ID, auth.COMPANY_CHARGE_ID);
        this.fetchDate();
        // 充值记录
        event.$on('showlist', () => {
            this.checkListType = 1;
            this.checkListVisible = true;
        });
        // 充值
        event.$on('showbtn1', () => {
            this.openDetailDialog(this.detailData, 1, 0);
        });
        // 退款
        event.$on('showbtn2', () => {
            this.openDetailDialog(this.detailData, 1, 1);
        });
        // 结账
        event.$on('showbtn3', () => {
            this.openDetailDialog(this.detailData, 1, 2);
        });
        // 结算记录
        event.$on('showlistcheck', () => {
            this.checkListType = 2;
            this.checkListVisible = true;
        });
        // 电子钱包流程成功回调
        event.$on('checkSuc', () => {
            this.checkListVisible = false;
            this.detailVisible = false;
            this.fetchDate();
        });
    },
    watch: {
        CustomerStatus: function() {
            this.fetchDate();
        },
        sort: function() {
            this.fetchDate();
        }
    },
    components: {
        DdPagination,
        DdSelect,
        DdDropdown,
        'dd-dropdown-item': DdDropdownItem,
        DdOption,
        DdTable,
        company,
        'checkFromDio': check,
        detail,
        companyDetail,
        checklist
    }
};
</script>

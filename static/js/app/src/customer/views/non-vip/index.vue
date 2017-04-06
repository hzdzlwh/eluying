<template>
    <div class="listbox">
        <div class="vip-search">
            <div class="vip-search-container">
                <input type="text" v-model='search' placeholder="搜索客户姓名/手机号/订单号" class="order-search dd-input">
                <span class="vip-search-icon" @click='fetchDate'><img src="//static.dingdandao.com/order_manage_search_grey.png" alt=""></span>
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
        <div class="cusTableContain">
            <DdTable :columns="col" :data-source="datalist" :sortField='sort.sortField' :sortType='sort.sortType' :onChange='changeSort'></DdTable>
        </div>
        <div class="footer-container">
            <span class="orders-total">共计<b>{{count}}位非会员</b></span>
            <div class="dd-pagination-container">
                <DdPagination @currentchange="handlePageChange" :current-page="currentPage" :page-count="pages">
                </DdPagination>
            </div>
        </div>
        <!--add new customer Modal -->
        <detail :visible='detailVisible' :type='"nonvip"' :id='detailid' :tab='2' :title='detailTitle' :onClose='detailClose'>
        </detail>
        <vipForm :vipProps='formdata' :visible='formvisible' @onSuccess='addForm'></vipForm>
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
    clear: both;
    overflow: auto;
}

.vip-search {
    margin-bottom: 20px;
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
import detail from '../../components/detail.vue';
import vipForm from '../../components/vipForm.vue';
export default {
    data() {
        return {
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
                title: '姓名',
                dataIndex: 'name'
            }, {
                title: '手机号 ',
                dataIndex: 'phone'
            }, {
                title: '订单数',
                dataIndex: 'ordersCount'
            }, {
                title: '消费金额',
                dataIndex: 'totalPrice',
                sorter: true
            }, {
                title: '首单日期',
                render: (h, row) => < span > {
                        row.firstOrderTime
                    } < /span>,
                dataIndex: 'firstOrderTime',
                sorter: true
            }, {
                title: '最近订单日期',
                render: (h, row) => < span > {
                        row.recentOrderTime
                    } < /span>,
                dataIndex: 'recentOrderTime',
                sorter: true
            }, {
                title: '操作',
                render: (h, row) =>
                        < span >
                        < span onClick = {
                            () => this.openDetailDialog(row, 1)
                        }> 加入会员 </span><span onClick = {
                        () => this.openDetailDialog(row, 0)
                } > 查单 </span></span>
            }],
            datalist: [],
            count: 0,
            search: '',
            currentPage: 1
        };
    },
    methods: {
        detailClose: function() {
            this.detailVisible = false;
        },
        openDetailDialog: function(date, type) {
            if (type) {
                this.formdata = {
                    name: date.name,
                    phone: date.phone,
                    customerId: date.customerId
                };
                $('#vipForm').modal('show');
                this.formvisible = true;
            } else {
                this.detailid = date.customerId;
                this.detailVisible = true;
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
            return obj;
        },
        addForm: function() {
            // $('#vipForm').modal('show');
                // this.formvisible = true
            this.fetchDate();
        },
        formclose: function() {
            this.formvisible = false;
        },
        fetchDate: function() {
            const dataObject = {
                keyWords: this.search,
                pageNo: this.currentPage
            };
            Object.assign(dataObject, this.sort);
            http.get('/customer/getCustomerList', dataObject).then(res => {
                if (res.code === 1) {
                    this.pages = Math.ceil(res.data.customerListSize / 30);
                    this.datalist = res.data.list;
                    this.count = res.data.customerListSize;
                }
            });
        }
    },
    watch: {
        sort: function() {
            this.fetchDate();
        }
    },
    created() {
        this.fetchDate();
    },
    components: {
        DdPagination,
        DdSelect,
        DdDropdown,
        'dd-dropdown-item': DdDropdownItem,
        DdOption,
        DdTable,
        detail,
        vipForm
    }
};
</script>

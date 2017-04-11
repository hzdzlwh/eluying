<template>
    <div id="detailModal" class="modal fade" role="dialog" data-backdrop="static">
        <div class="modal-dialog" style="width: 942px">
            <div class="modal-content">
                <div class="detail-header">
                    <div class="detail-header-title">
                        <h4>{{title}}</h4>
                        <button type="button" class="close" @click="onClose"><span>&times;</span></button>
                    </div>
                    <div class="detail-header-action" v-if="type !== 'nonvip'">
                        <ul class="restaurant-head-nav">
                            <li @click="innerTab = 1">
                                <a :class="{active: innerTab === 1}">{{type === 'vip' ? '会员' : '企业'}}详情</a>
                            </li>
                            <li @click="innerTab = 2">
                                <a :class="{active: innerTab === 2}">消费订单</a>
                            </li>
                        </ul>
                        <div v-if="innerTab === 1 && hasEditAuth">
                            <button class="dd-btn dd-btn-primary" @click="onDelete(id)">删除</button>
                            <button class="dd-btn dd-btn-primary" @click="onEdit(id)">编辑</button>
                        </div>
                    </div>
                </div>
                <div class="detail-content-box">
                    <div v-if="innerTab === 1">
                        <slot></slot>
                    </div>
                    <div v-if="innerTab === 2">
                        <div class="detail-content-filter">
                            <div style="width: 88px" v-if="type !== 'company'">
                                <dd-select v-model="state">
                                    <dd-option :key="state.id" v-for="state in states" :value="state.id" :label="state.name"></dd-option>
                                </dd-select>
                            </div>
                            <div>
                                <span>使用时间：</span>
                                <dd-datepicker placeholder="开始时间" v-model="startTime" :disabled-date="disableStartDate" />
                                <span>～</span>
                                <dd-datepicker placeholder="结束时间" v-model="endTime" :disabled-date="disableEndDate" />
                            </div>
                            <div class="search">
                                <input
                                    style="width: 217px"
                                    type="text"
                                    class="dd-input"
                                    ref="searchInput"
                                    @keyup.enter="search"
                                    placeholder="订单号"
                                >
                                <img class="search-icon" @click="search" src="//static.dingdandao.com/vipSearch.png">
                            </div>
                            <dd-dropdown text="导出明细" trigger="click">
                                <dd-dropdown-item><span><a :href="outPutText(1)" download>导出PDF</a></span></dd-dropdown-item>
                                <dd-dropdown-item><span><a :href="outPutText(0)" download>导出Excel</a></span></dd-dropdown-item>
                            </dd-dropdown>
                        </div>
                        <div class="detail-list">
                            <dd-table :columns="col" :dataSource="orders" stripe></dd-table>
                        </div>
                        <div class="detail-content-foot">
                            <span>
                                <span class="foot-item"><small>共计</small>{{orderCount}}个订单</span>
                                <span class="foot-item"><small>订单金额</small>¥{{ordersTotalPrice}}</span>
                                <span class="foot-item" v-if="type === 'company'"><small>挂账金额</small>¥{{ledgerFeeSum}}</span>
                            </span>
                            <span>
                                <dd-pagination @currentchange="getOrders" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    #detailModal {
        .modal-content {
            border-top: #178ce6 solid 3px;
            background: #fafafa;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15);
            border-radius: 2px;
            height: 705px;
            padding: 24px;
        }
        .detail-header {
            border-bottom: #e6e6e6 solid 1px;
            margin: 0 -24px;
            padding: 0 24px 24px;
        }
        .detail-header-title {
            margin-bottom: 18px;
        }
        .detail-header-title, .detail-header-action {
            display: flex;
            justify-content: space-between;
        }
        .detail-content-box {
            padding-top: 24px;
        }
        .detail-content-filter {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
        }
        .detail-content-foot {
            margin-top: 10px;
            background: #fafafa;
            box-shadow: 0 0 5px 0 rgba(0,0,0,0.15);
            height:45px;
            padding: 0 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .search {
            width: 217px;
            position: relative;
        }
        .search-icon {
            position: absolute;
            right: 8px;
            top: 6px;
        }
        .detail-list {
            max-height: 454px;
            overflow-y: auto;
        }
        .foot-item:not(:last-child) {
            padding-right: 16px;
            height: 17px;
            border-right: 1px solid #e6e6e6;
            margin-right: 16px;
        }
        .order-state {
            display: inline-block;
            text-align: center;
            height: 22px;
            width: 22px;
            line-height: 22px;
            color: #fff;
            border-radius: 2px;
            margin-right: 4px;
            &.order-state-red {
                background: #f27979;
            }
            &.order-state-blue {
                background: #3dcde0;
            }
            &.order-state-green {
                background: #62d99d;
            }
            &.order-state-yellow {
                background: #ffac59;
            }
        }

    }

</style>
<script>
    import {
        DdTable,
        DdPagination,
        DdSelect,
        DdOption,
        DdDropdown,
        DdDropdownItem,
        DdDatepicker
    } from 'dd-vue-component';
    import http from '../../common/AJAXService';
    import modal from '../../common/modal';
    import auth from '../../common/auth';

    const states = [
        {
            name: '全部状态',
            id: ''
        },
        {
            name: '已预订',
            id: 2
        },
        {
            name: '进行中',
            id: 3
        },
        {
            name: '已结束',
            id: 5
        },
        {
            name: '已取消',
            id: 4
        }
    ];

    function getStateText(id) {
        const state = states.find(i => i.id === id);
        return state && state.name;
    }

    const orderType = ['餐', '娱', '商', '住']; // eslint-disable-line
    const orderTypeClass = [ 'order-state-yellow', 'order-state-blue', 'order-state-green',  'order-state-red']; // eslint-disable-line

    const vipCol = [
        {
            title: '订单号',
            dataIndex: 'orderNum',
            width: 180
        },
        {
            title: '订单业态',
            render: (h, row) => row.orderTypes.map(type => <span class={'order-state ' + orderTypeClass[type]}>{orderType[type]}</span>)
        },
        {
            title: '订单金额￥',
            dataIndex: 'totalPrice'
        },
        {
            title: '使用时间',
            dataIndex: 'startTime'
        },
        {
            title: '操作人',
            dataIndex: 'operators'
        },
        {
            title: '订单状态',
            render: (h, row) => <span>{getStateText(row.state)}</span>
        }
    ];
    const companyCol = [
        {
            title: '订单号',
            dataIndex: 'orderNum',
            width: 180
        },
        {
            title: '订单业态',
            render: (h, row) => row.orderTypes.map(type => <span class={'order-state ' + orderTypeClass[type]}>{orderType[type]}</span>)
        },
        {
            title: '联系人',
            dataIndex: 'name'
        },
        {
            title: '联系号码',
            dataIndex: 'phone'
        },
        {
            title: '订单金额￥',
            dataIndex: 'totalPrice'
        },
        {
            title: '挂账金额￥',
            dataIndex: 'ledgerFee'
        },
        {
            title: '使用时间',
            dataIndex: 'startTime'
        },
        {
            title: '收银方式',
            dataIndex: 'payTypes'
        }
    ];
    const OrdersUrls = {
        vip: '/vipUser/getVipUserOrders',
        company: '/contractCompany/getCompanyOrderList',
        nonvip: '/customer/getCustomerList'
    };
    const OutputUrl = {
        vip: '/vipUser/vipUserOrdersExport',
        company: '/contractCompany/exportCompanyOrderList',
        nonvip: '/customer/customersToExcel'
    };

    export default{
        props: {
            type: String, // vip, company, novip
            id: Number,
            tab: Number, // 1-detail, 2-orders
            onDelete: Function,
            onEdit: Function,
            phone: String,
            title: String,
            visible: Boolean,
            onClose: Function
        },
        data() {
            return {
                orders: [],
                pageNo: 1,
                orderCount: 0,
                ordersTotalPrice: 0,
                ledgerFeeSum: 0,
                startTime: '',
                endTime: '',
                state: '',
                states: states,
                innerTab: 1 // 1-detail, 2-orders
            };
        },
        computed: {
            col() {
                return this.type === 'company' ? companyCol : vipCol;
            },
            pages() {
                return Math.ceil(this.orderCount / 30);
            },
            hasEditAuth() {
                return this.type === 'company'
                    ? auth.checkModule(auth.COMPANY_ID, auth.COMPANY_EDIT_ID)
                    : auth.checkModule(auth.VIP_ID, auth.VIP_EDIT_ID);
            }
        },
        watch: {
            visible(val) {
                if (val) {
                    this.show();
                } else {
                    this.hide();
                }
            },
            state() {
                this.getOrders();
            },
            startTime() {
                this.getOrders();
            },
            endTime() {
                this.getOrders();
            },
            id() {
                this.getOrders();
            }
        },
        components: {
            DdTable,
            DdPagination,
            DdSelect,
            DdDropdown,
            DdDropdownItem,
            DdOption,
            DdDatepicker
        },
        methods: {
            disableEndDate(date) {
                if (this.startTime !== '') {
                    const arr = this.startTime.split('-');
                    return date && date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                } else {
                    return false;
                }
            },

            outPutText(num) {
                const paramsObj = this.getParams();
                paramsObj.exportType = num;
                const host = http.getUrl2(OutputUrl[this.type]);
                const pa = http.getDataWithToken(paramsObj);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            },

            disableStartDate(date) {
                if (this.endDate !== '') {
                    const arr = this.endTime.split('-');
                    return date && date.valueOf() > (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                } else {
                    return false;
                }
            },
            getOrders(page) {
                this.pageNo = page || this.page;
                const params = this.getParams();
                http.get(OrdersUrls[this.type], params)
                    .then(res => {
                        if (res.code === 1) {
                            this.orders = res.data.list;
                            this.orderCount = res.data.orderCount;
                            this.ordersTotalPrice = res.data.ordersTotalPrice;
                        } else {
                            modal.alert(res.msg);
                        }
                    });
            },
            getParams() {
                return {
                    startTime: this.startTime,
                    endTime: this.endTime,
                    state: this.state,
                    phone: this.phone,
                    pageNo: this.pageNo,
                    keyword: this.keyword,
                    vipUserId: this.id,
                    cid: this.id
                };
            },
            search() {
                this.keyword = this.$refs.searchInput.value;
                this.pageNo = 1;
                this.getOrders();
            },
            show() {
                this.innerTab = this.tab;
                $('#detailModal').modal('show');
            },
            hide() {
                $('#detailModal').modal('hide');
                this.pageNo = 1;
                this.orderCount = 0;
                this.ordersTotalPrice = 0;
                this.ledgerFeeSum = 0;
                this.startTime = '';
                this.endTime = '';
                this.state = '';
            }
        }
    };
</script>

import AJAXService from 'AJAXService';
import { DdDatepicker, DdDropdown, DdDropdownItem, DdOption, DdPagination, DdSelect } from 'dd-vue-component';
import modal from 'modal';
/**
 * Created by zhaoyongsheng on 16/9/22.
 */
import Vue from 'vue';
import auth from '../common/auth';
import NoAuth from '../common/components/noAuth.vue';
import init from '../common/init';
import OrderDetail from './components/OrderDetail.vue';
import OrderEditor from './components/OrderEditor/OrderEditor.vue';
import { ORDER_STATE_LIST } from './constant';
import event from './event';
import store from './store';

init({
    leftMenu: false
});
require('bootstrap');
require('validation');

$(function() {
    const orderManage = new Vue({
        el: '.orderManage-rootContainer',
        store: store,
        data: {
            hasAuth: false,
            isLoading: true,
            currentPage: 1,
            orderItems: [],
            searchContent: '',
            sort: null,
            optionsParentOrderType: [
                {
                    id: -1,
                    name: '全部业态'
                },
                {
                    id: 3,
                    name: '住宿订单'
                },
                {
                    id: 0,
                    name: '餐饮订单'
                },
                {
                    id: 1,
                    name: '娱乐订单'
                },
                {
                    id: 2,
                    name: '商超订单'
                }
            ],
            orderType: -1,
            orderStatus: '-1',
            orderStatusText: {
                '0': '待处理',
                '1': '已拒绝',
                '2': '已预订',
                '3': '进行中',
                '4': '已取消',
                '5': '已结束',
                '8': '反结账' },
            optionsOrderState: ORDER_STATE_LIST,
            startDate: '',
            endDate: '',
            orderNum: 0,
            orderTotalPrice: 0,
            totalPay: 0,
            depositAmount: 0,
            pageSize: 30,
            showBothArrow: true,
            showTopArrow: true,
            showDownArrow: true,
            searchIconUrl: '//static.dingdandao.com/order_manage_search_grey.png',
            detailVisible: false,
            detailId: undefined,
            detailType: undefined,
            lastParamsObj: '',
            orderEditorVisible: false
        },

        created() {
            event.$on('onClose', this.hideDetail);
            event.$on('onShowDetail', this.showOrderDetail);
            this.hasAuth = auth.checkAccess(auth.ORDER_ID);
            if (!this.hasAuth) {
                return;
            }

            this.getOrdersList({}, false);
        },
        beforeDestroy: function() {
            event.$off('onClose', this.hideDetail);
            event.$off('onShowDetail', this.showOrderDetail);
        },
        computed: {
            orderParams() {
                if (this.orderStatus === '-1') {
                    return {};
                } else {
                    return { orderStatus: this.orderStatus };
                }
            }

        },

        methods: {
            /**
             * 请求订单列表
             * @param obj
             */
            getOrdersList(obj, pageChange) {
                const objStr = JSON.stringify(obj);
                if (this.lastParamsObj === objStr) {
                    return false;
                }
                this.lastParamsObj = objStr;
                this.currentPage = pageChange ? this.currentPage : 1;
                this.orderItems = [];
                this.isLoading = true;
                AJAXService.ajaxWithToken('get', '/order/listPc', obj,
                    (result) => {
                        this.isLoading = false;
                        if (result.code === 1 && result.data) {
                            this.orderItems = this.fixOrderItemData(result.data.list);
                            this.depositAmount = result.data.depositAmount;
                            this.orderNum = result.data.orderNum;
                            this.orderTotalPrice = result.data.orderTotalPrice;
                            this.totalPay = result.data.totalPay;
                        } else if (result.code !== 1) {
                            modal.somethingAlert(result.msg);
                        }
                    });
            },
            /**
             * 延迟获取订单列表
             * @param delayTime
             * @param action
             * @param args
             */
            delayGetOrdersList(delayTime, action, args) {
                var clearTime;
                clearTimeout(clearTime);
                clearTime = setTimeout(function() {
                    action.apply(this, args);
                }, delayTime);
            },

            outPutText(num) {
                const paramsObj = this.getParams();
                // paramsObj.map = JSON.stringify(paramsObj.map);
                paramsObj.type = num;
                const host = AJAXService.getUrl2('/order/listOrderListToText');
                const pa = AJAXService.getDataWithToken(paramsObj);
                const params = AJAXService.paramsToString(pa);
                return `${host}?${params}`;
            },

            getParams() {
                const obj = {
                    endDate: this.endDate, startDate: this.startDate,
                    keyword: this.searchContent, sort: this.sort, orderType: this.orderType
                };
                return Object.assign({}, obj, this.orderParams);
            },
            /**
             * 为各订单项添加showSub假数据
             * @param arr
             * @returns {*}
             */
            fixOrderItemData(arr) {
                arr.forEach(function(ele) {
                    if (ele.orderType === -1 && !!ele.subOrderList && ele.subOrderList.length > 1) {
                        ele.showSub = false;
                    }
                });
                return arr;
            },

            /**
             * 获取修改后的订单数据的业态
             * @param item
             * @returns {Array}
             */
            getOrderType(item) {
                let typeArr = [];
                if (item.orderType === -1 && item.subOrderType) {
                    typeArr = item.subOrderType;
                } else {
                    typeArr.push(item.orderType);
                }

                return typeArr;
            },

            getOrderStatusText(item) {
                const typeArr = this.getOrderType(item);
                const isShopOrder = item.orderType === 2 || (typeArr.length === 1 && typeArr[0] === 2);
                const isCateOrder = item.orderType === 0 || (typeArr.length === 1 && typeArr[0] === 0);
                const isRoomOrder = item.orderType === 3 || (typeArr.length === 1 && typeArr[0] === 3);
                if (isShopOrder && item.orderState === 2) {
                    return '已结束';
                } else if (isCateOrder && item.orderState === 3) {
                    return '就餐中';
                } else if (isRoomOrder && item.orderState === 3) {
                    return '已入住';
                } else if (isRoomOrder && item.orderState === 5) {
                    return '已退房';
                } else {
                    return this.orderStatusText[item.orderState];
                }
            },

            searchOrders() {
                const obj = this.getParams();
                this.getOrdersList(Object.assign({}, obj), false);
            },

            showOrderDetail(order) {
                this.detailType = order.orderType;
                this.detailId = order.orderId;
                this.detailVisible = true;
            },
            hideDetail() {
                this.detailId = undefined;
                this.detailVisible = false;
            },
            handleClickTr(item, event) {
                item.showSub = !item.showSub;
                $('.orders-tr').removeClass('dd-tr-selected');
                if (event.currentTarget.nodeName.toUpperCase() === 'TR') {
                    event.stopPropagation();
                    $(event.currentTarget).addClass('dd-tr-selected');
                }

                this.showOrderDetail(item);
            },

            changeListByDate() {
                this.showBothArrow = false;
                if (this.showTopArrow && this.showDownArrow) {
                    this.showTopArrow = !this.showTopArrow;
                    this.sort = 1;
                    const obj = this.getParams();
                    this.getOrdersList(Object.assign({}, obj), false);
                } else {
                    this.sort = this.sort === 1 ? 0 : 1;
                    this.showTopArrow = !this.showTopArrow;
                    this.showDownArrow = !this.showDownArrow;
                    const obj = this.getParams();
                    this.getOrdersList(Object.assign({}, obj), false);
                }
            },

            changeSearchIcon(str) {
                if (str === 'blur') {
                    this.searchIconUrl = this.searchContent === ''
                        ? '//static.dingdandao.com/order_manage_search_grey.png'
                        : '//static.dingdandao.com/order_manage_search_linght.png';
                } else {
                    this.searchIconUrl = '//static.dingdandao.com/order_manage_search_linght.png';
                }
            },

            handlePageChange(msg) {
                const obj = this.getParams();
                this.currentPage = msg;
                this.getOrdersList(Object.assign({}, obj, { page: msg }), true);
            },

            disableEndDate(date) {
                if (this.startDate !== '') {
                    const arr = this.startDate.split('-');
                    return date && date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                } else {
                    return false;
                }
            },

            disableStartDate(date) {
                if (this.endDate !== '') {
                    const arr = this.endDate.split('-');
                    return date && date.valueOf() > (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                } else {
                    return false;
                }
            },
            editOrder(type, order) {
                this.checkState = type;
                this.orderEditorVisible = true;
                this.orderDetail = order;
            }
        },

        watch: {
            orderType: function(newVal) {
                this.$nextTick(() => {
                    this.orderStatus = '-1';
                    const obj = this.getParams();
                    this.getOrdersList(obj, false);
                });
                /* if (newVal === 2) {
                    this.$nextTick(() => {
                        this.orderStatus = '5';
                        const obj = this.getParams();
                        this.getOrdersList(obj, false);
                    });
                } else {
                    this.$nextTick(() => {
                        this.orderStatus = '-1';
                        const obj = this.getParams();
                        this.getOrdersList(obj, false);
                    });
                } */
            },

            orderParams: function(newVal) {
                const obj = {
                    endDate: this.endDate,
                    startDate: this.startDate,
                    keyword: this.searchContent,
                    sort: this.sort,
                    orderType: this.orderType
                };
                this.getOrdersList(Object.assign({}, obj, newVal), false);
            },

            startDate: function(newVal) {
                const newValTime = new Date(newVal);
                const endDateTime = new Date(this.endDate);
                if (newVal !== '' && (this.endDate === '' || newValTime.getTime() > endDateTime.getTime())) {
                    this.endDate = newVal;
                }
            },

            endDate: function(newVal) {
                const newValTime = new Date(newVal);
                const startDateTime = new Date(this.startDate);
                if (newVal !== '' && (this.startDate === '' || startDateTime.getTime() > newValTime.getTime())) {
                    this.startDate = newVal;
                }
            }
        },

        components: {
            DdDropdown,
            DdDropdownItem,
            DdPagination,
            DdOption,
            DdSelect,
            DdDatepicker,
            NoAuth,
            OrderDetail,
            OrderEditor
        }
    });

    orderManage.$watch(
        function() {
            const startTime = new Date(this.startDate);
            const endTime = new Date(this.endDate);
            return { minusTime: endTime.getTime() - startTime.getTime() };
        },
        function(newVal) {
            if (newVal.minusTime >= 0) {
                const obj = this.getParams();
                this.getOrdersList(Object.assign({}, obj), false);
            }
        }
    );
});

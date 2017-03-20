/**
 * Created by zhaoyongsheng on 16/9/22.
 */
import Vue from 'vue';
import util from 'util';
import modal from 'modal';
import AJAXService from 'AJAXService';
import auth from '../../common/auth';
import NoAuth from '../../common/components/noAuth.vue';
import { DdDropdown, DdDropdownItem, DdPagination, DdDatepicker, DdSelect, DdOption } from 'dd-vue-component';
import init from '../../common/init';
init({
    leftMenu: false
});
require("bootstrap");
require("validation");

$(function(){
    var events = {

        "click .orders-tr": function(ev){
            ev.stopPropagation();
            $(".orders-tr").removeClass("dd-tr-selected");
            $(this).addClass("dd-tr-selected");
        }

    };
    
    let orderManage = new Vue({
        el: ".orderManage-rootContainer",
        data: {
            hasAuth: false,
            isLoading: true,
            currentPage: 1,
            orderItems: [],
            optionsSubOrderType: { '-1': [{id: -1, name: '全部业态'}], '2': [{id: -1, name: '全部商超' }] },
            searchContent: '',
            sort: null,
            optionsParentOrderType: [{
                id: -1,
                name: '全部业态'
                },
                {
                    id: 0,
                    name: '餐饮'
                },
                {
                    id: 1,
                    name: '娱乐'
                },
                {
                    id: 2,
                    name: '商超'
                },
                {
                    id: 3,
                    name: '住宿'
                }
            ],
            orderType: -1,
            orderStatus: '-1',
            orderStatusText: ['待处理', '已拒绝', '已预订', '进行中', '已取消', '已结束'],
            orderTypeItem: [-1],
            optionsOrderState: [
                {
                    id: '-1',
                    name: '全部订单状态'
                },
                {
                    id: '0',
                    name: '待处理'
                },
                {
                    id: '1',
                    name: '已拒绝'
                },
                {
                    id: '2',
                    name: '已预订'
                },
                {
                    id: '3',
                    name: '进行中'
                },
                {
                    id: '5',
                    name: '已结束'
                }
            ],
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
            searchIconUrl: '//static.dingdandao.com/order_manage_search_grey.png'
        },

        created() {
            this.hasAuth = auth.checkAccess(auth.ORDER_ID);
            if (!this.hasAuth) {
                return;
            }
       
            this.getOrdersList({}, false);
            AJAXService.ajaxWithToken('get', '/order/getTypeMap', {}, result => {
                this.optionsSubOrderType = Object.assign(this.optionsSubOrderType, result.data);
                this.optionsSubOrderType['0'] = this.optionsSubOrderType['0'].map(el => ({ id: el.id, name: el.name, show: true}));
                this.optionsSubOrderType['1'] = this.optionsSubOrderType['1'].map(el => ({ id: el.id, name: el.name, show: true}));
                this.optionsSubOrderType['3'] = this.optionsSubOrderType['3'].map(el => ({ id: el.id, name: el.name, show: true}));
                this.optionsSubOrderType['0'].unshift({id: -1, name: '全部餐厅', show: true });
                this.optionsSubOrderType['1'].unshift({id: -1, name: '全部娱乐', show: true });
                this.optionsSubOrderType['3'].unshift({id: -1, name: '全部房型', show: true });
            });
        },

        computed: {
            orderParams() {
                if (this.orderStatus === '-1') {
                    return {}
                } else {
                    return { orderStatus: this.orderStatus }
                }
            },


        },

        methods: {
            /**
             * 请求订单列表
             * @param obj
             */
            getOrdersList(obj, pageChange) {
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
                pa.map = JSON.parse(pa.map);
                let params = AJAXService.paramsToString(pa);
                return `${host}?${params}`;
            },

            getParams() {
                let obj = { endDate: this.endDate, startDate: this.startDate, keyword: this.searchContent, sort: this.sort };
                let map = { list: this.orderType === -1 ? [] : (this.orderTypeItem.length > 0 ? this.orderTypeItem : [-2]),
                            orderType: this.orderType};
                return Object.assign({}, obj, { map: JSON.stringify(map) }, this.orderParams);
            },
            /**
             * 为各订单项添加showSub假数据
             * @param arr
             * @returns {*}
             */
            fixOrderItemData(arr) {
                arr.forEach(function(ele){
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

            searchOrders() {
                const obj = this.getParams();
                this.getOrdersList(Object.assign({}, obj), false);
            },
            
            handleClickTr(item, event) {
                item.showSub = !item.showSub;
                $('.orders-tr').removeClass('dd-tr-selected');
                if (event.currentTarget.nodeName.toUpperCase() === 'TR') {
                    event.stopPropagation();
                    $(event.currentTarget).addClass('dd-tr-selected');
                }
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
                    this.searchIconUrl = this.searchContent === ""
                                         ? "//static.dingdandao.com/order_manage_search_grey.png"
                                         : "//static.dingdandao.com/order_manage_search_linght.png";
                } else {
                    this.searchIconUrl = "//static.dingdandao.com/order_manage_search_linght.png";
                }
            },
            
            handlePageChange(msg) {
                const obj = this.getParams();
                this.currentPage = msg;
                this.getOrdersList(Object.assign({}, obj, { page: msg }), true);
            },

            changeOrderTypeItem(item) {
                if (item.id === -1 && item.show) {
                    this.optionsSubOrderType[this.orderType].forEach(function(el){
                        el.show = false;
                    });
                    this.$nextTick(function() {
                        this.orderTypeItem = [];
                        const obj = this.getParams();
                        this.delayGetOrdersList(500, this.getOrdersList, [obj, false]);
                    });
                } else if (item.id === -1 && !item.show) {
                    this.optionsSubOrderType[this.orderType].forEach(function(el){
                        el.show = true;
                    });
                    this.$nextTick(function() {
                        this.orderTypeItem = this.optionsSubOrderType[this.orderType].map(el => el.id);
                        const obj = this.getParams();
                        this.delayGetOrdersList(500, this.getOrdersList, [obj, false]);
                    });
                } else if (item.id !== -1 && item.show) {
                    this.optionsSubOrderType[this.orderType][0].show = false;
                    this.optionsSubOrderType[this.orderType].forEach(function(el){
                        if (el.id === item.id) {
                            item.show = false;
                        }
                    });
                    this.$nextTick(function() {
                        if (this.orderTypeItem[0] === -1) {
                            this.orderTypeItem.splice(0, 1);
                        }
                        const obj = this.getParams();
                        this.delayGetOrdersList(500, this.getOrdersList, [obj, false]);
                    });
                } else if (item.id !== -1 && !item.show) {
                    this.optionsSubOrderType[this.orderType].forEach(function(el){
                        if(el.id === item.id) {
                            item.show = true;
                        }
                    });
                    this.$nextTick(function() {
                        if(this.optionsSubOrderType[this.orderType].length - this.orderTypeItem.length === 1) {
                            this.optionsSubOrderType[this.orderType][0].show = true;
                            this.$nextTick(function(){
                                this.orderTypeItem = this.optionsSubOrderType[this.orderType].map(el => el.id);
                                const obj = this.getParams();
                                this.delayGetOrdersList(500, this.getOrdersList, [obj, false]);
                            });
                        } else {
                            const obj = this.getParams();
                            this.delayGetOrdersList(500, this.getOrdersList, [obj, false]);
                        }
                    });
                }
            },

            disableEndDate(date) {
                if (this.startDate !== '') {
                    const arr = this.startDate.split('-');
                    return date && date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf()
                } else {
                    return false;
                }
            },

            disableStartDate(date) {
                if (this.endDate !== '') {
                    const arr = this.endDate.split('-');
                    return date && date.valueOf() > (new Date(arr[0], arr[1] - 1, arr[2])).valueOf()
                } else {
                    return false;
                }
            }
        },

        watch: {
            orderType: function(newVal, oldVal) {
                this.orderTypeItem = [];
                this.orderTypeItem = this.optionsSubOrderType[newVal].map(el => el.id);
                const obj = this.getParams();
                this.delayGetOrdersList(500, this.getOrdersList, [obj, false]);
            },

            orderParams: function(newVal, oldVal) {
                const obj = { endDate: this.endDate,
                              startDate: this.startDate,
                              keyword: this.searchContent,
                              sort: this.sort,
                              map: JSON.stringify({list: this.orderType === -1 ? [] : (this.orderTypeItem.length > 0 ? this.orderTypeItem : [-2]),
                                                    orderType: this.orderType})};
                this.getOrdersList(Object.assign({}, newVal, obj), false);
            },

            startDate: function(newVal, oldVal) {
                let newValTime = new Date(newVal);
                let endDateTime = new Date(this.endDate);
                if (newVal !== '' && (this.endDate === '' || newValTime.getTime() > endDateTime.getTime())) {
                    this.endDate = newVal;
                }
            },

            endDate: function(newVal, oldVal) {
                let newValTime = new Date(newVal);
                let startDateTime = new Date(this.startDate);
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
            NoAuth
        }
    });

    orderManage.$watch(
        function() {
            let startTime = new Date(this.startDate);
            let endTime = new Date(this.endDate);
            return { minusTime: endTime.getTime() - startTime.getTime() };
        },
        function(newVal, oldVal) {
            if (newVal.minusTime >= 0) {
                const obj = this.getParams();
                this.getOrdersList(Object.assign({}, obj), false);
            }
        }
    );

    util.bindDomAction(events);
});
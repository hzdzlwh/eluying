/**
 * Created by zhaoyongsheng on 16/9/22.
 */
import Vue from 'vue';
import header from 'header';
import util from 'util';
import modal from 'modal';
import AJAXService from 'AJAXService';
import auth from '../../common/auth';
import { DdDropdown, DdDropdownItem, DdPagination, DdDatepicker, DdSelect, DdOption } from 'dd-vue-component';

auth.checkAuth(auth.BUSINESS_ID);
require("bootstrap");
require("validation");

$(function(){
    //初始化界面
    header.showHeader();
    //高亮"订单管理"
    $(".manageVipEntry").removeClass("selected");
    $(".settingsEntry").removeClass("selected");
    $(".accomodationEntry").removeClass("selected");
    $(".ordersManageEntry").addClass("selected");
    var events = {

        "resize window": util.mainContainer,
        "click .orders-tr": function(){
            $(".orders-tr").removeClass("dd-tr-selected");
            $(this).addClass("dd-tr-selected");
        }

    };
    
    const orderManage = new Vue({
        el: ".ordersManage-mainContainer",
        data: {
            isLoading: true,
            currentPage: 1,
            orderItems: [],
            optionsSubOrderType: { '-1': [{id: '-1', name: '全部业态'}], '2': [{id: '-1', name: '全部商超' }] },
            searchContent: '',
            optionsParentOrderType: [{
                id: '-1',
                name: '全部业态'
                },
                {
                    id: '0',
                    name: '餐饮'
                },
                {
                    id: '1',
                    name: '娱乐'
                },
                {
                    id: '2',
                    name: '商超'
                },
                {
                    id: '3',
                    name: '住宿'
                }
            ],
            orderType: '-1',
            orderStatus: '-1',
            orderStatusText: ['待处理', '已拒绝', '已预订', '进行中', '已取消', '已完成'],
            orderTypeItem: ['-1'],
            optionsOrderState: [{
                id: '-1',
                name: '全部订单状态'
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
                    name: '已完成'
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
            showDownArrow: true
        },

        created(){
            this.getOrdersList({});
            AJAXService.ajaxWithToken('get', '/order/getTypeMap', {}, function(result){
                this.optionsSubOrderType = Object.assign(this.optionsSubOrderType, result.data);
                this.optionsSubOrderType['0'].unshift({id: '-1', name: '全部餐厅' });
                this.optionsSubOrderType['1'].unshift({id: '-1', name: '全部娱乐' });
                this.optionsSubOrderType['3'].unshift({id: '-1', name: '全部房型' });
            }.bind(this));
        },

        computed: {
            searchIconUrl() {
                return this.searchContent === ''
                    ? 'http://static.dingdandao.com/order_manage_search_grey.png'
                    : 'http://static.dingdandao.com/order_manage_search_linght.png';
            },

            orderParams() {
                if(this.orderStatus === '-1') {
                    return {}
                }else {
                    return { orderStatus: this.orderStatus }
                }
            }
        },

        methods: {
            /**
             * 请求订单列表
             * @param obj
             */
            getOrdersList(obj, pageChange) {
                this.currentPage = pageChange ? this.currentPage : 1;
                this.orderItems = [];
                this.showBothArrow = true;
                this.showTopArrow = true;
                this.showDownArrow =true;
                this.isLoading = true;
                AJAXService.ajaxWithToken('get', '/order/listPc', obj,
                    function(result){
                        this.isLoading = false;
                        if(result.code === 1 && result.data) {
                            this.orderItems = this.fixOrderItemData(result.data.list);
                            this.depositAmount = result.data.depositAmount;
                            this.orderNum = result.data.orderNum;
                            this.orderTotalPrice = result.data.orderTotalPrice;
                            this.totalPay = result.data.totalPay;
                        }else if(result.code !== 1) {
                            modal.somethingAlert(result.msg);
                        }
                    }.bind(this));
            },
            
            /**
             * 为各订单项添加typeArray数组,showSub假数据
             * @param arr
             * @returns {*}
             */
            fixOrderItemData(arr){
                arr.forEach(function(ele){
                    if(ele.orderType === -1) {
                        let typeArray = [];
                        ele.subOrderList.forEach(function(ele){
                            typeArray.push(ele.orderType);
                        });
                        ele.typeArray = typeArray;
                    }
                    if(ele.orderType === -1 && ele.subOrderList.length > 1) {
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
            getOrderType(item){
                let typeArr = [];
                if(item.orderType !== -1) {
                    typeArr.push(item.orderType);
                }else{
                    typeArr = item.typeArray;
                }
                return typeArr;
            },

            searchOrders(){
                if(this.searchContent !== '') {
                    const obj = { endDate: this.endDate, startDate: this.startDate, keyword: this.searchContent};
                    this.getOrdersList(Object.assign({}, this.orderParams, obj), false);
                }else{
                    return;
                }
            },
            
            handleClickTr(item){
                item.showSub = !item.showSub;
            },

            changeListByDate() {
                this.showBothArrow = false;
                if(this.showTopArrow && this.showDownArrow){
                    this.showTopArrow = !this.showTopArrow;
                    this.orderItems.sort(function(pre,next){
                        let preTime = new Date(pre.date);
                        let nextTime = new Date(next.date);
                        return nextTime.getTime() - preTime.getTime();
                    });
                }else{
                    this.showTopArrow = !this.showTopArrow;
                    this.showDownArrow = !this.showDownArrow;
                    this.orderItems.reverse();
                }
            },

            handlePageChange(msg) {
                const obj = { endDate: this.endDate, startDate: this.startDate, keyword: this.searchContent, page: msg};
                this.currentPage = msg;
                this.getOrdersList(Object.assign({}, this.orderParams, obj), true);
            }
        },

        watch: {
            orderType: function(newVal, oldVal){
                this.orderTypeItem = [];
                this.optionsSubOrderType[newVal].forEach(function(el){
                    this.orderTypeItem.push(el.id);
                }.bind(this));
            },

            orderTypeItem: function(newVal, oldVal){
                if(newVal.indexOf('-1') === -1 && oldVal.indexOf('-1') !== -1){
                    this.orderTypeItem = [];
                }
            },

            orderParams: function(newVal, oldVal){
                const obj = { endDate: this.endDate, startDate: this.startDate, keyword: this.searchContent};
                this.getOrdersList(Object.assign({}, newVal, obj), false);
            },

            startDate: function(newVal, oldVal){
                let newValTime = new Date(newVal);
                let endDateTime = new Date(this.endDate);
                if(newVal !== '' && (this.endDate === '' || newValTime.getTime() > endDateTime.getTime())){
                    this.endDate = newVal;
                }
            },

            endDate: function(newVal, oldVal){
                let newValTime = new Date(newVal);
                let startDateTime = new Date(this.startDate);
                if(newVal !== '' && (this.startDate === '' || startDateTime.getTime() > newValTime.getTime())){
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
            DdDatepicker
        }
    });

    orderManage.$watch(
        function(){
            let startTime = new Date(this.startDate);
            let endTime = new Date(this.endDate);
            return { minusTime: endTime.getTime() - startTime.getTime() };
        },
        function(newVal, oldVal){
            if(newVal.minusTime >= 0){
                const obj = { endDate: this.endDate, startDate: this.startDate, keyword: this.searchContent };
                this.getOrdersList(Object.assign({}, this.orderParams, obj), false);
            }
        }
    );

    util.bindDomAction(events);
});
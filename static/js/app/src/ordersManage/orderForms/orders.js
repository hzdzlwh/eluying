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
            orderTypeItems: [],
            optionsOrderTypeItems: [{id: -1, name: '全部业态'}],
            searchContent: '',
            optionsOrderType: [{
                id: '-1',
                name: '全部业态'
                },
                {
                    id: '3',
                    name: '住宿'
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
                }
            ],
            orderType: '-1',
            orderStatus: '-1',
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
        },

        created(){
            this.getOrdersList({});
            AJAXService.ajaxWithToken('get', '/order/getTypeMap', {}, function(result){
                this.orderTypeItems = result.data;
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
                    return { endDate: this.endDate, startDate: this.startDate }
                }else {
                    return { endDate: this.endDate, startDate: this.startDate, orderStatus: this.orderStatus }
                }
            }
        },

        methods: {
            getOrdersList(obj) {
                this.orderItems = [];
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

            getOrderStatusText(num){
                switch(num){
                    case 0:
                        return '待处理';
                    case 1:
                        return '已拒绝';
                    case 2:
                        return '已预订';
                    case 3:
                        return '进行中';
                    case 4:
                        return '已取消';
                    case 5:
                        return '已完成';
                }
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
                    this.getOrdersList(Object.assign({}, this.orderParams, {keyword: this.searchContent}));
                }else{
                    return;
                }
            },
            
            handleClickTr(item){
                item.showSub = !item.showSub;
            },

            handlePageChange(msg) {
                this.currentPage = msg;
                this.getOrdersList(Object.assign({}, this.orderParams, { page: msg }));
            }
        },

        watch: {
            orderType: function(newVal, oldVal){
                switch(newVal){
                    case '-1':
                        this.optionsOrderTypeItems = [{id: '-1', name: '全部业态'}];
                        this.orderTypeItem = [newVal];
                        break;
                    case '3':
                        this.optionsOrderTypeItems = Object.assign({}, this.orderTypeItems)['3'];
                        this.optionsOrderTypeItems.unshift({id: '3', name: '全部房型'});
                        this.orderTypeItem = [newVal];
                        break;
                    case '0':
                        this.optionsOrderTypeItems = Object.assign({}, this.orderTypeItems)['0'];
                        this.optionsOrderTypeItems.unshift({id: '0', name: '全部餐厅'});
                        this.orderTypeItem = [newVal];
                        break;
                    case '1':
                        this.optionsOrderTypeItems = Object.assign({}, this.orderTypeItems)['1'];
                        this.optionsOrderTypeItems.unshift({id: '1', name: '全部娱乐'});
                        this.orderTypeItem = [newVal];
                        break;
                }
            },

            orderParams: function(newVal, oldVal){
                this.getOrdersList(Object.assign({}, newVal, { page: this.currentPage, keyword: this.searchContent }))
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

    util.bindDomAction(events);
});
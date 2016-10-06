/**
 * Created by zhaoyongsheng on 16/9/22.
 */
var Vue = require('vue');
var header = require('header');
var leftMenu = require('leftMenu');
var util = require('util');
var modal = require('modal');
var AJAXService= require('AJAXService');
var auth = require('../../common/auth');
auth.checkAuth(auth.BUSINESS_ID);

require("bootstrap");
require("validation");
const { DdDropdown, DdDropdownItem, DdPagination, DdDatepicker, DdSelect, DdOption } = require('dd-vue-component');

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
            orderItems:[1, 2, 3, 4, 5, 6, 7, 8],
            searchState: 'grey',
            searchContent: '',
            options: [{
                value: '-1',
                label: '全部业态'
                },
                {
                    value: '3',
                    label: '住宿'
                },
                {
                    value: '0',
                    label: '餐饮'
                },
                {
                    value: '1',
                    label: '娱乐'
                },
                {
                    value: '2',
                    label: '商超'
                }
            ],
            value: '-1'
        },

        methods: {
            changeIcon(){
                if (this.searchState === 'linght' && this.searchContent) {
                    return;
                }else if (this.searchContent === ''){
                    this.searchState = 'grey';
                }else if (this.searchContent){
                    this.searchState = 'linght';
                }
            },

            handleChange(){
                console.log('hello');
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
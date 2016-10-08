/**
 * Created by zhaoyongsheng on 16/9/22.
 */
import Vue from 'vue';
import header from 'header';
import leftMenu from 'leftMenu';
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
            searchState: 'grey',
            orderItems:[1,2,3,4,5],
            searchContent: '',
            optionsType: [{
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
            orderState: '-1',
            optionsState: [{
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
            endDate: ''
        },

        created(){
            AJAXService.ajaxWithToken('get', '/order/listPc', { startDate: '2016-09-05', endDate: '2016-09-08'}, function(result){
            });
            AJAXService.ajaxWithToken('get', '/order/getTypeMap', {}, function(result){
                
            });
        },

        computed: {

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

            handlePageChange(msg){
                console.log(msg);
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
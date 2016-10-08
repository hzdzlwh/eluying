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
            orderItems:[1, 2, 3, 4, 5, 6, 7, 8],
            searchState: 'grey',
            searchContent: '',
            optionsType: [{
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
            orderType: '-1',
            orderState: '-1',
            optionsState: [{
                value: '-1',
                label: '全部订单状态'
                },
                {
                    value: '2',
                    label: '已预订'
                },
                {
                    value: '3',
                    label: '进行中'
                },
                {
                    value: '5',
                    label: '已完成'
                }
            ],
            startDate: '',
            endDate: ''
        },

        created(){
            AJAXService.ajaxWithToken('get', '/order/listPc', {}, function(result){

            });
            AJAXService.ajaxWithToken('get', '/order/getTypeMap', {}, function(result){
                
            });
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

            handleChange(msg){
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
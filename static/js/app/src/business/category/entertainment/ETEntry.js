/**
 * Created by Administrator on 2016/1/8.
 */
var header = require("header");
var Vue = require('vue');
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
var ETCategoryList = require("./ETCategoryList");
var addET = require("./addET");
var editETBasic = require("./editETBasic");
var showInfo = require("./showInfo");
var auth = require('../../../common/auth');
var AJAXService = require('../../../common/AJAXService');

auth.checkAuth(auth.BUSINESS_ID);
require("bootstrap");
require("validation");


$(function(){
    //初始化界面
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();
    modal.modalInit();


    // ETCategoryList.loadETCategoryList();


    var events = {

        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);}


    };

    util.bindDomAction(events);

    util.bindDomAction(ETCategoryList.events);

    util.bindDomAction(addET.events);

    util.bindDomAction(editETBasic.events);

    util.bindDomAction(showInfo.events);

    var ETList = new Vue({
        el: '.mainContainer',
        data: {
            isSelected: false,
            isS: false,
            selectedETId: undefined,
            selectedETType: undefined,
            ETTypeList: []
        },
        ready: function() {
            this.loadETList();
        },
        methods: {
            openCreateETDialog: function() {
                ETTypeDialog.status = 0;
                $('#createETDialog').modal('show');
            },
            selectET: function(id) {
                this.selectedETId = id;
                this.selectedETType = undefined;
            },
            selectETType: function(type) {
                this.selectedETType = type;
                this.selectedETId = undefined;
            },
            openEditCategoryDialog() {
                ETTypeDialog.status = 2;
                ETTypeDialog.ETType = this.selectedETType;
                if (ETTypeDialog.ETType.chargeMode == 0) {
                    ETTypeDialog.perPay = ETTypeDialog.ETType.price;
                } else {
                    ETTypeDialog.timePay = ETTypeDialog.ETType.price;
                }
                $('#createETDialog').modal('show');  
            },
            openCreateCategoryDialog() {
                ETTypeDialog.status = 1;
                $('#createETDialog').modal('show');  
            },
            loadETList() {
                 AJAXService.ajaxWithToken('get', '/entertainment/getEntertainmentManagementList', {}, res => {
                    if (res.code === 1) {
                        this.ETTypeList = [];
                        res.data.list.map(ET => {
                            ET.entertainmentCategoryList.map((el, index) => {
                                if (index === 0) {
                                    el.entertainmentId = ET.entertainmentId;
                                    el.entertainmentImgUrl = ET.entertainmentImgUrl;
                                    el.entertainmentName = ET.entertainmentName;
                                    el.amount = ET.entertainmentCategoryList.length;
                                }
                                this.ETTypeList.push(el);
                            })
                        })
                    } else {
                        modal.somethingAlert(res.msg);
                    }
                })         
            }
        }
    });
    var ETTypeDialog = new Vue({
        el: '#createETDialog',
        data: {
            ETType: {
                entertainmentIconId: 1,
                price: ''
            },
            perPay: '',
            timePay: '',
            status: ''
        },
        watch: {
            'ETType.chargeMode'(v) {
                this.$set('ETType.extraFeeItems', v == 0 ? '设备损坏，设备丢失' : '设备损坏，设备丢失，超时');
            }
        },
        computed: {
            entertainmentImgUrl() {
                return this.ETType.entertainmentImgUrl || 'http://static.dingdandao.com/eluyun/image/Group%203.png';
            }
        },
        methods: {
            rest() {
                this.data = {
                    ETType: {
                        entertainmentIconId: 1,
                        price: ''
                    },
                    perPay: '',
                    timePay: '',
                    status: ''
                }
            },
            addOrEditEntertainmentCategory() {
                AJAXService.ajaxWithToken('post', '/entertainment/addOrEditEntertainmentCategory', this.ETType, res => {
                    if (res.code === 1) {
                        ETList.loadETList();
                        $('#createETDialog').modal('hide');
                        this.rest();
                    } else {
                        modal.somethingAlert(res.msg);
                    }
                })
            },
            closeCreateETDialog() {
                $('#createETDialog').modal('hide');
                this.rest();
            },
            openIconDialog() {
                $('#iconDialog').modal('show');
            },
            createETType() {
                this.ETType.price = this.ETType.chargeMode == 0 ? this.perPay : this.timePay;
                AJAXService.ajaxWithToken('post', '/entertainment/addEntertainment', this.ETType, res => {
                    if (res.code === 1) {
                        ETList.loadETList();
                        $('#createETDialog').modal('hide');
                        this.rest();
                    } else {
                        modal.somethingAlert(res.msg);
                    }
                })
            },
            getIcon() {
                return this.ETType.entertainmentImgUrl || 'http://static.dingdandao.com/eluyun/image/Group%203.png';
            },
            onConfirm() {
                if (this.status === 0) {
                    this.createETType();
                } else {
                    this.addOrEditEntertainmentCategory();
                }
            }
        } 
    });
    var icons = new Vue({
        el: '#iconDialog',
        ready() {
            this.loadIcons();
        },
        data: {
            icons: {},
            iconSelected: {}
        },
        methods: {
            loadIcons() {
                AJAXService.ajaxWithToken('get', '/entertainment/getEntertainmentIcons', {}, res => {
                    if (res.code === 1) {
                        this.icons = res.data;
                    } else {
                        modal.somethingAlert(res.msg);
                    }
                })
            },
            closeIconDialog() {
                $('#iconDialog').modal('hide');
            },
            selectIcon(icon) {
                this.iconSelected = icon;
            },
            setIcon() {
                ETTypeDialog.$set('ETType.entertainmentIconId', this.iconSelected.entertainmentIconId);
                ETTypeDialog.$set('ETType.entertainmentImgUrl', this.iconSelected.entertainmentImgUrl);
                $('#iconDialog').modal('hide');                
            }
        }
    })
});

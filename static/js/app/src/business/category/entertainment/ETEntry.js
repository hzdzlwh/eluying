/**
 * Created by Administrator on 2016/1/8.
 */
var header = require("header");
var Vue = require('vue1');
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
var ETCategoryList = require("./ETCategoryList");
var addET = require("./addET");
var editETBasic = require("./editETBasic");
var showInfo = require("./showInfo");
var auth = require('../../../common/auth');
var http = require('../../../common/http');

require("bootstrap");
require("validation");
import init from '../../../common/init';
init({
    id: auth.BUSINESS_ID,
    clearModal: true
});

Vue.prototype.$isNull = function(text) {
    var result = typeof (text) === 'undefined' || text === '';
    return result;
};


$(function(){

    util.bindDomAction(showInfo.events);

    var ETList = new Vue({
        el: '.mainContainer',
        data: {
            selectedETId: undefined,
            selectedETCategoryId: undefined,
            ETTypeList: [],
            originData: []
        },
        computed: {
            selectedETCategory() {
                return this.ETTypeList.filter(el => el.entertainmentCategoryId === this.selectedETCategoryId)[0];
            }
        },
        created: function() {
            this.loadETList();
        },
        methods: {
            openCreateETDialog: function() {
                ETTypeDialog.status = 0;
                ETTypeDialog.$set('ETType.chargeUnit', '1');
                $('#createETDialog').modal('show');
            },
            selectET: function(id) {
                this.selectedETId = id;
                this.selectedETCategoryId = undefined;
            },
            selectETCategory: function(id) {
                this.selectedETCategoryId = id;
                this.selectedETId = undefined;
            },
            openEditTypeDialog() {
                ETTypeDialog.status = 3;
                var et = Object.assign({}, this.ETTypeList.filter(el => 
                    el.entertainmentId === this.selectedETId
                )[0]);
                ETTypeDialog.ETType = et;
                icons.$set('iconSelected.entertainmentIconId' ,et.entertainmentIconId);
                $('#createETDialog').modal('show');                  
            },
            openEditCategoryDialog() {
                ETTypeDialog.status = 2;
                ETTypeDialog.ETType = Object.assign({}, this.selectedETCategory);
                if (ETTypeDialog.ETType.chargeMode == 0) {
                    ETTypeDialog.perPay = ETTypeDialog.ETType.price;
                } else {
                    ETTypeDialog.timePay = ETTypeDialog.ETType.price;
                }
                $('#createETDialog').modal('show');  
            },
            openCreateCategoryDialog() {
                ETTypeDialog.status = 1;
                ETTypeDialog.entertainmentId = this.selectedETId;
                ETTypeDialog.$set('ETType.chargeUnit', '1');
                $('#createETDialog').modal('show');  
            },
            /**
             * 删除娱乐
             */
            openDeleteET() {
                modal.confirm({title: '提醒', message: '删除娱乐项目有之后娱乐项目里面的所有规格将一起被删除，确认要删除吗？', okText: '确认删除'}, this.deleteET);
            },
            /**
             * 删除娱乐
             */
            deleteET() {
                http.post('/entertainment/deleteEntertainment', { entertainmentId: this.selectedETId })
                    .then(res => {
                        this.selectedETId = undefined;
                        this.loadETList();
                    });
            },
            /**
             * 删除娱乐规格
             */
            openDeleteETCategory() {
                let length = 0;
                if (this.selectedETCategory.entertainmentId) {
                    length = this.originData.filter(el => el.entertainmentId === this.selectedETCategory.entertainmentId)[0].entertainmentCategoryList.length;
                }
                const message = length === 1 ? '删除最后一个娱乐规格，将把娱乐项目一起删除，确认要删除吗？' : '删除娱乐规格后，不可找回，确认要删除吗？'
                modal.confirm({title: '提醒', message, okText: '确认删除'}, this.deleteETCategory);
            },
            deleteETCategory() {
                http.post('/entertainment/deleteEnterCategory',
                    { id: this.selectedETCategory.entertainmentCategoryId,
                      entertainmentId: this.selectedETCategory.deleteId }
                )
                    .then(res => {
                        this.selectedETCategoryId = undefined;
                        this.loadETList();
                    });
            },
            modifyState() {
                const data = {
                    id: this.selectedETCategory.entertainmentCategoryId,
                    state: 1 - this.selectedETCategory.directNetState,
                    channelId: 5
                }
                http.post('/category/modifyStatePC', data)
                    .then(res => {
                        this.loadETList();
                    });
            },
            loadETList() {
                 http.get('/entertainment/getEntertainmentManagementList', {})
                     .then(res => {
                         this.ETTypeList = [];
                         this.originData = res.data.list;
                         res.data.list.map(ET => {
                             ET.entertainmentCategoryList.map((el, index) => {
                                 el.deleteId = ET.entertainmentId;
                                 if (index === 0) {
                                     el.entertainmentIconId = ET.entertainmentIconId;
                                     el.entertainmentId = ET.entertainmentId;
                                     el.entertainmentImgUrl = ET.entertainmentImgUrl;
                                     el.entertainmentName = ET.entertainmentName;
                                     el.amount = ET.entertainmentCategoryList.length;
                                 }
                                 this.ETTypeList.push(el);
                             })
                         })
                     })
            }
        }
    });
    var ETTypeDialog = new Vue({
        el: '#createETDialog',
        data: {
            ETType: {
                entertainmentIconId: '',
                price: ''
            },
            perPay: '',
            timePay: '',
            status: '', //0-创建娱乐项目；1-新增娱乐规格；2-编辑娱乐规格;3-编辑娱乐项目
            submitted: false
        },
        watch: {
            'ETType.chargeMode'(v) {
                if (this.status !== 2) {
                    this.$set('ETType.extraFeeItems', v == 0 ? '设备损坏，设备丢失' : '设备损坏，设备丢失，超时');
                }
            }
        },
        computed: {
            entertainmentImgUrl() {
                return this.ETType.entertainmentImgUrl || '//static.dingdandao.com/eluyun/image/Group%203.png';
            }
        },
        methods: {
            rest() {
                this.$data = {
                    ETType: {
                        entertainmentIconId: '',
                        price: ''
                    },
                    perPay: '',
                    timePay: '',
                    status: '',
                    submitted: false
                }
            },
            editEntertainment() {
                if (this.$isNull(this.ETType.entertainmentName)
                 || this.$isNull(this.ETType.entertainmentIconId)) {
                    return
                }
                var { entertainmentIconId,
                    entertainmentId,
                    entertainmentName
                } = this.ETType
                http.post('/entertainment/editEntertainment', { entertainmentIconId,entertainmentId,entertainmentName })
                    .then(res => {
                        ETList.loadETList();
                        $('#createETDialog').modal('hide');
                        setTimeout(this.rest, 300);
                    });
            },
            addOrEditEntertainmentCategory() {
                this.ETType.price = this.ETType.chargeMode == 0 ? this.perPay : this.timePay;                
                 if (this.$isNull(this.ETType.entertainmentCategoryName)
                    || this.$isNull(this.ETType.entertainmentCategoryShort)
                    || this.$isNull(this.ETType.unit)
                    || this.$isNull(this.ETType.needDeposit)
                    || this.$isNull(this.ETType.chargeMode)
                    || this.$isNull(this.ETType.price)) {
                    return
                }
                const data = Object.assign({}, this.ETType, {entertainmentId: this.ETType.deleteId || this.entertainmentId});
                http.post('/entertainment/addOrEditEntertainmentCategory', data)
                    .then(res => {
                        ETList.loadETList();
                        $('#createETDialog').modal('hide');
                        setTimeout(this.rest, 300);
                    });
            },
            closeCreateETDialog() {
                $('#createETDialog').modal('hide');
                setTimeout(this.rest, 300);
            },
            openIconDialog() {
                icons.$set('iconSelected.entertainmentIconId', this.ETType.entertainmentIconId);
                icons.$set('iconSelected.entertainmentImgUrl', this.ETType.entertainmentImgUrl);
                $('#iconDialog').modal('show');
            },
            /**
             * 创建娱乐项目
             */
            createETType() {
                this.ETType.price = this.ETType.chargeMode == 0 ? this.perPay : this.timePay;
                if (this.$isNull(this.ETType.entertainmentName)
                 || this.$isNull(this.ETType.entertainmentIconId)
                 || this.$isNull(this.ETType.entertainmentCategoryName)
                 || this.$isNull(this.ETType.entertainmentCategoryShort)
                 || this.$isNull(this.ETType.unit)
                 || this.$isNull(this.ETType.needDeposit)
                 || this.$isNull(this.ETType.chargeMode)
                 || this.$isNull(this.ETType.price)) {
                    return
                }
                
                http.post('/entertainment/addEntertainment', this.ETType)
                    .then(res => {
                        ETList.loadETList();
                        $('#createETDialog').modal('hide');
                        setTimeout(this.rest, 300);
                    });
            },
            getIcon() {
                return this.ETType.entertainmentImgUrl || '//static.dingdandao.com/eluyun/image/Group%203.png';
            },
            onConfirm() {
                this.submitted = true;
                if (this.status === 0) {
                    this.createETType();
                } else if (this.status === 3) {
                    this.editEntertainment();
                } else {
                    this.addOrEditEntertainmentCategory();                    
                }
            }
        } 
    });
    var icons = new Vue({
        el: '#iconDialog',
        created() {
            this.loadIcons();
        },
        data: {
            icons: {},
            iconSelected: {}
        },
        methods: {
            loadIcons() {
                http.get('/entertainment/getEntertainmentIcons', {})
                    .then(res => {
                        this.icons = res.data;
                    });
            },
            closeIconDialog() {
                this.iconSelected = {};
                $('#iconDialog').modal('hide');
            },
            selectIcon(icon) {
                this.iconSelected = icon;
            },
            setIcon() {
                if (!this.iconSelected.entertainmentIconId) {
                    modal.warn('请选择图标');
                    return false;
                }

                ETTypeDialog.$set('ETType.entertainmentIconId', this.iconSelected.entertainmentIconId);
                ETTypeDialog.$set('ETType.entertainmentImgUrl', this.iconSelected.entertainmentImgUrl);
                this.closeIconDialog();
            }
        }
    })
});

var AJAXService = require("AJAXService");
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
require("fileupload");
var auth = require('../../common/auth');
auth.checkAuth(auth.BUSINESS_ID);
import { DdSelect, DdOption } from 'dd-vue-component';
import { dsyForComponent, dsy } from '../../common/dsy';
import Vue from 'vue';
import { mapInit } from '../../common/mapInit';

require("bootstrap");
require("validation");

$(function() {
    //检测IE
    util.checkExplorer();
    //初始化界面
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();
    modal.modalInit();
    var events = {

        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
    };
    util.bindDomAction(events);
    var mainContainer;
    mainContainer = new Vue({
        el: '.mainContainer',
        data: {
            campName: '',
            optionShopType: [
                {
                    id: 0,
                    name: '营地'
                },
                {
                    id: 1,
                    name: '景区'
                },
                {
                    id: 2,
                    name: '农庄'
                },
                {
                    id: 3,
                    name: '游乐园'
                },
                {
                    id: 4,
                    name: '度假村'
                },
                {
                    id: 5,
                    name: '客栈'
                },
                {
                    id: 6,
                    name: '青旅'
                },
            ],
            shopType: -1,
            shopPhone: '',
            imgUrls: [],
            provinceType: 0,
            cityType: 0,
            countyType: 0,
            provinceItems: dsyForComponent['0'],
            cityItems: dsyForComponent['0_0'],
            countyItems: dsyForComponent['0_0_0'],
            mapMessage: '',
            lat: undefined,
            lon: undefined
        },
        created: function () {
            this.getShopList();
        },
        methods: {
            getShopList () {
                AJAXService.ajaxWithToken('get', '/directNet/getBasicInfo', {}, result => {
                    if (result.code === 1 && result.data) {
                        this.campName = result.data.campName;
                        this.shopType = result.data.type;
                        this.shopPhone = result.data.recePhone;
                        this.imgUrls = result.data.imgs || [];
                        this.mapMessage = result.data.address;
                        this.provinceType = this.mapAddress(this.provinceItems, result.data.province);
                        this.cityItems = dsyForComponent[0+'_'+this.mapAddress(this.provinceItems, result.data.province)];
                        this.cityType = this.mapAddress(this.cityItems, result.data.city);
                        this.countyItems = dsyForComponent[0+'_'+this.mapAddress(this.provinceItems, result.data.province)+'_'+this.mapAddress(this.cityItems, result.data.city)];
                        this.countyType = this.mapAddress(this.countyItems, result.data.county);
                        console.log(this.provinceItems);
                        console.log(this.provinceType);
                        console.log(this.cityItems);
                        console.log(this.cityType);
                        this.search();
                        mapInit('infoMap', {
                            addressStr: result.data.address,
                            pointLat: result.data.lat,
                            pointLon: result.data.lon
                        }, 16, obj => {
                            this.lat = obj.pointLat;
                            this.lon = obj.pointLon;
                        });
                    } else if (result.code !== 1) {
                        modal.somethingAlert(result.msg);
                    }
                })
            },
            fileUpload(callback) {
                var a = $('#detail').fileupload({
                    url: AJAXService.getUrl2("uploadImageUrl"),
                    done: (e, data) => {
                        var result = data.result[0].body ? data.result[0].body.innerHTML : data.result;
                        result = JSON.parse(result);
                        callback(result.data.url)
                    }
                });
            },
            uploadNewImg() {
                this.fileUpload(url => {
                    this.imgUrls.push(url);
                });
                $('#detail').click();
            },
            remove: function (index) {
                this.imgUrls.splice(index, 1);
            },
            replace: function (index) {
                this.fileUpload(url => {
                    this.imgUrls.splice(index, 1, url);
                });
                $('#detail').click();
            },
            search: function (mapMessage) {
                mapInit('infoMap', {addressStr: mapMessage}, 16, obj => {
                    this.lat = obj.pointLat;
                    this.lon = obj.pointLon;
                });
            },
            saveMessage: function () {
                AJAXService.ajaxWithToken('get', '/directNet/editBasicInfo', {
                    address: this.mapMessage,
                    campType: this.shopType,
                    recePhone: this.shopPhone,
                    province: this.provinceItems[this.provinceType].name,
                    city: this.cityItems[this.cityType].name,
                    county: this.countyItems[this.countyType].name,
                    imgs: JSON.stringify(this.imgUrls),
                    lat: this.lat,
                    lon: this.lon,
                    version: 13,
                }, result => {
                    if (result.code === 1) {
                        this.getShopList();
                        this.search();
                        modal.somethingAlert('保存成功');
                    } else if (result.code !== 1) {
                        modal.somethingAlert('请把信息填写完整');
                    }
                })
            },
            cancel: function () {
                    this.getShopList();
            },
            mapAddress: function(arr , value) {
                let i;
                arr.forEach((item, index) => {
                    if(item.name == value ) {
                        i = index;
                    }
                });
                return i;
            }
        },
        watch: {
            provinceType: function (newval, oldval) {
                this.cityItems = dsyForComponent[0 + '_' + newval];
                this.cityType = newval;
            },
            cityType: function (newval, oldval) {
                this.countyItems = dsyForComponent[0 + '_' + this.provinceType + '_' + newval];
            },
        },
        components: {
            DdSelect,
            DdOption
        }
    });
});




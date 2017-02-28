var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
require("fileupload");
var auth = require('../../common/auth');
import init from '../../common/init';
init({
    id: auth.BUSINESS_ID,
});
import { DdSelect, DdOption } from 'dd-vue-component';
import { dsyForComponent, dsy } from '../../common/dsy';
import Vue from 'vue';
import { mapInit } from '../../common/mapInit';

require("bootstrap");
require("validation");

$(function() {
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
            shopType: 0,
            shopPhone: '',
            imgUrls: [],
            provinceType: 0,
            cityType: 0,
            countyType: undefined,
            provinceItems: dsyForComponent['0'],
            cityItems: dsyForComponent['0_0'],
            countyItems: dsyForComponent['0_0_0'],
            address: '',
            lat: null,
            lon: null
        },
        mounted: function () {
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
                        this.address = result.data.address || '';
                        this.lat = result.data.lat;
                        this.lon = result.data.lon;
                        this.provinceType = this.mapAddress(this.provinceItems, result.data.province || '北京市');
                        this.cityItems = dsyForComponent[0+'_'+this.provinceType];
                        this.$nextTick(() => {
                            this.cityType = this.mapAddress(this.cityItems, result.data.city || '北京市');
                            this.countyItems = dsyForComponent[0+'_'+this.provinceType+'_'+this.cityType];
                            this.$nextTick(() => {
                                this.countyType = this.mapAddress(this.countyItems, result.data.county || '请选择');
                            }, result);
                        }, result);
                        result.data.lat ?
                            mapInit('infoMap', {
                                addressStr: `${result.data.province || '北京市'}${result.data.city || '北京市'}${result.data.county || ''}`,
                                pointLat: result.data.lat,
                                pointLon: result.data.lon
                            }, 16, obj => {
                                this.lat = obj.pointLat;
                                this.lon = obj.pointLon;
                            }) :
                            mapInit('infoMap', {
                                addressStr: `${result.data.province || '北京市'}${result.data.city || '北京市'}${result.data.county || ''}`,
                                pointLat: result.data.lat,
                                pointLon: result.data.lon
                            }, 16, () => {
                                this.lat = null;
                                this.lon = null;
                            });
                    } else if (result.code !== 1) {
                        modal.somethingAlert(result.msg);
                    }
                })
            },
            fileUpload(callback) {
                $('#detail').fileupload({
                    url: AJAXService.getUrl2("uploadImageUrl"),
                    done: (e, data) => {
                        var result = data.result[0].body ? data.result[0].body.innerHTML : data.result;
                        result = JSON.parse(result);
                        callback(result.data.url)
                    }
                });
            },
            uploadNewImg() {
                if (this.imgUrls.length >= 20) {
                    modal.somethingAlert('上传图片数量已达上限!');
                    return false;
                }
                this.fileUpload(url => {
                    this.imgUrls.push(url);
                });
                $('#detail').click();
            },
            remove(index) {
                this.imgUrls.splice(index, 1);
            },
            replace(index) {
                this.fileUpload(url => {
                    this.imgUrls.splice(index, 1, url);
                });
                $('#detail').click();
            },
            search() {
                const addressStr = `${this.provinceItems[this.provinceType].name}${this.cityItems[this.cityType].name}${this.countyItems[this.countyType].name}${this.address}`;
                mapInit('infoMap', {addressStr: addressStr}, 16, obj => {
                    this.lat = obj.pointLat;
                    this.lon = obj.pointLon;
                });
            },
            saveMessage() {
                if (this.countyType < 0) {
                    modal.somethingAlert('请把信息填写完整');
                    return;
                }
                AJAXService.ajaxWithToken('get', '/directNet/editBasicInfo', {
                    address: this.address,
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
                        modal.somethingAlert('保存成功');
                    } else if (result.code !== 1) {
                        modal.somethingAlert('请把信息填写完整');
                    }
                })
            },
            cancel() {
                this.getShopList();
            },
            mapAddress(arr, value) {
                let i;
                arr.forEach((item) => {
                    if(item.name.indexOf(value) >= 0 ) {
                        i = item.id;
                    }
                });
                return i;
            }
        },
        watch: {
            provinceType: function (newVal) {
                this.cityItems = dsyForComponent[0 + '_' + newVal];
                this.cityType = 0;
                this.countyItems = dsyForComponent[0 + '_' + this.provinceType + '_' + this.cityType];
                this.countyType = 0;
            },
            cityType: function (newVal) {
                this.countyItems = dsyForComponent[0 + '_' + this.provinceType + '_' + newVal];
                this.countyType = 0;
            }
        },
        components: {
            DdSelect,
            DdOption
        }
    });
});




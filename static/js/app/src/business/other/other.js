/**
 * Created by huwanqi on 15/12/26.
 */
import Vue from 'vue1';
var http = require("http");
var util = require("util");
var trToggle = require("trToggle");
require("jqueryui");
require("bootstrap");
var modal = require("modal");
var auth = require('../../common/auth');
import init from '../../common/init';

init({
    id: auth.BUSINESS_ID,
    topMenu: true
});
$(function() {
    const events = {
        'mouseover .imgss': function() {
            $(this).next().show();
        },
        'mouseout .imgss': function() {
            $(this).next().hide();
        }
    };

    util.bindDomAction(events);
    const settingDialog = new Vue({
        el: '#otherSetting',
        data: {
            id: undefined,
            oddType: 0,
            unit: 0,
            discounts: [],
            newDiscounts: []
        },
        methods: {
            remove(item) {
                if (!item.id) {
                    this.newDiscounts.$remove(item);
                } else {
                    Vue.set(item, 'deleted', true);
                }
            },
            addDiscount() {
                this.newDiscounts.push({
                    description: '',
                    discount: ''
                });
            },
            getDiscounts() {
                http.get('/quickDiscount/getList', {
                        nodeId: 0,
                        nodeType: 0
                    })
                    .then(res => {
                        if (res.code === 1) {
                            this.discounts = res.data.list;
                            this.oddType = res.data.oddSetting.oddType;
                            this.unit = res.data.oddSetting.unit;
                        } else {
                            modal.warn(res.msg);
                        }
                    });
            },
            confirm() {
                for (let i = 0; i < this.newDiscounts.length; i++) {
                    if (!this.newDiscounts[i].description) {
                        modal.warn('请填写折扣名称');
                        return false;
                    }

                    if (!this.newDiscounts[i].discount) {
                        modal.warn('请填写优惠折扣');
                        return false;
                    }

                    if (!/^0\.[1-9]$|^[1-9]\.[0-9]$|^[1-9]$/.test(this.newDiscounts[i].discount)) {
                        modal.warn('请输入0.1-9.9之间正确的折扣数字');
                        return false;
                    }
                }

                if ((Number(this.oddType) === 1 || Number(this.oddType) === 2) &&
                    !this.unit) {
                    modal.warn('请选择精确单位');
                    return false;
                }

                const list = this.discounts.filter(i => i.deleted)
                    .concat(this.newDiscounts);
                http.post('/quickDiscount/discountAndOddSettingEdit', {
                        oddType: this.oddType,
                        unit: this.unit,
                        nodeId: 0,
                        nodeType: 0,
                        quickDiscountList: JSON.stringify(list)
                    })
                    .then(res => {
                        if (res.code === 1) {
                            this.newDiscounts = []
                            this.getDiscounts();
                        } else {
                            modal.warn(res.msg);
                        }
                    });
            }
        },
        created() {
            this.getDiscounts()
        }
    });

});

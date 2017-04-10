/**
 * Created by lingchenxuan on 16/6/16.
 */
import http from 'AJAXService';
import modal from 'modal';
import util from 'util';
import Vue from 'vue1';
import auth from '../../../common/auth';
import init from '../../../common/init';
require('bootstrap');
require('validation');
require('jqueryui');
init({
    id: auth.BUSINESS_ID
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

    const table = new Vue({
        el: '.restaurant-container',
        data: {
            restaurants: [],
            restIdWillDeleted: undefined,
            restaurantId: undefined
        },
        created: function() {
            this.getRestaurants();
        },
        methods: {
            deleteRestaurant: function() {
                http.ajaxWithToken('GET',
                    '/catering/modifyRestaurant',
                    { restId: this.restIdWillDeleted },
                    function(result) {
                        if (result.code === 1) {
                            modal.somethingAlert('删除成功');
                            this.getRestaurants();
                        } else {
                            modal.somethingAlert(result.msg);
                        }
                    }.bind(this));
            },
            getRestaurants: function() {
                http.ajaxWithToken('GET', '/catering/getRestaurantList', {}, function(result) {
                    this.restaurants = result.data.list;
                }.bind(this));
            },
            openCreateDialog: function() {
                restaurantDialog.status = 'create';
                $('#restaurantDialog').modal('show');
            },
            openEditDialog: function(restaurant) {
                restaurantDialog.status = 'edit';
                restaurantDialog.restaurantName = restaurant.restName;
                restaurantDialog.restaurantId = restaurant.restId;
                restaurantDialog.resturantNotice = restaurant.caterScanAnnouncement ? restaurant.caterScanAnnouncement : '';
                $('#restaurantDialog').modal('show');
            },
            openDeleteDialog: function(restId) {
                this.restIdWillDeleted = restId;
                modal.confirmDialog({
                    okText: '删除',
                    message: '删除餐厅之后，餐厅里的菜品和桌子将一起被删除。',
                    showTitle: false
                },
                    this.deleteRestaurant.bind(this));
            },
            openSettingDialog: function(restaurant) {
                settingDialog.oddType = restaurant.oddType;
                settingDialog.unit = restaurant.unit;
                settingDialog.id = restaurant.restId;
                settingDialog.getDiscounts();
                $('#settingDialog').modal('show');
            },
            toggleStatus: function(item) {
                http.ajaxWithToken('get', '/catering/openCloseCaterScan', {
                    restId: item.restId,
                    isOpenCaterScan: (item.isOpenCaterScan === 1 ? 0 : 1)
                }, result => {
                    if (result.code !== 1) {
                        modal.somethingAlert(result.msg);
                    } else {
                        item.isOpenCaterScan = item.isOpenCaterScan === 1 ? 0 : 1;
                    }
                });
            }
        }
    });

    const settingDialog = new Vue({
        el: '#settingDialog',
        data: {
            id: undefined,
            oddType: undefined,
            unit: undefined,
            discounts: [],
            newDiscounts: []
        },
        methods: {
            close() {
                this.discounts = [];
                this.newDiscounts = [];
                $('#settingDialog').modal('hide');
            },
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
                    nodeId: this.id,
                    nodeType: 1
                })
                    .then(res => {
                        if (res.code === 1) {
                            this.discounts = res.data.list;
                        } else {
                            modal.alert(res.msg);
                        }
                    });
            },
            confirm() {
                for (let i = 0; i < this.newDiscounts.length; i ++) {
                    if (!/^0\.[1-9]$|^[1-9]\.[0-9]$|^[1-9]$/.test(this.newDiscounts[i].discount)) {
                        modal.alert('请输入0.1-9.9之间正确的折扣数字');
                        return false;
                    }
                }

                if ((Number(this.oddType) === 1 || Number(this.oddType) === 2) &&
                    !this.unit) {
                    modal.alert('请选择精确单位');
                    return false;
                }

                const list = this.discounts.filter(i => i.deleted)
                    .concat(this.newDiscounts);
                http.post('/quickDiscount/discountAndOddSettingEdit', {
                    oddType: this.oddType,
                    unit: this.unit,
                    restId: this.id,
                    quickDiscountList: JSON.stringify(list)
                })
                    .then(res => {
                        if (res.code === 1) {
                            this.close();
                            table.getRestaurants();
                        } else {
                            modal.alert(res.msg);
                        }
                    });
            }
        }
    });

    const restaurantDialog = new Vue({
        el: '#restaurantDialog',
        data: {
            restaurantName: '',
            submitted: false,
            status: '',
            restaurantId: undefined,
            resturantNotice: ''
        },
        methods: {
            createRestaurant: function() {
                this.submitted = true;
                if (this.restaurantName === '') {
                    return;
                }
                http.ajaxWithToken('POST',
                    '/catering/addRestaurant',
                    { restName: this.restaurantName, caterScanAnnouncement: this.resturantNotice },
                    function(result) {
                        if (result.code === 1) {
                            $('#restaurantDialog').modal('hide');
                            table.getRestaurants();
                            this.restaurantName = '';
                            this.resturantNotice = '';
                            this.submitted = false;
                        } else {
                            modal.somethingAlert(result.msg);
                        }
                    }.bind(this));
            },
            editRestaurant: function() {
                this.submitted = true;
                if (this.restaurantName === '') {
                    return;
                }
                http.ajaxWithToken('POST',
                    '/catering/modifyRestaurant',
                    {
                        restName: this.restaurantName,
                        restId: this.restaurantId,
                        caterScanAnnouncement: this.resturantNotice
                    },
                    function(result) {
                        if (result.code === 1) {
                            $('#restaurantDialog').modal('hide');
                            table.getRestaurants();
                            this.restaurantName = '';
                            this.resturantNotice = '';
                            this.submitted = false;
                        } else {
                            modal.somethingAlert(result.msg);
                        }
                    }.bind(this));
            },
            cancel: function() {
                this.restaurantName = '';
                this.resturantNotice = '';
                this.submitted = false;
                $('#restaurantDialog').modal('hide');
            },
            close: function() {
                this.restaurantName = '';
                this.resturantNotice = '';
                $('#restaurantDialog').modal('hide');
            }
        }
    });
});

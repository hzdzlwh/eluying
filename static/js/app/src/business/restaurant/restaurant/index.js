/**
 * Created by lingchenxuan on 16/6/16.
 */
var Vue = require('vue');
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
var AJAXService = require('AJAXService');
require("bootstrap");
require("validation");

var auth = require('../../../common/auth');
auth.checkAuth(auth.BUSINESS_ID);


$(function(){
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();
    modal.centerModals();
    var events = {

        "resize window": util.mainContainer

    };

    util.bindDomAction(events);
    
    var table = new Vue({
        el: '.restaurant-container',
        data: {
            restaurants: [],
            restIdWillDeleted: undefined
        },
        created: function() {
            this.getRestaurants();
        },
        methods: {
            deleteRestaurant: function() {
                AJAXService.ajaxWithToken('GET',
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
                AJAXService.ajaxWithToken('GET', '/catering/getRestaurantList', {}, function(result) {
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
                $('#restaurantDialog').modal('show');
            },
            openDeleteDialog: function(restId) {
                this.restIdWillDeleted = restId;
                modal.confirmDialog({ okText: '删除',
                    message: '删除餐厅之后，餐厅里的菜品和桌子将一起被删除。',
                    showTitle: false },
                    this.deleteRestaurant.bind(this))
            }
        }
    });


    var restaurantDialog = new Vue({
        el: '#restaurantDialog',
        data: {
            restaurantName: '',
            submitted: false,
            status: '',
            restaurantId: undefined
        },
        methods: {
            createRestaurant: function() {
                this.submitted = true;
                if (this.restaurantName === '') {
                    return;
                }
                AJAXService.ajaxWithToken('POST',
                    '/catering/addRestaurant',
                    { restName: this.restaurantName },
                    function(result) {
                        if (result.code === 1) {
                            $('#restaurantDialog').modal('hide');
                            table.getRestaurants();
                            this.restaurantName = '';
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
                AJAXService.ajaxWithToken('POST',
                    '/catering/modifyRestaurant',
                    { restName: this.restaurantName,
                      restId: this.restaurantId },
                    function(result) {
                        if (result.code === 1) {
                            $('#restaurantDialog').modal('hide');
                            table.getRestaurants();
                            this.restaurantName = '';
                            this.submitted = false;
                        } else {
                            modal.somethingAlert(result.msg);
                        }
                    }.bind(this));
            },
            cancel: function() {
                this.restaurantName = '';
                this.submitted = false;
                $('#restaurantDialog').modal('hide');
            }
        }
    })
});


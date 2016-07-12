/**
 * Created by lcx on 2016/6/24.
 */

var Vue = require('vue');
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
var AJAXService = require('AJAXService');
var restaurantMenu = require('../restaurantMenu');
var showInfo = require("../../category/food/showInfo");
require("bootstrap");
require("validation");

var auth = require('../../../common/auth');
auth.checkAuth(auth.BUSINESS_ID);
Vue.prototype.$isNull = function(text) {
    var result = typeof (text) === 'undefined' || text === '';
    return result;
};

$(function() {
    header.showHeader();
    leftMenu.showLeftMenu();
    restaurantMenu.render();
    util.mainContainer();
    modal.centerModals();
    modal.modalInit();

    window.addEventListener('resize', util.mainContainer);

    events = {

        "show.bs.modal .modal": modal.centerModals,
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);}

    };

    util.bindDomAction(events);

    util.bindDomAction(showInfo.events);
    
    var restId = location.search.split('=')[1];
    var main = new Vue({
        el: '.restaurant-container',
        data: {
            dishesList: [],
            packages: [],
            restName: undefined,
            dishesSelected: undefined,
            packageSelected: undefined,
            restId: restId
        },
        created: function() {
            this.getRestaurants();
            this.getPackagesAndDishesFromRestaurant();
        },
        methods: {
            getPackagesAndDishesFromRestaurant: function() {
                AJAXService.ajaxWithToken('GET', '/catering/getPackagesAndDishesFromRestaurant', { restId: restId }, function(result) {
                    this.dishesList = result.data.dishesList;
                    this.packages = result.data.packageList;
                }.bind(this));
            },
            getRestaurants: function() {
                AJAXService.ajaxWithToken('GET', '/catering/getRestaurantList', {}, function(result) {
                    this.restName = result.data.list.filter(function(el) {
                        return el.restId == restId;
                    })[0].restName;
                }.bind(this));
            },
            openCreateDishesDialog: function() {
                $('#dishesDialog').modal('show');
            },
            openDishesClassifyDialog: function() {
                dishesClassify.getDishesClassify();
                $('#dishesClassifyDialog').modal('show');
            },

            selectDishes: function(dishes) {
                if (this.packageSelected) {
                    this.packageSelected = undefined;
                }
                this.dishesSelected = dishes;
            },

            selectPackage: function(packageModel) {
                if (this.dishesSelected) {
                    this.dishesSelected = undefined;
                }
                this.packageSelected = packageModel;
            },

            openEditDialog: function() {
                if (this.dishesSelected) {
                    dishes.dishes = Object.assign({}, this.dishesSelected);
                    $('#dishesDialog').modal('show');
                } else if (this.packageSelected) {
                    packageVM.packageModel = Object.assign({}, this.packageSelected, { dishesNum: undefined, packageName: this.packageSelected.name });
                    packageSelect.getAllDishesFromRest();
                    $('#packageDialog').modal('show');
                }
            },
            
            openCreatePackageDialog: function() {
                packageSelect.getAllDishesFromRest();
                $('#packageDialog').modal('show');
            },

            openDeleteDialog: function() {
                if (!this.dishesSelected && !this.packageSelected) {
                    return
                }
                modal.confirmDialog({ okText: '删除', message: '您确定要删除吗？' }, this.deleteCategory)
            },

            deleteCategory: function() {
                var params = {
                    restId: restId
                };
                var url;
                if (this.packageSelected) {
                    params.packageId = this.packageSelected.categoryId;
                    url = '/catering/deletePackages';
                }
                if (this.dishesSelected) {
                    params.categoryId = this.dishesSelected.categoryId;
                    url = '/catering/deleteDishesForRestaurant';
                }
                AJAXService.ajaxWithToken('POST', url,
                    params,
                    function(res) {
                        if (res.code === 1) {
                            this.getPackagesAndDishesFromRestaurant();
                            this.packageSelected = undefined;
                            this.dishesSelected = undefined;
                        } else {
                            modal.somethingAlert(res.msg);
                        }
                    }.bind(this))
            },

            modifyState: function() {
                var selected = this.dishesSelected || this.packageSelected;
                var id = selected.categoryId;
                var state = 1 - selected.onDirectSaleState;

                AJAXService.ajaxWithToken('POST', '/category/modifyStatePC',
                    { id: id, state: state, channelId: 5 },
                    function(res) {
                        if (res.code === 1) {
                            this.getPackagesAndDishesFromRestaurant();
                            selected.onDirectSaleState = state;
                        } else {
                            modal.somethingAlert(res.msg);
                        }
                    }.bind(this))
            }
        }

    });

    var dishes = new Vue({
        el: '#dishesDialog',
        data: {
            dishes: {},
            dishesClassifyList: [],
            submitted: false
        },
        created: function() {
            this.getDishesClassify();
        },
        methods: {
            getDishesClassify: function() {
                AJAXService.ajaxWithToken('GET', '/catering/getDishesClassify', { restId: restId }, function(result) {
                    if (result.code === 1) {
                        this.dishesClassifyList = result.data.list;
                    } else {
                        modal.somethingAlert(result.msg);
                    }
                }.bind(this));
            },
            changeDishes: function() {
                this.submitted = true;
                if (this.$isNull(this.dishes.dishesClassifyId) ||
                    this.$isNull(this.dishes.shortName) ||
                    this.$isNull(this.dishes.unit)||
                    this.$isNull(this.dishes.unitPrice)) {
                    return null;
                }
                var params = Object.assign({}, this.dishes);
                params.restId = restId;
                var url = this.dishes.categoryId ? '/catering/modifyDishesForRestaurant' : '/catering/addDishesForRestaurant';
                AJAXService.ajaxWithToken('POST', url, params, function(result) {
                    if (result.code === 1) {
                        main.getPackagesAndDishesFromRestaurant();
                        this.dishes = {};
                        this.submitted = false;
                        $('#dishesDialog').modal('hide');
                    } else {
                        modal.somethingAlert(result.msg);
                    }
                }.bind(this));
            },
            cancel: function() {
                this.dishes = {};
                this.submitted = false;
                $('#dishesDialog').modal('hide');
            }
        }
    });

    var dishesClassify = new Vue({
        el: '#dishesClassifyDialog',
        data: {
            dishesClassifyList: [],
            dishesClassifySelected: undefined
        },
        methods: {
            getDishesClassify: function() {
                AJAXService.ajaxWithToken('GET', '/catering/getDishesClassify', { restId: restId }, function(result) {
                    if (result.code === 1) {
                        this.dishesClassifyList = result.data.list;
                    } else {
                        modal.somethingAlert(result.msg);
                    }
                }.bind(this));
            },
            openDishesClassifyCreateDialog: function() {
                $('#dishesClassifyEditDialog').modal('show');
            },
            select: function(dishesClassify) {
                this.dishesClassifySelected = dishesClassify;
            },
            openDishesClassifyEditDialog: function() {
                if (!this.dishesClassifySelected) {
                    return
                }
                dishesClassifyEdit.dishesClassify = Object.assign({}, this.dishesClassifySelected, {name: this.dishesClassifySelected.dishesClassifyName});
                $('#dishesClassifyEditDialog').modal('show');
            },
            openDeleteDialog: function() {
                if (!this.dishesClassifySelected) {
                    return
                }
                modal.confirmDialog({ okText: '删除', message: '删除菜品分类后，该菜品分类下的菜都将自动放入其它' }, this.deleteClassify)
            },
            deleteClassify: function() {
                AJAXService.ajaxWithToken('POST', '/catering/removeDishesClassify',
                    { restId: restId ,dishesClassifyId: this.dishesClassifySelected.dishesClassifyId },
                    function(res) {
                        if (res.code === 1) {
                            dishesClassify.getDishesClassify();
                        } else {
                            modal.somethingAlert(res.msg);
                        }
                })
            },
            cancel: function() {
                this.dishesClassifySelected = undefined;
                $('#dishesClassifyDialog').modal('hide');
            }
        }
    });

    var packageSelect = new Vue({
       el: '#packageSelectDialog',
        data: {
            dishesListGroupByClassify: {},
            dishesClassifyList: [],
            dishesInClassify: [],
            dishesInPackageList: [],
            currentClassifyId: undefined,
            classifyOffset: 0,
            dishesTempList: []
        },
        methods: {
            getAllDishesFromRest: function() {
                AJAXService.ajaxWithToken('GET', '/catering/getAllDishesFromRest',
                    { restId: restId, packageId: packageVM.packageModel.categoryId },
                    function(res) {
                        if (res.code === 1) {
                            this.dishesInPackageList = res.data.dishesInPackageList;
                            packageVM.packageModel.dishesReq = this.dishesInPackageList.map(function(el) {
                                return Object.assign({}, el);
                            });
                            this.dishesTempList = this.dishesInPackageList.map(function(el) {
                                return Object.assign({}, el);
                            });
                            res.data.dishesNumAndTypeList.map(function(el) {
                                if (!this.dishesListGroupByClassify[el.dishesClassifyId]) {
                                    this.dishesListGroupByClassify[el.dishesClassifyId] = [];
                                }
                                this.dishesListGroupByClassify[el.dishesClassifyId].push(el);
                            }.bind(this));
                            AJAXService.ajaxWithToken('GET', '/catering/getDishesClassify', { restId: restId }, function(result) {
                                if (result.code === 1) {
                                    this.dishesClassifyList = result.data.list;
                                    this.currentClassifyId = this.dishesClassifyList[0].dishesClassifyId;
                                    this.dishesInClassify = this.dishesListGroupByClassify[this.dishesClassifyList[0].dishesClassifyId];
                                } else {
                                    modal.somethingAlert(result.msg);
                                }
                            }.bind(this));
                        }
                }.bind(this));
            },
            changeClassify: function(id) {
                this.dishesInClassify = this.dishesListGroupByClassify[id];
                this.currentClassifyId = id;
            },
            isSelected: function(id) {
                var list = this.dishesTempList.filter(function(el) {
                    return el.categoryId === id;
                });
                if (list.length) {
                    return true;                    
                }
            },

            /**
             * 选择或反选菜品
             * @param dishes
             */
            selectDishes: function(dishes) {
                if (this.isSelected(dishes.categoryId)) {
                    dishes.amount = 1;
                    this.dishesTempList.map(function(el, index) {
                        if (el.categoryId === dishes.categoryId) {
                            this.dishesTempList.splice(index, 1);
                        }
                    }.bind(this));
                } else {
                    this.dishesTempList.push(Object.assign({}, dishes, {amount: 1}));
                }
            },
            changePackageDishes: function() {
                this.dishesInPackageList = this.dishesTempList.map(function(el) {
                    return Object.assign({}, el);
                });
                packageVM.packageModel.dishesReq = this.dishesInPackageList.map(function(el) {
                    return Object.assign({}, el);
                });
                $('#packageSelectDialog').modal('hide');
            },
            decreaseDishesNum: function(dishes) {
                if (dishes.amount <= 1) {
                    dishes.amount = 1;
                } else {
                    dishes.amount = dishes.amount - 1;
                }
            },
            increaseDishesNum: function(dishes) {
                if (dishes.amount >= 999) {
                    dishes.amount = 999;
                } else {
                    dishes.amount = dishes.amount + 1;
                }
            },
            changeAmount: function(dishes) {
                if (dishes.amount >= 999) {
                    dishes.amount = 999;
                } else if ((dishes.amount <= 1)) {
                    dishes.amount = 1;
                }
            },
            cancel: function() {
                this.dishesTempList = this.dishesInPackageList.map(function(el) {
                    return Object.assign({}, el);
                });
                $('#packageSelectDialog').modal('hide');
            },
            decreaseClassifyOffset: function() {
                if (this.classifyOffset <= 0) {
                    this.classifyOffset = 0;
                } else {
                    this.classifyOffset --;
                }
            },
            increaseClassifyOffset: function() {
                if (this.classifyOffset >= this.dishesClassifyList.length - 4) {
                    this.classifyOffset = this.dishesClassifyList.length - 4;
                } else {
                    this.classifyOffset ++;
                }
            }
        }
    });

    var packageVM = new Vue({
        el: '#packageDialog',
        data: {
            packageModel: {
                dishesNum: undefined,
                dishesReq: []
            },
            submitted: false
        },
        methods: {
            openPackageSelectDialog: function() {
                $('#packageSelectDialog').modal('show');
            },
            getDishesNum: function() {
                var num = 0;
                packageSelect.dishesInPackageList.map(function(el) {
                    num = num + el.amount;
                });
                return num;
            },
            changePackage: function() {
                this.submitted = true;
                if (this.$isNull(this.packageModel.packageName) ||
                    this.$isNull(this.packageModel.shortName) ||
                    this.$isNull(this.packageModel.unitPrice) ||
                    this.getDishesNum() === 0) {
                    return null;
                }
                var url = this.packageModel.categoryId ? '/catering/modifyPackages' : '/catering/addPackages';
                var param = Object.assign({}, this.packageModel,
                    { restId: restId, packageId: this.packageModel.categoryId, dishesReq: JSON.stringify(this.packageModel.dishesReq) });
                AJAXService.ajaxWithToken('POST', url, param, function(res) {
                    if (res.code === 1) {
                        $('#packageDialog').modal('hide');
                        packageSelect.dishesListGroupByClassify = {};
                        main.getPackagesAndDishesFromRestaurant();
                        this.packageModel = {};
                        this.submitted = false;
                    } else {
                        modal.somethingAlert(res.msg);
                    }
                }.bind(this));
            },
            cancel: function() {
                this.submitted = false;
                packageSelect.dishesListGroupByClassify = {};
                packageSelect.dishesInClassify = [];
                $('#packageDialog').modal('hide');
                this.packageModel = { dishesNum: undefined };
            }
        }
    });

    var dishesClassifyEdit = new Vue({
        el: '#dishesClassifyEditDialog',
        data: {
            dishesClassify: {},
            submitted: false
        },
        methods: {
            changeDishesClassify: function() {
                this.submitted = true;
                if (this.$isNull(this.dishesClassify.name) || (parseInt(this.dishesClassify.sequence) !== Number(this.dishesClassify.sequence) || parseInt(this.dishesClassify.sequence) < 1 || parseInt(this.dishesClassify.sequence) > 255 )) {
                    return
                }
                AJAXService.ajaxWithToken('POST', '/catering/changeDishesClassify', Object.assign({}, this.dishesClassify, { restId: restId }), function(res) {
                    if (res.code === 1) {
                        dishesClassify.getDishesClassify();
                        this.dishesClassify = {};
                        this.submitted = false;
                        $('#dishesClassifyEditDialog').modal('hide');
                    } else {
                        modal.somethingAlert(res.msg);
                    }
                }.bind(this))
            },
            cancel: function() {
                this.dishesClassify = {};
                this.submitted = false;
                $('#dishesClassifyEditDialog').modal('hide');
            }
        }
    })
});
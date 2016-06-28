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

$(function() {
    header.showHeader();
    leftMenu.showLeftMenu();
    restaurantMenu.render();
    util.mainContainer();
    modal.centerModals();
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
                if (this.packageSelected) {
                    params.packageId = this.packageSelected.categoryId;
                }
                if (this.dishesSelected) {
                    params.categoryId = this.dishesSelected.categoryId;
                }
                AJAXService.ajaxWithToken('POST', '/catering/deleteDishesForRestaurant',
                    params,
                    function(res) {
                        if (res.code === 1) {
                            this.getPackagesAndDishesFromRestaurant();
                        } else {
                            modal.somethingAlert(res.msg);
                        }
                    }.bind(this))
            },

            modifyState: function() {
                var id;
                var state;
                if (this.dishesSelected) {
                    id = this.dishesSelected.categoryId;
                    state = this.dishesSelected.onDirectSaleState === 0 ? 1 : 0;
                } else if (this.packageSelected) {
                    id = this.packageSelected.categoryId;
                    state = this.packageSelected.onDirectSaleState === 0 ? 1 : 0;
                }
                AJAXService.ajaxWithToken('POST', '/category/modifyStatePC',
                    { id: id, state: state, channelId: 5 },
                    function(res) {
                        if (res.code === 1) {
                            this.getPackagesAndDishesFromRestaurant();
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
            dishesClassifyList: []
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
                var params = Object.assign({}, this.dishes);
                params.restId = restId;
                var url = this.dishes.categoryId ? '/catering/modifyDishesForRestaurant' : '/catering/addDishesForRestaurant';
                AJAXService.ajaxWithToken('POST', url, params, function(result) {
                    if (result.code === 1) {
                        main.getPackagesAndDishesFromRestaurant();
                        $('#dishesDialog').modal('hide');
                    } else {
                        modal.somethingAlert(result.msg);
                    }
                }.bind(this));
            },
            cancel: function() {
                this.dishes = {};
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
            classifyOffset: 0
        },
        methods: {
            getAllDishesFromRest: function() {
                AJAXService.ajaxWithToken('GET', '/catering/getAllDishesFromRest', { restId: restId, packageId: packageVM.packageModel.categoryId }, function(res) {
                    if (res.code === 1) {
                        this.dishesInPackageList = res.data.dishesInPackageList;
                        res.data.dishesNumAndTypeList.map(function(el) {
                            if (!this.dishesListGroupByClassify[el.dishesClassify]) {
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
                var list = this.dishesInPackageList.filter(function(el) {
                    return el.categoryId === id;
                });
                if (list.length) {
                    return true;                    
                }
            },
            selectDishes: function(dishes) {
                if (this.isSelected(dishes.categoryId)) {
                    dishes.amount = 1;
                    this.dishesInPackageList.map(function(el, index) {
                        if (el.categoryId === dishes.categoryId) {
                            this.dishesInPackageList.splice(index, 1);
                        }
                    }.bind(this));
                } else {
                    this.dishesInPackageList.push(Object.assign({}, dishes, {amount: 1}));
                }
            },
            changePackageDishes: function() {
                packageVM.packageModel.dishesReq = this.dishesInPackageList;
                $('#packageSelectDialog').modal('hide');
            },
            decreaseDishesNum: function(dishes) {
                if (dishes.amount <= 0) {
                    dishes.amount = 0;
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
            cancel: function() {
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
            }
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
                var url = this.packageModel.categoryId ? '/catering/modifyPackages' : '/catering/addPackages';
                var param = Object.assign({}, this.packageModel, { restId: restId, packageId: this.packageModel.categoryId, dishesReq: JSON.stringify(this.packageModel.dishesReq) });
                AJAXService.ajaxWithToken('POST', url, param, function(res) {
                    if (res.code === 1) {
                        $('#packageDialog').modal('hide');
                        main.getPackagesAndDishesFromRestaurant();
                        this.packageModel = {};
                    } else {
                        modal.somethingAlert(res.msg);
                    }
                }.bind(this));
            },
            cancel: function() {
                $('#packageDialog').modal('hide');
                this.packageModel = { dishesNum: undefined };
            }
        }
    });

    var dishesClassifyEdit = new Vue({
        el: '#dishesClassifyEditDialog',
        data: {
            dishesClassify: {}
        },
        methods: {
            changeDishesClassify: function() {
                AJAXService.ajaxWithToken('POST', '/catering/changeDishesClassify', Object.assign({}, this.dishesClassify, { restId: restId }), function(res) {
                    if (res.code === 1) {
                        dishesClassify.getDishesClassify();
                        this.dishesClassify = {};
                        $('#dishesClassifyEditDialog').modal('hide');
                    } else {
                        modal.somethingAlert(res.msg);
                    }
                }.bind(this))
            },
            cancel: function() {
                this.dishesClassify = {};
                $('#dishesClassifyEditDialog').modal('hide');
            }
        }
    })
});
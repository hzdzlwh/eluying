/**
 * Created by Administrator on 2016/1/25.
 */
var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
var floatInfo = require("floatInfo");



var shopList = {

    list: [],

    categoryList: [],

    //读取商超列表
    loadShopList: function () {
        $.ajax({
            url: AJAXService.getUrl('getShopList'),
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function (result) {
                shopList.list = result.data.list;
                shopList.render();
            }
        });
    },

    loadShopCategory: function() {
        $.ajax({
            url: AJAXService.getUrl('getShopCategory'),
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function (result) {
                shopList.categoryList = result.data.list;
                shopList.renderCategory();
            }
        });
    },

    render: function() {
        var list = [];
        var showCategories = [];
        var str = '';
        if ($('.check').length !== 0) {
            $('.check').each(function(index, el) {
                if ($(el).css('visibility') === 'visible') {
                    showCategories.push($(el).parent().attr('data-id'));
                }
            });
            console.log(showCategories);

            $.each(this.list, function(index, el) {
                $.each(showCategories, function(index ,id) {
                    if (el.goodstypeId == id) {
                        list.push(el);
                    }
                })
            });
        } else {
            list = this.list;
        }
        $.each(list, function(index, element) {
            str += '<tr class="mainClass" data-id="' + element.id + '" data-categoryId="' + element.goodstypeId + '">' +
                '<td class="gridMore">' + element.name + '</td>' +
                '<td>' + element.shortName + '</td>' +
                '<td>' + element.goodstypeName + '</td>' +
                '<td>' + element.unit + '</td>' +
                '<td>' + element.price + '</td>' +
                '<td>' + element.brand + '</td>' +
                '<td class="gridMore">' + element.description + '</td></tr>';
        });
        $('.categoryGrid').find('tbody').html(str);
        $('.editShopButton').parent().addClass('hide');
        $('.deleteGoodButton').parent().addClass('hide');
    },

    deleteGood: function () {
        var id = $(".mainActive").attr('data-id');
        $.ajax({
            url: AJAXService.getUrl("deleteGood"),
            data: {id: id},
            success: function (result) {
                if (!util.errorHandler(result)) {
                    return;
                }
                $.each(shopList.list, function (index, element) {
                    if (element.id == id) {
                        shopList.list.splice(index, 1);
                        return false; //等于break
                    }
                });
                shopList.render();
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            }
        });
    },

    renderCategory: function() {
        var str = '';
        $.each(shopList.categoryList, function(index, element) {
            str += '<li data-id="' + element.goodstypeId + '"><img class="check" src="/static/image/check.png">' + element.goodstypeName + '</li>';

        });
        //因为可能修改了品类，所以先重写，再追加
        $('.categoryGrid').find('.selectList').html('<li id="selectSwitch">筛选商品类型<img src="/static/image/download.png"></li>');
        $('.categoryGrid').find('.selectList').append(str);
    },

    events: {
        'mouseenter #selectCategory': function() {
            $('.selectList').removeClass('hide');
        },
        "mouseleave .categoryGrid .selectList": function() {
            $('.selectList').addClass('hide');
        },
        'click .categoryGrid #selectSwitch': function() {
            //$('.selectList').toggleClass('hide');
        },
        "click .categoryGrid .mainClass": function() {
            $(".mainActive").removeClass("mainActive");
            $(this).addClass("mainActive");
            $(".mainOperate .operateItem").removeClass("hide");
        },
        'click .selectList li': function() {
            if ($(this).find('img').css('visibility') === 'visible') {
                $(this).find('img').css('visibility', 'hidden');
            } else {
                $(this).find('img').css('visibility', 'visible');
            }
            shopList.render()

        },
        "mouseenter .categoryGrid .gridMore": function() {
            floatInfo.showMoreInfo(event, this);
        },
        "mouseleave .categoryGrid .gridMore": function() {
            floatInfo.hideMoreInfo(event, this)
        },



        //删除一个商品
        'click .deleteGoodButton': function () {
            var confirmCallback = shopList.deleteGood;
            var dialogConfig = {title: "提示", message: "您确定要删除吗？"};
            modal.confirmDialog(dialogConfig, confirmCallback);
        }
    }

};

module.exports = shopList;
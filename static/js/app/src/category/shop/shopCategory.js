/**
 * Created by Administrator on 2016/1/25.
 */
var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
var shopList = require('./shopList');

var shopCategory = {

    list: [],

    loadShopCategory: function() {
        $.ajax({
            url: AJAXService.getUrl('getShopCategory'),
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function (result) {
                shopCategory.list = result.data.list;
                shopCategory.render();
            }
        });
    },



    editCategory: function(that, item) {
        $.ajax({
            url: AJAXService.getUrl('editCategory'),
            data: {subList: JSON.stringify(item)},
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function (result) {
                if (util.errorHandler(result)) {
                    modal.clearModal(that);
                } else {
                    return;
                }
                shopList.loadShopCategory();
                shopList.loadShopList();
            }
        });
    },

    render: function() {
        var str = '';
        $.each(shopCategory.list, function(index, element) {
            if (element.goodstypeId !== 1) {
                str += '<tr class="mainClass" data-status="0" data-id="' + element.goodstypeId + '"><td>' + element.goodstypeName + '</td></tr>'
            }
        });
        $('.manageShopCategory tbody').html(str);

    },

    events: {

        //点击类型管理
        'click .manageShopCategoryButton': function() {
            shopCategory.loadShopCategory();
        },

        'click .manageShopCategory .mainClass': function() {
            $(".manageShopCategory .mainClass").removeClass("mainActive");
            $(this).addClass("mainActive");
            $(".manageShopCategory .operateItem").removeClass("hide");
        },

        //点击新增
        'click #createCategory .btn-ok': function() {
            if (!$("#createCategory form").valid()) {
                return;
            }
            $('#categoryName').val();
            var str = '<tr class="mainClass" data-status="0"><td>' + $('#categoryName').val() + '</td></tr>';
            $('.manageShopCategory tbody').append(str);
            $("#createCategory").modal("hide");
            $("#createCategory").find("input").val("");
        },

        //子类删除按钮
        "click #shopCategoryDelete": function () {
            $("#manageShopCategory tr.mainActive").attr('data-status', '1');
            $("#manageShopCategory tr.mainActive").hide();
            $("#manageShopCategory tr.mainActive").removeClass("mainActive");
            $("#manageShopCategory .operateItem").addClass("hide");
        },

        //点击编辑
        'click #shopCategoryEdit': function () {
            $('#editCategoryName').val($("#manageShopCategory tr.mainActive").find('td').html());
        },

        //编辑确认
        'click #editOneCategory .btn-ok': function () {
            if (!$("#editOneCategory form").valid()) {
                return;
            }
            $("#manageShopCategory tr.mainActive").find('td').html($('#editCategoryName').val());
            $("#editOneCategory").modal("hide");
            $("#editOneCategory").find("input").val("");
        },

        //子类管理确认提交
        'click #manageShopCategory .btn-ok': function () {
            var that = this;
            var data = [];
            //把编辑好的子类放进data里
            $('#manageShopCategory .mainClass').each(function(index, el) {
                data.push({
                    goodstypeName: $(el).find('td').html(),
                    id: $(el).attr('data-id'),
                    status: $(el).attr('data-status')
                })
            });
            shopCategory.editCategory(that, data);
        }

    },

};

module.exports = shopCategory;
/**
 * Created by lingchenxuan on 16/1/10.
 */
import http from 'http';
var util = require("util");
var modal = require("modal");
var floatInfo = require("floatInfo");

var foodCategoryList = {
    render: function () {
        var str = "";
        $.each(foodCategoryList.list, function (index, element) {
            var state = element.state ? '已上架' : '未上架';
            str += "<tr class='mainClass'>" +
                "<td class='gridMore'>" + element.name + "</td>" +
                "<td>" + element.shortName + "</td>" +
                "<td>" + element.unit + "</td>" +
                "<td>" + element.fitNum + "</td>" +
                "<td>" + element.inventory + "</td>" +
                "<td>" + element.price + "</td>" +
                "<td class='gridMore'>" + element.description + "</td>" +
                "<td>" + state + "</td>" +
                "<input type='hidden' class='state' value=" + element.state + " />" +
                "<input type='hidden' class='id' value=" + element.id + " /></tr>";
        });
        $(".categoryGrid tbody").html(str);
        $(".mainOperate .operateItem").addClass("hide");
        $(".mainOperate .second").addClass("hide");

    },

    //读取餐饮品类列表
    loadFoodCategoryList: function () {
        http.get("pullOtherCategoryListUrl",{type: 1})
            .then(function (result) {
                foodCategoryList.list = result.data.list;
                foodCategoryList.render();
            });
    },

    //上架或者下架
    modifyState: function (item) {
        http.get('/category/modifyStatePC',item)
            .then(function (result) {
                $.each(foodCategoryList.list, function (index, element) {
                    if (element.id == item.id) {
                        foodCategoryList.list[index].state = item.state;
                        return false; //等于break
                    }
                });
                foodCategoryList.render();
            });
    },

    //删除
    deleteFoodCategory: function () {
        var id = $(".mainActive .id").val();
        http.post("deleteOtherCategoryUrl",{id: id})
            .then(function (result) {
                $.each(foodCategoryList.list, function (index, element) {
                    if (element.id == id) {
                        foodCategoryList.list.splice(index, 1);
                        return false; //等于break
                    }
                });
                foodCategoryList.render();
            });
    },
    events: {
        "click .categoryGrid .mainClass": function () {
            $(".mainClass").removeClass("mainActive");
            $(".subclass").removeClass("subActive");
            $(this).addClass("mainActive");
            $(".mainOperate .operateItem").removeClass("hide");
            $(".mainOperate .second").removeClass("hide");
            if ($(this).find(".state").val() == 0) {
                $(".xiajia").addClass("hide");
            } else {
                $(".shangjia").addClass("hide");
            }
        },
        "mouseenter .categoryGrid .gridMore": function () {
            floatInfo.showMoreInfo(event, this);
        },
        "mouseleave .categoryGrid .gridMore": function () {
            floatInfo.hideMoreInfo(event, this)
        },
        "click #modifyStateButton": function () {
            var item = {
                id: $(".mainActive .id").val(),
                state: 1 - $(".mainActive .state").val()
            };
            foodCategoryList.modifyState(item);
        },
        "click #deleteFoodButton": function () {
            confirmCallback = foodCategoryList.deleteFoodCategory;
            dialogConfig = {title: "提示", message: "您确定要删除吗？"};
            modal.confirmDialog(dialogConfig, confirmCallback);
        },
//上架或下架
        "click .modifyStateButton": function () {
            var item = {
                id: $(".mainActive .id").val(),
                state: 1 - $(".mainActive .state").val(),
                channelId: 5,
            };
            foodCategoryList.modifyState(item);
        }
    }
};

module.exports = foodCategoryList;
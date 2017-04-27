/**
 * Created by lingchenxuan on 16/1/10.
 */
import http from 'http';
var util = require("util");
var modal = require("modal");
var foodCategoryList = require("./foodCategoryList");

var editFoodBasic = {
    //编辑基本信息
    editFoodCategory: function (that) {
        var item = {
            id: $(".mainActive .id").val(),
            name: $("#editFoodName").val(),
            shortName: $("#editFoodShortName").val(),
            unit: $("#editFoodUnit").val(),
            fitNum: $("#editFoodFitNum").val(),
            inventory: $("#editFoodInventory").val(),
            price: $("#editFoodPrice").val(),
            description: $("#editFoodDescription").val(),
            type: 1
        };
        /*$.ajax({
            url: http.getUrl("addOrEditExtraCategoryUrl"),
            type: "POST",
            data: item,
            dataFilter: function (result) {
                return http.sessionValidate(result);
            },
            success: function (result) {
                if (util.errorHandler(result)) {
                    modal.clearModal(that);
                } else {
                    return;
                }
                $.each(foodCategoryList.list, function (index, element) {
                    if (element.id == item.id) {
                        var state = foodCategoryList.list[index].state;
                        foodCategoryList.list[index] = item;
                        foodCategoryList.list[index].state = state;
                        return false; //等于break
                    }
                });
                foodCategoryList.render();
            }
        })*/
        http.post("addOrEditExtraCategoryUrl",item)
            .then(function (result) {
                modal.clearModal(that);
                $.each(foodCategoryList.list, function (index, element) {
                    if (element.id == item.id) {
                        var state = foodCategoryList.list[index].state;
                        foodCategoryList.list[index] = item;
                        foodCategoryList.list[index].state = state;
                        return false; //等于break
                    }
                });
                foodCategoryList.render();
            });
    },
    events: {
        "click #editFoodOk": function () {
            if (!$("#editFood form").valid()) {
                return;
            }
            var that = this;
            editFoodBasic.editFoodCategory(that);
        },
        "click #editFoodButton": function () {
            $("#editFoodName").val($(".mainActive td:eq(0)").html());
            $("#editFoodShortName").val($(".mainActive td:eq(1)").html());
            $("#editFoodUnit").val($(".mainActive td:eq(2)").html());
            $("#editFoodFitNum").val($(".mainActive td:eq(3)").html());
            $("#editFoodInventory").val($(".mainActive td:eq(4)").html());
            $("#editFoodPrice").val($(".mainActive td:eq(5)").html());
            $("#editFoodDescription").val($(".mainActive td:eq(6)").html());
        }
    }
};

module.exports = editFoodBasic;

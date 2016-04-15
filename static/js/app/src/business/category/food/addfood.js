/**
 * Created by lingchenxuan on 16/1/10.
 */
var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
var foodCategoryList = require("./foodCategoryList");
var addFood = {
    //添加
    addFoodCategory: function (that) {
        var item = {
            name: $("#createFoodName").val(),
            shortName: $("#createFoodShortName").val(),
            unit: $("#createFoodUnit").val(),
            fitNum: $("#createFoodFitNum").val(),
            inventory: $("#createFoodInventory").val(),
            price: $("#createFoodPrice").val(),
            description: $("#createFoodDescription").val(),
            type: 1
        };
        /*$.ajax({
            url: AJAXService.getUrl("addOrEditExtraCategoryUrl"),
            type: "POST",
            data: item,
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function (result) {
                if (util.errorHandler(result)) {
                    modal.clearModal(that);
                } else {
                    return;
                }
                item.id = result.data.id;
                item.state = 0;
                foodCategoryList.list.push(item);
                foodCategoryList.render();
            }
        })*/
        AJAXService.ajaxWithToken("POST","addOrEditExtraCategoryUrl",item,function (result) {
            if (util.errorHandler(result)) {
                modal.clearModal(that);
            } else {
                return;
            }
            item.id = result.data.id;
            item.state = 0;
            foodCategoryList.list.push(item);
            foodCategoryList.render();
        });
    },
    events: {
        "click #createFoodOk": function () {
            if (!$("#createFood form").valid()) {
                return;
            }
            var that = this;
            addFood.addFoodCategory(that);
        }
    }
};

module.exports = addFood;

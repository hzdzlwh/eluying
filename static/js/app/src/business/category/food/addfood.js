/**
 * Created by lingchenxuan on 16/1/10.
 */
import http from 'http';
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
        http.post("addOrEditExtraCategoryUrl",item)
            .then(function(result) {
                modal.clearModal(that);
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

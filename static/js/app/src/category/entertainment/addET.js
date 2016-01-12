/**
 * Created by lingchenxuan on 16/1/10.
 */
var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
var ETCategoryList = require("./ETCategoryList");
var addET = {
    //添加
    addETCategory: function (that) {
        var item = {
            name: $("#createETName").val(),
            shortName: $("#createETShortName").val(),
            unit: $("#createETUnit").val(),
            fitNum: $("#createETFitNum").val(),
            inventory: $("#createETInventory").val(),
            price: $("#createETPrice").val(),
            description: $("#createETDescription").val(),
            type: 0
        };
        $.ajax({
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
                ETCategoryList.list.push(item);
                ETCategoryList.render();
            }
        })
    },
    events: {
        "click #createETOk": function () {
            if (!$("#createEnt form").valid()) {
                return;
            }
            var that = this;
            addET.addETCategory(that);
        }
    }
};

module.exports = addET;

import http from 'http';
var util = require("util");
var modal = require("modal");
var roomCategoryList = require("roomCategoryList");
require("validate");
var editRoomBasic = {

    //编辑房型基本信息
    editRoomBasic: function (that, item) {
        http.post("editRoomBasicUrl",item)
            .then(function (result) {
                modal.clearModal(that);
                $.each(roomCategoryList.list, function (index, element) {
                    if (element.id == item.id) {
                        for (var name in item) {
                            roomCategoryList.list[index][name] = item[name];
                        }
                        return false; //等于break
                    }
                });
                roomCategoryList.render();
            });
    },
    events: {
        //点击编辑房型基本信息
        "click #editBasicInfoButton": function () {
            $("#editRoomName").val($(".mainActive td:eq(0) span").html());
            $("#editRoomShortName").val($(".mainActive td:eq(1)").html());
            $("#editRoomPrice").val($(".mainActive td:eq(5)").html());
            $("#editRoomFitNum").val($(".mainActive td:eq(3)").html());
            $("#editRoomUnit").val($(".mainActive td:eq(2)").html());
        },

        //点击编辑房型基本信息确认按钮
        "click #editRoomBasicOk": function () {
            if (!$("#editBasicInfo form").valid()) {
                return;
            }
            var that = this;
            var item = {
                name: $("#editRoomName").val(),
                shortName: $("#editRoomShortName").val(),
                price: $("#editRoomPrice").val(),
                fitNum: $("#editRoomFitNum").val(),
                unit: $("#editRoomUnit").val(),
                id: $(".mainActive .id").val()
            };
            editRoomBasic.editRoomBasic(that, item);
        },
    }
};

module.exports = editRoomBasic;
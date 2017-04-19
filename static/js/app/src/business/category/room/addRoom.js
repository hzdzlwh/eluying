import http from 'http';
var modal = require("modal");
var util = require("util");
var roomCategoryList = require("roomCategoryList");
require("validate");
var addRoom = {
    //新增房型
    addRoom: function (data, that) {
        data.subTypeList = JSON.stringify(data.subTypeList);
        http.post("addAccommodationUrl",data)
            .then(function (result) {
                modal.clearModal(that);
                data.subTypeList = result.data.subTypeList;
                data.state = 0;
                data.id = result.data.id;
                roomCategoryList.list.push(data);
                roomCategoryList.render();
            });
    },
    events: {
        //新增房型确认按钮
        "click #createRoomOk": function () {
            if (!$("#createRoom form").valid()) {
                return;
            }
            var that = this;
            var subList = [];
            $("#createRoom tbody tr").each(function () {
                subList.push({
                    name: $(this).find("td:eq(0)").html(),
                    shortName: $(this).find("td:eq(1)").html(),
                    inventory: $(this).find("td:eq(2)").html()
                });
            });
            if (subList.length == 0) {
                subList.push({
                    name: $("#createRoomName").val(),
                    shortName: $("#createRoomShortName").val(),
                    inventory: $("#createRoomInventory").val()
                });
            }
            var data = {
                name: $("#createRoomName").val(),
                shortName: $("#createRoomShortName").val(),
                price: $("#createRoomPrice").val(),
                fitNum: $("#createRoomFitNum").val(),
                unit: $("#createRoomUnit").val(),
                inventory: $("#createRoomInventory").val(),
                subTypeList: subList
            };
            addRoom.addRoom(data, that);
        },

//新增房型的时候编辑子类按钮
        "click #createRoomEdit": function () {
            $("#editSubclassName").val($("#createRoom tbody tr.mainActive").find("td:eq(0)").html());
            $("#editSubclassShortName").val($("#createRoom tbody tr.mainActive").find("td:eq(1)").html());
            $("#editSubclassInventory").val($("#createRoom tbody tr.mainActive").find("td:eq(2)").html());
        },

//新增房型的时候删除子类按钮
        "click #createRoomDelete": function () {
            $("#createRoom tbody tr.mainActive").remove();
        },
        "click #createRoomButton": function () {
            $("#createRoom tbody").html("");
        }
    }
};

module.exports = addRoom;
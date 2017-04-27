import http from 'http';
var util = require("util");
var modal = require("modal");
var roomCategoryList = require("roomCategoryList");


var subRoom = {

    //读取子房间
    loadSubRoom: function (id) {
        var str = "";
        /*$.ajax({
            url: http.getUrl("loadSubRoomUrl"),
            data: {id: id},
            success: function (result) {
                $.each(result.data.list, function (index, element) {
                    str += "<div class='room'><img src='/static/image/ic_close.png' /><p>"
                        + element.serialNum + "</p>"
                        + "<input type='text' class='hide editName' value='' maxlength='8'>"
                        + "<input type='hidden' class='id' value='" + element.id + "' /><input type='hidden' value='0' class='status'></div>"
                });
                $(".roomContainer").html(str);
                //点击子类房间名
                $("#editRoom .room p").on("click", function () {
                    $(this).next(".editName").removeClass("hide").focus().val($(this).html());
                });
                $("#editRoom .editName").on("blur", function () {
                    $(this).addClass("hide");
                    $(this).parent(".room").find("p").html($(this).val());
                });
                $("#editRoom img").on("click", function () {
                    $(this).parent(".room").addClass("hide");
                    $(this).parent(".room").find(".status").val("1");
                });
            },
            dataFilter: function (result) {
                return http.sessionValidate(result);
            }
        })*/
        http.post("loadSubRoomUrl",{id: id})
            .then(function (result) {
                $.each(result.data.list, function (index, element) {
                    str += "<div class='room'><img src='/static/image/ic_close.png' /><p>"
                        + element.serialNum + "</p>"
                        + "<input type='text' class='hide editName' value='' maxlength='8'>"
                        + "<input type='hidden' class='id' value='" + element.id + "' /><input type='hidden' value='0' class='status'></div>"
                });
                $(".roomContainer").html(str);
                //点击子类房间名
                $("#editRoom .room p").on("click", function () {
                    $(this).next(".editName").removeClass("hide").focus().val($(this).html());
                });
                $("#editRoom .editName").on("blur", function () {
                    $(this).addClass("hide");
                    $(this).parent(".room").find("p").html($(this).val());
                });
                $("#editRoom img").on("click", function () {
                    $(this).parent(".room").addClass("hide");
                    $(this).parent(".room").find(".status").val("1");
                });
            });
    },

    //房间编辑
    editSubRoom: function (that, item) {
        /*$.ajax({
            url: http.getUrl("editSubRoomUrl"),
            data: {rooms: JSON.stringify(item)},
            type: "POST",
            dataFilter: function (result) {
                return http.sessionValidate(result);
            },
            success: function (result) {
                if (util.errorHandler(result)) {
                    modal.clearModal(that);
                } else {
                    return;
                }
                $("#editRoom .roomContainer").html("");
                var inventory = 0;
                $.each(item, function (index, elemet) {
                    if (elemet.status == 0) {
                        inventory++;
                    }
                });
                $.each(roomCategoryList.list, function (index, element) {
                    $.each(element.subTypeList, function (index, element) {
                        if (element.id == $(".subActive").find(".id").val()) {
                            element.inventory = inventory;
                        }
                    });
                });
                roomCategoryList.countInventory($(".mainActive").find(".id").val());
                roomCategoryList.render();
            }
        })*/
        http.post("editSubRoomUrl",{rooms: JSON.stringify(item)})
            .then(function (result) {
                modal.clearModal(that);
                $("#editRoom .roomContainer").html("");
                var inventory = 0;
                $.each(item, function (index, elemet) {
                    if (elemet.status == 0) {
                        inventory++;
                    }
                });
                $.each(roomCategoryList.list, function (index, element) {
                    $.each(element.subTypeList, function (index, element) {
                        if (element.id == $(".subActive").find(".id").val()) {
                            element.inventory = inventory;
                        }
                    });
                });
                roomCategoryList.countInventory($(".mainActive").find(".id").val());
                roomCategoryList.render();
            });
    },
    events: {
        //点击编辑房间
        "click #editSubRoomButton": function () {
            var id = $(".subActive .id").val();
            subRoom.loadSubRoom(id);
        },

//编辑房间确定
        "click #editRoomOk": function () {
            var that = this;
            var rooms = [];
            $(".room").each(function () {
                rooms.push({
                    id: $(this).find(".id").val(),
                    serialNum: $(this).find("p").html(),
                    status: $(this).find(".status").val()
                });
            });
            subRoom.editSubRoom(that, rooms);
        }

    }
};

module.exports = subRoom;

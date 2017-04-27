import http from 'http';
var util = require("util");
var modal = require("modal");
var roomCategoryList = require("roomCategoryList");

var subclassManage = {
    //子类管理
    subclassManage: function (that, item) {
        /*$.ajax({
            url: http.getUrl("subclassManageUrl"),
            type: "POST",
            data: {
                id: item.id,
                subTypeList: JSON.stringify(item.subTypeList)
            },
            dataFilter: function (result) {
                return http.sessionValidate(result);
            },
            success: function (result) {
                if (util.errorHandler(result)) {
                    modal.clearModal(that);
                } else {
                    return;
                }
                $.each(roomCategoryList.list, function (index, element) {
                    if (element.id == item.id) {
                        roomCategoryList.list[index].subTypeList = result.data.list;
                        return false; //等于break
                    }
                });
                roomCategoryList.countInventory(item.id);
                roomCategoryList.render();
            }
        })*/
        http.post("subclassManageUrl",{
            id: item.id,
            subTypeList: JSON.stringify(item.subTypeList)
        })
            .then(function (result) {
                modal.clearModal(that);
                $.each(roomCategoryList.list, function (index, element) {
                    if (element.id == item.id) {
                        roomCategoryList.list[index].subTypeList = result.data.list;
                        return false; //等于break
                    }
                });
                roomCategoryList.countInventory(item.id);
                roomCategoryList.render();
            });
    },
    events: {
        //点击子类管理按钮
        "click #subclassManageButton": function () {
            var str = "";
            $(".mainActive").nextUntil(".mainClass").each(function () {
                str += "<tr class='mainClass'><td>" + $(this).find("td:eq(0) div").html()
                    + "</td><td>" + $(this).find("td:eq(1) div").html() + "</td><td>" + $(this).find("td:eq(4) div").html() + "</td>"
                    + "<input type='hidden' class='id' value='" + $(this).find(".id").val()
                    + "'><input type='hidden' class='status' value='0'></tr>"
            });
            $("#subclassManagement").find("tbody").html(str);
            $(".subclassManagement .mainClass").on("click", function () {
                $("#subclassManagement .mainClass").removeClass("mainActive");
                $(this).addClass("mainActive");
                $(".subclassManagement .operateItem").removeClass("hide");
            });
        },

//子类管理编辑信息
        "click #subManageEditButton": function () {
            $("#editSubclassName").val($("#subclassManagement tr.mainActive").find("td:eq(0)").html());
            $("#editSubclassShortName").val($("#subclassManagement tr.mainActive").find("td:eq(1)").html());
            $("#editSubclassInventory").val($("#subclassManagement tr.mainActive").find("td:eq(2)").html());
        },

//子类删除按钮
        "click #deleteSubclassButton": function () {
            $("#subclassManagement tr.mainActive .status").val("1");
            $("#subclassManagement tr.mainActive").hide();
            $("#subclassManagement tr.mainActive").removeClass("mainActive");
            $("#subclassManagement .operateItem").addClass("hide");
        },

//子类管理确认按钮
        "click #subclassManagementOk": function () {
            var subTypeList = [];
            var that = this;
            $("#subclassManagement .mainClass").each(function () {
                subTypeList.push({
                    id: $(this).find(".id").val(),
                    inventory: $(this).find("td:eq(2)").html(),
                    name: $(this).find("td:eq(0)").html(),
                    shortName: $(this).find("td:eq(1)").html(),
                    status: $(this).find(".status").val()
                })
            });
            var item = {
                id: $("#roomCategoryList .mainActive .id").val(),
                subTypeList: subTypeList
            };
            subclassManage.subclassManage(that, item);
        },
//点击新增子类的确定按钮
        "click #createSubclassOk": function () {
            if (!$("#createSubclass form").valid()) {
                return;
            }
            $("#createRoom tbody").append("<tr class='mainClass'><td>" + $("#createSubclassName").val()
                + "</td><td>" + $("#createSubclassShortName").val() + "</td><td>" + $("#createSubclassInventory").val() + "</td></tr>");
            $("#subclassManagement tbody").append("<tr class='mainClass'><td>" + $("#createSubclassName").val()
                + "</td><td>" + $("#createSubclassShortName").val() + "</td><td>" + $("#createSubclassInventory").val()
                + "</td><input class='id' type='hidden'><input class='status' type='hidden' value='0'></tr>");
            $(".subclassManagement .mainClass").on("click", function () {
                $("#subclassManagement .mainClass").removeClass("mainActive");
                $(this).addClass("mainActive");
                $(".subclassManagement .operateItem").removeClass("hide");
            });
            $("#createRoom tr").on("click", function () {
                $("#createRoom .mainClass").removeClass("mainActive");
                $(this).addClass("mainActive");
                $("#createRoomEdit").parent().removeClass("hide");
                $("#createRoomDelete").parent().removeClass("hide");
            });
            $("#createSubclass").modal("hide");
            $("#createSubclass").find("input").val("");
        },
        //编辑子类确定按钮
        "click #editSubclassOk": function () {
            if (!$("#editSubclass form").valid()) {
                return;
            }
            var that = this;
            $("#createRoom tbody tr.mainActive").html("<td>" + $("#editSubclassName").val()
                + "</td><td>" + $("#editSubclassShortName").val() + "</td><td>" + $("#editSubclassInventory").val() + "</td>");
            $("#subclassManagement .mainActive td:eq(0)").html($("#editSubclassName").val());
            $("#subclassManagement .mainActive td:eq(1)").html($("#editSubclassShortName").val());
            $("#subclassManagement .mainActive td:eq(2)").html($("#editSubclassInventory").val());
            modal.clearModal(that);
        },
    }

};

module.exports = subclassManage;
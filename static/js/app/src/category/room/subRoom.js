/**
 * Created by Administrator on 2016/1/8.
 */

var subRoom = {

    //读取子房间
    loadSubRoom: function(id){
        var str = "";
        $.ajax({
            url: getUrl(loadSubRoomUrl),
            data: {id: id},
            success: function(result){
                $.each(result.data.list, function(index, element){
                    str += "<div class='room'><img src='/static/image/ic_close.png' /><p>"
                        + element.serialNum + "</p>"
                        + "<input type='text' class='hide editName' value='' maxlength='8'>"
                        + "<input type='hidden' class='id' value='" + element.id + "' /><input type='hidden' value='0' class='status'></div>"
                });
                $(".roomContainer").html(str);
                //点击子类房间名
                $("#editRoom .room p").on("click", function(){
                    $(this).next(".editName").removeClass("hide").focus().val($(this).html());
                });
                $("#editRoom .editName").on("blur", function(){
                    $(this).addClass("hide");
                    $(this).parent(".room").find("p").html($(this).val());
                });
                $("#editRoom img").on("click", function(){
                    $(this).parent(".room").addClass("hide");
                    $(this).parent(".room").find(".status").val("1");
                });
            },
            dataFilter: function (result) {
                result = JSON.parse(result); //先转为json
                sessionValidate(result);
                return JSON.stringify(result); //再转为字符串传回去
            }
        })
    },

    //房间编辑
    editSubRoom: function(that, item){
        $.ajax({
            url: getUrl(editSubRoomUrl),
            data: {rooms: JSON.stringify(item)},
            type: "POST",
            dataFilter: function(result) {
                result = JSON.parse(result); //先转为json
                sessionValidate(result);
                return JSON.stringify(result); //再转为字符串传回去
            },
            success: function(result){
                if (errorHandler(result)) {
                    clearModal(that);
                } else {
                    return;
                }
                $("#editRoom .roomContainer").html("");
                var inventory = 0;
                $.each(item, function(index, elemet){
                    if (elemet.status == 0) {
                        inventory ++;
                    }
                });
                $.each(roomCategoryList.list, function(index, element){
                    $.each(element.subTypeList, function(index, element){
                        if (element.id == $(".subActive").find(".id").val()) {
                            element.inventory = inventory;
                        }
                    });
                });
                roomCategoryList.countInventory($(".mainActive").find(".id").val());
                roomCategoryList.render();
            }
        })
    }
};

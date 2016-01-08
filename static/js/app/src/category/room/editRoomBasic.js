
var editRoomBasic = {

    //编辑房型基本信息
    editRoomBasic: function(that, item){
        $.ajax({
            url: getUrl(editRoomBasicUrl),
            type: "POST",
            data: item,
            success: function(result){
                if (errorHandler(result)) {
                    clearModal(that);
                } else {
                    return;
                }
                $.each(roomCategoryList.list, function(index, element){
                    if (element.id == item.id) {
                        for (var name in item) {
                            roomCategoryList.list[index][name] = item[name];
                        }
                        return false; //等于break
                    }
                });
                roomCategoryList.render();
            },
            dataFilter: function (result) {
                result = JSON.parse(result); //先转为json
                sessionValidate(result);
                return JSON.stringify(result); //再转为字符串传回去
            }
        });
    },
};
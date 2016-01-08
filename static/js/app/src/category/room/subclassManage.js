var subclassManage = {
    //子类管理
    subclassManage: function(that, item){
        $.ajax({
            url:  getUrl(subclassManageUrl),
            type: "POST",
            data: {
                id: item.id,
                subTypeList: JSON.stringify(item.subTypeList)
            },
            dataFilter: function (result) {
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
                $.each(roomCategoryList.list, function(index, element){
                    if (element.id == item.id) {
                        roomCategoryList.list[index].subTypeList = result.data.list;
                        return false; //等于break
                    }
                });
                roomCategoryList.countInventory(item.id);
                roomCategoryList.render();
            }
        })
    },
};
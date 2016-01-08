

var addRoom = {
    //新增房型
    addRoom: function(data, that){
        data.subTypeList = JSON.stringify(data.subTypeList);
        $.ajax({
            url: getUrl(addAccommodationUrl),
            type: "POST",
            data: data,
            success: function(result){
                if (errorHandler(result)) {
                    clearModal(that);
                } else {
                    return;
                }
                data.subTypeList = result.data.subTypeList;
                data.state = 0;
                data.id = result.data.id;
                roomCategoryList.list.push(data);
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

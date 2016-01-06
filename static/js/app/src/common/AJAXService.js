require("cookie");
var AJAXService = {
    urls: {
        //测试服 http://121.41.109.105:8081/mg
        //宪伟服务器 http://192.168.0.2:8082/mg
        //var host = "http://121.41.109.105:8081/mg";
        //浩南服务器 http://192.168.0.118:8087
        host: "http://121.41.109.105:8081/mg",
        //var host = "/mg";
        loginUrl: "/user/login",
        getRoomCategoryListUrl: "/category/getRoomCategoryList",
        addAccommodationUrl: "/category/addAccommodation",
        pullOtherCategoryListUrl: "/category/pullOtherCategoryList",
        deleteOtherCategoryUrl: "/category/deleteOtherCategory",
        addOrEditExtraCategoryUrl: "/category/addOrEditOtherCategory",
        editRoomBasicUrl: "/category/modifyAccommodationBaseInfo",
        deleteRoomUrl: "/category/deleteAccommodationCategory",
        subclassManageUrl: "/category/modifySubCategory",
        loadSubRoomUrl: "/category/pullRoomList",
        editSubRoomUrl: "/category/modifyRooms",
        modifyStateUrl: "/category/modifyState",
        pullShowInfoUrl: "/category/pullShowInfo",
        uploadImageUrl: "/image/upload",
        editShowInfoUrl: "/category/modifyShowInfo",
        getAccommodationBasicInfo: "/price/getAccommodationBasicInfo",
        getAccommodationPriceList: "/price/getAccommodationPriceList",
        modifyAccommodationSpecialPrice: "/price/batchModifyAccommodationSpecialSalePrice",
        ModifyAccommodationSpecialChannelPrice: "/price/batchModifyAccommodationSpecialChannelPrice",
        getFoodCategoryPriceList: "/price/getFoodCategoryPriceList",
        getPlayCategoryPriceList: "/price/getPlayCategoryPriceList",
        modifyDefaultPrice: "/price/modifyDefaultPrice",
        getCampSeasons: "/price/getCampSeasons",
        getAccommodationPeriodicalPrice: "/price/getAccommodationPeriodicalPrice",
        modifyAccommodationPeriodicalSalePrice: "/price/modifyAccommodationPeriodicalSalePrice",
        modifyAccommodationPeriodicalChannelPrice: "/price/modifyAccommodationPeriodicalChannelPrice",
        modifyCampSeason: "/price/modifyCampSeason",
        logoutUrl: "/user/logout",
        getCategoriesAndInventoriesUrl: '/inventory/getCategoriesAndInventories',
        sendVerifyCodeUrl: '/user/sendVerifyCode',
        resetPasswordUrl: '/user/resetPassword',
        registerUrl: '/user/register',
        verifyUserNameUrl: '/user/verifyUserName',
        rewriteUrl: true
    },
    getUrl: function(path){
        var url = this.urls.host + this.urls[path];
        if (this.urls.rewriteUrl == true) {
            url += ";jsessionid=" + $.cookie("jsessionid");
        }
        return url;
    },
    sessionValidate: function(data){
        data = JSON.parse(data);
        if (data.code == 14) {
            location.href = "/eluyun/login.html";
        }
        return JSON.stringify(data);
}
};
module.exports = AJAXService;
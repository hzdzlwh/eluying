require("cookie");
var AJAXService = {
    urls: {
        //正式服务器 http://120.26.83.168:8081/mg
        //测试服 http://121.41.109.105:8081/mg
        //宪伟服务器 http://192.168.0.2:8082/mg
        //var host = "http://121.41.109.105:8081/mg";
        //浩南服务器 http://192.168.0.118:8087
        host: "http://121.41.109.105:8081/mg",
        host2: "http://121.41.109.105:8081/ws",
        //host: "/mg",
        //host: "http://120.26.83.168:8081/mg",
        //var host = "/mg";
        loginUrl: "/user/login",
        getRoomCategoryListUrl: "/category/getRoomCategoryList",
        addAccommodationUrl: "/category/addAccommodation",
        pullOtherCategoryListUrl: "/category/pullOtherCategoryList",
        deleteOtherCategoryUrl: "/category/deleteOtherCategory",
        subclassManageUrl: "/category/modifySubCategory",
        addOrEditExtraCategoryUrl: "/category/addOrEditOtherCategory",
        editRoomBasicUrl: "/category/modifyAccommodationBaseInfo",
        deleteRoomUrl: "/category/deleteAccommodationCategory",
        loadSubRoomUrl: "/category/pullRoomList",
        editSubRoomUrl: "/category/modifyRooms",
        modifyStateUrl: "/category/modifyState",
        pullShowInfoUrl: "/category/pullShowInfo",
        uploadImageUrl: "/image/upload",
        editShowInfoUrl: "/category/modifyShowInfo",
        getAccommodationBasicInfo: "/price/getAccommodationBasicInfo",
        getAccommodationPriceList: "/price/getAccommodationPriceList",
        ModifyAccommodationSpecialChannelPrice: "/price/batchModifyAccommodationSpecialChannelPrice",
        getFoodCategoryPriceList: "/price/getFoodCategoryPriceList",
        getPlayCategoryPriceList: "/price/getPlayCategoryPriceList",
        modifyDefaultPrice: "/price/modifyDefaultPrice",
        getCampSeasons: "/price/getCampSeasons",
        getAccommodationPeriodicalPrice: "/price/getAccommodationPeriodicalPrice",
        modifyAccommodationPeriodicalPrice: "/price/modifyAccommodationPeriodicalPrice",
        modifyCampSeason: "/price/modifyCampSeason",
        getAccommodationMonthPriceList: "/price/getAccommodationMonthPriceList",
        batchModifyAccommodationSpecialPrice: "/price/batchModifyAccommodationSpecialPrice",
        logoutUrl: "/user/logout",
        getCategoriesAndInventoriesUrl: '/inventory/getCategoriesAndInventories',
        getRoomsAndStatusUrl: '/inventory/getRoomsAndStatus',
        getRoomStatusUrl: '/inventory/getRoomStatus',
        modifyRoomStatusUrl: '/inventory/modifyRoomStatus',
        modifyExtraInventoryUrl: '/inventory/modifyExtraInventory',
        getCategoryInventoriesUrl: '/inventory/getCategoryInventories',
        modifyExtraServiceInventoryBatchUrl: '/inventory/modifyExtraServiceInventoryBatch',
        sendVerifyCodeUrl: '/user/sendVerifyCode',
        resetPasswordUrl: '/user/resetPassword',
        registerUrl: '/user/register',
        verifyUserNameUrl: '/user/verifyUserName',
        getShopList: '/category/getMarketGoodsList',
        getShopCategory: '/category/getGoodTypeInfo',
        editCategory: '/category/goodTypeOperation',
        deleteGood: '/category/deleteOneGood',
        addGood: '/category/addNewGood',
        editGood: '/category/editOneGood',
        rewriteUrl: true,
        getCampTypeUrl: '/directNet/getCampType',
        getBasicInfoUrl: '/directNet/getBasicInfo',
        editBasicInfoUrl: '/directNet/editBasicInfo',
        checkDirectNetOnlineUrl: '/directNet/checkDirectNetOnline',
        getOperationInfoUrl: '/directNet/getOperationInfo'
    },
    getUrl: function(path){
        var url = this.urls.host + (this.urls[path] || path);
        if (this.urls.rewriteUrl == true && $.cookie("jsessionid")) {
            url += ";jsessionid=" + $.cookie("jsessionid");
        }
        return url;
    },
    getUrl2: function(path){
        var url = this.urls.host2 + (this.urls[path] || path);
        return url;
    },
    ajaxWithToken: function(method, path, data, callback, errorCallback){
        data.campId = localStorage.getItem("campId");
        data.uid = localStorage.getItem("uid");
        data.token = localStorage.getItem("token");
        $.ajax({
            type: method,
            url: AJAXService.getUrl2(path),
            data: data,
            success: callback,
            error: errorCallback,
        });
    },
    ajaxWithTokenAngular: function($http, method, path, data, callback, errorCallback){
        data.campId = localStorage.getItem("campId");
        data.uid = localStorage.getItem("uid");
        data.token = localStorage.getItem("token");
        if(method === 'GET' || method === 'get'){
            $http.get(AJAXService.getUrl2(path), {
                params: data
            }).success(callback);
        }else if(method === 'POST' || method === 'post'){
            //TODO
        }
    },
    sessionValidate: function(data){
        data = JSON.parse(data);
        //if (data.code == 11002) {
        //    location.href = "/login.html";
        //}
        return JSON.stringify(data);
}
};
module.exports = AJAXService;
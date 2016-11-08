require("cookie");
var md5 = require("md5");
var AJAXService = {
    urls: {
        //正式服务器 http://120.26.83.168:8081/mg
        //测试服 http://121.41.109.105:8081/mg
        //宪伟服务器 http://192.168.0.2:8082/mg
        //var host = "http://121.41.109.105:8081/mg";
        //浩南服务器 http://192.168.0.118:8087
        host: process.env.NODE_ENV === 'production' ? "/mg" : "//www.dingdandao.com:1443/mg",
        host2: process.env.NODE_ENV === 'production' ? "/ws" : "//www.dingdandao.com:1443/ws",
        // host2: "http://192.168.0.124:8081/ws", //勉之测试服
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
        sendVerifyUrl: '/user/sendVerify',
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
        openCloseDirectNetUrl: '/directNet/openCloseDirectNet',
        modifyNoticeUrl: '/directNet/modifyNotice',
        getCampTypeUrl: '/directNet/getCampType',
        getBasicInfoUrl: '/directNet/getBasicInfo',
        editBasicInfoUrl: '/directNet/editBasicInfo',
        checkDirectNetOnlineUrl: '/directNet/checkDirectNetOnline',
        getOperationInfoUrl: '/directNet/getOperationInfo',
        selectPayWapUrl: '/directNet/selectPayWap',
        getPaymentMethodAndStateUrl: '/collectionMethod/getPaymentMethodAndState',
        bindAlipayAccountUrl: '/collectionMethod/bindAlipayAccount',
        newDeleteCollectionMethodUrl: '/collectionMethod/newDeleteCollectionMethod',
        getChannelsUrl: '/user/getChannels',
        removeChannelUrl: '/user/removeChannel',
        addChannelUrl: '/user/addChannel',
        getRoomsAndStausUrl: '/room/getRoomsAndStaus',
        getRoomCategoriesUrl: '/room/getRoomCategories',
        getItemsUrl: '/item/getItems',
        getInventoryUrl: '/item/getInventory',
        confirmOrderUrl: '/room/confirmOrder',
        getOrderDetailUrl: '/order/getOrderDetail',
        getRoomStausUrl: '/room/getRoomStaus',
        orderSearchUrl: '/order/search',
        orderSearchPCUrl: '/order/searchFormPc',
        orderModifyUrl: '/order/modify',
        finishPaymentUrl: '/cashier/finishPayment',
        applyWxPayUrl: '/collectionMethod/applyWxPay',
        orderCancelUrl: '/order/cancel',
        checkInOrCheckoutUrl: '/order/checkInOrCheckout',
        getRoomFeeUrl: '/order/getRoomFee',
        shopListUrl: '/shop/list',
        barcodePayUrl: '/cashier/barcodePay',
        getPayStatus4BarcodeUrl: '/cashier/getPayStatus4Barcode',
        getEmployeeDetailUrl: '/user/getEmployeeDetail',
        getCaterOrderDetailUrl: '/catering/getCaterOrderDetail',
        cateringCancelOrderUrl: '/catering/cancelOrder',
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
    ajaxWithToken: function(method, path, data, callback, errorCallback, asy, baseUrl){
        if(path !== 'loginUrl'){
            data.timestamp = (new Date()).valueOf();
            // data.version = (new Date()).valueOf();
            if(path !== '/homepage/changeCamp'){
                data.campId = localStorage.getItem("campId");
            }
            data.uid = localStorage.getItem("uid");
            //data.campId = 56;
            //data.uid = 85;
            // data.kick = true;
            data.terminal = 1;
            data.version = data.version || 8;
            // data.token = localStorage.getItem("token");
            var array = [];
            for(var key in data){
                array.push(data[key]);
            }
            array.push(localStorage.getItem("token"));
            array.sort();
            var str = array.join("");
            var strMD5 = md5(str);
            data.sign = strMD5;
        }
        return $.ajax({
            type: method,
            url: baseUrl ? baseUrl + path : AJAXService.getUrl2(path),
            async: asy,
            data: data,
            dataFilter: function(data){
                if(JSON.parse(data).code == 5){
                    window.localStorage.clear();
                    window.location.href = "/login.html";
                }
                return data;
            },
            success: callback,
            error: errorCallback
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
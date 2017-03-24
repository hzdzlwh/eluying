require("cookie");
import Raven from 'raven-js';
import modal from './modal';
var md5 = require("md5");

const spin = new modal.Spin();
var AJAXService = {
    urls: {
        host: process.env.NODE_ENV === 'production' ? "/mg" : (process.env.serverUrl + "/mg"),
        host2: process.env.NODE_ENV === 'production' ? "/ws" : (process.env.serverUrl + "/ws"),
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
        finishPaymentUrl: '/order/addOrderPayment',
        applyWxPayUrl: '/collectionMethod/applyWxPay',
        orderCancelUrl: '/order/cancel',
        checkInOrCheckoutUrl: '/order/checkInOrCheckout',
        getRoomFeeUrl: '/order/getRoomFee',
        shopListUrl: '/shop/list',
        barcodePayUrl: '/order/addOrderPayment',
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
        if (!data) {
            data = {};
        }

        if(path !== 'loginUrl'){
            data = this.getDataWithToken(data);
        }

        spin.addPending();

        const url = baseUrl ? baseUrl + path : AJAXService.getUrl2(path);
        return $.ajax({
            type: method,
            url: baseUrl ? baseUrl + path : AJAXService.getUrl2(path),
            async: asy,
            data: data,
            dataFilter: function(res) {
                const result = JSON.parse(res);
                if (result.code != 1) {
                    Raven.captureMessage('ajax error', {
                        extra: {
                            data: data,
                            res: result,
                            url: url
                        }
                    })
                }

                if (result.code == 5) {
                    window.localStorage.clear();
                    modal.alert('账号在别处登录。');
                    setTimeout(() => {
                        window.location.href = "/login.html";
                    }, 3000);
                }

                Raven.captureBreadcrumb({
                    message: 'related ajax',
                    category: 'ajax',
                    data: {
                        data: data,
                        res: result,
                        url: url
                    }
                });
                return res;
            },
            success: callback,
            error: function(e) {
                Raven.captureMessage('ajax fail', {
                    extra: {
                        data: data,
                        e: e,
                        url: url
                    }
                });

                errorCallback(e);
            }
        })
            .always(() => {
                spin.removePending();
            });
    },
    get(path, data) {
        return this.ajaxWithToken('GET', path, data);
    },
    post(path, data) {
        return this.ajaxWithToken('POST', path, data);
    },
    sessionValidate: function(data){
        data = JSON.parse(data);
        return JSON.stringify(data);
    },
    getDataWithToken: function(data) {
        data.timestamp = (new Date()).valueOf();
        data.campId = data.campId || localStorage.getItem("campId");
        data.uid = localStorage.getItem("uid");
        data.terminal = 1;
        data.version = data.version || 17;
        data.kick = true;
        var array = [];
        for(var key in data){
            array.push(data[key]);
        }

        array.push(localStorage.getItem("token"));
        array.sort();
        var str = array.join("");
        var strMD5 = md5(str);
        data.sign = strMD5;
        return data;
    },
    paramsToString: function(params) {
        const paramsArray = [];
        for (const name in params) {
            if (params.hasOwnProperty(name)) {
                let str = '';
                if (params[name] !== null) {
                    str = JSON.stringify(params[name]);
                }
                if (str.substring(0, 1) === '\"' && str.substring(str.length - 1) === '\"') {
                    str = str.substring(1, str.length - 1);
                }

                paramsArray.push(`${name}=${str}`);
            }
        }

        return paramsArray.join('&');
    }
};
module.exports = AJAXService;
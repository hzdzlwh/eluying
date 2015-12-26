webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {__webpack_require__(9);
	$(function(){
	    var header = __webpack_require__(5);
	    header.showHeader();
	    var leftMenu = __webpack_require__(4);
	    leftMenu.showLeftMenu();
	    var util = __webpack_require__(3);
	    util.mainContainer();
	    $(".campName").html(localStorage.getItem("campName"));
	    var accommodationPriceList = __webpack_require__(11);
	    accommodationPriceList.getAccommodationBasicInfo();
	    laydate({
	        elem: '#dateInput'
	    });
	    laydate.skin('danlan');
	});
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },

/***/ 11:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {var AJAXService = __webpack_require__(7);
	var accommodationPriceList = {
	    getAccommodationBasicInfo: function(){
	        $.ajax({
	            url: AJAXService.getUrl("getAccommodationBasicInfo"),
	            data: {campId: localStorage.getItem("campId")},
	            dataFilter: function (result) {
	                return AJAXService.sessionValidate(result);
	            },
	            success: function(result){
	                this.roomsList = result.data.list;
	            }
	        });
	    },
	    getAccommodationPriceList: function(){
	        $.ajax({
	            url: AJAXService.getUrl("getAccommodationPriceList"),
	            data: {
	                campId: localStorage.getItem("campId"),
	                startDate: "2015-12-07",
	                endDate: "2015-12-13"
	            },
	            dataFilter: function (result) {
	                return AJAXService.sessionValidate(result);
	            },
	            success: function(result){
	
	            }
	        })
	    }
	};
	module.exports = accommodationPriceList;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }

});
//# sourceMappingURL=roomEntry.js.map
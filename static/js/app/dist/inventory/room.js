webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * Created by huwanqi on 15/12/26.
	 */
	var util = __webpack_require__(3);
	var leftMenu = __webpack_require__(4);
	var header = __webpack_require__(5);
	__webpack_require__(9);
	var trToggle = __webpack_require__(10);
	
	$(document).ready(function(){
	    /*
	    initialize public modules
	     */
	    header.showHeader();
	    leftMenu.showLeftMenu();
	    util.mainContainer();
	
	    /*
	    initialize datepicker
	     */
	    laydate({
	        elem: '#dateInput'
	    });
	    laydate.skin('danlan');
	
	    trToggle();
	
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },

/***/ 10:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * Created by huwanqi on 15/12/26.
	 */
	function trToggle(pClass){
	    $(".mainClass").on("click", function(){
	        var that = $(this);
	        if ($(this).nextUntil(".mainClass").hasClass("hide")) {
	            $(this).find("img").addClass("rotate");
	            $(this).nextUntil(".mainClass").find("div").hide();
	            $(this).nextUntil(".mainClass").removeClass("hide");
	            $(this).nextUntil(".mainClass").find("div").slideDown(300);
	        } else{
	            $(this).find("img").removeClass("rotate");
	            $(this).nextUntil(".mainClass").find("div").slideUp(300);
	            setTimeout(function(){
	                that.nextUntil(".mainClass").addClass("hide");
	            }, 300);
	        }
	    });
	}
	
	module.exports = trToggle;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }

});
//# sourceMappingURL=room.js.map
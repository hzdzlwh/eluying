/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);
/******/ 		if(moreModules[0]) {
/******/ 			installedModules[0] = 0;
/******/ 			return __webpack_require__(0);
/******/ 		}
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		2:0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);
/******/
/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;
/******/
/******/ 			script.src = __webpack_require__.p + "" + chunkId + "." + ({"0":"inventory/room","1":"price/roomEntry"}[chunkId]||chunkId) + ".js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./dist/";
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ function(module, exports) {

	var util = {
	    mainContainer: function(){
	        var width = document.body.clientWidth - 65;
	        if (width < 1135) {
	            width = 1135;
	        }
	        $(".mainContainer").css("width", width);
	    },
	
	    bindDomAction: function(events){
	        var eventDef,eventsInfoArray;
	        for (eventDef in events) {
	            if (events.hasOwnProperty(eventDef)) {
	                if(events[eventDef]) {
	                    eventsInfoArray = eventDef.split(" ");
	                    if(eventsInfoArray.length == 3){
	                        $(eventsInfoArray[1]).on(eventsInfoArray[0], eventsInfoArray[2], events[eventDef]);
	                    }else if(eventsInfoArray.length == 2){
	                        $(eventsInfoArray[1]).on(eventsInfoArray[0], events[eventDef]);
	                        if (eventsInfoArray[1] == "window") {
	                            $(window).on(eventsInfoArray[0], events[eventDef]);
	                        }
	                    }else{
	                        console.warn("事件绑定格式错误");
	                    }
	
	                }
	            }
	        }
	    },
	
	    dateFormat: function(date){
	        return date.toLocaleDateString().replace(/\//g, "-");
	    },
	
	    lastWeek: function(){
	        var datepicker = $(this).siblings(".dateContainer");
	        var currentDate = datepicker.datepicker( "getDate" );
	        datepicker.datepicker( "setDate", new Date(currentDate.setDate(currentDate.getDate() - 7)));
	        datepicker.trigger("dateChange");
	    },
	
	    nextWeek: function(){
	        var datepicker = $(this).siblings(".dateContainer");
	        var currentDate = datepicker.datepicker( "getDate" );
	        datepicker.datepicker( "setDate", new Date(currentDate.setDate(currentDate.getDate() + 7)));
	        datepicker.trigger("dateChange");
	    },
	
	    getWeek: function(d){
	        var week = ["周日","周一","周二","周三","周四","周五","周六"];
	        return week[d.getDay()];
	    },
	
	    clone: function(obj){
	        var result,oClass = util.isClass(obj);
	        //确定result的类型
	        if(oClass==="Object"){
	            result = {};
	        }else if(oClass === "Array"){
	            result = [];
	        }else{
	            return obj;
	        }
	        for(var key in obj){
	            var copy = obj[key];
	            if(util.isClass(copy) == "Object"){
	                result[key]=arguments.callee(copy);//递归调用
	            }else if(util.isClass(copy)=="Array"){
	                result[key]=arguments.callee(copy);
	            }else{
	                result[key]=obj[key];
	            }
	        }
	        return result;
	    },
	
	    isClass: function(o){
	        if(o===null) return "Null";
	        if(o===undefined) return "Undefined";
	        return Object.prototype.toString.call(o).slice(8,-1);
	    }
	};
	module.exports = util;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var leftMenu = {
	    showLeftMenu: function() {
	        var pathArray = window.location.pathname.split("/");
	        var path = (pathArray[3]);
	        var str = "<div class='leftMenu'><ul><li><a id='roomMenu' href='/eluyun/view/" + path + "/room.html'>住宿</a></li>"
	            + "<li><a id='foodMenu' href='/eluyun/view/" + path + "/food.html'>餐饮</a></li>"
	            + "<li><a id='enterMenu' href='/eluyun/view/" + path + "/entertainment.html'>娱乐</a></li></ul></div>";
	        var menu = pathArray[4].split(".")[0];
	        $(".header").after(str);
	        $("#" + menu + "Menu").addClass("active");
	    }
	};
	module.exports = leftMenu;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var logout = __webpack_require__(4);
	var util = __webpack_require__(1);
	var header = {
	    showHeader : function(){
	        var headerStr = "<div class='header clearfloat'><a class='logo' href='#'>易露云</a><ul>"
	            + "<li><a id='inventoryMenu' href='/eluyun/view/inventory/room.html'>库存管理</a></li>"
	            + "<li><a id='priceMenu' href='/eluyun/view/price/room.html'>价格维护</a></li>"
	            + "<li><a id='categoryMenu' href='/eluyun/view/category/room.html'>品类管理</a></li>"
	            + "</ul>"
	            + "<div class='right'>"
	            + "<div class='userPhoto'><a href='#'><img src='/eluyun/static/image/timg.jpg' alt='头像'></a></div>"
	            + "<div class='userName'>"
	            + "<a href='#'></a>"
	            + "</div>"
	            + "<div class='line'></div>"
	            + "<div class='logout'>"
	            + "<a href='javascript:void(0)' id='logout'>退出账户</a>"
	            + "</div>"
	            + "</div>"
	            + "</div>";
	        $("body").prepend(headerStr);
	        $(".userName").find("a").html(localStorage.getItem("userName"));
	        var pathArray = window.location.pathname.split("/");
	        var menu = pathArray[3];
	        $("#" + menu + "Menu").addClass("active");
	        util.bindDomAction(this.events);
	    },
	    events: {
	        "click #logout": logout.logout
	    }
	};
	module.exports = header;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var AJAXService = __webpack_require__(5);
	var logout = {
	    logout: function(){
	        $.get(AJAXService.getUrl("logoutUrl"));
	        localStorage.clear();
	        location.href = "/eluyun/login.html";
	    }
	};
	module.exports = logout;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(6);
	var AJAXService = {
	    urls: {
	        //测试服 http://121.41.109.105:8081/mg
	        //宪伟服务器 http://192.168.0.2:8082/mg
	        //var host = "http://121.41.109.105:8081/mg";
	        //浩南服务器 http://192.168.0.118:8087
	        host: "http://192.168.0.120:8087",
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
	        logoutUrl: "/user/logout",
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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery Cookie Plugin v1.4.1
	 * https://github.com/carhartl/jquery-cookie
	 *
	 * Copyright 2013 Klaus Hartl
	 * Released under the MIT license
	 */
	(function (factory) {
		if (true) {
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(7)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof exports === 'object') {
			// CommonJS
			factory(require('jquery'));
		} else {
			// Browser globals
			factory(jQuery);
		}
	}(function ($) {
	
		var pluses = /\+/g;
	
		function encode(s) {
			return config.raw ? s : encodeURIComponent(s);
		}
	
		function decode(s) {
			return config.raw ? s : decodeURIComponent(s);
		}
	
		function stringifyCookieValue(value) {
			return encode(config.json ? JSON.stringify(value) : String(value));
		}
	
		function parseCookieValue(s) {
			if (s.indexOf('"') === 0) {
				// This is a quoted cookie as according to RFC2068, unescape...
				s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
			}
	
			try {
				// Replace server-side written pluses with spaces.
				// If we can't decode the cookie, ignore it, it's unusable.
				// If we can't parse the cookie, ignore it, it's unusable.
				s = decodeURIComponent(s.replace(pluses, ' '));
				return config.json ? JSON.parse(s) : s;
			} catch(e) {}
		}
	
		function read(s, converter) {
			var value = config.raw ? s : parseCookieValue(s);
			return $.isFunction(converter) ? converter(value) : value;
		}
	
		var config = $.cookie = function (key, value, options) {
	
			// Write
	
			if (value !== undefined && !$.isFunction(value)) {
				options = $.extend({}, config.defaults, options);
	
				if (typeof options.expires === 'number') {
					var days = options.expires, t = options.expires = new Date();
					t.setTime(+t + days * 864e+5);
				}
	
				return (document.cookie = [
					encode(key), '=', stringifyCookieValue(value),
					options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					options.path    ? '; path=' + options.path : '',
					options.domain  ? '; domain=' + options.domain : '',
					options.secure  ? '; secure' : ''
				].join(''));
			}
	
			// Read
	
			var result = key ? undefined : {};
	
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			var cookies = document.cookie ? document.cookie.split('; ') : [];
	
			for (var i = 0, l = cookies.length; i < l; i++) {
				var parts = cookies[i].split('=');
				var name = decode(parts.shift());
				var cookie = parts.join('=');
	
				if (key && key === name) {
					// If second argument (value) is a function it's a converter...
					result = read(cookie, value);
					break;
				}
	
				// Prevent storing a cookie that we couldn't decode.
				if (!key && (cookie = read(cookie)) !== undefined) {
					result[name] = cookie;
				}
			}
	
			return result;
		};
	
		config.defaults = {};
	
		$.removeCookie = function (key, options) {
			if ($.cookie(key) === undefined) {
				return false;
			}
	
			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return !$.cookie(key);
		};
	
	}));


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ }
/******/ ]);
//# sourceMappingURL=common.js.map
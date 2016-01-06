webpackJsonp([3],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/**
	 * Created by huwanqi on 15/12/14.
	 */
	//var baseUrl = "http://192.168.0.120:8087";
	var AJAXService = __webpack_require__(10);
	var validate = __webpack_require__(13);
	__webpack_require__(1);
	__webpack_require__(5);
	
	/*
	验证码按钮倒计时用。
	 */
	var wait=60;
	function time(o) {
	    if (wait == 0) {
	        $(o).removeAttr('disabled');
	        $(o).html("获取验证码");
	        wait = 60;
	        if($(o).parents(".modal").attr("id") == 'loginRegister'){
	            $(o).on("click", registerVCOnClick);
	        }else{
	            $(o).on("click", forgetVCOnClick);
	        }
	    } else {
	        $(o).attr('disabled', "disabled");
	        $(o).html("重新发送(" + wait + ")");
	        wait--;
	        setTimeout(function() {
	            time(o);
	        }, 1000);
	    }
	}
	
	function forgetVCOnClick(){
	    var phone = $("#loginForgetPwd .phone").val();
	    var result = validate.phoneValidate(phone);
	    if(result == true){
	        $("#loginForgetPwd .errorTips").hide();
	        $(this).unbind("click");
	        $.ajax({
	            type: "GET",
	            //url: baseUrl + '/user/sendVerifyCode',
	            url: AJAXService.getUrl('sendVerifyCodeUrl'),
	            data: {
	                phone: phone,
	                origin: 1
	            },
	            success: function(data){
	                console.log(data);
	            },
	            error: function(data){
	                console.log(data);
	            }
	        });
	        time(this);
	    }else{
	        $("#loginForgetPwd .errorTips").html(result);
	        $("#loginForgetPwd .errorTips").show();
	    }
	}
	
	function registerVCOnClick(){
	    var phone = $("#loginRegister .phone").val();
	    var result = validate.phoneValidate(phone);
	    if(result == true){
	        $("#loginRegister .errorTips").hide();
	        $(this).unbind("click");
	        $.ajax({
	            type: "GET",
	            //url: baseUrl + '/user/sendVerifyCode',
	            url: AJAXService.getUrl('sendVerifyCodeUrl'),
	            data: {
	                phone: phone
	            },
	            success: function(data){
	                console.log(data);
	                if(data.code == 9){
	                    $("#loginRegister .errorTips").html(data.msg);
	                    $("#loginRegister .errorTips").show();
	                    wait = 0;
	                }
	            },
	            error: function(data){
	                console.log(data);
	            }
	        });
	        time(this);
	    }else{
	        $("#loginRegister .errorTips").html(result);
	        $("#loginRegister .errorTips").show();
	    }
	}
	
	$(document).ready(function(){
	    if (isPostBack == "False") {
	        GetLastUser();
	    }
	
	    $(".modal").modal({
	        backdrop: "static",
	        show: false,
	        keyboard: true
	    });
	    function centerModals(){
	        $('.modal').each(function(){
	            var $clone = $(this).clone().css('display', 'block').appendTo('body');
	            var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2) - 52;
	            top = top > 0 ? top : 0;
	            $clone.remove();
	            $(this).find('.modal-content').css("margin-top", top);
	        });
	    }
	    $('.modal').on('show.bs.modal', centerModals);
	    $(window).on('resize', centerModals);
	    $(".btn-cancel").click(function(){
	        $(this).parents(".modal").modal("hide");
	    });
	    /*
	    申请注册码和我有注册码切换
	     */
	    $("body").on("click", "#loginRegister .regCode .navs .item", function(){
	        $("#loginRegister .regCode .navs .item").removeClass("active");
	        $(this).addClass("active");
	        var data = $(this).attr("data");
	        if(data == 'use'){
	            $("#loginRegister .apply").hide();
	            $("#loginRegister .use").show();
	            $("#loginRegister .regCode").height(183);
	            $("#loginRegister .confirm").html('注册');
	        }else{
	            $("#loginRegister .apply").show();
	            $("#loginRegister .use").hide();
	            $("#loginRegister .regCode").height(243);
	            $("#loginRegister .confirm").html('申请');
	        }
	    });
	
	    /*
	     忘记密码点击发送验证码
	     */
	    $("#loginForgetPwd .get_code").on("click", forgetVCOnClick);
	
	    /*
	     忘记密码点击确认
	     */
	    $("#loginForgetPwd .confirm").on("click", function(){
	        var phone = $("#loginForgetPwd .phone").val();
	        var verifyCode = $("#loginForgetPwd .verifyCode").val();
	        var pwd = $("#loginForgetPwd .pwd").val();
	        var pwdConfirm = $("#loginForgetPwd .pwdConfirm").val();
	        var result = validate.phoneValidate(phone);
	        if(result == true) {
	            result = validate.verifyCodeValidate(verifyCode);
	        }
	        if(result == true) {
	            result = validate.passwordValidate(pwd);
	        }
	        if(result == true) {
	            result = validate.passwordConfirmValidate(pwd, pwdConfirm);
	        }
	        if(result === true){
	            $.ajax({
	                type: 'GET',
	                //url: baseUrl + '/user/resetPassword',
	                url: AJAXService.getUrl("resetPasswordUrl"),
	                data: {
	                    password: pwd,
	                    phone: phone,
	                    verifyCode: verifyCode
	                },
	                success: function(data){
	                    console.log(data);
	                    if(data.code == 1){
	                        $("#loginForgetPwd .errorTips").hide();
	                        $("#loginForgetPwd").modal('hide');
	                        $("#resetSuccess").modal('show');
	                        setTimeout(function(){$("#resetSuccess").modal('hide');}, 1000);
	                    }else{
	                        $("#loginForgetPwd .errorTips").html(data.msg);
	                        $("#loginForgetPwd .errorTips").show();
	                    }
	                },
	                error: function(data){
	                    console.log(data);
	                }
	            });
	        }else{
	            $("#loginForgetPwd .errorTips").html(result);
	            $("#loginForgetPwd .errorTips").show();
	        }
	    });
	
	    /*
	     注册点击发送验证码
	     */
	    $("#loginRegister .get_code").on("click", registerVCOnClick);
	
	    /*
	    申请注册码或者注册
	     */
	    $("#loginRegister .confirm").on("click", function(){
	        var phone = $("#loginRegister .phone").val();
	        var verifyCode = $("#loginRegister .verifyCode").val();
	        var loginName = $("#loginRegister .loginName").val();
	        var pwd = $("#loginRegister .pwd").val();
	        var pwdConfirm = $("#loginRegister .pwdConfirm").val();
	        var name, campName, campAddress, registrationCode;
	        var result = validate.phoneValidate(phone);
	        if(result == true){
	            result = validate.verifyCodeValidate(verifyCode);
	        }
	        if(result == true){
	            result = validate.loginNameValidate(loginName);
	        }
	        if(result == true){
	            result = validate.passwordValidate(pwd);
	        }
	        if(result == true){
	            result = validate.passwordConfirmValidate(pwd, pwdConfirm);
	        }
	        var state = $(this).html();
	        if(state == '申请'){
	            name = $("#loginRegister .name").val();
	            campName = $("#loginRegister .campName").val();
	            campAddress = $("#loginRegister .address").val();
	            registrationCode = null;
	            if(result == true){
	                result = validate.nameValidate(name);
	            }
	            if(result == true){
	                result = validate.campNameValidate(campName);
	            }
	            if(result == true){
	                result = validate.campAddressValidate(campAddress);
	            }
	        }else if(state == '注册'){
	            name = $("#loginRegister .name2").val();
	            campName = null;
	            campAddress = null;
	            registrationCode = $("#loginRegister .registrationCode").val();
	            if(result == true){
	                result = validate.nameValidate(name);
	            }
	            if(result == true){
	                result = validate.registrationCodeValidate(registrationCode);
	            }
	        }
	        if(result == true){
	            $.ajax({
	                type: 'GET',
	                //url: baseUrl + '/user/register',
	                url: AJAXService.getUrl("registerUrl"),
	                data: {
	                    campAddress: campAddress,
	                    campName: campName,
	                    name: name,
	                    password: pwd,
	                    phone: phone,
	                    registrationCode: registrationCode,
	                    userName: loginName,
	                    verifyCode: verifyCode
	                },
	                success: function(data){
	                    if(data.code == 1){
	                        if(state == '注册'){
	                            $("#loginRegister").modal('hide');
	                            $("#loginRegSuccess").modal('show');
	                            window.location.href = '/view/category/room.html';
	                        }else{
	                            $("#loginRegister").modal('hide');
	                            $("#loginApplySuccess").modal('show');
	                        }
	                    }else{
	                        $("#loginRegister .errorTips").html(data.msg);
	                        $("#loginRegister .errorTips").show();
	                    }
	                },
	                error: function(data){
	                    console.log(data);
	                }
	            });
	            $("#loginRegister .errorTips").hide();
	        }else{
	            $("#loginRegister .errorTips").html(result);
	            $("#loginRegister .errorTips").show();
	        }
	    });
	
	    /*
	    登录按钮响应
	     */
	    $("#loginSection1 .log button").on("click", function(){
	        var loginName = $("#loginSection1 .log .loginName").val();
	        var password = $("#loginSection1 .log .password").val();
	        var result = validate.loginNameValidate(loginName);
	        if(result == true) {
	            result = validate.passwordValidate(password);
	        }
	        if(result === true){
	            $.ajax({
	                type: "GET",
	                url: AJAXService.getUrl("loginUrl"),
	                data: {
	                    loginName: loginName,
	                    password: password
	                },
	                success: function(data){
	                    if(data.code == 1){
	                        $("#loginLogSuccess").modal('show');
	                        localStorage.setItem("campName", data.data.camps[0].name);
	                        localStorage.setItem("userName", data.data.userName);
	                        $.cookie("jsessionid", data.data.jsessionid, {path: "/"});
	                        window.location.href = '../../../../../view/category/room.html';
	                    }else{
	                        $("#loginSection1 .log .errorTips").html(data.msg);
	                        $("#loginSection1 .log .errorTips").show();
	                        $("#loginSection1 .log .text").css("margin-top", "30px");
	                    }
	                },
	                error: function(data){
	                    console.log(data);
	                }
	            });
	            $("#loginSection1 .log .errorTips").hide();
	            $("#loginSection1 .log .text").css("margin-top", "44px");
	        }else{
	            $("#loginSection1 .log .errorTips").html(result);
	            $("#loginSection1 .log .errorTips").show();
	            $("#loginSection1 .log .text").css("margin-top", "30px");
	        }
	    });
	
	    /*
	    登录表单验证
	     */
	    $("#loginSection1 .log .loginName").on("change", function(){
	        var loginName = $(this).val();
	        var result = validate.loginNameValidate(loginName);
	        if(result != true){
	            $("#loginSection1 .log .errorTips").html(result);
	            $("#loginSection1 .log .errorTips").show();
	            $("#loginSection1 .log .text").css("margin-top", "30px");
	        }else {
	            $("#loginSection1 .log .errorTips").hide();
	        }
	    });
	    $("#loginSection1 .log .password").on("change", function(){
	        var password = $(this).val();
	        var result = validate.passwordValidate(password);
	        if(result != true){
	            $("#loginSection1 .log .errorTips").html(result);
	            $("#loginSection1 .log .errorTips").show();
	            $("#loginSection1 .log .text").css("margin-top", "30px");
	        }else {
	            $("#loginSection1 .log .errorTips").hide();
	        }
	    });
	
	    /*
	     忘记密码表单验证
	     */
	    $("#loginForgetPwd .phone").on("change", function(){
	        var phone = $(this).val();
	        var result = validate.phoneValidate(phone);
	        if(result != true){
	            $("#loginForgetPwd .errorTips").html(result);
	            $("#loginForgetPwd .errorTips").show();
	        }else{
	            $("#loginForgetPwd .errorTips").hide();
	        }
	    });
	    $("#loginForgetPwd .verifyCode").on("change", function(){
	        var verifyCode = $(this).val();
	        var result = validate.verifyCodeValidate(verifyCode);
	        if(result != true){
	            $("#loginForgetPwd .errorTips").html(result);
	            $("#loginForgetPwd .errorTips").show();
	        }else{
	            $("#loginForgetPwd .errorTips").hide();
	        }
	    });
	    $("#loginForgetPwd .pwd").on("change", function(){
	        var pwd = $(this).val();
	        var result = validate.passwordValidate(pwd);
	        if(result != true){
	            $("#loginForgetPwd .errorTips").html(result);
	            $("#loginForgetPwd .errorTips").show();
	        }else{
	            $("#loginForgetPwd .errorTips").hide();
	        }
	    });
	    $("#loginForgetPwd .pwdConfirm").on("change", function(){
	        var pwd = $("#loginForgetPwd .pwd").val();
	        var pwdConfirm = $(this).val();
	        var result = validate.passwordValidate(pwd);
	        if(result != true){
	            $("#loginForgetPwd .errorTips").html(result);
	            $("#loginForgetPwd .errorTips").show();
	        }else{
	            result = validate.passwordConfirmValidate(pwd, pwdConfirm);
	            if(result != true){
	                $("#loginForgetPwd .errorTips").html(result);
	                $("#loginForgetPwd .errorTips").show();
	            }else{
	                $("#loginForgetPwd .errorTips").hide();
	            }
	        }
	    });
	
	    /*
	     注册表单验证
	     */
	    $("#loginRegister .phone").on("change", function(){
	        var phone = $(this).val();
	        var result = validate.phoneValidate(phone);
	        if(result != true){
	            $("#loginRegister .errorTips").html(result);
	            $("#loginRegister .errorTips").show();
	        }else{
	            $("#loginRegister .errorTips").hide();
	        }
	    });
	    $("#loginRegister .verifyCode").on("change", function(){
	        var verifyCode = $(this).val();
	        var result = validate.verifyCodeValidate(verifyCode);
	        if(result != true){
	            $("#loginRegister .errorTips").html(result);
	            $("#loginRegister .errorTips").show();
	        }else{
	            $("#loginRegister .errorTips").hide();
	        }
	    });
	    $("#loginRegister .loginName").on("change", function(){
	        var loginName = $(this).val();
	        var result = validate.loginNameValidate(loginName);
	        if(result != true){
	            $("#loginRegister .errorTips").html(result);
	            $("#loginRegister .errorTips").show();
	        }else{
	            $("#loginRegister .errorTips").hide();
	            //验证用户名是否存在
	            $.ajax({
	                type: 'GET',
	                //url: baseUrl + '/user/verifyUserName',
	                url: AJAXService.getUrl("verifyUserNameUrl"),
	                data: {
	                    userName: loginName
	                },
	                success: function(data){
	                    if(data.data.exist){
	                        $("#loginRegister .errorTips").html('用户名已存在');
	                        $("#loginRegister .errorTips").show();
	                    }else{
	                        $("#loginRegister .errorTips").hide();
	                    }
	                },
	                error: function(data){}
	            });
	        }
	    });
	    $("#loginRegister .pwd").on("change", function(){
	        var pwd = $(this).val();
	        var result = validate.passwordValidate(pwd);
	        if(result != true){
	            $("#loginRegister .errorTips").html(result);
	            $("#loginRegister .errorTips").show();
	        }else{
	            $("#loginRegister .errorTips").hide();
	        }
	    });
	    $("#loginRegister .pwdConfirm").on("change", function(){
	        var pwd = $("#loginRegister .pwd").val();
	        var pwdConfirm = $(this).val();
	        var result = validate.passwordValidate(pwd);
	        if(result != true){
	            $("#loginRegister .errorTips").html(result);
	            $("#loginRegister .errorTips").show();
	        }else{
	            result = passwordConfirmValidate(pwd, pwdConfirm);
	            if(result != true){
	                $("#loginRegister .errorTips").html(result);
	                $("#loginRegister .errorTips").show();
	            }else{
	                $("#loginRegister .errorTips").hide();
	            }
	        }
	    });
	    $("#loginRegister .name, #loginRegister .name2").on("change", function(){
	        var name = $(this).val();
	        var result = validate.nameValidate(name);
	        if(result != true){
	            $("#loginRegister .errorTips").html(result);
	            $("#loginRegister .errorTips").show();
	        }else{
	            $("#loginRegister .errorTips").hide();
	        }
	    });
	    $("#loginRegister .campName").on("change", function(){
	        var campName = $(this).val();
	        var result = validate.campNameValidate(campName);
	        if(result != true){
	            $("#loginRegister .errorTips").html(result);
	            $("#loginRegister .errorTips").show();
	        }else{
	            $("#loginRegister .errorTips").hide();
	        }
	    });
	    $("#loginRegister .address").on("change", function(){
	        var address = $(this).val();
	        var result = validate.campAddressValidate(address);
	        if(result != true){
	            $("#loginRegister .errorTips").html(result);
	            $("#loginRegister .errorTips").show();
	        }else{
	            $("#loginRegister .errorTips").hide();
	        }
	    });
	    $("#loginRegister .registrationCode").on("change", function(){
	        var registrationCode = $(this).val();
	        var result = validate.registrationCodeValidate(registrationCode);
	        if(result != true){
	            $("#loginRegister .errorTips").html(result);
	            $("#loginRegister .errorTips").show();
	        }else{
	            $("#loginRegister .errorTips").hide();
	        }
	    });
	});
	
	function GetLastUser() {
	    var id = "49BAC005-7D5B-4231-8CEA-16939BEACD67";//GUID标识符
	    var usr = GetCookie(id);
	    if (usr != null) {
	        $("#loginSection1 .loginName").val(usr);
	    } else {
	        $("#loginSection1 .loginName").val('');
	    }
	    GetPwdAndChk();
	}
	//点击登录时触发客户端事件
	
	function SetPwdAndChk() {
	    //取用户名
	    var usr = $("#loginSection1 .loginName").val();;
	    //将最后一个用户信息写入到Cookie
	    SetLastUser(usr);
	    //如果记住密码选项被选中
	    if (document.getElementById('loginSave').checked == true) {
	        //取密码值
	        var pwd = $("#loginSection1 .password").val();
	        var expdate = new Date();
	        expdate.setTime(expdate.getTime() + 14 * (24 * 60 * 60 * 1000));
	        //将用户名和密码写入到Cookie
	        SetCookie(usr, pwd, expdate);
	    } else {
	        //如果没有选中记住密码,则立即过期
	        ResetCookie();
	    }
	}
	
	/*
	 记住密码功能用
	 */
	function SetLastUser(usr) {
	    var id = "49BAC005-7D5B-4231-8CEA-16939BEACD67";
	    var expdate = new Date();
	    //当前时间加上两周的时间
	    expdate.setTime(expdate.getTime() + 14 * (24 * 60 * 60 * 1000));
	    SetCookie(id, usr, expdate);
	}
	//用户名失去焦点时调用该方法
	
	function GetPwdAndChk() {
	    var usr = $("#loginSection1 .loginName").val();
	    var pwd = GetCookie(usr);
	    if (pwd != null) {
	        document.getElementById('loginSave').checked = true;
	        $("#loginSection1 .password").val(pwd);
	    } else {
	        document.getElementById('loginSave').checked = false;
	        $("#loginSection1 .password").val('');
	    }
	}
	//取Cookie的值
	
	function GetCookie(name) {
	    var arg = name + "=";
	    var alen = arg.length;
	    var clen = document.cookie.length;
	    var i = 0;
	    while (i < clen) {
	        var j = i + alen;
	        if (document.cookie.substring(i, j) == arg) return getCookieVal(j);
	        i = document.cookie.indexOf(" ", i) + 1;
	        if (i == 0) break;
	    }
	    return null;
	}
	var isPostBack = "False";
	
	function getCookieVal(offset) {
	    var endstr = document.cookie.indexOf(";", offset);
	    if (endstr == -1) endstr = document.cookie.length;
	    return unescape(document.cookie.substring(offset, endstr));
	}
	//写入到Cookie
	
	function SetCookie(name, value, expires) {
	    var argv = SetCookie.arguments;
	    //本例中length = 3
	    var argc = SetCookie.arguments.length;
	    var expires = (argc > 2) ? argv[2] : null;
	    var path = (argc > 3) ? argv[3] : null;
	    var domain = (argc > 4) ? argv[4] : null;
	    var secure = (argc > 5) ? argv[5] : false;
	    document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) + ((path == null) ? "" : ("; path=" + path)) + ((domain == null) ? "" : ("; domain=" + domain)) + ((secure == true) ? "; secure" : "");
	}
	
	function ResetCookie() {
	    var usr = $("#loginSection1 .loginName").val();;
	    var expdate = new Date();
	    SetCookie(usr, null, expdate);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },

/***/ 13:
/***/ function(module, exports) {

	/**
	 * Created by huwanqi on 15/12/19.
	 */
	var validate = {};
	
	validate.loginNameValidate = function(str){
	    var reg = /^[a-zA-Z0-9]{6,15}$/;
	    return reg.test(str) || '账户名必须是6到15位的字母或者数字';
	};
	
	validate.passwordValidate = function(str){
	    //var reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/;
	    var reg = /^[a-zA-Z0-9]{6,15}$/;
	    return reg.test(str) || '密码必须是6到15位的数字或字母';
	};
	
	validate.passwordConfirmValidate = function(left, right){
	    return left === right || '两次输入的密码不一样';
	};
	
	validate.phoneValidate = function(str){
	    var reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
	    return reg.test(str) || '请填写大陆的11位手机号码';
	};
	
	validate.verifyCodeValidate = function(str){
	    var reg = /^\d{4}$/;
	    return reg.test(str) || '请填写您收到的4位验证码';
	};
	
	validate.nameValidate = function(str){
	    var reg = /^[\u4e00-\u9fa5]{2,}$/;
	    return reg.test(str) || '请填写您的姓名';
	};
	
	validate.campNameValidate = function(str){
	    var reg = /^[\u4e00-\u9fa5]{0,}$/;
	    return reg.test(str) || '请填写您的营地名称';
	};
	
	validate.campAddressValidate = function(str){
	    var reg = /^[\u4e00-\u9fa5]{0,}$/;
	    return reg.test(str) || '请填写您的营地地址';
	};
	
	validate.registrationCodeValidate = function(str){
	    var reg = /^[a-zA-Z0-9]{0,}$/;
	    return reg.test(str) || '请填写您的营地注册码';
	};
	
	module.exports = validate;

/***/ }

});
//# sourceMappingURL=login.js.map
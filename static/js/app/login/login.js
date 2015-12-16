/**
 * Created by huwanqi on 15/12/14.
 */
var baseUrl = 'http://121.41.109.105:8081/mg';

/*
验证码按钮倒计时用。
 */
var wait=60;
function time(o) {
    if (wait == 0) {
        //o.removeAttribute("disabled");
        $(o).removeAttr('disabled');
        $(o).html("获取验证码");
        wait = 60;
    } else {
        $(o).attr('disabled', "disabled");
        $(o).html("重新发送(" + wait + ")");
        wait--;
        setTimeout(function() {
            time(o);
        }, 1000);
    }
}

$(document).ready(function(){
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
   注册框表单验证
    */
    $("#loginRegister .phone").on("change", function(){
        var phone = $(this).val();
        if(phone && phone.length == 11){
            $(this).parents(".form_row").removeClass("has-error");
            $(this).parents(".form_row").addClass("has-success");
        }else{
            $(this).parents(".form_row").removeClass("has-success");
            $(this).parents(".form_row").addClass("has-error");
        }
    });
    /*
     忘记密码点击发送验证码
     */
    $("#loginForgetPwd .get_code").on("click", function(){
        var phone = $("#loginForgetPwd .phone").val();
        if(phone && phone.length == 11){
            $.ajax({
                type: "GET",
                url: baseUrl + '/user/sendVerifyCode',
                data: {
                    phone: phone,
                    origin: -1
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

        }
    });
    /*
     忘记密码点击确认
     */
    $("#loginForgetPwd .confirm").on("click", function(){
        var phone = $("#loginForgetPwd .phone").val();
        var verifyCode = $("#loginForgetPwd .verifyCode").val();
        var pwd = $("#loginForgetPwd .pwd").val();
        var pwdConfirm = $("#loginForgetPwd .pwdConfirm").val();
        //TODO 表单验证
        $.ajax({
            type: "GET",
            url: baseUrl + '/user/resetPassword',
            data: {
                password: pwd,
                phone: phone,
                verifyCode: verifyCode,
            },
            success: function(data){
                console.log(data);
            },
            error: function(data){
                console.log(data);
            }
        });
    });
    /*
     注册点击发送验证码
     */
    $("#loginRegister .get_code").on("click", function(){
        var phone = $("#loginRegister .phone").val();
        if(phone && phone.length == 11){
            $.ajax({
                type: "GET",
                url: baseUrl + '/user/sendVerifyCode',
                data: {
                    phone: phone
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

        }
    });
    /*
    申请注册码或者注册
     */
    $("#loginRegister .confirm").on("click", function(){
        var state = $(this).html();
        if(state == '申请'){
            var address = $("#loginRegister .address").val();
            var campName = $("#loginRegister .campName").val();
            var name = $("#loginRegister .name").val();
            $.ajax({
                type: "GET",
                url: baseUrl + '/user/applyRegistrationCode',
                data: {
                    address: address,
                    campName: campName,
                    name: name
                },
                success: function(data){
                    console.log(data);
                },
                error: function(data){
                    console.log(data);
                }
            });
        }else if(state == '注册'){
            var phone = $("#loginRegister .phone").val();
            var verifyCode = $("#loginRegister .verifyCode").val();
            var loginName = $("#loginRegister .loginName").val();
            var pwd = $("#loginRegister .pwd").val();
            var pwdConfirm = $("#loginRegister .pwdConfirm").val();
            var registrationCode = $("#loginRegister .registrationCode").val();
            var name = $("#loginRegister .name2").val();
            //TODO 验证表单
            $.ajax({
                type: "GET",
                url: baseUrl + '/user/register',
                data: {
                    name: name,
                    password: pwd,
                    phone: phone,
                    verifyCode: verifyCode,
                    registrationCode: registrationCode
                },
                success: function(data){
                    console.log(data);
                },
                error: function(data){
                    console.log(data);
                }
            });
        }else{
            console.warn('按钮有错咯');
        }
    });

    /*
    登录按钮响应
     */
    $("#loginSection1 .log button").on("click", function(){
        var loginName = $("#loginSection1 .log .loginName");
        var password = $("#loginSection1 .log .password");
        //TODO 表单验证
        $.ajax({
            type: "GET",
            url: baseUrl + '/user/login',
            data: {
                loginName: loginName,
                password: password
            },
            success: function(data){
                console.log(data);
            },
            error: function(data){
                console.log(data);
            }
        });
    });

});

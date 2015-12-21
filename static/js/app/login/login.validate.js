/**
 * Created by huwanqi on 15/12/19.
 */
function loginNameValidate(str){
    var reg = /^[a-zA-Z0-9]{6,15}$/;
    return reg.test(str) || '账户名必须是6到15位的字母或者数字';
}

function passwordValidate(str){
    var reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/;
    return reg.test(str) || '密码必须是6到15位,包含大小写字母和数字';
}

function passwordConfirmValidate(left, right){
    return left === right || '两次输入的密码不一样';
}

function phoneValidate(str){
    var reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    return reg.test(str) || '请填写大陆的11位手机号码';
}

function verifyCodeValidate(str){
    var reg = /^\d{4}$/;
    return reg.test(str) || '请填写您收到的4位验证码';
}

function nameValidate(str){
    var reg = /^[\u4e00-\u9fa5]{2,}$/;
    return reg.test(str) || '请填写您的姓名';
}

function campNameValidate(str){
    var reg = /^[\u4e00-\u9fa5]{0,}$/;
    return reg.test(str) || '请填写您的营地名称';
}

function campAddressValidate(str){
    var reg = /^[\u4e00-\u9fa5]{0,}$/;
    return reg.test(str) || '请填写您的营地地址';
}

function registrationCodeValidate(str){
    var reg = /^[a-zA-Z0-9]{0,}$/;
    return reg.test(str) || '请填写您的营地注册码';
}
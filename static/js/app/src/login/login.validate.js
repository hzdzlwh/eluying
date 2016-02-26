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
    var reg = /^1[3|4|5|7|8]\d{9}$/;
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
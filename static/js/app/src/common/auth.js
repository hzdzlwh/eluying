/**
 * Created by lingchenxuan on 16/6/14.
 */
var ACCOMMODATION_ID = 2;
var VIP_ID = 11;
var BUSINESS_ID = 0;
var HOST_ID = 1;
var EMPLOYEE_ID = 2;
var ADMIN_ID = 3;
var NO_AUTH_URL = '/view/tips/noauth.html';
var NO_AUTH_FOR_A_URL = '/view/tips/noauthfora.html';
var NO_AUTH_FOR_VIP_URL = '/view/tips/noauthforvip.html';
var EXPIRED_URL = '/view/tips/expired.html';
var UPGRADE_URL = '/view/tips/upgrade.html';

var camps = JSON.parse(localStorage.getItem("camps"));
var bottom = JSON.parse(localStorage.getItem("bottom"));
var campId = localStorage.getItem("campId");

/**
 * 检测版本信息并跳转页面
 */
function checkVersionAndJump(){
    for (var i = 0; i < camps.length; i++) {
        var camp = camps[i];
        if (campId == camp.campId) {
            if (camp.type === 0 && camp.days <= 0) {
                window.location.href = '/view/tips/upgrade.html';
            } else if(camp.type === 1 && camp.days <= 0){
                window.location.href = '/view/tips/expired.html';
            }
        }
    }
}

/**
 * 检测模块权限
 * @param moduleId
 * @returns {boolean}
 */
function checkModule(moduleId){
    if (moduleId === BUSINESS_ID) {
        // 业务设置通过用户类型判断
        for (var i = 0; i < camps.length; i++) {
            var camp = camps[i];
            if (campId == camp.campId && (camp.userType === HOST_ID || camp.userType === ADMIN_ID)) {
                return true;
            }
        }
    } else {
        for (var j = 0; j < bottom.length; j++) {
            if (bottom[j].type === moduleId && bottom[j].status === 1) {
                return true;
            }
        }
    }
    return false;
}

function checkAuth(moduleId, url){
    url = url || '/view/tips/noauth.html';
    checkVersionAndJump();
    if (!checkModule(moduleId)) {
        window.location.href = url;
    }
}

exports.checkAuth = checkAuth;
exports.checkModule = checkModule;
exports.checkVersionAndJump = checkVersionAndJump;
exports.ACCOMMODATION_ID = ACCOMMODATION_ID;
exports.VIP_ID = VIP_ID;
exports.BUSINESS_ID = BUSINESS_ID;
exports.HOST_ID = HOST_ID;
exports.EMPLOYEE_ID = EMPLOYEE_ID;
exports.ADMIN_ID = ADMIN_ID;
exports.NO_AUTH_URL = NO_AUTH_URL;
exports.NO_AUTH_FOR_A_URL = NO_AUTH_FOR_A_URL;
exports.NO_AUTH_FOR_VIP_URL = NO_AUTH_FOR_VIP_URL;
exports.EXPIRED_URL = EXPIRED_URL;
exports.UPGRADE_URL = UPGRADE_URL;
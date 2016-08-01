/**
 * Created by lingchenxuan on 16/6/14.
 */

var $ajax = require('./AJAXService');

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
function checkVersion(){
    for (var i = 0; i < camps.length; i++) {
        var camp = camps[i];
        if (campId == camp.campId) {
            if (camp.type === 0 && camp.days <= 0) {
                return { update: true };
            } else if(camp.type === 1 && camp.days <= 0){
                return { expired: true };
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

function showMaintenance(announcement) {
    var style = 'style="background:#ffba75;width:100%;color:#fff;z-index:11;font-size:14px;position:absolute;top:68px;padding:2px 16px"';
    var html = '<div class="maintenance" ' + style + '>' + announcement
        + '<span class="maintenance-close" style="position: absolute;right: 16px;font-size: 18px;cursor: pointer">X</span>'
        + '</div>';
    $(function(){
        var body = $('body');
        body.prepend(html);
        body.on('click', '.maintenance-close', function() {
            $('.maintenance').remove();
        });
    })
}

function checkMaintenance() {
    var host =  process.env.NODE_ENV === 'production' ? "http://114.215.183.122:10086/mt" : "http://114.215.183.122:10010/mt";
    $.get(host + '/maintain/getMaintainInfo')
        .done(function(res) {
            if (res.data.open === 1 && res.data.type === 0) {
                showMaintenance(res.data.announcement);
            }
        });
    // showMaintenance('为了提供更快速、便捷的服务，订单来了将于2016-06-03（周一）14:00~16:00进行系统升级，届时网站与APP将无法访问，请您提前安排好工作。因此给您造成的不便，敬请谅解！');
}

function checkAuth(moduleId, url){
    checkMaintenance();
    url = url || '/view/tips/noauth.html';
    var version = checkVersion();
    var moduleAuth = checkModule(moduleId);
    if (version && version.update) {
        location.href = UPGRADE_URL;
    } else if (version && version.expired) {
        location.href = EXPIRED_URL;
    } else if (!moduleAuth) {
        location.href = url;
    }
}

exports.checkAuth = checkAuth;
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
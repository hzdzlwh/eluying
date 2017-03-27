/**
 * Created by lingchenxuan on 16/6/14.
 */

var $ajax = require('./AJAXService');
import modal from './modal';

const ACCOMMODATION_ID = 2;
const VIP_ID = 11;
const BUSINESS_ID = 0;
const HOST_ID = 1;
const EMPLOYEE_ID = 2;
const ADMIN_ID = 3;
const ORDER_ID = 1;
const REPORT_ID = 8;
const NO_AUTH_URL = '/view/tips/noauth.html';
const NO_AUTH_FOR_A_URL = '/view/tips/noauthfora.html';
const NO_AUTH_FOR_VIP_URL = '/view/tips/noauthforvip.html';
const EXPIRED_URL = '/view/tips/expired.html';
const UPGRADE_URL = '/view/tips/upgrade.html';
const INSURANCE_ID = 1;

const camps = JSON.parse(localStorage.getItem('camps'));
const bottom = JSON.parse(localStorage.getItem('bottom'));
const top = JSON.parse(localStorage.getItem('top'));
const campId = localStorage.getItem('campId');
const switches = JSON.parse(localStorage.getItem('switches'));

const maintenanceHost =  process.env.NODE_ENV === 'production' ? "/mt" : "//www.dingdandao.com:1443/mt";

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

        for (var k = 0; k < top.length; k++) {
            if (top[k].type === moduleId && top[k].status === 1) {
                return true;
            }
        }
    }
    return false;
}

function showMaintenance(announcement) {
    var style = 'style="background:#ffba75;width:100%;color:#fff;z-index:11;font-size:14px;position:absolute;top:68px;padding:2px 16px"';
    var html = '<div class="maintenance" ' + style + '>' + announcement
        + '<img class="maintenance-close" style="position: absolute;right: 16px;top:2px;cursor: pointer" src="//static.dingdandao.com/99003D43-530F-428A-BC34-6EF8608636D9@1x.png">'
        + '</div>';
    $(function(){
        var body = $('body');
        body.prepend(html);
        body.on('click', '.maintenance-close', function() {
            $('.maintenance').remove();
            window.localStorage.setItem('maintenanceClosed', true);
        });
    })
}

function checkMaintenance() {
    $.get(maintenanceHost + '/maintain/getMaintainInfo')
        .done(function(res) {
            if (res.data.open === 1 && res.data.type === 0) {
                showMaintenance(res.data.announcement);
            }
        });
    // showMaintenance('为了提供更快速、便捷的服务，订单来了将于2016-06-03（周一）14:00~16:00进行系统升级，届时网站与APP将无法访问，请您提前安排好工作。因此给您造成的不便，敬请谅解！');
}

/**
 * 维护跳转，版本跳转，返回模块权限
 * @param moduleId
 * @returns {boolean}
 */
function checkAccess(moduleId) {
    try {
        const maintenanceClosed = window.localStorage.getItem('maintenanceClosed');
        !maintenanceClosed && checkMaintenance();
        const version = checkVersion();
        const moduleAuth = checkModule(moduleId);
        if (version && version.update) {
            location.href = UPGRADE_URL;
        } else if (version && version.expired) {
            location.href = EXPIRED_URL;
        } else {
            return moduleAuth;
        }
    } catch (e) {
        modal.alert('请重新登录');
        setTimeout(() => {
            location.href = '/';
        }, 3000)
    }
}

/**
 * 维护跳转，版本跳转，模块权限跳转
 * @param moduleId
 * @param url
 */
function checkAuth(moduleId, url) {
    const access = checkAccess(moduleId);
    if (!access) {
        url = url || '/view/tips/noauth.html';
        location.href = url;
    }
}

function checkSwitch(id) {
    try {
        const switchStatus = switches.find(i => i.id === id);
        return switchStatus && !!switchStatus.status;
    } catch (e) {
        modal.alert('请重新登录');
        setTimeout(() => {
            location.href = '/';
        }, 3000);
    }

}

exports.checkAuth = checkAuth;
exports.checkAccess = checkAccess;
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
exports.ORDER_ID = ORDER_ID;
exports.REPORT_ID = REPORT_ID;
exports.checkSwitch = checkSwitch;
exports.INSURANCE_ID = INSURANCE_ID;

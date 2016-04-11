var leftMenuHtml = require('./leftMenu.html');
var dot = require('dot');
var leftMenu = {
    showLeftMenu: function() {
        var pathArray = window.location.pathname.split("/");
        var menuParent = pathArray[2];
        var menu = pathArray[4].split(".")[0];
        var templ = dot.template(leftMenuHtml);
        var data = {
            room:'住宿',
            food:'餐饮',
            entertainment:'娱乐',
            roomPath:'/view/business/category/room.html',
            foodPath:'/view/business/category/food.html',
            entertainmentPath:'/view/business/category/entertainment.html',
            business: '业务设置',
            salesite: '直销网站设置',
            setting: '收款设置',
            businessPath: '/view/business/category/room.html',
            salesitePath: '/view/salesite/operation/operation.html',
            settingPath: '/view/setting/weixin/weixin.html',
            operation:'网站运营',
            info:'基本信息',
            operationPath: '/view/salesite/operation/operation.html',
            infoPath: '/view/salesite/info/info.html',
            weixin: '企业微信支付',
            zhifubao: '企业支付宝',
            other: '其他',
            weixinPath: '/view/setting/weixin/weixin.html',
            zhifubaoPath: '/view/setting/zhifubao/zhifubao.html',
            otherPath: '/view/setting/other/other.html'
        };
        $('.header').after(templ(data));
        $('#'+ menu +'Menu').addClass('active');
        $('#'+ menuParent +'ParentMenu').addClass('active');
        $('#'+  menuParent +'Menu').css('display','block').siblings().css('display','none');
    }
};
module.exports = leftMenu;
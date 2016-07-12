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
            shop:'商超',
            entertainment:'娱乐',
            roomPath:'/view/business/category/room.html',
            foodPath:'/view/business/restaurant/restaurant.html',
            entertainmentPath:'/view/business/category/entertainment.html',
            shopPath:'/view/business/category/shop.html',
            business: '业务设置',
            businessPath: '/view/business/category/room.html',

            operation:'网站运营',
            info:'基本信息',
            operationPath: '/view/salesite/operation/operation.html',
            infoPath: '/view/salesite/info/info.html',
            salesite: '直销网站设置',
            salesitePath: '/view/salesite/operation/operation.html',

            codeOperation: '网站运营',
            codeOperationPath: '/view/codesite/operation/codeOperation.html',
            codesite: '一码通网站设置',
            codesitePath: '/view/codesite/operation/codeOperation.html',

            method: '支付方式',
            methodPath: '/view/setting/method/method.html',
            setting: '收款设置',
            settingPath: '/view/setting/method/method.html',

            source: '客源列表',
            sourcePath: '/view/guest/source/source.html',
            guest: '客源设置',
            guestPath: '/view/guest/source/source.html',

            lineOperation: '网站运营',
            lineOperationPath: '/view/linesite/operation/lineOperation.html',
            linesite: '排队网站设置',
            linesitePath: '/view/linesite/operation/lineOperation.html',
            // tipsMethod: '支付方式',
            //tipsMethodPath: '/view/setting/tipsMethod/tipsMethod.html'
        };
        $('.header').after(templ(data));
        $('#'+ menu +'Menu').addClass('active');
        $('#'+ menuParent +'ParentMenu').addClass('active');
        $('#'+  menuParent +'Menu').css('display','block').siblings().css('display','none');
    }
};
module.exports = leftMenu;
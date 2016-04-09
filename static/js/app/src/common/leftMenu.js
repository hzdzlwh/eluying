var leftMenuHtml = require('./leftMenu.html');
var dot = require('dot');
var leftMenu = {
    showLeftMenu: function() {
        var pathArray = window.location.pathname.split("/");
        var path = (pathArray[2]);
        var menu = pathArray[3].split(".")[0];
        var templ = dot.template(leftMenuHtml);
        var data = {
            room:'住宿',
            food:'餐饮',
            entertainment:'娱乐',
            roomPath:'/view/'+path+'/room.html',
            foodPath:'/view/'+path+'/food.html',
            entertainmentPath:'/view/'+path+'/entertainment.html',
            service: '业务设置',
            website: '直销网站设置',
            charge: '收款设置',
            servicePath: '#',
            websitePath: '#',
            chargePath: '#',
            web:'网站运营',
            information:'基本信息',
            manage:'商品管理',
            webPath: '#',
            informationPath: '#',
            managePath: '#',
            weixin: '企业微信支付',
            zhifubao: '企业支付宝',
            other: '其他',
            weixinPath: '#',
            zhifubaoPath: '#',
            otherPath: '#'
        };
        $(".header").after(templ(data));
        $("#"+ menu +"Menu").addClass("active");
    }
};
module.exports = leftMenu;
/**
 * Created by zhaoyongsheng on 16/4/11.
 */
var topMenuHtml = require('./topMenu.html');
var dot = require('dot');
var topMenu = {
    showTopMenu: function(){
        var pathArray = window.location.pathname.split('/');
        var menu = pathArray[3];
        var path = pathArray[4].split(".")[0];
        var templ = dot.template(topMenuHtml);
        var data = {
            category:'品类管理',
            inventory:'库存管理',
            price:'价格维护',
            categoryPath:'/view/business/category/'+ path +'.html',
            inventoryPath:'/view/business/inventory/'+ path +'.html',
            pricePath:'/view/business/price/'+ path +'.html'
        };
        $('.topMenu').before(templ(data));
        $('#'+ menu +'Menu').addClass('active');
    }
};
module.exports = topMenu;
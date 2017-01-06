/**
 * Created by zhaoyongsheng on 16/4/11.
 */
var topMenuHtml = require('./topMenu.html');
var dot = require('dot');
var topMenu = {
    showTopMenu: function(option){
        var pathArray = window.location.pathname.split('/');
        var menu = pathArray[4];
        var path = pathArray[5].split(".")[0];
        var templ = dot.template(topMenuHtml);
        var query = location.search;
        var data = {
            category:'品类管理',
            inventory:'库存管理',
            inventoryDisplay: (option && option.showInventory === false) ? 'none' : 'block',
            price:'价格维护',
            categoryPath:'/view/settings/business/category/'+ path +'.html',
            inventoryPath:'/view/settings/business/inventory/'+ path +'.html',
            pricePath:'/view/settings/business/price/'+ path +'.html'
        };
        if (path === 'food') {
            data.categoryPath = '/view/settings/business/restaurant/dishes.html?' + query;
        }
        $('.topMenu').before(templ(data));
        $('#'+ menu +'Menu').addClass('active');
    }
};
module.exports = topMenu;
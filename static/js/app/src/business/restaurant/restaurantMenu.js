/**
 * Created by lingchenxuan on 16/6/18.
 */
var restaurantMenu = {
    render: function(option) {
        var query = location.search;
        var menu = (option && option.menuActive) || location.pathname.split("/")[4].split(".")[0];
        var html = '<ul id="businessMenu">' +
            '<div class="leftMenu-back"><a href="' + '/view/business/restaurant/restaurant.html' + '"><div>《 返回</div><div>餐厅列表</div></a></div>' +
            '<li><a id="dishesMenu" href="' + '/view/business/restaurant/dishes.html' + query + '">菜品</a></li>' +
            '<li><a id="tableMenu" href="' + '/view/business/restaurant/table.html' + query + '">桌子</a></li>' +
            '</ul>';
        $('.leftMenu').html(html);
        $('#'+ menu +'Menu').addClass('active');
    }
};
module.exports = restaurantMenu;
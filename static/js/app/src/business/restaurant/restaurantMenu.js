/**
 * Created by lingchenxuan on 16/6/18.
 */
var restaurantMenu = {
    render: function(option) {
        var reg = /\?*/g;
        var query = location.search.replace(reg,"");
        var menu = (option && option.menuActive) || location.pathname.split("/")[5].split(".")[0];
        var html = '<div class="leftMenu-back"><a href="/view/settings/business/restaurant/restaurant.html"><div>《 返回</div><div>餐厅列表</div></a></div>'
            + '<li><a id="dishesMenu" href="/view/settings/business/restaurant/dishes.html?' + query +'">菜品</a></li>'
            + '<li><a id="tableMenu" href="/view/settings/business/restaurant/table.html?' + query +'">桌子</a></li>'
            + '<li><a id="otherMenu" href="/view/settings/business/restaurant/other.html?' + query +'">其他设置</a></li>';
        $('#leftMenu-children').html(html);
        $('#'+ menu +'Menu').addClass('active');
    }
};
module.exports = restaurantMenu;
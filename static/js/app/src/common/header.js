exports.header = {
    headerStr: "<div class='header clearfloat'>"
    + "<a class='logo' href='#'>易露云</a>"
    + "<ul>"
    + "<li><a id='inventoryMenu' href='#'>库存管理</a></li>"
    + "<li><a id='priceMenu' href='/eluyun/view/price/room.html'>价格维护</a></li>"
    + "<li><a id='categoryMenu' href='/eluyun/view/category/room.html'>品类管理</a></li>"
    + "</ul>"
    + "<div class='right'>"
    + "<div class='userPhoto'><a href='#'><img src='/eluyun/static/image/timg.jpg' alt='头像'></a></div>"
    + "<div class='userName'>"
    + "<a href='#'></a>"
    + "</div>"
    + "<div class='line'></div>"
    + "<div class='logout'>"
    + "<a href='javascript:void(0)' id='logout'>退出账户</a>"
    + "</div>"
    + "</div>"
    + "</div>",
    showHeader: function () {
        $("body").prepend(this.headerStr);
        var pathArray = window.location.pathname.split("/");
        var menu = pathArray[3];
        $("#" + menu + "Menu").addClass("active");
    }
};

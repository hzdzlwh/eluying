var logout = require("logout");
var util = require("util");
var header = {
    showHeader : function(){
        var headerStr = "<div class='header clearfloat'><img src='/static/image/bannerLogo.png' width='100px' class='logo'><ul>"
            + "<li><a id='inventoryMenu' href='/view/inventory/room.html'>库存管理</a></li>"
            + "<li><a id='priceMenu' href='/view/price/room.html'>价格维护</a></li>"
            + "<li><a id='categoryMenu' href='/view/category/room.html'>品类管理</a></li>"
            + "</ul>"
            + "<div class='right'>"
            + "<div class='userName'>"
            + "<span></span>"
            + "</div>"
            + "<div class='line'></div>"
            + "<div class='logout'>"
            + "<a href='javascript:void(0)' id='logout'>退出账户</a>"
            + "</div>"
            + "</div>"
            + "</div>";
        $("body").prepend(headerStr);
        $(".userName").find("span").html(localStorage.getItem("userName"));
        var pathArray = window.location.pathname.split("/");
        var menu = pathArray[2];
        $("#" + menu + "Menu").addClass("active");
        util.bindDomAction(this.events);
    },
    events: {
        "click #logout": logout.logout
    }
};
module.exports = header;
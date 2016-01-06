var logout = require("logout");
var util = require("util");
var header = {
    showHeader : function(){
        var headerStr = "<div class='header clearfloat'><a class='logo' href='#'>订单来了</a><ul>"
            + "<li><a id='inventoryMenu' href='/view/inventory/room.html'>库存管理</a></li>"
            + "<li><a id='priceMenu' href='/view/price/room.html'>价格维护</a></li>"
            + "<li><a id='categoryMenu' href='/view/category/room.html'>品类管理</a></li>"
            + "</ul>"
            + "<div class='right'>"
            + "<div class='userPhoto'><a href='#'><img src='/static/image/timg.jpg' alt='头像'></a></div>"
            + "<div class='userName'>"
            + "<a href='#'></a>"
            + "</div>"
            + "<div class='line'></div>"
            + "<div class='logout'>"
            + "<a href='javascript:void(0)' id='logout'>退出账户</a>"
            + "</div>"
            + "</div>"
            + "</div>";
        $("body").prepend(headerStr);
        $(".userName").find("a").html(localStorage.getItem("userName"));
        var pathArray = window.location.pathname.split("/");
        var menu = pathArray[3];
        $("#" + menu + "Menu").addClass("active");
        util.bindDomAction(this.events);
    },
    events: {
        "click #logout": logout.logout
    }
};
module.exports = header;
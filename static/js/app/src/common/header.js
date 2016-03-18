var logout = require("logout");
var util = require("util");
var header = {
    showHeader : function(){
        var headerStr = "<div class='header clearfloat'><p class='camp-name'>" + localStorage.getItem('campName') + "</p>" +
            "<img src='../../static/image/upload.png' class='upload'>" +
            "<ul>" +
            "<li><a id='categoryMenu' href='/view/category/room.html'>品类管理</a></li>" +
            "<li><a id='inventoryMenu' href='/view/inventory/room.html'>库存管理</a></li>" +
            "<li><a id='priceMenu' href='/view/price/room.html'>价格维护</a></li>" +
            "</ul>" +
            "<div class='right'>" +
            "<div class='userName'>" +
            "<span></span>" +
            "</div>" +
            "<div class='logout' style='display: none'>" +
            "<a href='javascript:void(0)' id='logout'>退出账户</a>" +
            "</div>" +
            "</div>" +
            "</div>"; +
        $("body").prepend(headerStr);
        //根据path激活active
        $(".userName").find("span").html(localStorage.getItem("userName"));
        var pathArray = window.location.pathname.split("/");
        var menu = pathArray[2];
        $("#" + menu + "Menu").addClass("active");
        util.bindDomAction(this.events);
    },
    events: {
        "click #logout": function(e) {
            e.stopPropagation();
            logout.logout();
        },
        "click .userName": function(e) {
            e.stopPropagation();
            $(this).addClass('userName-active');
            $('.logout').show();
        },
        "click body": function() {
            $('.userName').removeClass('userName-active');
            $('.logout').hide();
        }
    }
};

module.exports = header;
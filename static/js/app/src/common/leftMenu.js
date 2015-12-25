var leftMenu = {
    showLeftMenu: function() {
        var pathArray = window.location.pathname.split("/");
        var path = (pathArray[3]);
        var str = "<div class='leftMenu'><ul><li><a id='roomMenu' href='/eluyun/view/" + path + "/room.html'>住宿</a></li>"
            + "<li><a id='foodMenu' href='/eluyun/view/" + path + "/food.html'>餐饮</a></li>"
            + "<li><a id='enterMenu' href='/eluyun/view/" + path + "/entertainment.html'>娱乐</a></li></ul></div>";
        var menu = pathArray[4].split(".")[0];
        $(".header").after(str);
        $("#" + menu + "Menu").addClass("active");
    }
};
module.exports = leftMenu;
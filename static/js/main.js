$(document).ready(function(){
    $("body").prepend("<nav>"
        + "<div class='myContainer'>"
        + "<a class='logo' href='#'>易露云</a>"
        + "<ul>"
        + "<li><a id='inventoryMenu' href='#'>库存管理</a></li>"
        + "<li><a id='priceMenu' href='#'>价格维护</a></li>"
        + "<li><a id='categoryMenu' href='/eluyun/view/category/room.html'>品类管理</a></li>"
        + "</ul>"
        + "<div class='userPhoto pie'><a href='#'><img src='/eluyun/static/image/timg.jpg' alt='头像'></a></div>"
        + "<div class='userName'>"
        + "<a href='#'></a>"
        + "</div>"
        + "<div class='line'></div>"
        + "<div class='logout'>"
        + "<a href='#'>退出账户</a>"
        + "</div>"
        + "</div>"
        + "</nav>")
    $(".mainContainer").prepend("<div class='menu'>"
        + "<ul>"
        + "<li><a id='roomMenu' class='pie' href='/eluyun/view/category/room.html'>住宿</a></li>"
        + "<li><a id='foodMenu' href='/eluyun/view/category/food.html'>餐饮</a></li>"
        + "<li><a id='enterMenu' href='/eluyun/view/category/entertainment.html'>娱乐</a></li>"
        + "<li><a id='shopMenu' href='/eluyun/view/category/shop.html'>商超</a></li>"
        + "</ul>"
        + "</div>")
    $(".mainClass").click(function(){
        $(".mainClass").removeClass("mainActive");
        $(".subclass").removeClass("subActive");
        $(this).addClass("mainActive");
    })
    $(".subclass").click(function(){
        $(".mainClass").removeClass("mainActive");
        $(".subclass").removeClass("subActive");
        $(this).addClass("subActive");
    })
    $(".modal").modal({
        backdrop: "static",
        show: false,
        keyboard: true
    });
    function centerModals(){
        $('.modal').each(function(){
            var $clone = $(this).clone().css('display', 'block').appendTo('body');
            var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2) - 52;
            top = top > 0 ? top : 0;
            $clone.remove();
            $(this).find('.modal-content').css("margin-top", top);
        });
    }
    $('.modal').on('show.bs.modal', centerModals);
    $(window).on('resize', centerModals);
    $(".btn-cancel").click(function(){
        $(this).parents(".modal").modal("hide");
    });
})

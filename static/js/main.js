function bindMainActive(){
    $(".mainClass").on("click", function(){
        $(".mainClass").removeClass("mainActive");
        $(".subclass").removeClass("subActive");
        $(this).addClass("mainActive");
    });
}

function  bindSubActive(){
    $(".subclass").on("click", function(){
        $(".mainClass").removeClass("mainActive");
        $(".subclass").removeClass("subActive");
        $(this).addClass("subActive");
    });
}

function centerModals(){
    $('.modal').each(function(){
        var $clone = $(this).clone().css('display', 'block').appendTo('body');
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2) - 52;
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top);
    });
}

//关闭模态框
function clearModal(that){
    $(that).parents(".modal").modal("hide");
    $(that).parents(".modal").find("input").val(""); //将输入框清空
    $(that).parents(".modal").find("tbody").html(""); //将表单清空
}

//确认弹出框
function confirmDialog(dialogConfig,confirmCallback){
    dialogConfig= dialogConfig||{title:"提示", message:"您确定要这么做吗？"};
    $("body").prepend(
        "<div class='modal fade' role='dialog' id='confirmDialog'>" +
            "<div class='modal-dialog modal-w392'>" +
                "<div class='modal-content clearfloat'>" +
                    "<div class='modal-header'>" +
                        "<p>" + dialogConfig.title + "</p>" +
                    "</div>" +
                    "<div class='modal-body'>" +
                        "<p>" +dialogConfig.message + "</p>" +
                    "</div>" +
                    "<div class='footer clearfloat'>" +
                        "<button class='btn-cancel' id='confirmDialogCancel'>取消</button>" +
                        "<button class='btn-ok' id='confirmDialogOk'>确认</button>" +
                    "</div>" +
                "</div>" +
            "</div>" +
        "</div>");
    $("#confirmDialog").modal("show");
    centerModals();
    $('#confirmDialogOk').on("click", function(){
        confirmCallback&&confirmCallback();
    });
    $('#confirmDialogCancel').on("click", function(){
        $("#confirmDialog").modal("hide");
        $(".modal-backdrop").remove();
        $("#confirmDialog").remove();
    });
};

$(document).ready(function(){
    //顶部导航栏
    $("body").prepend("<nav>"
        + "<div class='myContainer clearfloat'>"
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
        + "<a href='javascript:void(0)' id='logout'>退出账户</a>"
        + "</div>"
        + "</div>"
        + "</nav>");
    //左侧菜单
    $(".mainContainer").prepend("<div class='menu'>"
        + "<ul>"
        + "<li><a id='roomMenu' class='pie' href='/eluyun/view/category/room.html'>住宿</a></li>"
        + "<li><a id='foodMenu' href='/eluyun/view/category/food.html'>餐饮</a></li>"
        + "<li><a id='enterMenu' href='/eluyun/view/category/entertainment.html'>娱乐</a></li>"
        + "<li><a id='shopMenu' href='/eluyun/view/category/shop.html'>商超</a></li>"
        + "</ul>"
        + "</div>");

    $(".modal").modal({
        backdrop: "static",
        show: false,
        keyboard: true
    });

    //绑定模态框居中
    $('.modal').on('show.bs.modal', centerModals);
    $(window).on('resize', centerModals);

    //绑定模态框取消按钮
    $(".btn-cancel").on("click", function(){
        var that = this;
        clearModal(that);
    });

    //退出登录
    $('#logout').click(function(){
        $.get("http://192.168.0.2:8082/mg/user/logout;jsessionid=" + $.cookie("jsessionid"));
        $.cookie("campName", "", {path: "/"});
        $.cookie("userName", "", {path: "/"});
        $.cookie("jsessionid", "", {path: "/"});
        location.href = "/eluyun/view/loginTest.html";
    });
});

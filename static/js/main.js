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
    $(that).parents(".modal").find(".operateItem").addClass("hide");
    $(that).parents(".modal").modal("hide");
    $(that).parents(".modal").find("input").val(""); //将输入框清空
    $(that).parents(".modal").find("textarea").val("");
    $(that).parents(".modal").find("tbody").html(""); //将表单清空
    if ($(that).parents(".modal").find("form").length != 0) {
        $(that).parents(".modal").find("form").validate().resetForm();
    }
    $(that).parents(".modal").find("input[type=radio]").prop(false);
    $("coverError").addClass("hide");
    $("detailError").addClass("hide");

}

//错误验证
function errorHandler(result){
    if (result.code != 1) {
        somethingAlert(result.msg);
        return false;
    } else {
        somethingAlert("操作成功");
        return true;
    }
}

//错误提示框
function somethingAlert(message){
    $("body").prepend(
        "<div class='modal fade' role='dialog' id='errorAlert'>" +
        "<div class='modal-dialog modal-w392'>" +
        "<div class='modal-content clearfloat'>" +
        "<div class='modal-header'>" +
        "<p>" + "提示" + "</p>" +
        "</div>" +
        "<div class='modal-body'>" +
        "<p>" + message + "</p>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>");
    $("#errorAlert").modal("show");
    centerModals();
    setTimeout(function(){
        $("#errorAlert").modal("hide");
    }, 1000);
}

function getUrl(path){
    var url = host + path;
    if (rewriteUrl == true) {
        url += ";jsessionid=" + $.cookie("jsessionid");
    }
    return url;
}

//详细信息提示
function showMoreInfo(event, that){
    var x;
    var y;
    function getPos(e){
        x = e.pageX;
        y = e.pageY;
    }
    document.addEventListener('mousemove', getPos);
    moreInfoT = setTimeout(function(){
        $("body").append("<div class='moreInfo'></div>");
        $(".moreInfo").html($(that).html()).css("top", y).css("left", x);
        document.removeEventListener('mousemove', getPos);
    }, 500);
}

function hideMoreInfo(){
    clearTimeout(moreInfoT);
    $(".moreInfo").remove();
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
        $("#confirmDialog").modal("hide");
        $(".modal-backdrop").remove();
        $("#confirmDialog").remove();
    });
    $('#confirmDialogCancel').on("click", function(){
        $("#confirmDialog").modal("hide");
        $(".modal-backdrop").remove();
        $("#confirmDialog").remove();
    });
}

function mainContainer(){
    var width = document.body.clientWidth - 65;
    if (width < 1135) {
        width = 1135;
    }
    $(".mainContainer").css("width", width);
}

$(document).ready(function(){
    modalInit();
    mainContainer();
    //顶部导航栏
    $("body").prepend("<div class='header clearfloat'>"
            + "<a class='logo' href='#'>订单来了</a>"
            + "<ul>"
                + "<li><a id='inventoryMenu' href='/view/inventory/room.html'>库存管理</a></li>"
                + "<li><a id='priceMenu' href='/view/price/room.html'>价格维护</a></li>"
                + "<li><a id='categoryMenu' href='/view/category/room.html'>品类管理</a></li>"
            + "</ul>"
            + "<div class='right'>"
                + "<div class='userPhoto pie'><a href='#'><img src='/static/image/timg.jpg' alt='头像'></a></div>"
                + "<div class='userName'>"
                    + "<a href='#'></a>"
                + "</div>"
                + "<div class='line'></div>"
                + "<div class='logout'>"
                    + "<a href='javascript:void(0)' id='logout'>退出账户</a>"
                + "</div>"
            + "</div>"
        + "</div>"
        );

    //左侧菜单
    $(".header").after("<div class='leftMenu'>"
        + "<ul>"
        + "<li><a id='roomMenu' class='pie' href='/view/category/room.html'>住宿</a></li>"
        + "<li><a id='foodMenu' href='/view/category/food.html'>餐饮</a></li>"
        + "<li><a id='enterMenu' href='/view/category/entertainment.html'>娱乐</a></li>"
        + "</ul>"
        + "</div>");

    function modalInit(){
        $(".modal").modal({
            backdrop: "static",
            show: false,
            keyboard: true
        });
    }

    //绑定模态框居中
    $('.modal').on('show.bs.modal', function(){
        centerModals();
    });

    $(window).on('resize', function(){
        centerModals();
        mainContainer();
    });

    //绑定模态框取消按钮
    $(".btn-cancel").on("click", function(){
        var that = this;
        clearModal(that);
    });

    //退出登录
    $('#logout').click(function(){
        $.get(getUrl(logoutUrl));
        localStorage.clear();
        location.href = "/login.html";
    });
});

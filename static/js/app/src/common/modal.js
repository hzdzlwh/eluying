require("bootstrap");
require("validate");
function centerModals(){
    $('.modal').each(function(){
        var $clone = $(this).clone().css('display', 'block').appendTo('body');
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2) - 52;
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top);
    });
}

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

function modalInit(){
    $(".modal").modal({
        backdrop: "static",
        show: false,
        keyboard: true
    });
}

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

//确认弹出框
function confirmDialog(dialogConfig,confirmCallback,cancelCallback){
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
        cancelCallback&&cancelCallback();
        $("#confirmDialog").modal("hide");
        $(".modal-backdrop").remove();
        $("#confirmDialog").remove();
    });
}


exports.centerModals =  centerModals;
exports.clearModal = clearModal;
exports.modalInit = modalInit;
exports.somethingAlert = somethingAlert;
exports.confirmDialog = confirmDialog;
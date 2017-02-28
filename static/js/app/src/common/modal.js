require("bootstrap");
require("validate");
function centerModals(){
    $('.modal').each(function(){
        var hasShown = $(this).css('display') === 'block';
        $(this).css('display', 'block');
        var top = ($(this).height() - $(this).find('.modal-dialog').height()) / 2;
        top = top > 0 ? top : 0;
        if (!hasShown) {
            $(this).css('display', 'none');
        }
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
    if ($('.error-alert-container').length === 0) {
        $("body").prepend('<div class="error-alert-container"></div>');
    }
    $(".error-alert-container").html(
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
    }, 2500);
}

function ajaxWaiting(message){
    $("body").prepend(
        "<div class='modal fade' role='dialog' id='waitingModal'>" +
        "<div class='modal-dialog modal-w392'>" +
        "<div class='modal-content clearfloat'>" +
        "<div class='modal-header'>" +
        "<p>" + "请稍后" + "</p>" +
        "</div>" +
        "<div class='modal-body'>" +
        "<p>" + message + "</p>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>");
    $("#errorAlert").modal("show");
    centerModals();
}

//确认弹出框
function confirmDialog(dialogConfig, confirmCallback, cancelCallback) {
    var title = dialogConfig.title || '提醒';
    var message = dialogConfig.message || '您确定要这么做吗';
    var okText = dialogConfig.okText || '确认';
    var cancelText = dialogConfig.cancelText || '取消';
    var showTitle = typeof (dialogConfig.showTitle) === 'undefined' ? true : dialogConfig.showTitle;
    var hasOk = dialogConfig.hasOk;
    var hasCancel = dialogConfig.hasCancel;
    var header = showTitle ? "<div class='modal-header'>" +
    "<p>" + title + "</p>" +
    "</div>" : '';
    var okButton = hasOk === false ? '' : '<button class="dd-btn dd-btn-primary" id="confirmDialogOk">' + okText + '</button>';
    var cancelButton = hasCancel === false ? '' : '<button class="dd-btn dd-btn-ghost" id="confirmDialogCancel">' + cancelText + '</button>';
    if ($('.confirm-dialog-container').length === 0) {
        $("body").prepend('<div class="confirm-dialog-container"></div>');
    }
    $('.confirm-dialog-container').html(
        "<div class='modal fade' role='dialog' id='confirmDialog'>" +
        "<div class='modal-dialog' style='width: 300px'>" +
        "<div class='modal-content clearfloat'>" +
        header +
        "<div class='modal-body'>" +
        "<p>" + message + "</p>" +
        "</div>" +
        "<div class='footer'>" +
        okButton +
        cancelButton +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>");
    $("#confirmDialog").modal("show");
    centerModals();
    hasOk !== false && $('#confirmDialogOk').on("click", function(){
        $("#confirmDialog").modal("hide");
        // bootstrap 去遮罩要再fade动画完成后执行，时间是300ms
        confirmCallback && setTimeout(confirmCallback, 301);
        // $(".modal-backdrop").remove();
        //$("#confirmDialog").remove();
    });
    hasCancel !== false && $('#confirmDialogCancel').on("click", function(){
        $("#confirmDialog").modal("hide");
        cancelCallback && setTimeout(cancelCallback, 301);
        // $(".modal-backdrop").remove();
        //$("#confirmDialog").remove();
    });
}


exports.centerModals =  centerModals;
exports.clearModal = clearModal;
exports.modalInit = modalInit;
exports.somethingAlert = somethingAlert;
exports.confirmDialog = confirmDialog;
exports.ajaxWaiting = ajaxWaiting;
exports.alert = somethingAlert;
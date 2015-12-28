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
    $(that).parents(".modal").modal("hide");
    $(that).parents(".modal").find(".operateItem").addClass("hide");
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

exports.centerModals =  centerModals;
exports.clearModal = clearModal;
/**
 * Created by huwanqi on 15/12/26.
 */
function trToggle(pClass){
    $("body").on("click", ".mainClass", function(){
        var that = $(this);
        if ($(this).nextUntil(".mainClass").hasClass("hide")) {
            $(this).find("img").addClass("rotate");
            $(this).nextUntil(".mainClass").find("div").hide();
            $(this).nextUntil(".mainClass").removeClass("hide");
            $(this).nextUntil(".mainClass").find("div").slideDown(300);
        } else{
            $(this).find("img").removeClass("rotate");
            $(this).nextUntil(".mainClass").find("div").slideUp(300);
            setTimeout(function(){
                that.nextUntil(".mainClass").addClass("hide");
            }, 300);
        }
    });
}

module.exports = trToggle;
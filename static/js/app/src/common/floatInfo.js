var floatInfo = {
    showMoreInfo: function(event, that){
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
    },

    hideMoreInfo: function(){
        clearTimeout(moreInfoT);
        $(".moreInfo").remove();
    }
};

module.exports = floatInfo;
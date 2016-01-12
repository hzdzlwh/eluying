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
            $(".moreInfo").html($(that).html().replace(/\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029)/g, "<br>")).css("top", y + 10).css("left", x + 10);
            document.removeEventListener('mousemove', getPos);
        }, 500);
    },

    hideMoreInfo: function(){
        clearTimeout(moreInfoT);
        $(".moreInfo").remove();
    }
};

module.exports = floatInfo;
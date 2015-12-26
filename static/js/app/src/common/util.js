var util = {
    mainContainer: function(){
        var width = document.body.clientWidth - 65;
        if (width < 1135) {
            width = 1135;
        }
        $(".mainContainer").css("width", width);
    },

    bindDomAction: function(events){
        var eventDef,eventsInfoArray;
        for (eventDef in events) {
            if (events.hasOwnProperty(eventDef)) {
                if(events[eventDef]) {
                    eventsInfoArray = eventDef.split(" ");
                    if(eventsInfoArray.length == 3){
                        $(eventsInfoArray[1]).on(eventsInfoArray[0], eventsInfoArray[2], events[eventDef]);
                    }else if(eventsInfoArray.length == 2){
                        $(eventsInfoArray[1]).on(eventsInfoArray[0], events[eventDef]);
                        if (eventsInfoArray[1] == "window") {
                            $(window).on(eventsInfoArray[0], events[eventDef]);
                        }
                    }else{
                        console.warn("事件绑定格式错误");
                    }

                }
            }
        }
    },

    dateFormat: function(date){
        return date.toLocaleDateString().replace(/\//g, "-");
    }
};
module.exports = util;

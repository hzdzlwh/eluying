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
                    $(eventsInfoArray[1]).on(eventsInfoArray[0], events[eventDef]);
                }
            }
        }
    }
};
module.exports = util;

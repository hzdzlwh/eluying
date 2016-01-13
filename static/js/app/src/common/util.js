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

    errorHandler: function(result){
        var modal = require("modal");
        if (result.code != 1) {
            modal.somethingAlert(result.msg);
            return false;
        } else {
            modal.somethingAlert("操作成功");
            return true;
        }
    },

    dateFormat: function(date){
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    },

    prevWeek: function(){
        var currentDate = $("#datePicker").datepicker( "getDate" );
        $("#datePicker").datepicker( "setDate", new Date(currentDate.setDate(currentDate.getDate() - 7)));
        $("#datePicker").trigger("dateChange");
    },

    nextWeek: function(){
        var currentDate = $("#datePicker").datepicker( "getDate" );
        $("#datePicker").datepicker( "setDate", new Date(currentDate.setDate(currentDate.getDate() + 7)));
        $("#datePicker").trigger("dateChange");
    },

    getWeek: function(d){
        var week = ["周日","周一","周二","周三","周四","周五","周六"];
        return week[d.getDay()];
    },

    getFirstDay: function(date){
        return new Date(date.setDate(1));
    },

    getLastDay: function(firstDate){
        var endDate = new Date(firstDate);
        endDate.setMonth(endDate.getMonth()+1);
        endDate.setDate(0);
        return endDate;
    },

    //“yyyy-MM-dd” 转换成日期型
    stringToDate: function(string){
        var array = string.split("-");
        var date = new Date();
        date.setUTCFullYear(array[0], array[1] - 1, array[2]);
        date.setUTCHours(0, 0, 0, 0);
        return date;
    },

    diffDate: function(date, diff){
        return new Date(date.valueOf() + diff*24*60*60*1000);
    },

    compareDates: function(date1, date2){
        //return date1.getFullYear() > date2.getFullYear() || (date1.getFullYear() == date2.getFullYear()
        //    && date1.getMonth() > date2.getMonth()) || (date1.getFullYear() == date2.getFullYear()
        //    && date1.getMonth() == date2.getMonth() && date1.getDate() >= date2.getDate())
        return date1 > date2;
    },

    isSameDay: function(date1, date2){
        return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth()
            && date1.getDate() == date2.getDate();
    },

    dateFormatWithoutYear: function(date){
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return m + '-' + d;
    },

    centroidDiv: function(dom, pdom){
        var cw = $(dom).width();
        var pw = $(pdom).width();
        $(dom).css({
            position: "relative",
            left: (pw-cw)/2
        });
    }
};
module.exports = util;

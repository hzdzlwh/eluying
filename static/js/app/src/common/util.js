var util = {
    mainContainer: function(){
        var width = document.body.clientWidth - 220;
        if (width < 980) {
            width = 980;
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

    errorHandler: function(result, msg){
        var modal = require("modal");
        if (result.code != 1) {
            modal.somethingAlert(result.msg);
            return false;
        } else {
            if (msg) {
                modal.somethingAlert(msg)
            } else {
                modal.somethingAlert("操作成功");
            }
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
    },

    checkExplorer: function(){
        var flag = true;
        if(navigator.userAgent.indexOf("MSIE")>0)
        {
            if(navigator.userAgent.indexOf("MSIE 6.0")>0)
            {
                flag = true;
            }
            if(navigator.userAgent.indexOf("MSIE 7.0")>0)
            {
                flag = true;
            }
            if(navigator.userAgent.indexOf("MSIE 8.0")>0)
            {
                flag = true;
            }
            if(navigator.userAgent.indexOf("MSIE 9.0")>0)
            {
                flag = false;
            }
        }else
        {
            flag = false;
        }
        if(flag){
            window.location.href = "/view/tips/tips.html";
        }
    },

    checkAuth: function(){
        var campId = localStorage.getItem("campId");
        var camps = localStorage.getItem("camps");
        camps = JSON.parse(camps);
        var flag = false;
        //UNKNOWN(-1, "未知"), SYSTEM_ADMIN(0, "易露云管理员-准备废弃"), HOST(1, "营地主"), EMPLOYEE(2, "普通员工"), ADMIN(3, "管理员");
        for(var i = 0; i < camps.length; i++){
            var camp = camps[i];
            if(campId == camp.campId && camp.userType != 2){
                flag = true;
            }
        }
        var href = window.location.href;
        if(!flag){
            if(href.indexOf("/view/tips/noauth.html") > 0){

            }else{
                window.location.href = '/view/tips/noauth.html';
            }
        }else{
            if(href.indexOf("/view/tips/noauth.html") > 0){
                window.location.href = '/view/business/category/room.html';
            }else{

            }
        }
    }
};
module.exports = util;

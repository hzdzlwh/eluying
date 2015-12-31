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
        return date.toLocaleDateString().replace(/\//g, "-");
    },

    lastWeek: function(){
        var datepicker = $(this).siblings(".dateContainer");
        var currentDate = datepicker.datepicker( "getDate" );
        datepicker.datepicker( "setDate", new Date(currentDate.setDate(currentDate.getDate() - 7)));
        datepicker.trigger("dateChange");
    },

    nextWeek: function(){
        var datepicker = $(this).siblings(".dateContainer");
        var currentDate = datepicker.datepicker( "getDate" );
        datepicker.datepicker( "setDate", new Date(currentDate.setDate(currentDate.getDate() + 7)));
        datepicker.trigger("dateChange");
    },

    getWeek: function(d){
        var week = ["周日","周一","周二","周三","周四","周五","周六"];
        return week[d.getDay()];
    },

    clone: function(obj){
        var result,oClass = util.isClass(obj);
        //确定result的类型
        if(oClass==="Object"){
            result = {};
        }else if(oClass === "Array"){
            result = [];
        }else{
            return obj;
        }
        for(var key in obj){
            var copy = obj[key];
            if(util.isClass(copy) == "Object"){
                result[key]=arguments.callee(copy);//递归调用
            }else if(util.isClass(copy)=="Array"){
                result[key]=arguments.callee(copy);
            }else{
                result[key]=obj[key];
            }
        }
        return result;
    },

    isClass: function(o){
        if(o===null) return "Null";
        if(o===undefined) return "Undefined";
        return Object.prototype.toString.call(o).slice(8,-1);
    }
};
module.exports = util;

/**
 * Created by huwanqi on 16/5/1.
 */
var header = require("header");
var leftMenu = require("leftMenu");
var topMenu = require("../../common/topMenu");
var util = require("util");
var modal = require("modal");
require("angular");

require("jqueryui");
require("datepicker-zh");
require("bootstrap");
require("validation");

$(function(){
    //初始化界面
    header.showHeader();
    //高亮"前台录入"
    $(".settingsEntry").removeClass("selected");
    $(".accomodationEntry").addClass("selected");
    topMenu.showTopMenu();
    modal.modalInit();

    $(".entryList")[0].oncontextmenu = function(){
        return false;
    };
    $(".entryList")[0].onselectstart  = function(){
        return false;
    };
    // $(".search").show();

    //初始化日历
    // $.datepicker.setDefaults( $.datepicker.regional[ "zh-CN" ] );
    // $("#datePicker").datepicker({
    //     dateFormat: "yy-mm-dd",
    //     changeMonth: true,
    //     changeYear: true
    // });
    // $("#datePicker").datepicker( "setDate", new Date());
    // var locked = false;
    events = {

        "show.bs.modal .modal": modal.centerModals,
        "scroll .calendor-container": function(){
            var scrollLeft = $(this).scrollLeft();
            var scrollTop = $(this).scrollTop();
            $(".accommodation-mainContainer .content .sheader").css("margin-left", -scrollLeft);
            $(".accommodation-mainContainer .content .leftHeader").css("margin-top", -scrollTop);
        },
        "click .btn-cancel": function(){var that = this; modal.clearModal(that);},
        "mouseover body .entryItem": function(){
            // if(locked){
            //     return false;
            // }
            var date = $(this).attr("date");
            var room = $(this).parents(".srow").attr("room");
            $(".room-item[room=" + room + "]").addClass("selected");
            $(".date-item[date=" + date + "]").addClass("selected");
        },
        "mouseleave body .entryItem": function(){
            // if(locked){
            //     return false;
            // }
            $(".room-item").removeClass("selected");
            $(".date-item").removeClass("selected");
        },
        "mousedown body .entryItem": function(ev){
            if(ev.which == 3){
                $(".entryOp").hide();
                $(this).find(".entryOp").show();
                // locked = true;
                return false;
            }
            if($(this).hasClass("selected")){
                $(this).removeClass("selected");
            }else{
                $(this).addClass("selected");
            }
        },
        "mousedown body .entryOp": function(ev){
            ev.stopPropagation();
        },
        "click body": function(ev){
            if(!$(ev.target).hasClass("entryOp")){
                $(".entryOp").hide();
                // locked = false;
            }
            // if(!$(ev.target).hasClass("category-filter-menu") || !$(ev.target).hasClass("options")){
            //     $(".category-filter").removeClass("open");
            //     // locked = false;
            // }
        },
        "click body .category-filter-switch": function(ev){
            ev.stopPropagation();
            if(!$(".category-filter").hasClass("open")){
                $(".category-filter").addClass("open");
            }else{
                $(".category-filter").removeClass("open");
            }
        },
        "click body .date-selector-switch": function(ev){
            ev.stopPropagation();
            if(!$(".date-selector").hasClass("open")){
                $(".date-selector").addClass("open");
            }else{
                $(".date-selector").removeClass("open");
            }
        },
        "mouseover body .glyph": function(ev){
            var clientY = ev.clientY;
            var infos = $(this).find(".infos");
            var height = infos.height();
            if(height + 180 > clientY){
                infos.removeClass("up");
                infos.addClass("down");
            }else{
                infos.removeClass("down");
                infos.addClass("up");
            }
            infos.show();
        },
        "mouseleave body .glyph": function(ev){
            $(this).find(".infos").hide();
        }
    };

    util.bindDomAction(events);

    var app = angular.module('calenderApp', []);
    app.controller('calenderCtrl', ['$scope', function(scope) {
        scope.today = util.dateFormatWithoutYear(new Date());
        scope.startDate = util.diffDate(new Date(), -2);
        scope.startDateStr = util.dateFormatWithoutYear(scope.startDate);
        scope.datesArray = [];
        var tempDate = util.diffDate(new Date(), -2);
        for(var i = 0; i < 30; i++){
            scope.datesArray.push({
                date: tempDate,
                dateStr: util.dateFormatWithoutYear(tempDate),
                weekday: util.getWeek(tempDate),
                left: 111
            });
            tempDate = util.tomorrow(tempDate);
        }
        scope.category = [];
        scope.rooms = [];
        var tempId = 0;
        for(var i = 0; i < 5; i++){
            var rooms = [];
            for(var j = 0; j < 3; j++){
                var days = [];
                for(var k = 0; k < 30; k++){
                    days.push({
                        date: scope.datesArray[k].dateStr
                    });
                }
                var room = {
                    id: tempId++,
                    num: '0101',
                    list: days
                };
                rooms.push(room);
                scope.rooms.push(room);
            }
            scope.category.push({
                name: '超屌海景房',
                rooms: rooms
            });
        }
        //type:1退房, 2入住, 3预订
        scope.glyphs = [];
        var gridWidth = 100;
        var gridHeight = 48;
        for(var i = 0; i < 1; i++){
            var date_min = new Date("2016-05-09");
            var date_max = new Date("2016-05-13");
            var diff = util.DateDiff(date_min, date_max);
            var startDiff = util.DateDiff(scope.startDate, date_min);
            var room = 0;
            var top = gridHeight * room + 1;
            var left = 100 * startDiff + 2;
            var width = 100 * diff - 6;
            var glyph = {
                type: Math.ceil(Math.random()),
                top: top,
                left: left,
                width: width
            };
            scope.glyphs.push(glyph);
        }

        //维护日历
        var selectedMonth = null;
        var calenderDays = [];
        var firstDay = new Date();
        firstDay.setDate(1);
        if(selectedMonth && firstDay_Month !== selectedMonth){
            firstDay.setMonth(selectedMonth);
        }
        var firstDay_Month = firstDay.getMonth();
        var firstDay_weekday = firstDay.getDay();
        if(firstDay_weekday === 0){
            for(var i = 6; i > 0; i--){
                calenderDays.push(util.diffDate(firstDay, -i));
            }
        }
        else{
            for(var i = firstDay_weekday-1; i > 0; i--){
                calenderDays.push(util.diffDate(firstDay, -i));
            }
        }
        calenderDays.push(firstDay);
        var temp = util.diffDate(firstDay, 1);
        while(temp.getMonth() === firstDay_Month || calenderDays.length % 7 !== 0){
            calenderDays.push(temp);
            temp = util.diffDate(temp, 1);
        }
        var iter = [];
        var days = [];
        for(var i = 0; i < calenderDays.length; i++){
            var sclass = '';
            var today = new Date();
            var text = null;
            if(util.isSameDay(calenderDays[i], today)){
                sclass = 'today';
                text = '今';
            }else if(calenderDays[i] < today){
                sclass = 'invalid';
            }
            if(util.isSameDay(calenderDays[i], scope.startDate)){
                sclass += ' selected';
            }
            iter.push({
                text: text,
                date: calenderDays[i],
                sclass: sclass
            });
            if(i % 7 === 6){
                days.push(iter);
                iter = [];
            }
        }
        console.log(days);
        scope.calenderDays = days;
    }]);

});

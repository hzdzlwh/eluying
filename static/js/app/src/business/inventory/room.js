/**
 * Created by huwanqi on 15/12/26.
 */
var AJAXService = require("AJAXService");
var util = require("util");
var leftMenu = require("leftMenu");
var header = require("header");
var trToggle = require("trToggle");
require("jqueryui");
require("datepicker-zh");
require("bootstrap");
var modal = require("modal");

var IVENTORY = {
    data: null,
    start: util.dateFormat(new Date()),
    selectedRoom: null,
    patchYear: (new Date()).getFullYear(),
    patchMonth: (new Date()).getMonth(),
    updateTh: function(){
        var dayStrs = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        var dateStr = this.start;
        var date = util.stringToDate(dateStr);
        var dateStrWithoutYear = util.dateFormatWithoutYear(date);
        var today = new Date();
        for(var i = 0; i < 7; i++){
            var str = dayStrs[date.getDay()];
            if(util.isSameDay(today, date)){
                str = '今天';
            }
            $(".inventoryGrid table thead th:nth-child(" + (i+3) + ") p:nth-child(1)").html(dateStrWithoutYear);
            $(".inventoryGrid table thead th:nth-child(" + (i+3) + ") p:nth-child(2)").html(str);
            date = util.diffDate(date, 1);
            dateStr = util.dateFormat(date);
            dateStrWithoutYear = util.dateFormatWithoutYear(date);
        }
    },
    update: function(){
        var that = this;
        $.ajax({
            url: AJAXService.getUrl("getCategoriesAndInventoriesUrl"),
            data:{
                date: that.start,
                type: 0
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                console.log(result);
                var data = that.data = result.data.list;
                var html = '';
                data.forEach(function(i){
                    html += '<tr class="mainClass" cid="' + i.id + '" scid="' + i.subTypeId + '"> ' +
                        '<td> ' +
                        '<span>' + i.name + '</span> ' +
                        '<img src="/static/image/rotate.png" /> ' +
                        '</td> ' +
                        '<td><p>剩余</p><p>总量</p></td> ';
                    i.inventories.forEach(function(d){
                        html += '<td date="' + d.date + '"><p>' + d.remain + '</p><p>' + d.total + '</p></td> ';
                    });
                    html += '</tr>'
                });
                $(".inventoryGrid table tbody").html(html);
            }
        });
    },
    changeStart: function(start){
        this.start = start;
        this.updateTh();
        this.update();
    },
    updateLeft: function(){
        $.ajax({
            url: AJAXService.getUrl("getCategoriesAndInventoriesUrl"),
            data:{
                date: IVENTORY.start,
                type: 0
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                result.data.list.forEach(function(d){
                    d.inventories.forEach(function(i){
                        $("tr[scid=" + d.subTypeId + "]").find("td[date=" + i.date + "]").find('p:first-child').html(i.remain);
                    });
                });
            }
        });
    },
    setPatchGrid: function(){
        $("#delPatch .monthPick .month").html( (parseInt(this.patchMonth)+1) + "月");
        var today = new Date();
        var startDate, start;
        var endDate, end;
        today.setFullYear(this.patchYear);
        today.setMonth(this.patchMonth);
        startDate = util.getFirstDay(today);
        endDate = util.getLastDay(today);
        start = util.dateFormat(startDate);
        end = util.dateFormat(endDate);
        $.ajax({
            url: AJAXService.getUrl("getRoomStatusUrl"),
            data:{
                startDate: start,
                endDate	: end,
                roomId: this.selectedRoom.id
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                var statusList = [{
                    classStr: 'shut',
                    text: '已关闭'
                },{
                    classStr: 'sale',
                    text: '已售'
                },{
                    classStr: 'notsale',
                    text: '未售'
                }];
                if(result.code == 1){
                    var html = '';
                    //处理每个月第一天之前的
                    var firstDate = util.stringToDate(result.data.list[0].date);
                    var diff1 = firstDate.getDay() == 0 ? -6 : -(firstDate.getDay() - 1);
                    var firstDay = util.diffDate(firstDate, diff1);
                    var tempDate = firstDay;
                    if(tempDate < firstDate){
                        html += '<tr>'
                    }
                    while(tempDate < firstDate){
                        html += '<td class="empty"><p>' + tempDate.getDate() + '日</p><p>' + '' + '</p></td>';
                        tempDate = util.diffDate(tempDate, 1);
                    }
                    var today = new Date();
                    result.data.list.forEach(function(d){
                        tempDate = util.stringToDate(d.date);
                        var status = d.status;
                        var classStr = "roomDayItem " + statusList[status].classStr;
                        if(!util.isSameDay(today, tempDate) && util.compareDates(today, tempDate)){
                            classStr = "empty";
                        }
                        if(tempDate.getDay() == 1){
                            html += '<tr>';
                        }
                        html += '<td status="' + d.status + '" date="' + d.date + '" class="' + classStr + '"><p>' + tempDate.getDate()
                            + '日</p><p>' + statusList[status].text + '</p></td>';
                        if(tempDate.getDay() == 0){
                            html += '</tr>'
                        }
                    });
                    //处理每个月最后一天之后的
                    var lastDate = util.stringToDate(result.data.list[result.data.list.length-1].date);
                    lastDate = util.diffDate(lastDate, 1);
                    if(lastDate.getDay() != 0){
                        //var diff2 = 7 - lastDate.getDay();
                        //var lastDay = util.diffDate(lastDate, diff2);
                        //var tempDate = lastDate;
                        //while(tempDate <= lastDay){
                        //    html += '<td class="empty"><p>' + tempDate.getDate() + '日</p><p>' + '' + '</p></td>';
                        //    if(tempDate == lastDay){
                        //        html += '</tr>';
                        //    }
                        //    tempDate = util.diffDate(tempDate, 1);
                        //}
                        html += '</tr>';
                    }
                    $("#delPatch .patchGrid tbody").html(html);
                    $(".modal#delPatch").modal("show");
                }else{
                    alert(result.msg);
                }
            }
        });
    }
};

var events = {
    "click .preWeek": function(){
        $(".editSalePrice").addClass("hide");
        $(".editNetPrice").addClass("hide");
        $(".second").addClass("hide");
        util.prevWeek();
        var date = $("#datePicker").datepicker("getDate");
        var dateStr = util.dateFormat(date);
        IVENTORY.changeStart(dateStr);
        $('.subclass').remove();
    },
    "click .nextWeek": function(){
        $(".editSalePrice").addClass("hide");
        $(".editNetPrice").addClass("hide");
        $(".second").addClass("hide");
        util.nextWeek();
        var date = $("#datePicker").datepicker("getDate");
        var dateStr = util.dateFormat(date);
        IVENTORY.changeStart(dateStr);
        $('.subclass').remove();
    },
    //按钮js改变日期
    "dateChange #datePicker": function(){
        var date = $(this).datepicker("getDate");
        var dateStr = util.dateFormat(date);
        IVENTORY.changeStart(dateStr);
    },
    //用户选择改变日期
    "change #datePicker": function(){
        var date = $(this).datepicker("getDate");
        var dateStr = util.dateFormat(date);
        IVENTORY.changeStart(dateStr);
        $(".second").addClass("hide");
        $(".editSalePrice").addClass("hide");
        $(".editNetPrice").addClass("hide");
    },
    //获取一个房型的房间列表
    "click body .mainClass": function(){
        var cid = $(this).attr("cid");
        var scid = $(this).attr("scid");
        var that = this;
        if($(this).nextUntil(".mainClass").length == 0){
            $.ajax({
                url: AJAXService.getUrl("getRoomsAndStatusUrl"),
                data:{
                    date: IVENTORY.start,
                    categoryId: cid,
                    subTypeId: scid
                },
                dataFilter: function (result) {
                    return AJAXService.sessionValidate(result);
                },
                success: function(result){
                    if(result.code == 1){
                        if(result.data.list.length == 0){
                            alert('这个房型还没有房间！');
                        }else{
                            console.log(result);
                            var html = '';
                            result.data.list.forEach(function(d){
                                html += '<tr class="subclass hide" roomid="' + d.id + '"> ' +
                                    '<td><div class="roomitem" data="' + d.id + '">房间' + d.serialNum + '</div></td> ' +
                                    '<td> <div class="notsale">状态</div> </td> ';

                                var statusClass, statusStr;
                                for(var i = 0; i < 7; i++){
                                    if(d.statusList[i].status == 0){
                                        statusClass = 'shut';
                                        statusStr = '已关闭';
                                    }else if(d.statusList[i].status == 1){
                                        statusClass = 'sale';
                                        statusStr = '已售';
                                    }else if(d.statusList[i].status == 2){
                                        statusClass = 'notsale';
                                        statusStr = '未售';
                                    }
                                    html += '<td> <div room="' + d.id + '" date="' + d.statusList[i].date
                                        + '" status="' + d.statusList[i].status + '" class="statusitem '
                                        + statusClass + '" index="' + i + '">' + statusStr + '</div> </td> '
                                }
                                html += '</tr>'
                            });
                            $(that).after(html);
                            $(that).find("img").addClass("rotate");
                            $(that).nextUntil(".mainClass").removeClass("hide");
                        }
                    }else{
                        alert(result.msg);
                    }
                }
            });
        }else{
            if ($(this).nextUntil(".mainClass").hasClass("hide")) {
                $(this).find("img").addClass("rotate");
                $(this).nextUntil(".mainClass").removeClass("hide");
                //$(this).nextUntil(".mainClass").find("div").slideDown(300);
            } else{
                $(this).find("img").removeClass("rotate");
                //$(this).nextUntil(".mainClass").find("div").slideUp(300);
                $(that).nextUntil(".mainClass").addClass("hide");
            }
        }
    },
    'click body .roomitem': function(){
        var roomid = $(this).attr("data");
        $(".operate .operateItem:first-child").hide();
        $(".operate .operateItem:last-child").show();
        if(!$(this).hasClass("selected")){
            $(".roomitem, .statusitem").removeClass("selected");
            $(this).addClass("selected");
            IVENTORY.selectedRoom = {
                id: roomid,
                name: $(this).html()
            };
        }else{
            $(".roomitem, .statusitem").removeClass("selected");
            IVENTORY.selectedRoom = null;
        }
    },
    'click body .statusitem': function(){
        IVENTORY.selectedRoom = null;
        var status = $(this).attr("status");
        if(status == 0){
            $(".operate .operateItem:first-child p").html("打开房间");
        }else{
            $(".operate .operateItem:first-child p").html("关闭房间");
        }
        $(".operate .operateItem:first-child").show();
        $(".operate .operateItem:last-child").hide();
        $(".roomitem, .statusitem").removeClass("selected");
        $(this).addClass("selected");
    },
    'click body #delPatchButton': function(){
        var selectedRoom = IVENTORY.selectedRoom;
        if(!selectedRoom){
            alert("请先选择一个房间");
        }else{
            $("#delPatch .title span").html(selectedRoom.name);
            IVENTORY.setPatchGrid();
        }
    },
    'click body #editPatchCancel': function(){
        $(".modal#delPatch").modal("hide");
        IVENTORY.patchYear = (new Date()).getFullYear();
        IVENTORY.patchMonth = (new Date()).getMonth();
    },
    'click body #editPatchOk': function(){
        //TODO 修改库存
        $(".modal#delPatch").modal("hide");
    },
    'click body .preMonth': function(){
        if(IVENTORY.patchMonth == 0){
            IVENTORY.patchMonth = 11;
            IVENTORY.patchYear--;
        }else{
            IVENTORY.patchMonth--;
        }
        IVENTORY.setPatchGrid();
    },
    'click body .nextMonth': function(){
        if(IVENTORY.patchMonth == 11){
            IVENTORY.patchMonth = 0;
            IVENTORY.patchYear++;
        }else{
            IVENTORY.patchMonth++;
        }
        IVENTORY.setPatchGrid();
    },
    'click body .roomDayItem': function(){
        if($(this).hasClass("selected")){
            $(this).removeClass("selected");
        }else{
            $(this).addClass("selected");
        }
        if($(".roomDayItem.selected").length == 0){
            $("#modalDelButton").hide();
        }else if($(".roomDayItem.selected[status=0]").length == 0){
            $("#modalDelButton").show();
            $("#modalDelButton").find("p").html("关闭房间");
        }else{
            $("#modalDelButton").show();
            $("#modalDelButton").find("p").html("打开房间");
        }
    },
    'click body #modalDelButton': function(){
        if($(".roomDayItem.selected").length == 0){
            alert("请先选择房间！");
        }else{
            var open = 0;
            var dateList = [];
            var flag = false;
            $(".roomDayItem.selected").each(function(){
                var date = $(this).attr("date");
                var status = $(this).attr("status");
                dateList.push(date);
                if(status == 0){
                    open = 1
                } //有一个是关闭的，就是全打开操作；全都是打开的，就是全关闭操作
                else if(status == 1){
                    alert("房间已出售！不能关闭！");
                    flag = true;
                }
            });
            if(flag){
                return false;
            }//如果选中的房间有已出售的，停止
            $.ajax({
                url: AJAXService.getUrl("modifyRoomStatusUrl"),
                data:{
                    isAll: false,
                    dateList: JSON.stringify(dateList),
                    open: open,
                    roomId: IVENTORY.selectedRoom.id
                },
                dataFilter: function (result) {
                    return AJAXService.sessionValidate(result);
                },
                success: function(result){
                    if(util.errorHandler(result)){
                        IVENTORY.setPatchGrid();
                        dateList.forEach(function(date){
                            console.log(date);
                            var dom = $(".statusitem[date=" + date + "][room=" + IVENTORY.selectedRoom.id + "]");
                            if(open == 1){
                                dom.attr("status", '2');
                                dom.removeClass("shut").addClass("notsale");
                                dom.html('未售');
                            }else{
                                dom.attr("status", '0');
                                dom.removeClass("notsale").addClass("shut");
                                dom.html('已关闭');
                            }
                        });
                        IVENTORY.updateLeft();
                    }
                }
            });
        }
    },
    'click body #delButton': function(){
        var itemDom = $(".statusitem.selected");
        var roomId = itemDom.attr("room");
        var dateList = [];
        dateList.push(itemDom.attr("date"));
        var status = itemDom.attr("status");
        var open = 0;
        if(status == 2){
            open = 0;
        }else if(status == 1){
            alert("已出售的房间不能关闭！");
            return false;
        }else if(status == 0){
            open = 1;
        }
        $.ajax({
            url: AJAXService.getUrl("modifyRoomStatusUrl"),
            data:{
                isAll: false,
                dateList: JSON.stringify(dateList),
                open: open,
                roomId: roomId
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                if(util.errorHandler(result)){
                    if(status == 2){
                        itemDom.attr("status", '0');
                        itemDom.removeClass("notsale").addClass("shut");
                        itemDom.html('已关闭');
                    }else if(status == 1){

                    }else if(status == 0){
                        itemDom.attr("status", '2');
                        itemDom.removeClass("shut").addClass("notsale");
                        itemDom.html('未售');
                    }
                    IVENTORY.updateLeft();
                }
            }
        });
    },
    "resize window": util.mainContainer,
    "show.bs.modal .modal": modal.centerModals,
    "scroll window": function(){

    }
};

var operateTop;
var operateLeft;

$(document).ready(function(){
    /*
    initialize public modules
     */
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();

    //初始化日历
    $.datepicker.setDefaults( $.datepicker.regional[ "zh-CN" ] );
    $(".dateContainer").datepicker({
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        changeYear: true
    });
    $("#datePicker").datepicker( "setDate", new Date());

    IVENTORY.updateTh();
    IVENTORY.update();

    $(".operate .operateItem").hide();

    var localStorage = window.localStorage;
    $(".mainContainer .campName").html(localStorage.campName);

    util.bindDomAction(events);

});
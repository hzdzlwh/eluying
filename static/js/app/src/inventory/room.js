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

var IVENTORY = {
    data: null,
    start: util.dateFormat(new Date()),
    selectedRoom: null,
    updateTh: function(){
        var dayStrs = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        var dateStr = this.start;
        var date = util.stringToDate(dateStr);
        for(var i = 0; i < 7; i++){
            $(".inventoryGrid table thead th:nth-child(" + (i+3) + ") p:nth-child(1)").html(dateStr);
            $(".inventoryGrid table thead th:nth-child(" + (i+3) + ") p:nth-child(2)").html( i == 0 ? '今天' : dayStrs[date.getDay()]);
            date = new Date(date.valueOf() + 1*24*60*60*1000);
            dateStr = util.dateFormat(date);
        }
    },
    update: function(){
        //$(".inventoryGrid table tbody").html('');
        var data = this.data;
        var html = '';
        data.forEach(function(i){
            console.log(i);
            html += '<tr class="mainClass" cid="' + i.id + '" scid="' + i.subTypeId + '"> ' +
                '<td> ' +
                '<span>' + i.name + '</span> ' +
                '<img src="/static/image/rotate.png" /> ' +
                '</td> ' +
                '<td><p>剩余</p><p>总量</p></td> ';
            i.inventories.forEach(function(d){
                html += '<td><p>' + d.remain + '</p><p>' + d.total + '</p></td> '
            });
            html += '</tr>'
        });
        $(".inventoryGrid table tbody").html(html);
    },
    changeStart: function(start){
        this.start = start;
        this.updateTh();
        this.update();
    }
};

var events = {
    "click .prevWeek": function(){
        $(".editSalePrice").addClass("hide");
        $(".editNetPrice").addClass("hide");
        $(".second").addClass("hide");
        util.prevWeek();
        var date = $("#datePicker").datepicker("getDate");
        var dateStr = util.dateFormat(date);
        IVENTORY.changeStart(dateStr);
    },
    "click .nextWeek": function(){
        $(".editSalePrice").addClass("hide");
        $(".editNetPrice").addClass("hide");
        $(".second").addClass("hide");
        util.nextWeek();
        var date = $("#datePicker").datepicker("getDate");
        var dateStr = util.dateFormat(date);
        IVENTORY.changeStart(dateStr);
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
                    console.log(result);
                    if(result.code == 1){
                        if(result.data.list.length == 0){
                            alert('这个房型还没有房间！');
                        }else{
                            var html = '';
                            result.data.list.forEach(function(d){
                                html += '<tr class="subclass" roomid="' + d.id + '"> ' +
                                    '<td><div class="roomitem" data="' + d.id + '">房间' + d.serialNum + '</div></td> ' +
                                    '<td> <div class="notsale">状态</div> </td> ';

                                var statusClass, statusStr;
                                for(var i = 0; i < 7; i++){
                                    if(d.statusList[i].open == 0){
                                        statusClass = 'shut';
                                        statusStr = '已关闭';
                                    }else{
                                        if(d.statusList[i].status == 1){
                                            statusClass = 'sale';
                                            statusStr = '已售';
                                        }else{
                                            statusClass = 'notsale';
                                            statusStr = '未售';
                                        }
                                    }
                                    html += '<td> <div class="statusitem ' + statusClass + '" index="' + i + '">' + statusStr + '</div> </td> '
                                }
                                html += '</tr>'
                            });
                            $(that).after(html);
                        }
                    }else{
                        alert(result.msg);
                    }
                }
            });
        }
    },
    'click body .roomitem': function(){
        var roomid = $(this).attr("data");
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
        $(".roomitem, .statusitem").removeClass("selected");
        $(this).addClass("selected");
    },
    'click body #delPatchButton': function(){
        var selectedRoom = IVENTORY.selectedRoom;
        if(!selectedRoom){
            alert("请先选择一个房间");
        }else{
            $("#delPatch .title span").html(selectedRoom.name);
            var today = new Date();
            var start, end;
            if(today.getDay() == 1){
                start = util.dateFormat(today);
                end = util.dateFormat(util.diffDate(today, 20));
            }else{
                start = util.dateFormat(util.diffDate(today, -(today.getDay()-1)));
                end = util.dateFormat(util.diffDate(today, 20 - today.getDay() + 1));
            }
            $.ajax({
                url: AJAXService.getUrl("getRoomStatusUrl"),
                data:{
                    startDate: start,
                    endDate	: end,
                    roomId: selectedRoom.id
                },
                dataFilter: function (result) {
                    return AJAXService.sessionValidate(result);
                },
                success: function(result){
                    if(result.code == 1){
                        //TODO 把每天的房间状态排出来。
                    }else{
                        alert(result.msg);
                    }
                }
            });
        }
    }
};

$(document).ready(function(){
    /*
    initialize public modules
     */
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();

    trToggle();

    //初始化日历
    $.datepicker.setDefaults( $.datepicker.regional[ "zh-CN" ] );
    $(".dateContainer").datepicker({
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        changeYear: true
    });
    $("#datePicker").datepicker( "setDate", new Date());

    IVENTORY.updateTh();
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
            IVENTORY.data = result.data.list;
            IVENTORY.update();
        }
    });

    var localStorage = window.localStorage;
    $(".mainContainer .campName").html(localStorage.campName);

    util.bindDomAction(events);

});
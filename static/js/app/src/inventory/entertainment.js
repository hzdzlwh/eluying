/**
 * Created by huwanqi on 15/12/26.
 */
var AJAXService = require("AJAXService");
var util = require("util");
var leftMenu = require("leftMenu");
var header = require("header");
require("jqueryui");
require("datepicker-zh");
require("bootstrap");

var IVENTORY = {
    data: null,
    start: util.dateFormat(new Date()),
    selectedEntertain: null,
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
        var that = this;
        $.ajax({
            url: AJAXService.getUrl("getCategoriesAndInventoriesUrl"),
            data:{
                date: this.start,
                type: 2
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                var data = that.data = result.data.list;
                var html = '';
                data.forEach(function(i){
                    html += '<tr class="mainClass" data="' + i.id + '"> ' +
                        '<td class="entertainitem"> ' +
                        '<span>' + i.name + '</span> ' +
                        '</td> ' +
                        '<td><p>剩余</p><p>总量</p></td> ';
                    i.inventories.sort(function(a, b){
                        return util.stringToDate(a.date) - util.stringToDate(b.date);
                    });
                    i.inventories.forEach(function(d){
                        html += '<td class="entertainDayItem" date="' + d.date + '"><p>' + d.remain + '</p><p>' + d.total + '</p></td> ';
                    });
                    html += '</tr>';
                    console.log(i);
                });
                $(".inventoryGrid table tbody").html(html);
            }
        });
    },
    changeStart: function(start) {
        this.start = start;
        this.updateTh();
        this.update();
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
    "click body .entertainitem": function(){
        var entertainid = $(this).parents(".mainClass").attr("data");
        console.log(entertainid);
        if(!$(this).hasClass("selected")){
            $(".entertainDayItem, .entertainitem").removeClass("selected");
            $(this).addClass("selected");
            IVENTORY.selectedEntertain = {
                id: entertainid,
                date: null,
                name: $(this).html()
            };
        }else{
            $(".entertainDayItem, .entertainitem").removeClass("selected");
            IVENTORY.selectedEntertain = null;
        }
    },
    "click body .entertainDayItem": function(){
        var entertainid = $(this).parents(".mainClass").attr("data");
        var date = $(this).attr("date");
        if(!$(this).hasClass("selected")){
            $(".entertainDayItem, .entertainitem").removeClass("selected");
            $(this).addClass("selected");
            IVENTORY.selectedEntertain = {
                id: entertainid,
                date: date,
                name: $(this).html()
            };
        }else{
            $(".entertainDayItem, .entertainitem").removeClass("selected");
            IVENTORY.selectedEntertain = null;
        }
    },
    'click body #editInvenButton': function(){
        if(IVENTORY.selectedEntertain.date){
            $("#editInven").modal("show");
        }else{
            alert("请先选择某天的餐饮！");
        }
    },
    'click body #editInvenOk': function(){
        var inventory = $("#editInven .edit input").val();
        var categoryId = IVENTORY.selectedEntertain.id;
        var date = IVENTORY.selectedEntertain.date;
        $.ajax({
            url: AJAXService.getUrl("modifyExtraInventoryUrl"),
            data:{
                categoryId: categoryId,
                date: date,
                inventory: inventory
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                console.log(result);
                var totalDom = $(".mainClass[data=" + IVENTORY.selectedEntertain.id + "]")
                    .find(".entertainDayItem[date=" + date + "]").find("p:last-child");
                var remainDom = $(".mainClass[data=" + IVENTORY.selectedEntertain.id + "]")
                    .find(".entertainDayItem[date=" + date + "]").find("p:first-child");
                var total = parseInt(totalDom.html());
                var remain = parseInt(remainDom.html());
                var newRemain = inventory - total + remain;
                totalDom.html(inventory);
                remainDom.html(newRemain);
                $("#editInven").modal("hide");
            }
        });
    },
    'click body #editInvenCancel': function(){
        $("#editInven").modal("hide");
    }
};

$(document).ready(function(){
    /*
     initialize public modules
     */
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();

    //trToggle();

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

    var localStorage = window.localStorage;
    $(".mainContainer .campName").html(localStorage.campName);

    util.bindDomAction(events);

});
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
    selectedFood: null,
    patchYear: (new Date()).getFullYear(),
    patchMonth: (new Date()).getMonth(),
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
                type: 1
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                var data = that.data = result.data.list;
                var html = '';
                data.forEach(function(i){
                    html += '<tr class="mainClass" data="' + i.id + '"> ' +
                        '<td class="fooditem"> ' +
                        '<span>' + i.name + '</span> ' +
                        '</td> ' +
                        '<td><p>剩余</p><p>总量</p></td> ';
                    i.inventories.sort(function(a, b){
                        return util.stringToDate(a.date) - util.stringToDate(b.date);
                    });
                    i.inventories.forEach(function(d){
                        html += '<td class="foodDayItem" date="' + d.date + '"><p>' + d.remain + '</p><p>' + d.total + '</p></td> ';
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
    },
    setPatchGrid: function(){
        $("#editPatch .monthPick .month").html( (parseInt(this.patchMonth)+1) + "月");
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
            url: AJAXService.getUrl("getCategoryInventoriesUrl"),
            data:{
                startDate: start,
                endDate	: end,
                categoryId: this.selectedFood.id
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                if(result.code == 1){
                    result.data.list.sort(function(a, b){
                        return util.stringToDate(a.date) - util.stringToDate(b.date);
                    });
                    var html = '';
                    //处理每个月第一天之前的
                    var firstDate = util.stringToDate(result.data.list[0].date);
                    var diff1 = firstDate.getDay() == 0 ? -6 : -(firstDate.getDay() - 1);
                    var firstDay = util.diffDate(firstDate, diff1);
                    var tempDate = firstDay;
                    if(tempDate < firstDate){
                        html += '<tr><td class="fixed"><p>&nbsp;</p><p>剩余</p><p>总量</p></td>'
                    }
                    while(tempDate < firstDate){
                        html += '<td class="empty"><p>' + tempDate.getDate() + '日</p></td>';
                        tempDate = util.diffDate(tempDate, 1);
                    }
                    var today = new Date();
                    result.data.list.forEach(function(d){
                        tempDate = util.stringToDate(d.date);
                        var status = d.status;
                        var classStr = "foodPatchItem";
                        if(util.compareDates(today, tempDate)){
                            classStr = 'empty';
                        }
                        if(tempDate.getDay() == 1){
                            html += '<tr><td class="fixed"><p>&nbsp;</p><p>剩余</p><p>总量</p></td>';
                        }
                        html += '<td class="' + classStr + '" total="' + d.total + '" remain="' + d.remain + '" date="' + d.date
                            + '"><p class="date">'
                            + tempDate.getDate() + '日</p><p class="left">' + d.remain
                            + '</p><p class="all">' + d.total + '</p></td>';
                        if(tempDate.getDay() == 0){
                            html += '</tr>'
                        }
                    });
                    //处理每个月最后一天之后的
                    var lastDate = util.stringToDate(result.data.list[result.data.list.length-1].date);
                    lastDate = util.diffDate(lastDate, 1);
                    if(lastDate.getDay() != 0){
                        html += '</tr>';
                    }
                    console.log(html);
                    $("#editPatch .patchGrid tbody").html(html);
                }else{
                    alert(result.msg);
                }
                console.log(result.data.list);
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
    "click body .fooditem": function(){
        var foodid = $(this).parents(".mainClass").attr("data");
        console.log(foodid);
        if(!$(this).hasClass("selected")){
            $(".foodDayItem, .fooditem").removeClass("selected");
            $(this).addClass("selected");
            IVENTORY.selectedFood = {
                id: foodid,
                date: null,
                name: $(this).html()
            };
        }else{
            $(".foodDayItem, .fooditem").removeClass("selected");
            IVENTORY.selectedFood = null;
        }
    },
    "click body .foodDayItem": function(){
        var foodid = $(this).parents(".mainClass").attr("data");
        var date = $(this).attr("date");
        if(!$(this).hasClass("selected")){
            $(".foodDayItem, .fooditem").removeClass("selected");
            $(this).addClass("selected");
            IVENTORY.selectedFood = {
                id: foodid,
                date: date,
                name: $(this).html()
            };
        }else{
            $(".foodDayItem, .fooditem").removeClass("selected");
            IVENTORY.selectedFood = null;
        }
    },
    'click body #editInvenButton': function(){
        if(IVENTORY.selectedFood.date){
            $("#editInven").modal("show");
        }else{
            alert("请先选择某天的餐饮！");
        }
    },
    'click body #editInvenOk': function(){
        var inventory = $("#editInven .edit input").val();
        var categoryId = IVENTORY.selectedFood.id;
        var date = IVENTORY.selectedFood.date;
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
                var totalDom = $(".mainClass[data=" + IVENTORY.selectedFood.id + "]")
                    .find(".foodDayItem[date=" + date + "]").find("p:last-child");
                var remainDom = $(".mainClass[data=" + IVENTORY.selectedFood.id + "]")
                    .find(".foodDayItem[date=" + date + "]").find("p:first-child");
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
    },
    'click body #editInvenForPatchOk': function(){
        var newTotal = $("#editInvenForPatch .edit input").val();
        //TODO 判断下有没有比已经预定的多
        $(".foodPatchItem.selected").each(function(){
            var total = parseInt($(this).attr("total"));
            var remain = parseInt($(this).attr("remain"));
            $(this).attr("total", newTotal);
            $(this).attr("remain", newTotal-total+remain);
            $(this).find(".all").html(newTotal);
            $(this).find(".left").html(newTotal-total+remain);
        });
        $(".foodPatchItem").removeClass("selected");
        $("#editInvenForPatch").modal("hide");
    },
    'click body #editInvenForPatchCancel': function(){
        $("#editInvenForPatch").modal("hide");
    },
    'click body #editPatchButton': function(){
        if($(".fooditem.selected").length != 0){
            IVENTORY.setPatchGrid();
            $("#editPatch .title span").html(IVENTORY.selectedFood.name);
            $("#editPatch").modal("show");
        }else{
            alert("请选择一项餐饮！");
        }
    },
    'click body #editPatchOk': function(){
        var hash = {};
        $(".foodPatchItem").each(function(){
            var date = $(this).attr("date");
            var total = $(this).attr("total");
            if(hash[total] == undefined){
                hash[total] = [];
                hash[total].push(date);
            }else if(hash[total] && hash[total].indexOf(date) == -1){
                hash[total].push(date);
            }
        });
        for(var total in hash){
            var dateList = hash[total];
            $.ajax({
                url: AJAXService.getUrl("modifyExtraServiceInventoryBatchUrl"),
                async: false,
                data:{
                    categoryId: IVENTORY.selectedFood.id,
                    dateList: JSON.stringify(dateList),
                    inventory: total
                },
                dataFilter: function (result) {
                    return AJAXService.sessionValidate(result);
                },
                success: function(result){
                    console.log(result);
                }
            });
            IVENTORY.update();
            $("#editPatch").modal("hide");
        }
    },
    'click body #editPatchCancel': function(){
        $("#editPatch").modal("hide");
    },
    'click body #preMonth': function(){
        if(IVENTORY.patchMonth == 0){
            IVENTORY.patchMonth = 11;
            IVENTORY.patchYear--;
        }else{
            IVENTORY.patchMonth--;
        }
        IVENTORY.setPatchGrid();
    },
    'click body #nextMonth': function(){
        if(IVENTORY.patchMonth == 11){
            IVENTORY.patchMonth = 0;
            IVENTORY.patchYear++;
        }else{
            IVENTORY.patchMonth++;
        }
        IVENTORY.setPatchGrid();
    },
    'click body .foodPatchItem': function(){
        if($(this).hasClass("selected")){
            $(this).removeClass("selected");
        }else{
            $(this).addClass("selected");
        }
    },
    'change body input.numofall': function(){
        var newTotal = $(this).val();
        $(".foodPatchItem").each(function(){
            var total = parseInt($(this).attr("total"));
            var remain = parseInt($(this).attr("remain"));
            $(this).attr("total", newTotal);
            $(this).attr("remain", newTotal-total+remain);
            $(this).find(".all").html(newTotal);
            $(this).find(".left").html(newTotal-total+remain);
        });
    },
    'click body #modalEditButton': function(){
        if($(".foodPatchItem.selected").length != 0){
            $("#editInvenForPatch").modal("show");
        }else{
            alert("请先选择至少一天！");
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
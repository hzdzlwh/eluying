import http from 'http';
var util = require("util");
var modal = require("modal");
var accommodationPriceList = require("accommodationPriceList");
require("validate");

var monthManage = {
    getAccommodationMonthPriceList: function(startDate){
        $("#editMonth .month").html(startDate.getMonth() + 1 + "月");
        var endDate = util.dateFormat(util.getLastDay(startDate));
        startDate = util.dateFormat(startDate);
        $("#editMonth .month").attr("start-date", startDate);
        /*$.ajax({
            url: http.getUrl("getAccommodationMonthPriceList"),
            data: {
                startDate: startDate,
                endDate: endDate,
                categoryId: $(".priceGrid .selected").attr("category-id")
            },
            dataFilter: function(result) {
                return http.sessionValidate(result);
            },
            success: function(result){
                var channelArray = [];
                for (var name in result.data) {
                    channelArray.push({
                        name: result.data[name][0].channelName,
                        id: result.data[name][0].channelId
                    });
                }
                $(".monthCategory").html("月份管理-" + result.data["0"][0].name);
                monthManage.tab(channelArray);
                monthManage.priceGrid(result.data);

            }
        })*/
        http.get("getAccommodationMonthPriceList",{
            startDate: startDate,
            endDate: endDate,
            categoryId: $('#editMonth').attr('data-category-id')
        })
            .then(function(result){
                var channelArray = [];
                for (var name in result.data) {
                    channelArray.push({
                        name: result.data[name][0].channelName,
                        id: result.data[name][0].channelId
                    });
                }
                // 新增虚拟币tab
                channelArray.push({ name: '虚拟币', id: 2 });
                $(".monthCategory").html("月份管理-" + result.data["0"][0].name);
                monthManage.tab(channelArray);
                // 获取虚拟币的数据,再和之前的数据合并
                http.get('/virCurrency/getVirtualCurrencyMonthLimitList', {
                    startDate: startDate,
                    endDate: endDate,
                    categoryId: $('#editMonth').attr('data-category-id')
                }).then(res => {
                    console.log(res);
                });
                monthManage.priceGrid(result.data);
            });
    },

    tab: function(channelArray){
        var tabStr = "";
        var tabpanelStr = "";
        $.each(channelArray, function(index, element){
            if (index === 0) {
                tabStr += "<li role='presentation' class='active leftTab nav-tabs-li'><a class='leftTab' href='#month"+ element.id +"'role='tab' data-toggle='tab'>" + element.name +"</a></li>";
            } else if (index === channelArray.length - 1) {
                tabStr += "<li role='presentation' class='rightTab nav-tabs-li'><a class='rightTab' href='#month"+ element.id +"'role='tab' data-toggle='tab'>" + element.name + "</a></li>";
            } else {
                tabStr += "<li role='presentation' class='nav-tabs-li'><a href='#month"+ element.id +"' role='tab' data-toggle='tab'>" + element.name + "</a></li>"
            }



            tabpanelStr += "<div role='tabpanel' class='tab-pane " + (index === 0 ? "active" : "") + " clearfloat' id='month" + element.id + "'>" +
                "<table class='grid'><thead><tr>" +
                "<th>价格类型</th>" +
                "<th>周一</th>" +
                "<th>周二</th>" +
                "<th>周三</th>" +
                "<th>周四</th>" +
                "<th>周五</th>" +
                "<th>周六</th>" +
                "<th>周日</th>" +
                "</tr>" +
                "</thead>" +
                "</table>" +
                "</div>";
        });
        $("#editMonth .nav").html(tabStr);
        $("#editMonth .tab-content").html(tabpanelStr);

    },

    priceGrid: function(data){
        $("#editMonth .month").html();
        for (var name in data) {
            var tbody = "<tbody>";
            //name=0的是零售
            if (name === "0") {

                var count = 0;
                $.each(data[name], function(index, element){
                    if (count % 7 === 0){
                        tbody += "<tr><td><p>零售价</p></td>"
                    }
                    //定位首个价格在表格中的位置
                    if (index === 0) {
                        if (util.stringToDate(element.date).getDay() === 0 ){
                            for (var i = 0; i < 6; i ++) {
                                tbody += "<td></td>";
                                count ++;
                            }
                        } else {
                            for (var i = 0; i < util.stringToDate(element.date).getDay() - 1; i ++) {
                                tbody += "<td></td>";
                                count ++;
                            }
                        }
                    }
                    tbody += "<td class='salePrice' date='" + element.date + "' channel-id='" + element.channelId + "'><span class='date'>" + element.date.substring(8) + "日</span><p>" + element.salePrice + "</p></td>";
                    if (count != 0 && (count + 1) % 7 === 0) {
                        tbody += "</tr>";
                    }
                    count ++;
                });


            } else if(name === "7"){
                var count = 0;
                $.each(data[name], function(index, element){
                    if (count % 7 === 0){
                        tbody += "<tr><td><p>协议价</p><p>网络价</p></td>"
                    }
                    //定位首个价格在表格中的位置
                    if (index === 0) {
                        if (util.stringToDate(element.date).getDay() === 0 ){
                            for (var i = 0; i < 6; i ++) {
                                tbody += "<td></td>";
                                count ++;
                            }
                        } else {
                            for (var i = 0; i < util.stringToDate(element.date).getDay() - 1; i ++) {
                                tbody += "<td></td>";
                                count ++;
                            }
                        }
                    }
                    tbody += "<td class='netPrice' date='" + element.date + "' channel-id='" + element.channelId + "'><span class='date'>" + element.date.substring(8) + "日</span>" +
                        "<p>" + element.agreementPrice + "</p><p>" + element.netPrice + "</p></td>";
                    if (count != 0 && (count + 1) % 7 ===0) {
                        tbody += "</tr>";
                    }
                    count ++;
                });
            }
            else {
                //渠道表格
                var count = 0;
                $.each(data[name], function(index, element){
                    if (count % 7 === 0){
                        tbody += "<tr><td><p>微官网价</p></td>"
                    }
                    //定位首个价格在表格中的位置
                    if (index === 0) {
                        if (util.stringToDate(element.date).getDay() === 0 ){
                            for (var i = 0; i < 6; i ++) {
                                tbody += "<td></td>";
                                count ++;
                            }
                        } else {
                            for (var i = 0; i < util.stringToDate(element.date).getDay() - 1; i ++) {
                                tbody += "<td></td>";
                                count ++;
                            }
                        }
                    }
                    tbody += "<td class='netPrice' date='" + element.date + "' channel-id='" + element.channelId + "'><span class='date'>" + element.date.substring(8) + "日</span>" +
                        "<p>" + element.netPrice + "</p></td>";
                    if (count != 0 && (count + 1) % 7 ===0) {
                        tbody += "</tr>";
                    }
                    count ++;
                });
            }
            $("#month" + name + " .grid").append(tbody);
        }
    },
    batchModifyAccommodationSpecialPrice: function(data, that){
        /*$.ajax({
            url: http.getUrl("batchModifyAccommodationSpecialPrice"),
            type: "POST",
            data: data,
            dataFilter: function(result) {
                return http.sessionValidate(result);
            },
            success: function(result){
                if (util.errorHandler(result)) {
                    if (that) {
                        modal.clearModal(that);
                    }
                }
            }
        })*/
        http.post("batchModifyAccommodationSpecialPrice",data)
            .then(function(result){
                accommodationPriceList.getAccommodationPriceList($('#datePicker').datepicker('getDate'));
                $('.priceOperate .second').addClass('hide');
                $('.priceOperate .first .operateItem ').addClass('hide');
                if (that) {
                    modal.clearModal(that);
                }
            })
    },
    events: {
        "click #editMonthButton": function(){
            var startDate = util.getFirstDay(new Date());
            $('#editMonth').attr('data-category-id', $('.priceGrid .selected').attr('category-id'));
            monthManage.getAccommodationMonthPriceList(startDate);
        },
        "click #prevMonth": function(){
            if ($(".changed").length > 0) {
                var dialogConfig = {
                    title: "提醒",
                    message: "当前月份的修改尚未保存，是否保存？"
                };
                var confirmCallback = function(){
                    var data = monthManage.preparePrices();
                    $("#editMonth .operateItem").addClass("hide");
                    monthManage.batchModifyAccommodationSpecialPrice(data);
                    monthManage.showPrevMonth();
                };
                var cancelCallback = function(){
                    monthManage.showPrevMonth();
                };
                modal.confirm(dialogConfig, confirmCallback, cancelCallback);
            } else {
                monthManage.showPrevMonth();
            }
        },
        "click #nextMonth": function(){
            if ($(".changed").length > 0) {
                var dialogConfig = {
                    title: "提醒",
                    message: "当前月份的修改尚未保存，是否保存？"
                };
                var confirmCallback = function(){
                    var data = monthManage.preparePrices();
                    $("#editMonth .operateItem").addClass("hide");
                    monthManage.batchModifyAccommodationSpecialPrice(data);
                    monthManage.showNextMonth();
                };
                var cancelCallback = function(){
                    monthManage.showNextMonth();
                };
                modal.confirm(dialogConfig, confirmCallback, cancelCallback);
            } else {
                monthManage.showNextMonth();
            }


        },
        "click #editMonth .salePrice": function(){
            $(this).toggleClass("selected");
            if ($("#editMonth .selected").length === 0) {
                $("#editMonthSalePriceButton").parent().addClass("hide");
            } else {
                $("#editMonthSalePriceButton").parent().removeClass("hide");
            }
        },
        "click #editMonth .netPrice": function(){
            $(this).toggleClass("selected");
            if ($("#editMonth .selected").length === 0) {
                $("#editMonthNetPriceButton").parent().addClass("hide");
            } else {
                $("#editMonthNetPriceButton").parent().removeClass("hide");
            }
        },
        "click #editMonth a[data-toggle='tab']": function(){
            var that = this;
            if ($(".changed").length > 0) {

                var dialogConfig = {
                    title: "提醒",
                    message: "当前渠道的修改尚未保存，是否保存？"
                };
                var confirmCallback = function(){
                    var data = monthManage.preparePrices();
                    monthManage.batchModifyAccommodationSpecialPrice(data);
                    $("#editMonth .operateItem").addClass("hide");
                    $(".changed").removeClass("changed");
                    $(that).tab("show");
                };
                var cancelCallback = function(){
                    $("#editMonth .selected").removeClass("selected");
                    $("#editMonth .operateItem").addClass("hide");
                    $(".changed").removeClass("changed");
                    $(that).tab("show");
                    //TODO 把修改过的值复原 T T
                };
                modal.confirm(dialogConfig, confirmCallback, cancelCallback);
                return false;
            } else {
                $("#editMonth .selected").removeClass("selected");
                $("#editMonth .operateItem").addClass("hide");
            }
        },
        "click #editMonthSalePriceButton": function(){
            if ($("#editMonth .selected").length === 1) {
                $("#monthRetailPrice").val($("#editMonth .selected").find("p").html());
            } else {
                $("#monthRetailPrice").attr("placeholder", "批量修改");
            }
        },
        "click #editMonthNetPriceButton": function(){
            if ($("#editMonth .selected").length === 1) {
                /*$("#monthCommissionPrice").val($("#editMonth .selected").find("p:eq(0)").html());*/
                $("#monthNetPrice").val($("#editMonth .selected").find("p:eq(0)").html());
            } else {
                $("#monthCommissionPrice").attr("placeholder", "批量修改");
                $("#monthNetPrice").attr("placeholder", "批量修改");
            }
        },
        "click #editMonthSalePriceOk": function(){
            if (!$("#editMonthSalePrice form").valid()) {
                return;
            }
            $("#editMonth .selected").find("p").html($("#monthRetailPrice").val());
            $("#editMonth .selected").addClass("changed").removeClass("selected");
            var that = this;
            modal.clearModal(that);
        },
        "click #editMonthNetPriceOk": function(){
            if (!$("#editMonthNetPrice form").valid()) {
                return;
            }
            /*$("#editMonth .selected").find("p:eq(0)").html($("#monthCommissionPrice").val());*/
            $("#editMonth .selected").find("p:eq(0)").html($("#monthNetPrice").val());
            $("#editMonth .selected").addClass("changed").removeClass("selected");
            var that = this;
            modal.clearModal(that);
        },
        "click #editMonthOk": function(){
            var that = this;
            if ($("#editMonth .changed").length >0 ) {
                var data = monthManage.preparePrices();
                monthManage.batchModifyAccommodationSpecialPrice(data, that);
            } else {
                modal.clearModal(that);
            }

        },
        "click #editMonthCancel": function(){
            var that = this;
            if ($(".changed").length > 0) {
                var dialogConfig = {
                    title: "提醒",
                    message: "当前的修改尚未保存，您确定要离开此页面吗？"
                };
                var confirmCallback = function(){
                    modal.clearModal(that);
                };

                modal.confirm(dialogConfig, confirmCallback);

            } else {
                modal.clearModal(that);
            }
        }
    },
    preparePrices: function(){
        var prices = [];
        $(".changed").each(function(){
            if ($(this).hasClass("salePrice")) {
                var price = {
                    channelId: $(this).attr("channel-id"),
                    date: $(this).attr("date"),
                    newSalePrice: $(this).find("p").html(),
                    newAgreementPrice: 0,
                    newNetPrice: 0
                };
            } else {
                var price = {
                    channelId: $(this).attr("channel-id"),
                    date: $(this).attr("date"),
                    newSalePrice: $(this).find("p:eq(0)").html(),
                    newAgreementPrice: $(this).find("p:eq(0)").html(),
                    newNetPrice: $(this).find("p:eq(0)").html()
                };
            }
            prices.push(price);
        });
        var data = {
            items: JSON.stringify(prices),
            categoryId: $('#editMonth').attr('data-category-id')
        };
        return data;
    },
    showNextMonth: function(){
        var current = util.stringToDate($("#editMonth .month").attr("start-date"));
        var nextMonth = new Date(current.setMonth(current.getMonth() + 1));
        monthManage.getAccommodationMonthPriceList(nextMonth);
        $("#prevMonth").removeClass("hide");
        $("#editMonth .operateItem").addClass("hide");
    },
    showPrevMonth: function(){
        var current = util.stringToDate($("#editMonth .month").attr("start-date"));
        var prevMonth = new Date(current.setMonth(current.getMonth() - 1));
        monthManage.getAccommodationMonthPriceList(prevMonth);
        if (prevMonth.getMonth() === new Date().getMonth()) {
            $("#prevMonth").addClass("hide");
        }
        $("#nextMonth").removeClass("hide");
        $("#editMonth .operateItem").addClass("hide");
    }
};
module.exports = monthManage;
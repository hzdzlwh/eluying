var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");
var accommodationPriceList = require("accommodationPriceList");
require("validate");

var seasonManage = {
    fromBusyDate: "",
    toBusyDate: "",
    fromSlackDate: "",
    toSlackDate: "",
    //获取淡旺季的时间范围
    getSeasons: function(){
        /*$.ajax({
            url: AJAXService.getUrl2("getCampSeasons"),
            dataFilter: function (result) {
                return AJAXServicesessionValidate(result);
            },
            success: function(result){
                $.each(result.data.list, function(index, element){
                    if (element.type === 1) {
                        $("#busyStartMonth option[value=" + (element.startMonth < 10 ? "0" + element.startMonth : element.startMonth) + "]").prop("selected", true);
                        $("#busyStartDay option[value=" + (element.startDay < 10 ? "0" + element.startDay : element.startDay) + "]").prop("selected", true);
                        $("#busyEndMonth option[value=" + (element.endMonth < 10 ? "0" + element.endMonth : element.endMonth) + "]").prop("selected", true);
                        $("#busyEndDay option[value=" + (element.endDay < 10 ? "0" + element.endDay : element.endDay) + "]").prop("selected", true);
                        seasonManage.fromBusyDate = "2000-" + (element.startMonth < 10 ? "0" + element.startMonth : element.startMonth) + "-" + (element.startDay < 10 ? "0" + element.startDay : element.startDay);
                        seasonManage.toBusyDate = "2000-" + (element.endMonth < 10 ? "0" + element.endMonth : element.endMonth) + "-" + (element.endDay < 10 ? "0" + element.endDay : element.endDay);
                    } else{
                        $("#slackStartMonth option[value=" + (element.startMonth < 10 ? "0" + element.startMonth : element.startMonth) + "]").prop("selected", true);
                        $("#slackStartDay option[value=" + (element.startDay < 10 ? "0" + element.startDay : element.startDay) + "]").prop("selected", true);
                        $("#slackEndMonth option[value=" + (element.endMonth < 10 ? "0" + element.endMonth : element.endMonth) + "]").prop("selected", true);
                        $("#slackEndDay option[value=" + (element.endDay < 10 ? "0" + element.endDay : element.endDay) + "]").prop("selected", true);
                        seasonManage.fromSlackDate = "2000-" + (element.startMonth < 10 ? "0" + element.startMonth : element.startMonth) + "-" + (element.startDay < 10 ? "0" + element.startDay : element.startDay);
                        seasonManage.toSlackDate = "2000-" + (element.endMonth < 10 ? "0" + element.endMonth : element.endMonth) + "-" + (element.endDay < 10 ? "0" + element.endDay : element.endDay);
                    }
                });
                seasonManage.getAccommodationPeriodicalPrice();
            }
        })*/
        AJAXService.ajaxWithToken("GET","getCampSeasons",{},function(result){
            $.each(result.data.list, function(index, element){
                if (element.type === 1) {
                    $("#busyStartMonth option[value=" + (element.startMonth < 10 ? "0" + element.startMonth : element.startMonth) + "]").prop("selected", true);
                    $("#busyStartDay option[value=" + (element.startDay < 10 ? "0" + element.startDay : element.startDay) + "]").prop("selected", true);
                    $("#busyEndMonth option[value=" + (element.endMonth < 10 ? "0" + element.endMonth : element.endMonth) + "]").prop("selected", true);
                    $("#busyEndDay option[value=" + (element.endDay < 10 ? "0" + element.endDay : element.endDay) + "]").prop("selected", true);
                    seasonManage.fromBusyDate = "2000-" + (element.startMonth < 10 ? "0" + element.startMonth : element.startMonth) + "-" + (element.startDay < 10 ? "0" + element.startDay : element.startDay);
                    seasonManage.toBusyDate = "2000-" + (element.endMonth < 10 ? "0" + element.endMonth : element.endMonth) + "-" + (element.endDay < 10 ? "0" + element.endDay : element.endDay);
                } else{
                    $("#slackStartMonth option[value=" + (element.startMonth < 10 ? "0" + element.startMonth : element.startMonth) + "]").prop("selected", true);
                    $("#slackStartDay option[value=" + (element.startDay < 10 ? "0" + element.startDay : element.startDay) + "]").prop("selected", true);
                    $("#slackEndMonth option[value=" + (element.endMonth < 10 ? "0" + element.endMonth : element.endMonth) + "]").prop("selected", true);
                    $("#slackEndDay option[value=" + (element.endDay < 10 ? "0" + element.endDay : element.endDay) + "]").prop("selected", true);
                    seasonManage.fromSlackDate = "2000-" + (element.startMonth < 10 ? "0" + element.startMonth : element.startMonth) + "-" + (element.startDay < 10 ? "0" + element.startDay : element.startDay);
                    seasonManage.toSlackDate = "2000-" + (element.endMonth < 10 ? "0" + element.endMonth : element.endMonth) + "-" + (element.endDay < 10 ? "0" + element.endDay : element.endDay);
                }
            });
            seasonManage.getAccommodationPeriodicalPrice();
        });
    },

    //获取价格
    getAccommodationPeriodicalPrice: function(){
        //拉旺季价格
        /*$.ajax({
            url: AJAXService.getUrl("getAccommodationPeriodicalPrice"),
            async: false,
            data: {
                categoryId: $(".selected").attr("category-id"),
                startDate: seasonManage.fromBusyDate,
                endDate: seasonManage.toBusyDate
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                var channelArray = [];
                for (var name in result.data) {
                    channelArray.push({
                        name: result.data[name][0].channelName,
                        id: result.data[name][0].channelId
                    });
                }
                $(".seasonCategory").html("淡旺季管理-" + result.data["0"][0].name);
                seasonManage.tab(channelArray);

                seasonManage.priceGrid(result.data, true);
            }
        })*/
        AJAXService.ajaxWithToken("GET","getAccommodationPeriodicalPrice",{
            categoryId: $("td.selected").attr("category-id"),
            startDate: seasonManage.fromBusyDate,
            endDate: seasonManage.toBusyDate
        },function(result){
            var channelArray = [];
            for (var name in result.data) {
                channelArray.push({
                    name: result.data[name][0].channelName,
                    id: result.data[name][0].channelId
                });
            }
            $(".seasonCategory").html("淡旺季管理-" + result.data["0"][0].name);
            seasonManage.tab(channelArray);

            seasonManage.priceGrid(result.data, true);
        },undefined,false);
        //拉淡季价格
        /*$.ajax({
            url: AJAXService.getUrl("getAccommodationPeriodicalPrice"),
            data: {
                categoryId: $(".selected").attr("category-id"),
                startDate: seasonManage.fromSlackDate,
                endDate: seasonManage.toSlackDate
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                seasonManage.priceGrid(result.data, false);


            }
        });*/
        AJAXService.ajaxWithToken("GET","getAccommodationPeriodicalPrice",{
            categoryId: $("td.selected").attr("category-id"),
            startDate: seasonManage.fromSlackDate,
            endDate: seasonManage.toSlackDate
        },function(result) {
            seasonManage.priceGrid(result.data, false);
        },undefined,false)
    },


    tab: function(channelArray){
        //拼接渠道tab
        var tabStr = "";
        var tabpanelStr = "";
        $.each(channelArray, function(index, element){
            if (index === 0) {
                tabStr += "<li role='presentation' class='active leftTab nav-tabs-li'><a class='leftTab' href='#season"+ element.id +"'role='tab' data-toggle='tab'>" + element.name +"</a></li>";
            } else if (index === channelArray.length - 1) {
                tabStr += "<li role='presentation' class='rightTab nav-tabs-li'><a class='rightTab' href='#season"+ element.id +"'role='tab' data-toggle='tab'>" + element.name + "</a></li>";
            } else {
                tabStr += "<li role='presentation' class='nav-tabs-li'><a href='#season"+ element.id +"' role='tab' data-toggle='tab'>" + element.name + "</a></li>"
            }


            //表格表头
            tabpanelStr += "<div role='tabpanel' class='tab-pane " + (index === 0 ? "active" : "") + " clearfloat' id='season"+ element.id +"'>" +
                "<table class='busyGrid grid'><thead><tr>" +
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
                "<table class='slackGrid grid'><thead><tr>" +
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
                "</div>"
        });
        $("#editSeason .nav").html(tabStr);
        $("#editSeason .tab-content").html(tabpanelStr);
    },


    //表格内容
    priceGrid: function(data, isBusy){
        for (var name in data) {
            var tbody = "";
            //name=0的是零售
            if (name === "0") {
                tbody += "<tbody>" +
                    "<tr>" +
                    "<td>" +
                    "<p>零售价</p>" +
                    "</td>";
                //0是周日 1~6是周一到周六
                for (var i = 1; i < 7; i++) {
                    tbody += "<td week='" + (i + 1) + "' class='salePrice' channel-id='" + data[name][i].channelId + "'><p>" + data[name][i].salePrice + "</p></td>";
                }
                tbody += "<td week='1' class='salePrice' channel-id='" + data[name][0].channelId + "'><p>" + data[name][0].salePrice + "</p></td></tbody>";
            } else if(name === "5"){
                tbody += "<tbody>" +
                    "<tr>" +
                    "<td>" +
                    "<p>直销价</p>" +
                    "</td>";
                for (var i = 1; i < 7; i++) {
                    tbody += "<td class='netPrice' channel-id='" + data[name][i].channelId + "' week='" + (i + 1) + "'>" + "<p>" + data[name][i].netPrice + "</p></td>";
                }
                tbody += "<td class='netPrice' channel-id='" + data[name][0].channelId + "' week='1''>" + "<p>" + data[name][0].netPrice + "</p></td></tbody>";

            }
             else {
                tbody += "<tbody>" +
                    "<tr>" +
                    "<td>" +
                    "<p>协议价</p>" +
                    "<p>网络价</p>" +
                    "</td>";
                for (var i = 1; i < 7; i++) {
                    tbody += "<td class='netPrice' channel-id='" + data[name][i].channelId + "' week='" + (i + 1) + "'><p>" + data[name][i].agreementPrice + "</p><p>" + data[name][i].netPrice + "</p></td>";
                }
                tbody += "<td class='netPrice' channel-id='" + data[name][0].channelId + "' week='1''><p>" + data[name][0].agreementPrice + "</p><p>" + data[name][0].netPrice + "</p></td></tbody>";
            }


            if (isBusy) {
                $("#season" + name + " .busyGrid").append(tbody);
            } else {
                $("#season" + name + " .slackGrid").append(tbody);
            }

        }
    },

    //修改价格和周期
    modifyAccommodationPeriodicalPrice: function(data,that) {
        /*$.ajax({
            url: AJAXService.getUrl("modifyAccommodationPeriodicalPrice"),
            data: data,
            dataFilter: function(result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                if (util.errorHandler(result)) {
                    modal.clearModal(that)
                }
            }
        })*/
        AJAXService.ajaxWithToken("POST", "modifyAccommodationPeriodicalPrice", data, function(result) {
            if (util.errorHandler(result)) {
                accommodationPriceList.getAccommodationPriceList($('#datePicker').datepicker('getDate'));
                $('.priceOperate .second').addClass('hide');
                $('.priceOperate .first .operateItem ').addClass('hide');
                modal.clearModal(that)
            }
        })
    },

    setDaySelect: function(monthSelect, daySelect){
        var month = monthSelect.val();
        switch (month) {
            case "01":
            case "03":
            case "05":
            case "07":
            case "08":
            case "10":
            case "12":
                var day31 = '';
                for (var i = 1; i < 32; i ++) {
                    day31 += '<option value="' + (i < 10 ? '0' + i : i) + '">' + (i < 10 ? '0' + i : i) + '</option>'
                }
                daySelect.html(day31);
                break;
            case "04":
            case "06":
            case "09":
            case "11":
                var day30 = '';
                for (var i = 1; i < 31; i ++) {
                    day30 += '<option value="' + (i < 10 ? '0' + i : i) + '">' + (i < 10 ? '0' + i : i) + '</option>'
                }
                daySelect.html(day30);
                break;
            case "02":
                var day29 = '';
                for (var i = 1; i < 30; i ++) {
                    day29 += '<option value="' + (i < 10 ? '0' + i : i) + '">' + (i < 10 ? '0' + i : i) + '</option>'
                }
                daySelect.html(day29);
                break;
            default:
        }

    },

    events: {

        //点击月份选择
        "change #editSeason .monthSelect": function(){
            var monthSelect = $(this);
            var daySelect = $(this).next("select");
            seasonManage.setDaySelect(monthSelect, daySelect);
        },

        "shown.bs.tab #editSeason a[data-toggle='tab']": function(){
            $("#editSeason .selected").removeClass("selected");
            $("#editSeason .operateItem").addClass("hide");
        },
        "click #editSeasonButton": function(){
            seasonManage.getSeasons();
        },
        "click #editSeason .salePrice": function(){
            $(".salePrice").removeClass("selected");
            $(".netPrice").removeClass("selected");
            $(this).addClass("selected");
            $("#editSeasonNetPriceButton").parent().addClass("hide");
            $("#editSeasonSalePriceButton").parent().removeClass("hide");
        },
        "click #editSeason .netPrice": function(){
            $(".netPrice").removeClass("selected");
            $(".salePrice").removeClass("selected");
            $(this).addClass("selected");
            $("#editSeasonSalePriceButton").parent().addClass("hide");
            $("#editSeasonNetPriceButton").parent().removeClass("hide");
        },
        "click #editSeasonSalePriceButton": function(){
            $("#seasonRetailPrice").val($(".salePrice.selected").find("p").html());
        },
        "click #editSeasonNetPriceButton": function(){
            /*$("#seasonCommissionPrice").val($(".netPrice.selected").find("p:eq(0)").html());*/
            $("#seasonNetPrice").val($(".netPrice.selected").find("p:eq(0)").html());
        },
        "click #editSeasonSalePriceOk": function(){
            if (!$("#editSeasonSalePrice form").valid()) {
                return;
            }
            $("#editSeason .selected").addClass("changed");
            var that = this;
            $("td.selected").find("p").html($("#seasonRetailPrice").val());
            modal.clearModal(that);
        },
        "click #editSeasonNetPriceOk": function(){
            if (!$("#editSeasonNetPrice form").valid()) {
                return;
            }
            $("#editSeason .selected").addClass("changed");
            var that = this;
            /*$(".selected").find("p:eq(0)").html($("#seasonCommissionPrice").val());*/
            $("td.selected").find("p:eq(0)").html($("#seasonNetPrice").val());
            modal.clearModal(that);
        },
        "click #editSeasonOk": function(){
            var that = this;
            if ($("#editSeason .changed").length > 0
                || seasonManage.fromBusyDate != $("#fromBusyDate").val()
                || seasonManage.toBusyDate != $("#toBusyDate").val()
                || seasonManage.fromSlackDate != $("#fromSlackDate").val()
                || seasonManage.toSlackDate != $("#toSlackDate").val()) {
                seasonManage.prepareData(that);
            } else {
                modal.clearModal(that);
            }

        },
        "click #editSeasonCancel": function(){
            var that = this;
            if ($(".changed").length > 0) {
                var dialogConfig = {
                    title: "提醒",
                    message: "当前的修改尚未保存，您确定要离开此页面吗？"
                };
                var confirmCallback = function(){
                    modal.clearModal(that);
                };

                modal.confirmDialog(dialogConfig, confirmCallback);

            } else {
                modal.clearModal(that);
            }
        },
        "change #editSeason select": function(){
            if ($(this).hasClass("monthSelect")) {
                var dateStr = "2000-" + $(this).val() + "-" + $(this).next("select").val();
                var date = util.stringToDate(dateStr);
            } else {
                var dateStr = "2000-" + $(this).prev("select").val() + "-" + $(this).val();
                var date = util.stringToDate(dateStr);
            }
            if ($(this).attr("id") === "busyStartMonth" || $(this).attr("id") === "busyStartDay") {
                date.setDate(date.getDate() - 1);
                var dateArray = util.dateFormat(date).split("-");
                $("#slackEndMonth [value=" + dateArray[1] +"]").prop("selected", true);
                $("#slackEndDay [value=" + dateArray[2] +"]").prop("selected", true);
            } else if ($(this).attr("id") === "busyEndMonth" || $(this).attr("id") === "busyEndDay") {
                date.setDate(date.getDate() + 1);
                var dateArray = util.dateFormat(date).split("-");
                $("#slackStartMonth [value=" + dateArray[1] +"]").prop("selected", true);
                $("#slackStartDay [value=" + dateArray[2] +"]").prop("selected", true);
            } else if ($(this).attr("id") === "slackStartMonth" || $(this).attr("id") === "slackStartDay") {
                date.setDate(date.getDate() - 1);
                var dateArray = util.dateFormat(date).split("-");
                $("#busyEndMonth [value=" + dateArray[1] +"]").prop("selected", true);
                $("#busyEndDay [value=" + dateArray[2] +"]").prop("selected", true);
            } else {
                date.setDate(date.getDate() + 1);
                var dateArray = util.dateFormat(date).split("-");
                $("#busyStartMonth [value=" + dateArray[1] +"]").prop("selected", true);
                $("#busyStartDay [value=" + dateArray[2] +"]").prop("selected", true);
            }
        }
    },
    prepareData: function(that){
        var prices = [];
        $("#editSeason td.changed").each(function(){
            var price = {
                channelId: $(this).attr("channel-id"),
                newAgreementPrice: $(this).hasClass("salePrice") ? 0 : $(this).find("p:eq(0)").html(),
                newNetPrice: $(this).hasClass("salePrice") ? 0 : $(this).find("p:eq(0)").html(),
                newSalePrice:$(this).find("p:eq(0)").html(),
                startDate: $(this).parents("table").hasClass("busyGrid") ? '2000-' + $("#busyStartMonth").val() + '-' + $("#busyStartDay").val() : '2000-' + $("#slackStartMonth").val() + '-' + $("#slackStartDay").val(),
                endDate: $(this).parents("table").hasClass("busyGrid") ? '2000-' + $("#busyEndMonth").val() + '-' + $("#busyEndDay").val() : '2000-' + $("#slackEndMonth").val() + '-' + $("#slackEndDay").val(),
                weekday: $(this).attr("week")
            };
            prices.push(price);
        });
        var seasons = [
            {
                startDate: "2000-" + $("#busyStartMonth").val() + "-" + $("#busyStartDay").val(),
                endDate: "2000-" + $("#busyEndMonth").val() + "-" + $("#busyEndDay").val(),
                type: 1
            },
            {
                startDate: "2000-" + $("#slackStartMonth").val() + "-" + $("#slackStartDay").val(),
                endDate: "2000-" + $("#slackEndMonth").val() + "-" + $("#slackEndDay").val(),
                type: 0
            }
        ];
        var data = {
            items: JSON.stringify(prices),
            categoryId: $(".priceGrid .selected").attr("category-id"),
            seasons: JSON.stringify(seasons)
        };
        seasonManage.modifyAccommodationPeriodicalPrice(data, that);
    }

};
module.exports = seasonManage;

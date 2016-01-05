var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");

var seasonManage = {
    getSeasons: function(){
        $.ajax({
            url: AJAXService.getUrl("getCampSeasons"),
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                $.each(result.data.list, function(index, element){
                    if (element.type === 1) {
                        $("#fromBusyDate").datepicker( "setDate", element.startDate);
                        $("#toBusyDate").datepicker( "setDate", element.endDate);
                    } else{
                        $("#fromSlackDate").datepicker( "setDate", element.startDate);
                        $("#toSlackDate").datepicker( "setDate", element.endDate);
                    }
                });
                seasonManage.getAccommodationPeriodicalPrice();
            }
        });
    },
    getAccommodationPeriodicalPrice: function(){
        //拉旺季价格
        $.ajax({
            url: AJAXService.getUrl("getAccommodationPeriodicalPrice"),
            async: false,
            data: {
                categoryId: $(".selected").attr("category-id"),
                startDate: $("#fromBusyDate").val(),
                endDate: $("#toBusyDate").val()
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
        });
        //拉淡季价格
        $.ajax({
            url: AJAXService.getUrl("getAccommodationPeriodicalPrice"),
            data: {
                categoryId: $(".selected").attr("category-id"),
                startDate: $("#fromSlackDate").val(),
                endDate: $("#toSlackDate").val()
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                seasonManage.priceGrid(result.data, false);


            }
        });
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
                    tbody += "<td week='" + (i + 1) + "' class='salePrice'><p>" + data[name][i].salePrice + "</p></td>";
                }
                tbody += "<td week='1' class='salePrice'><p>" + data[name][0].salePrice + "</p></td></tbody>";
            } else {
                tbody += "<tbody>" +
                    "<tr>" +
                    "<td>" +
                    "<p>协议价</p>" +
                    "<p>网络价</p>" +
                    "</td>";
                for (var i = 1; i < 7; i++) {
                    tbody += "<td class='netPrice' channel-id='" + data[name][0].channelId + "' week='" + (i + 1) + "'><p>" + data[name][i].agreementPrice + "</p><p>" + data[name][i].netPrice + "</p></td>";
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
    editSalePrice: function(that){
        $.ajax({
            url: AJAXService.getUrl("modifyAccommodationPeriodicalSalePrice"),
            data:{newSalePrice: $("#seasonRetailPrice").val(),
                categoryId: $(".priceGrid .selected").attr("category-id"),
                startDate: $("#editSeason .selected").parents("table").hasClass("busyGrid") ? $("#fromBusyDate").val() : $("#fromSlackDate").val(),
                endDate: $("#editSeason .selected").parents("table").hasClass("busyGrid") ? $("#toBusyDate").val() : $("#toSlackDate").val(),
                weekday: $("#editSeason .selected").attr("week")
            },
            dataFilter: function(result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                if (util.errorHandler(result)) {
                    $("#editSeason .selected").find("p").html($("#seasonRetailPrice").val());
                    modal.clearModal(that);
                }
            }
        })
    },
    editNetPrice: function(that){
        $.ajax({
            url: AJAXService.getUrl("modifyAccommodationPeriodicalChannelPrice"),
            data:{
                newNetPrice: $("#seasonNetPrice").val(),
                newAgreementPrice: $("#seasonCommissionPrice").val(),
                channelId: $("#editSeason .selected").attr("channel-id"),
                categoryId: $(".priceGrid .selected").attr("category-id"),
                startDate: $("#editSeason .selected").parents("table").hasClass("busyGrid") ? $("#fromBusyDate").val() : $("#fromSlackDate").val(),
                endDate: $("#editSeason .selected").parents("table").hasClass("busyGrid") ? $("#toBusyDate").val() : $("#toSlackDate").val(),
                weekday: $("#editSeason .selected").attr("week")
            },
            dataFilter: function(result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                if (util.errorHandler(result)) {
                    $("#editSeason .selected").find("p:eq(0)").html($("#seasonCommissionPrice").val());
                    $("#editSeason .selected").find("p:eq(1)").html($("#seasonNetPrice").val());
                    modal.clearModal(that);
                }
            }
        })
    },
    modifyCampSeason: function(that){
        $.ajax({
            url: AJAXService.getUrl("modifyCampSeason"),
            data:{
                endDate: $("#toBusyDate").val(),
                startDate: $("#fromBusyDate").val(),
                type: 1
            },
            dataFilter: function(result) {
                return AJAXService.sessionValidate(result);
            },
            async: false
        });
        $.ajax({
            url: AJAXService.getUrl("modifyCampSeason"),
            data:{
                endDate: $("#toSlackDate").val(),
                startDate: $("#fromSlackDate").val(),
                type: 0
            },
            dataFilter: function(result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                if (util.errorHandler(result)) {
                    modal.clearModal(that);
                }
            }
        });
    }

};
module.exports = seasonManage;

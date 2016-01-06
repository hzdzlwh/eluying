var AJAXService = require("AJAXService");
var util = require("util");
var trToggle = require("trToggle");
var modal = require("modal");
var accommodationPriceList = {
    getAccommodationPriceList: function(startDate){
        var endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        $.ajax({
            url: AJAXService.getUrl("getAccommodationPriceList"),
            data: {
                campId: localStorage.getItem("campId"),
                startDate: util.dateFormat(startDate),
                endDate: util.dateFormat(endDate)
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                accommodationPriceList.createEl(startDate, result);
            }
        })
    },

    events: {
        "click .priceGrid .price": function(){
            $(".price").removeClass("selected");
            $(".subPriceTd").removeClass("selected");
            $(this).toggleClass("selected");
            $(".editSalePrice").removeClass("hide");
            $(".editNetPrice").addClass("hide");
            $(".second").removeClass("hide");
        },
        "click .priceGrid .subPriceTd": function(){
            $(".subPriceTd").removeClass("selected");
            $(".price").removeClass("selected");
            $(this).toggleClass("selected");
            $(".editNetPrice").removeClass("hide");
            $(".editSalePrice").addClass("hide");
            $(".second").removeClass("hide");
        },
        "click #editSalePriceButton": function(){
            $("#retailPrice").val($(".selected").html());
        },
        "click #editNetPriceButton": function(){
            $("#netPrice").val($(".selected").find("p:eq(1)").html());
            $("#commissionPrice").val($(".selected").find("p:eq(0)").html());
        },
        "click #editSalePriceOk": function(){
            var that = this;
            accommodationPriceList.editSalePrice(that);
        },
        "click #editNetPriceOk": function(){
            var that = this;
            accommodationPriceList.editNetAgreePrice(that);
        }
    },

    tableInit: function(){

        trToggle();

    },

    createEl: function(startDate, result){

        //得到七天日期对象
        var dateArray = [];
        for (var i = 0;  i < 7; i++) {
            var date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dateArray.push(date);
        }

        //把表头写好
        var thead = "<thead><tr><th>房型</th><th>价格类型</th>";

        for (i = 0;  i < 7; i++) {
            thead += "<th><p>" + dateArray[i].toLocaleDateString().substring(5).replace("/", "-") + "</p><p>" +
                (new Date().toDateString() ==  dateArray[i].toDateString() ? "今天" : util.getWeek(dateArray[i])) + "</p></th>"
        }

        thead += "</tr></thead>";


        //开始写下面的表格
        var tbody = "<tbody>";
        for (var name in result.data) {
            for (var subName in result.data[name]) {
                if (subName == "0") {
                    tbody += "<tr class='mainClass'><td>" + result.data[name][subName][0].name + (result.data[name].hasOwnProperty("1") ? "<img src='/static/image/rotate.png' />" : "") + "</td><td>零售价</td>";
                    $.each(result.data[name][subName], function (index, element) {
                        tbody += "<td class='price' category-id=" + element.id + " date=" + element.date + ">" + element.salePrice + "</td>";
                    });
                } else {
                    tbody += "<tr class='subPrice hide'><td><div>" + result.data[name][subName][0].channelName + "</div></td><td><div><p>协议价</p><p>网络价</p></div></td>";
                    $.each(result.data[name][subName], function (index, element) {
                        tbody += "<td class='subPriceTd' channel-id=" + element.channelId + " category-id=" + element.id + " date=" + element.date + "><div><p>" + element.agreementPrice + "</p><p>" + element.netPrice + "</p></div></td>";
                    });
                }
                tbody += "</tr>"
            }
        }
        tbody += "</tbody>";

        var table = "<table>"+ thead + tbody +"</table>";

        $(".priceGrid").html(table);
        this.tableInit();
    },

    //改零售价
    editSalePrice: function(that){
        var items = [{
            channelId: 0,
            date: $(".selected").attr("date"),
            newAgreementPrice: 0,
            newNetPrice: 0,
            newSalePrice: $("#retailPrice").val()
        }];
        $.ajax({
            url: AJAXService.getUrl("batchModifyAccommodationSpecialPrice"),
            data: {
                items: JSON.stringify(items),
                categoryId: $(".selected").attr("category-id")
            },
            dataFilter: function(result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                if (util.errorHandler(result)) {
                    $(".selected").html($("#retailPrice").val());

                    modal.clearModal(that);
                }
            }
        })
    },

    //改网络价和协议价
    editNetAgreePrice: function(that){
        var items = [{
            channelId: $(".selected").attr("channel-id"),
            date: $(".selected").attr("date"),
            newAgreementPrice: $("#commissionPrice").val(),
            newNetPrice: $("#netPrice").val(),
            newSalePrice: 0
        }];
        $.ajax({
            url: AJAXService.getUrl("batchModifyAccommodationSpecialPrice"),
            data: {
                items: JSON.stringify(items),
                categoryId: $(".selected").attr("category-id")
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                if (util.errorHandler(result)) {
                    $(".selected").find("p:eq(0)").html($("#commissionPrice").val());
                    $(".selected").find("p:eq(1)").html($("#netPrice").val());
                    modal.clearModal(that);
                }
            }
        })
    }
};
module.exports = accommodationPriceList;
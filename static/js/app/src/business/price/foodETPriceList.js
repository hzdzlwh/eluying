var AJAXService = require("AJAXService");
var util = require("util");
var trToggle = require("trToggle");
var modal = require("modal");
require("validate");
var foodETPriceList = {
    getFoodETPriceList: function(path){
        /*$.ajax({
            url: path == "food" ? AJAXService.getUrl("getFoodCategoryPriceList") : AJAXService.getUrl("getPlayCategoryPriceList"),
            data: {
                campId: localStorage.getItem("campId")
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                foodETPriceList.render(result)
            }
        })*/
        var url = (path == "food") ? "getFoodCategoryPriceList" : "getPlayCategoryPriceList";
        AJAXService.ajaxWithToken("GET",url,{},function(result){
            foodETPriceList.render(result)
        })
    },
    render: function(result){
        var tbody = "<tbody>";
        for (var name in result.data) {
            for (var subName in result.data[name]) {
                if (subName == 0) {
                    tbody += "<tr class='mainClass'><td>" + result.data[name][subName].name + (result.data[name].hasOwnProperty("1") ? "<img src='/static/image/rotate.png' />" : "") + "</td><td>零售价</td><td class='price' category-id='" + result.data[name][subName].id + "'>" + result.data[name][subName].salePrice + "</td></tr>"
                } else {
                    tbody += "<tr class='subPrice hide'><td><div>" + result.data[name][subName].channelName + "</div></td><td><div><p>直销价</p></div></td>" +
                        "<td class='subPriceTd' category-id='" + result.data[name][subName].id + "' channel-id='" + result.data[name][subName].channelId + "' ><div><p>"
                        + result.data[name][subName].netPrice + "</p></div></td></tr>"
                }
            }
        }
        tbody += "</tbody>";
        $("table").append(tbody);
        this.eventBind();
    },
    editSalePrice: function(that){
        /*$.ajax({
            url: AJAXService.getUrl("modifyDefaultPrice"),
            data: {
                newSalePrice: $("#retailPrice").val(),
                newNetPrice: 0,
                newAgreementPrice: 0,
                categoryId: $(".selected").attr("category-id"),
                channelId: 0
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                if (util.errorHandler(result)) {
                    $(".selected").html($("#retailPrice").val());
                    modal.clearModal(that);
                }
            }
        })*/
        AJAXService.ajaxWithToken("GET","modifyDefaultPrice",{
            newSalePrice: $("#retailPrice").val(),
            newNetPrice: 0,
            newAgreementPrice: 0,
            categoryId: $(".selected").attr("category-id"),
            channelId: 0
        },function(result){
            if (util.errorHandler(result)) {
                $(".selected").html($("#retailPrice").val());
                modal.clearModal(that);
            }
        });
    },
    editNetAgreePrice: function(that){
        /*$.ajax({
            url: AJAXService.getUrl("modifyDefaultPrice"),
            data: {
                newSalePrice: 0,
                newNetPrice: $("#netPrice").val(),
                newAgreementPrice: $("#commissionPrice").val(),
                categoryId: $(".selected").attr("category-id"),
                channelId: $(".selected").attr("channel-id")
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
        })*/
        AJAXService.ajaxWithToken("GET","modifyDefaultPrice",{
            newSalePrice: 0,
            newNetPrice: $("#netPrice").val(),
            newAgreementPrice: 0,
            categoryId: $(".selected").attr("category-id"),
            channelId: $(".selected").attr("channel-id")
        },function(result){
            if (util.errorHandler(result)) {
                $(".selected").find("p:eq(0)").html($("#commissionPrice").val());
                $(".selected").find("p:eq(0)").html($("#netPrice").val());
                modal.clearModal(that);
            }
        })
    },
    eventBind: function(){
        events= {
            "click .priceGrid .price": function(event){
                $(".price").removeClass("selected");
                $(".subPriceTd").removeClass("selected");
                $(this).toggleClass("selected");
                $(".editSalePrice").removeClass("hide");
                $(".editNetPrice").addClass("hide");
                $(".second").removeClass("hide");
            },
            "click .priceGrid .subPriceTd": function(event){
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
                $("#netPrice").val($(".selected").find("p:eq(0)").html());
                $("#commissionPrice").val($(".selected").find("p:eq(0)").html());
            },
            "click #editSalePriceOk": function(){
                var that = this
                if (!$("#editSalePrice form").valid()) {
                    return;
                }
                foodETPriceList.editSalePrice(that)
            },
            "click #editNetPriceOk": function(){
                if (!$("#editNetPrice form").valid()) {
                    return;
                }
                var that = this;
                foodETPriceList.editNetAgreePrice(that);
            }
        };
        trToggle();
        util.bindDomAction(events);
    }
};
module.exports = foodETPriceList;
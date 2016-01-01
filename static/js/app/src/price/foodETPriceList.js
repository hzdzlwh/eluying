var AJAXService = require("AJAXService");
var util = require("util");
var trToggle = require("trToggle");
var modal = require("modal");
var foodETPriceList = {
    getFoodETPriceList: function(path){
        $.ajax({
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
        })
    },
    render: function(result){
        var tbody = "<tbody>";
        for (var name in result.data) {
            for (var subName in result.data[name]) {
                if (subName == 0) {
                    tbody += "<tr><td>" + result.data[name][subName].name + (result.data[name].hasOwnProperty("1") ? "<img src='/eluyun/static/image/rotate.png' />" : "") + "</td><td>零售价</td><td class='price'>" + result.data[name][subName].salePrice + "</td></tr>"
                } else {
                    tbody += "<tr class='subPrice'><td><div>" + result.data[name][subName].channelName + "</div></td><td><div><p>协议价</p><p>网络价</p></div></td><td><div><p>" +
                            + result.data[name][subName].agreementPrice + "</p><p>" + result.data[name][subName].netPrice + "</p></div></td></tr>"
                }
            }
        }
        tbody += "</tbody>";
        $("table").append(tbody);
        this.eventBind();
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
                $("#netPrice").val($(".selected").find("p:eq(1)").html());
                $("#commissionPrice").val($(".selected").find("p:eq(0)").html());
            },
            "click #editSalePriceOk": function(){
                var that = this;
                foodETPriceList.editSalePrice(that);
            },
            "click #editNetPriceOk": function(){
                var that = this;
                foodETPriceList.editNetAgreePrice(that);
            }
        };
        trToggle();
        util.bindDomAction(events);
    }
};
module.exports = foodETPriceList;
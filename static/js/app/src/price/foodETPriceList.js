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
                    tbody += "<tr><td>" + result.data[name][subName].name + (result.data[name].hasOwnProperty("1") ? "<img src='/eluyun/static/image/rotate.png' />" : "") + "</td><td>零售价</td><td>" + result.data[name][subName].salePrice + "</td></tr>"
                } else {
                    tbody += "<tr class='subPrice'><td><div>" + result.data[name][subName].channelName + "</div></td><td><div><p>协议价</p><p>网络价</p></div></td><td><div><p>" +
                            + result.data[name][subName].agreementPrice + "</p><p>" + result.data[name][subName].netPrice + "</p></div></td></tr>"
                }
            }
        }
        tbody += "</tbody>";
        $("table").append(tbody);
    }
};
module.exports = foodETPriceList;
var AJAXService = require("AJAXService");
var util = require("util");
var modal = require("modal");

var monthManage = {
    getAccommodationMonthPriceList: function(startDate){
        $("#editMonth .month").html(startDate.getMonth() + 1 + "月");
        var endDate = util.dateFormat(util.getLastDay(startDate));
        startDate = util.dateFormat(startDate);
        $("#editMonth .month").attr("start-date", startDate);
        $.ajax({
            url: AJAXService.getUrl("getAccommodationMonthPriceList"),
            data: {
                startDate: startDate,
                endDate: endDate,
                categoryId: $(".priceGrid .selected").attr("category-id")
            },
            dataFilter: function(result) {
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
                $(".monthCategory").html("月份管理-" + result.data["0"][0].name);
                monthManage.tab(channelArray);
                monthManage.priceGrid(result.data);

            }
        })
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
                    tbody += "<td class='salePrice' date='" + element.date + "'><span class='date'>" + element.date.substring(8) + "日</span><p>" + element.salePrice + "</p></td>";
                    if (count != 0 && (count + 1) % 7 === 0) {
                        tbody += "</tr>";
                    }
                    count ++;
                });


            } else {
                //渠道表格
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
                    tbody += "<td class='netPrice' date='" + element.date + "'><span class='date'>" + element.date.substring(8) + "日</span>" +
                        "<p>" + element.agreementPrice + "</p><p>" + element.netPrice + "</p></td>";
                    if (count != 0 && (count + 1) % 7 ===0) {
                        tbody += "</tr>";
                    }
                    count ++;
                });
            }
            $("#month" + name + " .grid").append(tbody);
        }
    }
};
module.exports = monthManage;
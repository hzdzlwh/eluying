var AJAXService = require("AJAXService");
var vD = require("virtualDOM");
var util = require("util");
var accommodationPriceList = {
    getAccommodationPriceList: function(startDate){
        $.ajax({
            url: AJAXService.getUrl("getAccommodationPriceList"),
            data: {
                campId: localStorage.getItem("campId"),
                startDate: util.dateFormat(startDate),
                endDate: util.dateFormat(new Date(startDate.setDate(startDate.getDate() + 6)))
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                accommodationPriceList.createEl(result);
            }
        })
    },
    createEl: function(result){
        var week = ["周日","周一","周二","周三","周四","周五","周六"];
        var table = vD.El("table", {}, [
            vD.El("thead", {}, [
                vD.El("tr", {}, [
                    vD.El("th", {}, ["房型"]),
                    vD.El("th", {}, ["价格类型"])
                ])
            ])
        ]);
        var dateArray = [];
        for (var name in result.data) {
            $.each(result.data[name], function(index, element){
                dateArray.push(new Date(element.date));
            })
        }
        for (var i = 0;  i < 7; i++) {
            table.children[0].children[0].children.push(vD.El("th", {}, [
                vD.El("p", {}, [dateArray[i].toLocaleDateString().substring(5).replace("/", "-")]),
                vD.El("p", {}, [new Date().toDateString() ==  dateArray[i].toDateString() ? "今天" : week[dateArray[i].getDay()]])
            ]));
        }
        var tbody = vD.El('tbody', {}, []);
        for (var name in result.data) {
            var tr = vD.El("tr", {}, [
                vD.El("td", {} , [result.data[name][0].name]),
                vD.El("td", {} , ["零售价"])
            ]);
            $.each(result.data[name], function(index, element){
                tr.children.push(vD.El("td", {}, [
                    element.salePrice / 100,
                    vD.El("input", {type: "hidden", class: "date"}, [element.date]),
                    vD.El("input", {type: "hidden", class: "id"}, [element.id])
                ]));
            });
            tbody.children.push(tr);
        }
        table.children.push(tbody);
        this.renderEl(table);
    },
    renderEl: function(el){
        var dom = el.render();
        $(".priceGrid").append(dom);
    }
};
module.exports = accommodationPriceList;